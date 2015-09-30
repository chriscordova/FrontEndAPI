CP.LoggedLeft = CP.extend(CP.emptyFn, {

	constructor: function () {
		this.initPage();
	},

	initPage: function () {
		this.initForm();
	},

	initPageContent: function () {

	},

	setPageContent: function () {

	},

	referralToken: localStorage.REFID,

	verifyMobile: CP.apiVerifyMobile(),

	initForm: function () {
		var pageObj = this;

		var oDataTest1 = {
			action: "IsSiteAlive"
		};

		$.post(CP.apiURL(), oDataTest1, function (response) {
			if (typeof response == 'string') {
				if (response.indexOf('Theme/maintenance.png') >= 0) {
					var oHTML = response.toString();
					var newImage = oHTML.replace('Theme/maintenance.png', '../Theme/maintenance.png');
					$('body').html(newImage);
				}
			}
			else {
				pageObj.checkIfMaintenanceUpcoming();
			}
		});

		$('a#lnkLogout').on('click', function () {
			localStorage.removeItem("TOKEN");
			location.reload();
		});

		if (pageObj.referralToken !== undefined) {
			pageObj.storeReferralToken(pageObj);
		}

		pageObj.getPoll(pageObj);
		pageObj.setPointsBalances();
		pageObj.setProfileCompletion();
		pageObj.setPanelMemberInfo(pageObj);

		$('#findnew').on('click', function () {
			pageObj.getPoll(pageObj);
		});

		$('#submit-poll').on('click', function () {
			//debugger;
			var sValues = pageObj.getSelectedValues(pageObj.attributeId, pageObj.dataType);

			var oData6 = {
				action: "SavePollResults",
				token: CP.apiTOKEN(),
				values: sValues,
				count: pageObj.count,
				pollid: pageObj.pollId

			};

			$.post(CP.apiURL(), oData6, function (response) {
				var obj = response;
				if (obj.Success) {
					$('#submit-poll').hide();
					$('#dvPoll').html('Thank you for your poll submission.');

					$('#findnew').show();
				}
				else {
					var sError = CP.Message.getError(obj);
					CP.setValidationBox('submit-poll', false, sError);
					return false;
				}
			});
		});

	},

	pollId: "",
	count: 0,
	attributeId: "",
	dataType: "",

	buildPoll: function (AttributeId, AwardedCredits) {
		var pageObj = this;

		var oData5 = {
			action: "GetAttributeDetails",
			token: CP.apiTOKEN(),
			attributeid: AttributeId,
			postregistration: false
		};

		$.post(CP.apiURL(), oData5, function (response) {
			var obj = response;
			if (obj.Success) {
				var sQuestionText = obj.Data.attribute[0].questiontext;
				pageObj.dataType = obj.Data.attribute[0].datatype;
				var aListItems = obj.Data.attribute[0].listitems;
				pageObj.buildPollQuestion(sQuestionText, pageObj.dataType, aListItems, AwardedCredits);
			}

		});
	},

	buildPollQuestion: function (QuestionText, DataType, ListItems, AwardedCredits) {
		var pageObj = this;
		
		var sBuild = "";
		var sControl = "";
		sBuild += "<table class='table table-striped' id='" + pageObj.attributeId + "'><tr><th colspan='2'>" + QuestionText + "</th></tr>";

		switch (DataType) {
			case "Multiple Selection List":
				sControl = "checkbox";
				break;
			case "Single Selection List":
				sControl = "radio";
				break;
			default:
				break;

		}
		$.each(ListItems, function (i, v) {
			sBuild += "<tr>";
			sBuild += "<td><label><input type='" + sControl + "' name='listitem' value='" + v.value + "'/>  " + v.name + "</label></td>";
			sBuild += "</tr>";
		});

		sBuild += "<tr><td colspan='2'>This poll is worth " + AwardedCredits + " credits</td></tr>";
		$('#submit-poll').show();

		$('#dvPoll').html(sBuild);
	},

	setPanelMemberInfo: function (pageObj) {
		var oData3 = {
			action: "GetPanelMemberDetails",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData3, function (response) {
			var obj = response;
			if (obj.Success) {
				var panelMemberDetails = obj.Data.panelmemberdetails[0];
				$('.pFullName').html(panelMemberDetails.fullname);
				$('#pEmail').html(panelMemberDetails.emailaddress);
				
				//Order of preference for Panel Member check is => 1. Agree To Terms 2. Has Incomplete Registration 3. Unverified Mobile Number
				if (!panelMemberDetails.agreetoterms) {
					var oPath = $(location)[0].pathname;
					var iAgreePage = oPath.indexOf('agreetoterms');
					if (iAgreePage < 0) {
						document.location.href = "agreetoterms.html";
					}
				}
				else if (panelMemberDetails.hasincompleteregistration) {
					var oPath = $(location)[0].pathname;
					var iIncomplete = oPath.indexOf('changedetails.html?redirect=true');
					if (iIncomplete < 0) {
						document.location.href = "changedetails.html?redirect=true";
					}
				}
				else if (pageObj.verifyMobile) {
					var bHasUnverifiedMobile = panelMemberDetails.hasunverifiedmobile;
					if (bHasUnverifiedMobile) {
						var oPath = $(location)[0].pathname;
						var iVerifyPage = oPath.indexOf('smsverify');
						if (iVerifyPage < 0) {
							document.location.href = "smsverify.html";
						}
					}
				}
			}
		});
	},

	setProfileCompletion: function () {
		var oData2 = {
			action: "GetProfileFormCompletionStatus",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData2, function (response) {
			var obj = response;
			$('#pProfileCompletion').html(obj.Data.percentcomplete);
		});
	},

	setPointsBalances: function () {
		var oData1 = {
			action: "GetPointsBalance",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData1, function (response) {
			var obj = response;
			$('#pPointsBalanceTotal').html(obj.Data.total);
			$('#pPointsBalanceToday').html(obj.Data.today);
			$('#pPointsBalanceWeek').html(obj.Data.week);
			$('#pPointsBalanceMonth').html(obj.Data.month);
		});
	},

	getPoll: function (pageObj) {
		var oData4 = {
			action: "GetPolls",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData4, function (response) {
			//debugger;
			var obj = response;
			if (obj.Success) {
				if (obj.Data.polls == false) {
					$('#submit-poll').hide();
					$('#findnew').hide();
					$('#dvPoll').html('You have completed all necessary polls');
				}
				else {
					pageObj.attributeId = obj.Data.polls[0].pollattributeid;
					var sAwardedCredits = obj.Data.polls[0].awardedcredits;
					pageObj.pollId = obj.Data.polls[0].pollid;
					pageObj.buildPoll(pageObj.attributeId, sAwardedCredits);
				}

			}
			else {
				var sError = CP.Message.getError(obj);
				$('#dvPoll').html(sError);
			}
		});
	},

	storeReferralToken: function (pageObj) {
		var oData7 = {
			action: "ProcessReferral",
			token: CP.apiTOKEN(),
			refid: pageObj.referralToken
		};

		$.post(CP.apiURL(), oData7, function (response) {
			var obj = response;
			if (obj.Success) {
				//remove refid from localstorage
				localStorage.removeItem("REFID");
			}
		});
	},

	getSelectedValues: function (AttributeId, DataType) {
		var pageObj = this;

		var Values = "";
		var oTable = 'table#' + AttributeId;
		switch (DataType) {
			case "Multiple Selection List":
				var aSelected = [];
				var aCheckboxes = $(oTable).find('input:checkbox');
				$.each(aCheckboxes, function (i, v) {
					var bSelected = $(v).is(":checked");
					if (bSelected) {
						pageObj.count++;
						var oValue = $(v).val();
						aSelected.push(oValue);
					}
				});

				for (var i = 0; i < aSelected.length; i++) {
					Values += aSelected[i];
					var bFinish = (aSelected.length - i) == 1;
					if (!bFinish) {
						Values += "|";
					}
				}

				break;
			case "Single Selection List":
				Values = $(oTable + " input:radio[name='listitem']:checked").val();
				pageObj.count++;
				break;
			default:
				break;
		}

		return Values;
	},

	checkIfMaintenanceUpcoming: function () {
		var oData = {
			action: "GetMaintenanceModeLevel"
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				var sTime = obj.Data.minutestomaintenance;
				var iTime = parseInt(sTime, 10);
				if (iTime > 0) {
					$('body').prepend('<div style="background-color: red; text-align: center; color:white; width: 100%; height: 20px;">NOTE: Panel will be in maintenance in ' + sTime + ' minutes!</div>');
				}
			}
		});
	}

});

CP.CurrentPage = new CP.LoggedLeft();
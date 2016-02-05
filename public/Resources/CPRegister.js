/// <reference path="CPBase.js" />
CP.Register = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.Register.superclass.constructor.call(this);
		CP.shouldIBeHere('panel');
		this.initPage();
	},

	initPage: function () {

		this.initPageContent();
		this.initForm();

	},

	initPageContent: function () {
		var pageObj = this;

		var dataContent = {
			action: "GetWebPageContentByPageCode",
			pagecode: "REGISTERJOIN"
		};

		$.post(CP.apiURL(), dataContent, function (response) {
			var bSuccess = response.Success;
			if (bSuccess) {
				var obj = response.Data;
				pageObj.setPageContent(obj);
			}
		});
	},

	setPageContent: function (data) {
		var page = data.webpage;
		if (page.length > 0) {
			var contentlinks = page[0].contentlinks;
			$.each(contentlinks, function (i, v) {
				var zone = v.zone;
				var content = '';
				var html = '';

				content = v.linkcontent;
				if (CP.isNotNullOrEmpty(content)) {
					html = content[0].html;
				}

				switch (zone) {
					case 0:
						$('#zone1').append(html);
						break;
					case 1:
						$('#zone2').append(html);
						break;
					default:
						break;
				}
			});
		}
	},

	initForm: function () {
		var pageObj = this;

		$('#next1').on('click', function () {
			pageObj.clickNext1();
		});

		$('#back1').on('click', function () {
			$('#part1').show();
			$('#part2').hide();
		});

		$('#back2').on('click', function () {
			$('#confirm').hide();
			$('#register-fail').hide();
			$('#part2').show();
		});

		$('#next2').on('click', function () {
			pageObj.clickNext2();
		});

		$('#Country').on('change', function () {
			pageObj.populateStates($(this).val());
		});

		$('#register').submit(function () {
			pageObj.register();
			return false;
		});
	},

	validateForm: function () {
        
        var aFields = null;
        if (CP.allowRegisterLoginWithMobile()){
            aFields = $('#register #part1 *[required]').not(':input[name*="EmailAddress"]').not('[name*="UseHTMLEmails"]');
        }
        else{
            aFields = $('#register #part1 *[required]');
        }
        
		var bValid = CP.checkRequiredFields(aFields);
		if (!bValid) {
			CP.setValidationBox('register-part1', false, CP.Message.incompleteFields);
			return false;
		}

		var sEmail1 = $('input[name="EmailAddress"]').val();
		var sEmail2 = $('input[name="EmailAddress2"]').val();
		var bConfirm = CP.checkConfirmFields(sEmail1, sEmail2);
		if (!bConfirm) {
			CP.setValidationBox('register-part1', false, CP.Message.emailAddressesDoNotMatch);
			return false;
		}
		
		var sAltEmail1 = $('input[name="AlternateEmailAddress"]').val();
		var sAltEmail2 = $('input[name="AlternateEmailAddress2"]').val();
		var bAltConfirm = CP.checkConfirmFields(sAltEmail1, sAltEmail2);
		if (!bAltConfirm) {
			CP.setValidationBox('register-part1', false, CP.Message.altEmailAddressesDoNotMatch);
			return false;
		}

		var bAgreeToTerms = $('input[name="AgreeToTerms"]').is(":checked");
		if (!bAgreeToTerms) {
			CP.setValidationBox('register-part1', false, CP.Message.agreeToTerms);
			return false;
		}

		return true;
	},

	clickNext1: function () {
		var pageObj = this;
		var bValid = pageObj.validateForm();
		if (bValid) {
			$('#part2').show();
			$('#part1').hide();
			$('#register-part1').hide();
            
            if (CP.allowRegisterLoginWithMobile()){
                var bNoEmailAddress = CP.isNullOrEmpty( $('input[name="EmailAddress"]').val() );
                if (bNoEmailAddress){
                    $('input[name="MobilePhone"]').attr('required', true);
                }
                else {
                    $('input[name="MobilePhone"]').removeAttr('required');
                }
            }
            
		}
	},

	clickNext2: function () {
		var pageObj = this;
        
		var aFields = $('#part2 *[required]');
		var bValid = CP.checkRequiredFields(aFields);
		if (!bValid) {
			CP.setValidationBox('register-part2', false, CP.Message.incompleteFields);
			return false;
		}
        
        var sMobile = $('input[name="MobilePhone"]').val();
        if (CP.isNotNullOrEmpty(sMobile)){
            if (!CP.mobilePhoneValidate(sMobile)){
                CP.setValidationBox('register-part2', false, "Mobile Number is not valid.");
                return false;
            }
        }
			
		//Fill confirm details
		pageObj.fillDetails();

		$('#confirm').show();
		$('#part1').hide();
		$('#part2').hide();
	},

	fillDetails: function () {
		var sName = $('input[name="FirstName"]').val() + ' ' + $('input[name="LastName"]').val();
		var sEmail = $('input[name="EmailAddress"]').val();
		var sDOB = $('input[name="BirthDate"]').val();
		var sAddress = $('input[name="Address1"]').val() + ' ' + $('input[name="Address2"]').val() + ' ' + $('input[name="City"]').val() + ' ' + $('select#State').val() + ' ' + $('input[name="PostalCode"]').val() + ' ' + $('select#Country').val();
        var sMobile = $('input[name="MobilePhone"]').val();
		$('#_name').html(sName);
		$('#_email').html(sEmail);
        $('#_mobile').html(sMobile);
		$('#_dob').html(sDOB);
		$('#_address').html(sAddress);
	},

	populateStates: function (country) {
		var oState = $('#State');
		
		//Clean it out first
		oState.find('option').remove();
		
		oState.append($("<option></option>")
			.attr("value", "")
			.text("Choose one.."));
		switch (country) {
			case 'Australia':
				$(CP.Data.auStates).each(function (i, v) {
					oState.append($("<option></option>")
						.attr("value", v.toString())
						.text(v.toString()));
				});
				break;
			case 'New Zealand':
				$(CP.Data.nzStates).each(function (i, v) {
					oState.append($("<option></option>")
						.attr("value", v.toString())
						.text(v.toString()));
				});
				break;
			default:
				break;
		}
	},

	addToken: function (id) {
		if (CP.isNotNullOrEmpty(id)) {
			localStorage.setItem("REFID", id);
		}
	},

	postRegistrationAction: function (obj) {
		var sPostRegistration = obj.Data.PostRegistrationFormLink;
		var sLink = obj.Data.ScreenerLink;
		if (CP.isNotNullOrEmpty(sPostRegistration)) {
			$('#postregoinfo').show();
			setTimeout(function () {
				document.location.href = sPostRegistration;
			}, 5000);
		}
		else if (CP.isNotNullOrEmpty(sLink)) {
			$('#screenerlink').html(sLink);
			$('#screenerinfo').show();
			setTimeout(function () {
				document.location.href = sLink;
			}, 5000);
		}
	},
	
	register: function () {
		var pageObj = this;
		$('#register-fail').hide();
		$('#confirm').hide();
		$('#register-loading').show();

		var sRefId;
		sRefId = CP.getURLParam("refid");
		var sRespondentTypeId;
		sRespondentTypeId = CP.getURLParam("c");

		var oData = $("#register").serializeArray();
		oData.push({ name: "action", value: "CreateNewPanelMember" });
		if (CP.isNotNullOrEmpty(sRespondentTypeId)) {
			oData.push({ name: "CampaignCode", value: sRespondentTypeId });
		}

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {

				$('#register-loading').hide();
				$('#registered').show();
															
				//Add localStorage of refid
				pageObj.addToken(sRefId);
	
				//Redirect to Screener if exists or go to post registration
				pageObj.postRegistrationAction(obj);
			}
			else {
				$('#register-loading').hide();
				$('#confirm').show();
				var sError = CP.Message.getError(obj);
				if (CP.isNotNullOrEmpty(sError)) {
					CP.setValidationBox('register', false, sError);
					return false;
				}
			}
		});

		return false;
	}

});

CP.CurrentPage = new CP.Register();
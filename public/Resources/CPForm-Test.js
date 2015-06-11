/// <reference path="../../typings/knockout/knockout.d.ts"/>
CP.Form = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.shouldIBeHere('member');
		this.initPage();
	},

	aHiddenRules: [],

	initPage: function () {
		var pageObj = this;
		pageObj.initForm();
	},

	initPageContent: function () {

	},

	setPageContent: function () {

	},

	FormViewModel: function (data, pageObj) {
		var self = this;
		self.formdata = ko.observableArray();
		self.attributedata = ko.observableArray();
		self.attributetitle = ko.observable();
		self.attributeshortcode = ko.observable();
		self.questiontype = ko.observable();
		self.showthispage = ko.observable();
		self.usecurrency = ko.observable();
		// self.hiddenrules = ko.observableArray();

		self.getHiddenRules = function (e) {
			pageObj.aHiddenRules = [];
			$.each(e, function (i, v) {
				pageObj.aHiddenRules.push(v);
			});
		};
		
		self.setAttributeValues = function(a,b,c){
			pageObj.setAttributeValues(a, b, c);	
		};

		self.loadFormData = function (e) {
			self.formdata = e;
		};

		self.checkVisibility = function (index) {
			self.showthispage = index > 0 ? false : true;
		};

		self.getAttributeData = function (id) {
			var oData = {
				action: "GetAttributeDetails",
				token: CP.apiTOKEN(),
				attributeid: id,
				postregistration: false
			};

			$.ajaxSetup({
				async: false
			});

			var aItems = {};
			var sTitle = '';
			var sShortCode = '';
			var sQuestionType = '';
			var sInputType = '';
			var bDropDown = false;
			var bCurrency = false;
			var req = $.post(CP.apiURL(), oData);

			req.done(function (response) {
				aItems = {
					"attributeData": response.Data.attribute[0].listitems
				};

				bDropDown = pageObj.isDropDownQuestion(response.Data.attribute[0].properties);
				bCurrency = pageObj.isCurrencyQuestion(response.Data.attribute[0].properties);
				sTitle = response.Data.attribute[0].questiontext;
				sShortCode = response.Data.attribute[0].shortcode;
				sQuestionType = response.Data.attribute[0].datatype;

				self.attributedata = aItems;
				self.attributetitle = sTitle;
				self.attributeshortcode = sShortCode;
				if (bDropDown) {
					self.questiontype = 'QuestionType_DropDownQuestion';
				}
				else {
					sInputType = CP.getControlFromDataType(sQuestionType, bDropDown);
					self.questiontype = pageObj.getQuestionTemplate(sInputType);
				}
				self.usecurrency = bCurrency;
				var oAttributeData = response.Data.attribute[0].attributedata[0];
				if (CP.isNotNullOrEmpty(oAttributeData)){
					self.setAttributeValues(oAttributeData, sQuestionType, bDropDown);	
				}
			});
		};

		self.loadFormData(data);

	},

	setHiddenRules: function (items) {
		$.each(items, function (i, v) {
			var attributeToHide = v.attributeid;
			var choicesSelectedToShow = v.datachoices.split(',');
			var thisAttribute = v.pageitemattributeid;
			var ruleType = v.ruletype;
			if (ruleType == 8) {
				var inputs = $('#' + thisAttribute).find('input');
				$('#' + attributeToHide).hide();
				$.each(inputs, function (i, v) {
					if ($(v).is(':checked')) {
						if ($.inArray($(v).val(), choicesSelectedToShow) >= 0) {
							$('#' + attributeToHide).show();
						}
					}
				});

				$('#' + thisAttribute).on('change', function () {
					var inputs = $(this).find('input');
					$.each(inputs, function (i, v) {
						if ($(v).is(':checked')) {
							if ($.inArray($(v).val(), choicesSelectedToShow) >= 0) {
								$('#' + attributeToHide).show();
							}
							else {
								$('#' + attributeToHide).hide();
							}
						}
					});
				});
			}
		});
	},

	getQuestionTemplate: function (inputType) {
		var sTemplate = '';
		switch (inputType) {
			case "radio":
				sTemplate = 'QuestionType_SingleChoiceQuestion';
				break;
			case "checkbox":
				sTemplate = 'QuestionType_MultipleChoiceQuestion';
				break;
			case "number":
			case "decimal":
				sTemplate = 'QuestionType_NumericQuestion';
				break;
			case "text":
				sTemplate = 'QuestionType_TextQuestion';
				break;
			case "date":
				sTemplate = 'QuestionType_DateQuestion';
				break;
			default:
				break;
		}

		return sTemplate;
	},

	initForm: function () {
		var pageObj = this;
		
		//Get Profile Form details
		var oData4 = {
			action: "GetProfileFormDetails",
			token: CP.apiTOKEN(),
			postregistration: false
		};

		$.post(CP.apiURL(), oData4, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success) {
				var sFormId = CP.getURLParam("formid");
				var aForms = obj.Data.formgroups;
				var arr = $.grep(aForms[0].forms, function (n, i) {
					return (n.formid == sFormId);
				});

				var oForms = {
					"formData": arr[0].formpages
				};

				var formVM = new pageObj.FormViewModel(oForms, pageObj);
				ko.applyBindings(formVM);
			}
		});
		
		//Load Hidden Rules Stuff here?
		$(document).ajaxComplete(function(){
			pageObj.setHiddenRules(pageObj.aHiddenRules);	
		});
				
		//Click Back
		$(document).on('click', '#back', function () {
			pageObj.clickBack(this);
		});
		
		//Click Save
		$(document).on('click', '#save-attribute', function () {
			pageObj.clickSave(this);
		});

	},
	
	clickBack: function (obj) {
		var thisDiv = $(obj).closest('div');
		setTimeout(function () {
			var prevDiv = thisDiv.prev();
			if (prevDiv) {
				thisDiv.hide();
				prevDiv.show();
			}
		}, 500);
	},

	clickSave: function (obj) {
		var pageObj = this;
		//Save all attributes on the page
		var bClose = $(obj).hasClass('saveclose');
		var sFormId = $('#dvForm').attr('formid');
		var thisDiv = $(obj).closest('div');
		var aQuestions = thisDiv.find('table');

		$.each(aQuestions, function (i, v) {
			var sValues = "";
			var oAttributeId = v.id;
			var bHidden = !$(v).is(':visible');
			var oInput = $(v).find('input');
			var oSelect = $(v).find('select');

			if (!bHidden) {
				if (oInput.length > 0) {
					sValues = CP.getValuesFromInputType(oInput);
				}
				else if (oSelect.length > 0) {
					var oSelectType = $(oSelect).attr('multiple');
					if (oSelectType) {
						$(oSelect + ' :selected').each(function (i, selected) {
							sValues += $(selected).val();
						});
					}
					else {
						sValues = $(oSelect).val();
					}
				}
			}

			pageObj.saveAttribute(sValues, sFormId, oAttributeId, bHidden);

		});

		setTimeout(function () {
			$('#save-success').hide();
			if (bClose) {
				document.location.href = "profileform.html";
				return false;
			}

			var nextDiv = thisDiv.next();
			if (nextDiv.length == 0) {
				document.location.href = "profileform.html";
				return false;
			}
			else {
				thisDiv.hide();
				nextDiv.show();
			}
		}, 3000);
	},

	// 	buildAttributeQuestion: function (QuestionText, DataType, DropDown, Currency, ListItems, ShortCode, AttributeId, PageId) {
	// 		var sBuild = "";
	// 		var sControl = "";
	// 		sBuild += "<table class='table' id='" + AttributeId + "'><tr><th colspan='2'>" + QuestionText + "</th></tr>";
	// 
	// 		if (DropDown) {
	// 			sControl = CP.getControlFromDataType(DataType, true);
	// 			sBuild += "<tr><td><select " + sControl + " class='form-control'>";
	// 			sBuild += "<option value=''>Select...</option>";
	// 			$.each(ListItems, function (i, v) {
	// 				sBuild += "<option name='" + ShortCode + "' value='" + v.value + "'>" + v.name + "</option>";
	// 			});
	// 
	// 			sBuild += "</td></tr>";
	// 		}
	// 		else {
	// 			sControl = CP.getControlFromDataType(DataType, false);
	// 			if (sControl == "text" || sControl == "number" || sControl == "date") {
	// 				sBuild += "<tr><td>";
	// 				if (Currency) {
	// 					sBuild += "$";
	// 				}
	// 				sBuild += "<input type='" + sControl + "' name='" + ShortCode + "'/>";
	// 				sBuild += "</td></tr>";
	// 			}
	// 			else {
	// 				$.each(ListItems, function (i, v) {
	// 					sBuild += "<tr><td>";
	// 					sBuild += "<label><input type='" + sControl + "' name='" + ShortCode + "' value='" + v.value + "'/> " + v.name + "</label>";
	// 					sBuild += "</td>";
	// 					if (v.value == "999") {
	// 						sBuild += "<td><input type='text' name='" + ShortCode + "' id='other'/></td>";
	// 					}
	// 					sBuild += "</tr>";
	// 				});
	// 			}
	// 
	// 		}
	// 
	// 		sBuild += '</table>';
	// 
	// 		var pageForm = $('#' + PageId);
	// 		var aTables = pageForm.find('table');
	// 		if (aTables.length > 0) {
	// 			var aLast = pageForm.find('table').last();
	// 			$(sBuild).insertAfter(aLast);
	// 		}
	// 		else {
	// 			$(sBuild).insertAfter('#' + PageId + ' h3');
	// 		}
	// 	},

	// 	buildForm: function (oData) {
	// 		var pageObj = this;
	// 		var sTable = "";
	// 		var sFormId = CP.getURLParam("formid");
	// 		$('#dvForm').attr('formid', sFormId);
	// 		var aFormGroups = oData.formgroups.sort(CP.sortBySortOrder);
	// 		$.each(aFormGroups, function (i, v) {
	// 			var aForms = v.forms.sort(CP.sortBySortOrder);
	// 			$.each(aForms, function (i, v) {
	// 				if (v.formid == sFormId) {
	// 					var aFormPages = v.formpages.sort(CP.sortBySortOrder);
	// 					var iPages = aFormPages.length;
	// 					$.each(aFormPages, function (i, v) {
	// 						var sPageId = v.pageid;
	// 						if (i > 0) {
	// 							sTable += "<div class='form-page table' style='display: none;' id='" + sPageId + "'>";
	// 						}
	// 						else {
	// 							sTable += "<div class='form-page table' id='" + sPageId + "'>";
	// 						}
	// 
	// 						sTable += "<h3>" + v.pagetitle + "</h3>";
	// 						var aPageItems = v.pageitems.sort(CP.sortBySortOrder);
	// 						var aPageItemsList = [];
	// 						$.each(aPageItems, function (i, v) {
	// 							//do hidden stuff here
	// 							var aHiddenItems = v.hiddenattributes;
	// 							if (aHiddenItems.length > 0) {
	// 								pageObj.aHiddenRules.push(aHiddenItems);
	// 							}
	// 
	// 							aPageItemsList.push(v);
	// 
	// 						});
	// 
	// 						deferredPost(0, aPageItemsList.length - 1);
	// 
	// 						function deferredPost(index, max) {
	// 							if (index < max) {
	// 								var o = pageObj.getAttribute(aPageItemsList[index].attributeid, sPageId);
	// 								if (o) {
	// 									setTimeout(function () {
	// 										deferredPost(index + 1, max);
	// 									}, 200);
	// 								}
	// 							} else {
	// 								setTimeout(function () {
	// 									return pageObj.getAttribute(aPageItemsList[index].attributeid, sPageId);
	// 								}, 200);
	// 
	// 							}
	// 						}
	// 
	// 						if (i != 0) {
	// 							sTable += "<input type='button' class='btn btn-default' id='back' value='Back'/>&nbsp;";
	// 						}
	// 
	// 						if (i == (iPages - 1)) {
	// 							sTable += "<input type='button' class='btn btn-default' id='save-attribute' value='Save and Finish'/>";
	// 						}
	// 						else {
	// 							sTable += "<input type='button' class='btn btn-default' id='save-attribute' value='Save and Next'/>&nbsp;";
	// 							sTable += "<input type='button' class='btn btn-default saveclose' id='save-attribute' value='Save and Close'/>";
	// 						}
	// 
	// 						sTable += "</div>";
	// 					});
	// 				}
	// 			});
	// 		});
	// 
	// 		$('#dvForm').append(sTable);
	// 	},

	

	// 	createHiddenRules: function (aHiddenRules) {
	// 		$.each(aHiddenRules, function (i, items) {
	// 			$.each(items, function (i, v) {
	// 				var attributeToHide = v.attributeid;
	// 				var choicesSelectedToShow = v.datachoices.split(',');
	// 				var thisAttribute = v.pageitemattributeid;
	// 				var ruleType = v.ruletype;
	// 				if (ruleType == 8) {
	// 					var inputs = $('#' + thisAttribute).find('input');
	// 					$('#' + attributeToHide).hide();
	// 					$.each(inputs, function (i, v) {
	// 						if ($(v).is(':checked')) {
	// 							if ($.inArray($(v).val(), choicesSelectedToShow) >= 0) {
	// 								$('#' + attributeToHide).show();
	// 							}
	// 						}
	// 					});
	// 
	// 					$('#' + thisAttribute).on('change', function () {
	// 						var inputs = $(this).find('input');
	// 						$.each(inputs, function (i, v) {
	// 							if ($(v).is(':checked')) {
	// 								if ($.inArray($(v).val(), choicesSelectedToShow) >= 0) {
	// 									$('#' + attributeToHide).show();
	// 								}
	// 								else {
	// 									$('#' + attributeToHide).hide();
	// 								}
	// 							}
	// 						});
	// 					});
	// 				}
	// 			});
	// 		});
	// 	},

	getAttribute: function (sAttributeId, sPageId) {
		var pageObj = this;
		var oData5 = {
			action: "GetAttributeDetails",
			token: CP.apiTOKEN(),
			attributeid: sAttributeId,
			postregistration: false
		};

		return $.ajax({
			type: "POST",
			url: CP.apiURL(),
			datatype: "json",
			data: oData5,
			success: function (response) {
				var obj = response;
				if (obj.Success) {
					var sQuestionText = obj.Data.attribute[0].questiontext,
						sDataType = obj.Data.attribute[0].datatype,
						aListItems = obj.Data.attribute[0].listitems,
						sShortCode = obj.Data.attribute[0].shortcode,
						bDropDown = pageObj.isDropDownQuestion(obj.Data.attribute[0].properties),
						bCurrency = pageObj.isCurrencyQuestion(obj.Data.attribute[0].properties);
					pageObj.buildAttributeQuestion(sQuestionText, sDataType, bDropDown, bCurrency, aListItems, sShortCode, sAttributeId, sPageId);
				}
				else {
					//No Attribute
				}
			},
			complete: function (response) {
				//Set attribute data if exists
				var obj = response,
					bDropDown = pageObj.isDropDownQuestion(obj.responseJSON.Data.attribute[0].properties),
					oDataType = obj.responseJSON.Data.attribute[0].datatype,
					oData = obj.responseJSON.Data.attribute[0].attributedata[0];
				if (oData != null) {
					pageObj.setAttributeValues(oData, oDataType, bDropDown);
				}
			}
		});
	},

	isCurrencyQuestion: function (properties) {
		var bCurrency = false;
		$.each(properties, function (i, v) {
			if (v.Name == "CurrencyCountry") {
				if (v.Value != "" && v.Value != null) {
					bCurrency = true;
					return bCurrency;
				}
			}
		});

		return bCurrency;
	},

	isDropDownQuestion: function (properties) {
		var bDropDown = false;
		$.each(properties, function (i, v) {
			if (v.Name == "ShowDropDown") {
				if (v.Value == "True") {
					bDropDown = true;
					return bDropDown;
				}
			}
		});

		return bDropDown;
	},

	saveAttribute: function (a, b, c, d) {
		var oData6 = {
			action: "SaveAttribute",
			token: CP.apiTOKEN(),
			values: a,
			formid: b,
			attributeid: c,
			ishidden: d,
			postregistration: false
		};

		$.post(CP.apiURL(), oData6, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('save', true, 'Response saved.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('save', false, sError);
				return false;
			}
		});

	},

	setAttributeValues: function (Data, DataType, DropDown) {
		var oAttributeTable = $('table#' + Data.attributeid);
		switch (DataType) {
			case "Multiple Selection List":
				var aValues = [];
				if (DropDown) {
					var oSelect = oAttributeTable.find('select');
					var sValue = Data.datatext;
					aValues = sValue.split(';');
					$.each(aValues, function (i, v) {
						if (v != "" && v != null && v != undefined) {
							$(oSelect).val(v);
						}
					});
				}
				else {
					var oInput = oAttributeTable.find('input');
					var sValue = Data.datatext;
					aValues = sValue.split(';');
					var aInput = oAttributeTable.find('input');
					$.each(aInput, function (i, v) {
						var value = $(v).val();
						$.each(aValues, function (i2, v2) {
							if (parseInt(value, 10) == parseInt(v2, 10)) {
								$(v).prop('checked', true);
							}
						});
					});

				}

				break;
			case "Single Selection List":
				if (DropDown) {
					var oSelect = $(oAttributeTable[0]).find('select'),
						iValue = Data.dataint2;
					$(oSelect).val(iValue);
				}
				else {
					var iValue = Data.dataint2,
						aInput = $(oAttributeTable[0]).find('input'),
						sOther = Data.other,
						bSetOther = false;

					if (iValue === 999) {
						bSetOther = true;
					}

					$.each(aInput, function (i, v) {
						var input = $(v);
						var value = input.val();
						if (parseInt(value, 10) == parseInt(iValue, 10)) {
							input.prop('checked', true);
							if (bSetOther) {
								var otherInput = input.closest('td').next().find('input');
								$(otherInput).val(sOther);
							}
						}
					});
				}

				break;
			case "Numeric":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.dataint;
				$(oInput).val(sValue);
				break;
			case "Text":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datatext;
				$(oInput).val(sValue);
				break;
			case "Date and Time":
				var sNewDate = "",
					aDate = [],
					sDate = "",
					oInput = oAttributeTable.find('input'),
					sValue = Data.datadate;
				sDate = sValue.slice(0, 10);
				aDate = sDate.split("/");
				sNewDate = aDate[2] + "-" + aDate[1] + "-" + aDate[0];
				$(oInput).val(sNewDate);
				break;
			case "Decimal":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datadecimal;
				$(oInput).val(sValue);
				break;
			case "Currency":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datacurrency;
				$(oInput).val(sValue);
				break;
			default:
				break;
		}
	}
});

CP.CurrentPage = new CP.Form();
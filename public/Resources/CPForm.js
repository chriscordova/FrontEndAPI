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
		self.attributelistitems = ko.observableArray();
		self.fullattributedata = ko.observableArray();
		self.attributetitle = ko.observable();
		self.attributeshortcode = ko.observable();
		self.questiontype = ko.observable();
		self.showthispage = ko.observable();
		self.usecurrency = ko.observable();
		self.datatype = ko.observable();
		self.dropdown = ko.observable();
		self.actualattributedata = ko.observableArray();

		self.getHiddenRules = function (e) {
			$.each(e, function (i, v) {
				pageObj.aHiddenRules.push(v);
			});
		};
		
		self.setAttributeValues = function(a,b){
			pageObj.setAttributeValues(a, b, self.dropdown);	
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

			var sTitle = '', sShortCode = '', sQuestionType = '', sInputType = '', bDropDown = false, bCurrency = false;
			
			var req = $.post(CP.apiURL(), oData, self.fullattributedata);
			req.done(function (response) {
				bDropDown = pageObj.isDropDownQuestion(response.Data.attribute[0].properties);
				bCurrency = pageObj.isCurrencyQuestion(response.Data.attribute[0].properties);
				sTitle = response.Data.attribute[0].questiontext;
				sShortCode = response.Data.attribute[0].shortcode;
				sQuestionType = response.Data.attribute[0].datatype;

				self.attributelistitems = response.Data.attribute[0].listitems;
				self.attributetitle = sTitle;
				self.attributeshortcode = sShortCode;
				self.datatype = sQuestionType;
				self.dropdown = bDropDown;
				
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
					self.actualattributedata = oAttributeData;	
				}
			});
			
			$.ajaxSetup({
				async: true
			});
		};

		self.loadFormData(data);
		$('#dvForm').attr('formid', CP.getURLParam('formid'));

	},

	setHiddenRules: function (items) {
		$.each(items, function (i, v) {
			var attributeToHide = v.attributeid;
			var choicesSelectedToShow = v.datachoices.split(',');
			var thisAttribute = v.pageitemattributeid;
			var ruleType = v.ruletype;
			if (ruleType == 8) {
				var inputs = $('#' + thisAttribute).find('input');
				$('table#' + attributeToHide).hide();
				$.each(inputs, function (i, v) {
					if ($(v).is(':checked')) {
						if ($.inArray($(v).val(), choicesSelectedToShow) >= 0) {
							$('table#' + attributeToHide).show();
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

		var req = $.post(CP.apiURL(), oData4, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success) {
				var sFormId = CP.getURLParam("formid");
				var aForms = obj.Data.formgroups;
				var arr = null;
				$.each(aForms, function(index, form){
					arr = $.grep(form.forms, function (n, i) {
						return n.formid == sFormId;
					});
					
					if (CP.isNotNullOrEmpty(arr)){
						return false;
					}
				});
				

				var oForms = {
					"formData": arr[0].formpages
				};

				var formVM = new pageObj.FormViewModel(oForms, pageObj);
				ko.applyBindings(formVM);
			}
		});
		
		req.done(function(){
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
					var oSelect = oAttributeTable.find('select'),
						iValue = Data.dataint2;
					$(oSelect).val(iValue);
				}
				else {
					var iValue = Data.dataint2,
						aInput = oAttributeTable.find('input'),
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
								var otherInput = input.parent().next();
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
					oInput = oAttributeTable.find('input[type="date"]'),
					sValue = Data.datadate;
				sNewDate = CP.formatDateForCP(sValue);
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
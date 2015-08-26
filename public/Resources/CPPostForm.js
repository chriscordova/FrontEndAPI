/// <reference path="../../typings/knockout/knockout.d.ts"/>
CP.PostForm = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.shouldIBeHere('panel');
		this.initPage();
	},

	aHiddenRules: [],
	
	aPageHidingRules: [],
	
	personId: function () {
		return CP.getURLParam('personid');
	},

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
		self.attribute = ko.observable();
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
		self.pageitems = ko.observableArray();

		self.getAttributeData = function (items) {
			var oAttribute, sTitle = '', sShortCode = '', sQuestionType = '', sInputType = '', bDropDown = false, bCurrency = false;
			oAttribute = items;
			bDropDown = pageObj.isDropDownQuestion(oAttribute.properties);
			bCurrency = pageObj.isCurrencyQuestion(oAttribute.properties);
			sTitle = oAttribute.questiontext;
			sShortCode = oAttribute.shortcode;
			sQuestionType = oAttribute.datatype;

			self.attribute = oAttribute;
			self.attributelistitems = oAttribute.listitems;
			self.attributetitle = sTitle;
			self.attributeshortcode = sShortCode;
			self.datatype = sQuestionType;
			self.dropdown = bDropDown;
			self.usecurrency = bCurrency;

			if (bDropDown) {
				self.questiontype = 'QuestionType_DropDownQuestion';
			}
			else {
				sInputType = CP.getControlFromDataType(sQuestionType, bDropDown);
				self.questiontype = pageObj.getQuestionTemplate(sInputType);
			}

			var oAttributeData = oAttribute.attributedata[0];
			if (CP.isNotNullOrEmpty(oAttributeData)) {
				self.actualattributedata = oAttributeData;
			}
		};

		self.getHiddenRules = function (e) {
			ko.utils.arrayPushAll(pageObj.aHiddenRules, e);
		};

		self.setAttributeValues = function (a, b) {
			pageObj.setAttributeValues(a, b, self.dropdown);
		};

		self.loadFormData = function (e) {
			self.formdata = e.formData.sort(CP.sortBySortOrder);
			ko.utils.arrayForEach(self.formdata, function (item) {
				self.pageitems = item.pageitems.sort(CP.sortBySortOrder);
			});
		};

		self.checkVisibility = function (index) {
			self.showthispage = index > 0 ? false : true;
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

	deferreds: [],

	results: [],
	
	bError: false,
	
	processAttributeData: function (id, item, d) {
		var pageObj = this;
		var oData = {
			action: "GetAttributeDetails",
			attributeid: id,
			postregistration: true,
			personid: pageObj.personId()
		};

		$.post(CP.apiURL(), oData, function (result) {
			item['attributeitemdata'] = result.Data.attribute[0];
			pageObj.results.push(result);
			d.resolve();
		});
	},

	initForm: function () {
		var pageObj = this;
		
		//Get Profile Form details
		var oData4 = {
			action: "GetProfileFormDetails",
			postregistration: true,
			personid: pageObj.personId()
		};

		var req = $.post(CP.apiURL(), oData4, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success) {

				var arr = obj.Data.form;
				var formVM = null;

				var oForms = { "formData": arr[0].formpages };

				$.each(oForms, function (i, v) {
					$(v).each(function (i, v) {
						var aPageRule = v.hiddenpagerules;
						if (aPageRule.length > 0){
							pageObj.aPageHidingRules.push(aPageRule);	
						}
						var aPageItems = v.pageitems;
						$(aPageItems).each(function (i, v) {
							var dObject = new $.Deferred();
							pageObj.processAttributeData(v.attributeid, v, dObject);
							pageObj.deferreds.push(dObject);
						});
					});
				});
				
				$.when.apply($, pageObj.deferreds).done(function () {
					formVM = new pageObj.FormViewModel(oForms, pageObj);
					ko.applyBindings(formVM);
					pageObj.setHiddenRules(pageObj.aHiddenRules);
				});
			}
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
		$('#save-fail').hide();
		var thisDiv = $(obj).closest('div');
		setTimeout(function () {
			
			//Now loop through .prev() until we find a DIV without the attribute 'skip="true"'
			//Need to also remove the attribute 'skip'.
			
			var oPrevToShow;
			var aPrevPages = $(thisDiv).prevAll();
			aPrevPages.get().reverse();
			
			$(aPrevPages).each(function(i,e){
				var oElement = $(e);
				var oSkipAttr = oElement.attr('skip');
				if (CP.isNotNullOrEmpty(oSkipAttr)){
					oElement.removeAttr('skip');
				}
				else{
					oPrevToShow = oElement;
					return false;
				}
			});
			
			thisDiv.hide();
			oPrevToShow.show();
			
		}, 500);
	},
	
	saveHiddenPages: function(element) {
		var pageObj = this;
		
		//Save all attributes on the page
		var sFormId = $('#dvForm').attr('formid');
		var thisDiv = $(element);
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
	},

	clickSave: function (obj) {
		var pageObj = this;
				
		pageObj.bError = false;
		
		$('#save-fail').hide();
		$('#save-success').hide();
		
		//Save all attributes on the page
		var sFormId = $('#dvForm').attr('formid');
		var thisDiv = $(obj).closest('div');
		var aQuestions = thisDiv.find('table');
		var aNextPages = $(thisDiv).nextAll();

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
			
			//Multiple page hide:
			//Need to set 'skip="true"' to any page that is going to be hidden on NEXT.
			//Once set all skip to any pages, we need to find the next page that does NOT have attribute and show that/hide the rest.
			
			$(aNextPages).each(function(i,el){
				var oElement = $(el);
				var gPageId = oElement.attr('id');
				if (CP.isNotNullOrEmpty(gPageId)){
					var aRules = pageObj.aPageHidingRules;
					$(aRules).each(function(i,rules){
						var aMatchingAttr = $.grep(rules, function(e){ return e.attributeid == oAttributeId });
						if (aMatchingAttr.length > 0){
							$(aMatchingAttr).each(function(i,att){
								var sRuleValue = att.datachoices;
								if (CP.isNotNullOrEmpty(sRuleValue)){
									var aValues = sRuleValue.split(',');
									if (aValues.length){
										var aFormValues = sValues.split('|');
										$(aValues).each(function(i,v){
											var sVal = v.toString();
											var iExists = $.inArray(sVal, aFormValues);
											if (iExists >= 0){
												if (att.pageid == gPageId){
													oElement.attr('skip', 'true');
													//need to ..saveAttribute for these pages.
													pageObj.saveHiddenPages(oElement);
												}
											}
										});
									}
								}
							});
						}
					});
				}
			});
		});
		
		setTimeout(function () {
			
			if (!pageObj.bError){
				$('#save-success').hide();
			
				//Check to see if we are clicking to the end, if so, redirect to main page
				var nextDiv = thisDiv.next();
				if (nextDiv.length == 0) {
					document.location.href = "index.html";
					return false;
				}
				
				//Find the next DIV that does NOT have the 'skip="true"' attribute
				var iCount = 0;
				var oNextToShow = $.grep(aNextPages, function(e){
						if (CP.isNullOrEmpty(e.attributes.skip)){
							if (iCount == 0){
								iCount++;
								return true;
							}
						}
					});
				
				//Hide this page
				$(thisDiv).hide();
				
				//Show the found DIV that needs to be shown/If none shown, redirect to main page
				if (CP.isNullOrEmpty(oNextToShow)){
					document.location.href = "index.html";
					return false;
				}
				else{
					$(oNextToShow).show();
				}
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
		var pageObj = this;
		
		var oData6 = {
			action: "SaveAttribute",
			values: a,
			formid: b,
			attributeid: c,
			ishidden: d,
			postregistration: true,
			personid: pageObj.personId()
		};

		$.post(CP.apiURL(), oData6, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.formValidation(c, true);	
				if (!$('#save-fail').is(':visible')){
					CP.setValidationBox('save', true, 'Response saved.');
				}
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('save', false, sError);
				CP.formValidation(c, false);
				pageObj.bError = true;
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
					if (CP.isNullOrEmpty(sValue)){
						return;
					}
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
					if (CP.isNullOrEmpty(sValue)){
						return;
					}
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
					if (CP.isNullOrEmpty(iValue)){
						return;
					}
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
				if (CP.isNullOrEmpty(sValue)){
					return;
				}
				$(oInput).val(sValue);
				break;
			case "Text":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datatext;
				if (CP.isNullOrEmpty(sValue)){
					return;
				}
				$(oInput).val(sValue);
				break;
			case "Date and Time":
				var sNewDate = "",
					oInput = oAttributeTable.find('input[type="date"]'),
					sValue = Data.datadate;
				if (CP.isNullOrEmpty(sValue)){
					return;
				}
				sNewDate = CP.formatDateForCP(sValue);
				$(oInput).val(sNewDate);
				break;
			case "Decimal":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datadecimal;
				if (CP.isNullOrEmpty(sValue)){
					return;
				}
				$(oInput).val(sValue);
				break;
			case "Currency":
				var oInput = oAttributeTable.find('input'),
					sValue = Data.datacurrency;
				if (CP.isNullOrEmpty(sValue)){
					return;
				}
				$(oInput).val(sValue);
				break;
			default:
				break;
		}
	}
});

CP.CurrentPage = new CP.PostForm();
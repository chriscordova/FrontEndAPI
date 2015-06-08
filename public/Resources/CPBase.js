/// <reference path="../typings/jquery/jquery.d.ts"/>
if (localStorage.TOKEN) {
	$('#dvHeader').load('../Includes/header.shtml');
	$('#dvFooter').load('../Includes/footer.shtml');
	$('#nav-header').load('../Includes/logged_menu.shtml');
	$('#leftCol').load('../Includes/logged_left.shtml');
}
else {
	$('#dvHeader').load('../Includes/header.shtml');
	$('#dvFooter').load('../Includes/footer.shtml');
	$('#nav-header').load('../Includes/menu.shtml');
	$('#leftCol').load('../Includes/left.shtml');
}

var CP = {
	emptyFn: function () { },

	extend: function () {
        // inline overrides function
        var overrideFunc = function (obj) {
            for (var prop in obj) {
                this[prop] = obj[prop];
            }
        };
        // constructor of simple Object class
        var baseObjConstr = Object.prototype.constructor;
        // create closure function
        return function (subBase, supPar, overrides) {
            // if function called with 2 paramters, superclass and object literal
            if (typeof supPar == 'object') {
                // change vars, because called with 2 params
                overrides = supPar;
                supPar = subBase;
                // if contructor won't overriden, call parent with all passed args
                subBase = (overrides.constructor != baseObjConstr) ? overrides.constructor : function () { supPar.apply(this, arguments); };
            }
            // create temp function and vars with prototypes
            var F = function () { }, subBaseProt, supParProt = supPar.prototype;
            // change temp functiion prototype
            F.prototype = supParProt;
            // create new incstance of prototype, this will solve problem of one prototype chain
            subBaseProt = subBase.prototype = new F();
            // take care of inheritance, reset constructor
            subBaseProt.constructor = subBase;
            // make link to parent contructor
            subBase.superclass = supParProt;
            // reset parent constructor, don't know for what
            if (supParProt.constructor == baseObjConstr) {
                supParProt.constructor = supPar;
            }
            // add override function
            subBase.override = function (obj) {
                CP.override(subBase, obj);
            };
            // add override to prototype
            subBaseProt.override = overrideFunc;
            // copy properties
            CP.override(subBase, overrides);
            // add extend function
            subBase.extend = function (obj) { CP.extend(subBase, obj); };
            // return new class (constructor function)
            return subBase;
        };
    } (),

	override: function (origClass, overrides) {
        if (overrides) {
            var origProt = origClass.prototype;
            // copy all properties to prototype
            for (var method in overrides) {
                origProt[method] = overrides[method];
            }
        }
    },

	emptyGuid: '00000000-0000-0000-0000-000000000000',

    isGuid: function (guid) {
        return (guid == "00000000-0000-0000-0000-000000000000" || guid == "" || guid == null) ? false : true;
    },

	isNullOrEmpty: function (str) {
        return str == null || str == '';
    },

    isNotNullOrEmpty: function (str) {
        return str != null && str != '';
    },

    isButtonEnabled: function (btn) {
        return !(btn.hasClass('disabled') || btn.closest('.button').hasClass('disabled'));
    },

    enableButton: function (btn, enable) {
        if (enable) {
            btn.removeClass('disabled');
            btn.closest('.button').removeClass('disabled');
        }
        else {
            btn.addClass('disabled');
            btn.closest('.button').addClass('disabled');
        }
    },

    toFirstCharUpperString: function (val) {
        return val[0].toUpperCase() + val.substring(1);
    },

    toFirstCharLowerString: function (val) {
        return val[0].toLowerCase() + val.substring(1);
    },

	isEmailValid: function (email) {
        var result = true;
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regexp.test(email)) {
            result = false;
        }
        return result;
    },

	generateHashString: function (length) {
        var literals = "abcdefghijklmnopqrstuvwxyz123456789",
            generatedHash = "";
        for (var i = 0; i < length; i++) {
            generatedHash += literals[Math.floor(Math.random() * 34)];
        }
        return generatedHash;
    },

	generateHashForString: function (str) {
        var hash = 0, i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },

	allowNumbersOnly: function (event) {
        if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39)
            return true;
        else {
            // Ensure that it is a number and stop the keypress
            if (event.keyCode < 48 || event.keyCode > 57 && event.keyCode < 96 || event.keyCode > 105) {
                event.preventDefault();
                return false;
            }
            else {
                if (event.shiftKey) {
                    return false;
                }
                return true;
            }
        }
    },

	allowAlphaNumericsOnly: function (event) {
        if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39)
            return true;
        else {
            // Ensure that it is a number or an alphabet and stop the keypress
            if (event.keyCode < 48 || event.keyCode > 90 && event.keyCode < 96 || event.keyCode > 105) {
                event.preventDefault();
                return false;
            }
            else {
                if (event.shiftKey) {
                    return false;
                }
                return true;
            }
        }
    },

	convertSelectToJson: function (selectId, context) {
        var arr = [];
        $(selectId + " > option", context).each(function () {
            if ($(this).val() != '') {
                arr.push({ id: $(this).val(), text: $(this).text() });
            }
        });
        return arr;
    },

	isNumber: function (n) {
        return n == parseFloat(n);
    },

    isEven: function (n) {
        return CP.isNumber(n) && (n % 2 == 0);
    },

    isOdd: function (n) {
        return CP.isNumber(n) && (Math.abs(n) % 2 == 1);
    },

    apiURL: function () {
        return "http://www.cpdemo.com.au/api.ashx";
		//		return "http://localhost:64904/ContactProfiler/api.ashx";
    },

    apiOrigin: function () {
        return "http://www.cpdemo.com.au/";
		//		return "http://localhost:64904/ContactProfiler/";
    },

    apiTOKEN: function () {
        return localStorage.getItem('TOKEN');
    },

	shouldIBeHere: function (pagetype) {
		var sToken = CP.apiTOKEN();
		switch (pagetype) {
			case 'panel':
				if (CP.isNotNullOrEmpty(sToken)) {
					document.location.href = '../member/index.html';
				}
				break;
			case 'member':
				if (CP.isNullOrEmpty(sToken)) {
					document.location.href = '../panel/index.html';
				}
				break;
			default:
				break;
		};
	},

    apiVerifyMobile: function () {
        return false;
    },

	setValidationBox: function (id, success, message) {
		var oSelectorBox = '#' + id;
		var oSelector = '';
		var oSelectorMessage = '';
		var sSuccess = '-success';
		var sFail = '-fail';
		var oMessage = ' .message';
		if (success) {
			oSelector = oSelectorBox + sSuccess;
			$(oSelector).show();
			$(oSelectorBox + sFail).hide();
			oSelectorMessage = oSelectorBox + sSuccess + oMessage;
		}
		else {
			oSelector = oSelectorBox + sFail;
			$(oSelector).show();
			$(oSelectorBox + sSuccess).hide();
			oSelectorMessage = oSelectorBox + sFail + oMessage;
		}

		$(oSelectorMessage).html(message);
		
		//Scroll to message
		var scrollPos = $(oSelectorMessage).offset().top;
		$(window).scrollTop(scrollPos);
	},

    checkConfirmFields: function (a, b) {
        return a == b;
    },

    checkRequiredFields: function (fields) {
        var iCount = 0;
		$.each(fields, function (i, v) {
			var oField = $(v);
			var oFormGroup = oField.parent().parent();
			var sType = v.type;
			if (sType == undefined) {
				var sClass = v.className;
				switch (sClass) {
					case 'radio':
						var oInput = oField.find('input')[0];
						var oRadioGroup = $(oInput).attr('name');
						if (!$("input[name='" + oRadioGroup + "']:checked").val()) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
						}
						break;
				}

			}
			else {
				var sValue = oField.val();
				switch (sType) {
					case 'date':
						if (sValue == '' || sValue == undefined) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
						}
						break;
					case 'password':
						if (sValue == '' || sValue == undefined) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
						}
						break;
					case 'text':
					case 'textarea':
						if (sValue == '') {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
						}
						break;
					case 'email':
						var bValidEmail = CP.isEmailValid(sValue);
						if (sValue == '' || !bValidEmail) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
							if (oFormGroup.find('span').length == 0) {
								oFormGroup.find('input').parent().append('<span class="label label-danger">Must be valid email format</span>');
							}

						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
							var sMessage = oFormGroup.find('span');
							sMessage.remove();
						}
						break;
					case 'select-one':
						if (sValue == '' || sValue == undefined) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
						}
						break;
					case 'number':
						var bNumeric = $.isNumeric(sValue);
						var sMessage;
						if (!bNumeric) {
							iCount++;
							oFormGroup.removeClass('has-success');
							oFormGroup.addClass('has-error');
							if (oFormGroup.find('span').length == 0) {
								oFormGroup.append('<span class="label label-danger">Must contain numbers only</span>');
							}
						}
						else {
							oFormGroup.removeClass('has-error');
							oFormGroup.addClass('has-success');
							sMessage = oFormGroup.find('span');
							sMessage.remove();
						}
						break;
					default:
						break;

				}
			}


		});

		return iCount == 0;
    },

    getURLParam: function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results == null) {
			return null;
		}
		else {
			return results[1] || 0;
		}
    },

	sortBySortOrder: function (a, b) {
		var aOrder = a.sortorder;
		var bOrder = b.sortorder;
		return ((aOrder < bOrder) ? -1 : ((aOrder > bOrder) ? 1 : 0));
	},
	
	apiRequest: function(){
		
	},
	
	getValuesFromInputType: function (oInput) {
		var sValues = "";
		var oInputType = $(oInput).attr('type');
		switch (oInputType) {
			case "text":
			case "number":
				sValues = $(oInput).val();
				break;
			case "date":
				var dateValue = $(oInput).val();
				var bMatch = dateValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
				if (bMatch) {
					sValues = bMatch[3] + "/" + bMatch[2] + "/" + bMatch[1];
				}
				break;
			case "radio":
				$.each(oInput, function (i, v) {
					var bChecked = $(v).is(':checked');
					if (bChecked) {
						var sVal = $(v).val();
						sValues += sVal;
						if (sVal == '999') {
							var otherInput = $(v).closest('td').next().find('input');
							if (otherInput.length > 0) {
								var otherValue = otherInput.val();
								sValues += '|' + otherValue;
							}
						}
					}
				});
				break;
			case "checkbox":
				$.each(oInput, function (i, v) {
					var bChecked = $(v).is(':checked');
					if (bChecked) {
						sValues += $(v).val() + "|";
					}
				});
				break;
			default:
				break;
		}
		
		return sValues;
	},

	getControlFromDataType: function (dataType, bDropDown) {
		var sControl = '';
		switch (dataType) {
			case CP.Enums.DataTypes.MultipleSelectionList:
				sControl = "checkbox";
				break;
			case CP.Enums.DataTypes.SingleSelectionList:
				if (!bDropDown) {
					sControl = "radio";
				}
				break;
			case CP.Enums.DataTypes.DateAndTime:
				sControl = "number";
				break;
			case CP.Enums.DataTypes.Decimal:
			case CP.Enums.DataTypes.Numeric:
			case CP.Enums.DataTypes.Currency:
				sControl = "number";
				break;
			case CP.Enums.DataTypes.Text:
				sControl = "text";
				break;
			default:
				break;
		}

		return sControl;
	}
};

CP.Enums = {
	DataTypes: {
		MultipleSelectionList: 'Multiple Selection List',
		SingleSelectionList: 'Single Selection List',
		Numeric: 'Numeric',
		Decimal: 'Decimal',
		DateAndTime: 'Date and Time',
		Currency: 'Currency',
		Text: 'Text'
	},

	InputTypes: {
		0: "text",
		1: "number",
		2: "email",
		3: "radio",
		4: "checkbox"
	}
};

CP.Data = {
	nzStates: ['Auckland', 'Bay Of Plenty', 'Canterbury', 'Chatham Islands', 'Gisborne', 'Hawke\s Bay', 'Manawatu', 'Marlborough', 'Nelson', 'Northland', 'Otago', 'Southland', 'Taranaki', 'Tasman', 'Waikato', 'Wellington', 'West Coast'],

	auStates: ['NSW', 'VIC', 'NT', 'QLD', 'SA', 'WA', 'TAS']
};

CP.Message = {

	incompleteFields: "There are incomplete fields.",

	agreeToTerms: "You must agree to terms to continue.",

	emailAddressesDoNotMatch: "Email Addresses do not match.",

	lostPasswordEmail: "Lost password email has been sent",

	emptyEmails: "No Panel Member Emails",

	emptyParticipation: "No Participation History",

	getError: function (obj) {

        var buildSet = function (array) {
			var set = {};
			for (var i in array) {
				var item = array[i];
				set[item] = item;
			}
			return set;
		};

		var eErrors = buildSet([
			'UnknownError',
			'InvalidAction',
			'InvalidEnum',
			'InvalidParameter',
			'InvalidContactCode',
			'UnableToRetrieveJobContact',
			'InvalidContactId',
			'InvalidContactStatus',
			'AttributeDataTypeNotSupported',
			'UnableToUpdateContactStatus',
			'UnableToRetrievePerson',
			'UnableToRetrieveExternalContact',
			'UnableToUpdatePersonDetails',
			'UnableToUpdateExternalContactDetails',
			'UnableToCreatePerson',
			'UnableToUpdateStatus',
			'InvalidStatus',
			'InvalidActionCode',
			'UnableToRetrieveSurvey',
			'InvalidEventType',
			'InvalidStatusForProcessing',
			'UnableToCreateJobDelayedProcessing',
			'ContactCodeNotProvided',
			'DuplicateEmailAddress',
			'InvalidEmailAddressFormat',
			'UnableToUpdateAttributes',
			'InvalidDeveloperKey',
			'DoNotUpdateAttributeData',
			'EmailAddressNotProvided',
			'AccessDenied',
			'InvalidPersonToken',
			'ReferralLimitExceeded',
			'ReferralEmailAddressWithNameFormatInvalid',
			'ReferralEmailAddressAlreadyExists',
			'ReferralEmailFailedToSent',
			'ReferralEmailTemplateDoesNotExist',
			'CouldNotBuildReferLink',
			'UnableToUnsubscribePanelMember',
			'UnableToProcessUnsubscribeRequest',
			'UnableToLogin',
			'PersonApiTokenDoesNotExist',
			'OfferDoesNotExistOrInvalid',
			'NotEnoughCreditsToPurchaseOffer',
			'AlternateAddressForRedemptionNotProvided',
			'RedeemOfferEmailTemplateDoesNotExist',
			'UnableToPurchaseOffer',
			'PasswordNotProvided',
			'UnableToDeleteAlternateEmailAddress',
			'NoValidAlternateEmailAddresses',
			'UnableToSendContactUsMessage',
			'PollIdIsEmptyOrInvalid',
			'PollSelectedValuesAreEmptyOrInvalid',
			'PollSelectedValuesCountIsEmptyOrInvalid',
			'UnableToSavePollResults',
			'AttributeShortCodeAndAttributeIdIsEmptyOrInvalid',
			'UnableToRetrieveAttribute',
			'UnableToRetrieveAttributeData',
			'AttributeIdIsEmptyOrInvalid',
			'AttributeValueIsEmptyOrInvalid',
			'AttributeFormIsNullOrInvalid',
			'VerifyIdIsEmptyOrInvalid',
			'VerifyPasswordEmptyOrInvalid',
			'UnableToGetEmailAddress',
			'UnableToSendLostPasswordEmail',
			'MobilePhoneIsEmptyOrInvalid',
			'UnableToSendMobileVerificationSms',
			'VerifyActionIsEmptyOrInvalid',
			'VerificationCodeIsEmptyOrInvalid',
			'UnableToVerifyCode',
			'CardNumberIsEmptyOrInvalid',
			'UnableToActivateRedemptionCard',
			'UnableToDeclineSurvey',
			'PageCodeIsEmptyOrInvalid',
			'TimeslotIdIsEmptyOrInvalid',
			'TimeslotAttendanceStatusIsEmptyOrInvalid',
			'UnableToAccessGroupConfirmationStatus',
			'PostRegistrationProfileFormIsEmptyOrInvalid'
		]);

        var sReturn = "";
		var sErrorCode = "";
		var sDataError = "";
		if (obj.ErrorCode != "" && obj.ErrorCode != null && obj.ErrorCode != 0) {
			var oKeys = Object.keys(eErrors);
			var sError = oKeys[obj.ErrorCode];
			var sCleanError = sError.replace(/([a-z])([A-Z])/g, "$1 $2");
			sErrorCode = sCleanError;
		}

		if (obj.Data != null) {
			if (obj.Data.Error != "" || obj.Data.Error != null) {
				sDataError = obj.Data.Error;
			}
		}

		if (sErrorCode != "" && sDataError != "") {
			sReturn = sErrorCode + ' - ' + sDataError;
		}
		else {
			sReturn = sErrorCode == "" ? sDataError : sErrorCode;
		}
        return sReturn;
    }

};
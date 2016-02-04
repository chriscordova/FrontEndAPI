CP.ChangeEmail = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.shouldIBeHere('member');
		this.initPage();
	},

	initPage: function () {
		this.initForm();

	},

	initPageContent: function () {

	},

	setPageContent: function () {

	},

	initForm: function () {
		var pageObj = this;
		var oData3 = {
			action: "GetPanelMemberDetails",
			token: CP.apiTOKEN()
		};
        
        function success(obj){
            var emailAddress = obj.panelmemberdetails[0].emailaddress;
            var altEmailAddress;
            var altEmailAddresses = obj.panelmemberdetails[0].altemailaddress;
            if (altEmailAddresses.length > 0){
                altEmailAddress = altEmailAddresses[0].altemailaddress;
            }
            
            if (CP.isNotNullOrEmpty(emailAddress)){
                $('input[name="currentemailaddress"]').val(emailAddress);	
            }
            
            if (CP.isNotNullOrEmpty(altEmailAddress)){
                $('input[name="currentaltemailaddress"]').val(altEmailAddress);	
            }
        }
        
        CP.ajaxRequest(
            oData3,
            success,
            null,
            null,
            false
        );
        
        
		
		$('#removeAltEmailAddress').on('click', function(){
			pageObj.removeAltEmail();
		});
		
		$('#change-email').on('click', function () {
			pageObj.changeEmail();
		});

		$('#change-altemail').on('click', function () {
			pageObj.changeAltEmail();
		});
	},
	
	validateEmailChange: function(a,b){
		var aRequired = $('#emailChange *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('updateemail', false, CP.Message.incompleteFields);
			return false;
		}
		
		var bConfirmed = CP.checkConfirmFields(a, b);
		if (!bConfirmed){
			CP.setValidationBox('updateemail', false, CP.Message.emailAddressesDoNotMatch);
			return false;
		}
		
		return true;
	},
	
	changeEmail: function () {
		var pageObj = this;
		
		var sNewEmail = $('input[name="_emailaddress"]').val();
		var sNewEmailConfirm = $('input[name="confirmemailaddress"]').val();
		
		if (!pageObj.validateEmailChange(sNewEmail, sNewEmailConfirm)){
			return false;
		}
		
		var sPassword = $('input[name="password"]').val();

		var oData4 = {
			action: "ChangePanelMemberEmailAddress",
			token: CP.apiTOKEN(),
			password: sPassword,
			emailaddress: sNewEmail
		};
        
        var oVData = {
            validationbox: "updateemail",
            success: true,
            successmessage: "Email address change successful.",
            fail: true,
            failmessage: null
        }
        
        CP.ajaxRequest(
            oData4,
            null,
            null,
            oVData,
            false
        );
	},
	
	validateAltEmailChange: function(a,b){
		var aRequired = $('#altEmailChange *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('updatealtemail', false, CP.Message.incompleteFields);
			return false;
		}
		
		var bConfirmed = CP.checkConfirmFields(a, b);
		if (!bConfirmed){
			CP.setValidationBox('updatealtemail', false, CP.Message.emailAddressesDoNotMatch);
			return false;
		}
		
		return true;
	},

	changeAltEmail: function () {
		var pageObj = this;
		
		var sNewAltEmail = $('input[name="_altemailaddress"]').val();
		var sNewAltEmailConfirm = $('input[name="confirmaltemailaddress"]').val();
		
		if (!pageObj.validateAltEmailChange(sNewAltEmail, sNewAltEmailConfirm)){
			return false;
		}
		
		var sPassword = $('input[name="_password"]').val();

		var oData5 = {
			action: "ChangePanelMemberEmailAddress",
			token: CP.apiTOKEN(),
			password: sPassword,
			altemailaddress: sNewAltEmail
		};
        
        var oVData = {
            validationbox: "updatealtemail",
            success: true,
            successmessage: "Alternate email address change successful.",
            fail: true,
            failmessage: null
        }
        
        CP.ajaxRequest(
            oData5,
            null,
            null,
            oVData,
            false
        );
	},
	
	removeAltEmail: function(){
		//Confirm they want to delete
		var bConfirm = confirm("Are you sure you want to remove your alternate email address record?");
		if (!bConfirm){
			return false;
		}
		
		var oDeleteData = {
			action: "RemoveAlternateEmailAddress",
			token: CP.apiTOKEN()
		};
        
        var oVData = {
            validationbox: "removealtemailaddress",
            success: false,
            successmessage: null,
            fail: true,
            failmessage: null
        }
        
        function success(){
            window.location.reload(true);
        }
        
        CP.ajaxRequest(
            oDeleteData,
            success,
            null,
            oVData,
            false
        );
		
	}

});

CP.CurrentPage = new CP.ChangeEmail();
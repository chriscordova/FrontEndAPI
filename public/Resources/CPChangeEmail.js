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

		$.post(CP.apiURL(), oData3, function (response) {
			var obj = response;
			if (obj.Success) {
				var emailAddress = obj.Data.panelmemberdetails[0].emailaddress;
				var altEmailAddress;
				var altEmailAddresses = obj.Data.panelmemberdetails[0].altemailaddress;
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
		});

		$('#change-email').on('click', function () {
			pageObj.changeEmail();
		});

		$('#change-altemail').on('click', function () {
			pageObj.changeAltEmail();
		});
	},

	changeEmail: function () {
		var aRequired = $('#emailChange *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('updateemail', false, CP.Message.incompleteFields);
			return false;
		}
		
		var sNewEmail = $('input[name="_emailaddress"]').val();
		var sNewEmailConfirm = $('input[name="confirmemailaddress"]').val();
		
		var bConfirmed = CP.checkConfirmFields(sNewEmail, sNewEmailConfirm);
		if (!bConfirmed){
			CP.setValidationBox('updateemail', false, CP.Message.emailAddressesDoNotMatch);
			return false;
		}
		
		var sPassword = $('input[name="password"]').val();

		var oData4 = {
			action: "ChangePanelMemberEmailAddress",
			token: CP.apiTOKEN(),
			password: sPassword,
			emailaddress: sNewEmail
		};

		$.post(CP.apiURL(), oData4, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('updateemail', true, 'Email address change successful.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('updateemail', false, sError);
				return false;
			}
		});
	},

	changeAltEmail: function () {
		var aRequired = $('#altEmailChange *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('updatealtemail', false, CP.Message.incompleteFields);
			return false;
		}
		
		var sNewAltEmail = $('input[name="_altemailaddress"]').val();
		var sNewAltEmailConfirm = $('input[name="confirmaltemailaddress"]').val();
		
		var bConfirmed = CP.checkConfirmFields(sNewAltEmail, sNewAltEmailConfirm);
		if (!bConfirmed){
			CP.setValidationBox('updatealtemail', false, CP.Message.emailAddressesDoNotMatch);
			return false;
		}
		
		var sPassword = $('input[name="_password"]').val();

		var oData5 = {
			action: "ChangePanelMemberEmailAddress",
			token: CP.apiTOKEN(),
			password: sPassword,
			altemailaddress: sNewAltEmail
		};

		$.post(CP.apiURL(), oData5, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('updatealtemail', true, 'Alternate email address change successful');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('updatealtemail', false, sError);
			}
		});
	}

});

CP.CurrentPage = new CP.ChangeEmail();
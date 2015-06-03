CP.Verify = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.shouldIBeHere('panel');
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
		var sVerifyId = CP.getURLParam("verifyid");
		var sContactId = CP.getURLParam("contactid");
		var sEmailAddress = "";

		var oData2 = {
			action: "GetEmailAddressesFromPersonId",
			contactid: sContactId
		};

		$.post(CP.apiURL(), oData2, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				sEmailAddress = obj.Data.emailaddress;
				$('#email').val(sEmailAddress);
			}
			else {
				var sError = CP.Message.getError(obj);
				alert(sError);
			}
		});

		$('#activate').on('click', function () {
			pageObj.verify(sVerifyId, sContactId, sEmailAddress);
		});

	},

	verify: function (a,b,c) {
		var aRequired = $('#verify-form *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('verify', false, CP.Message.incompleteFields);
			return false;
		}
		
		var sPassword = $('#password').val();
		var sPasswordConfirm = $('#confirm-password').val();
		var bConfirmed = CP.checkConfirmFields(sPassword, sPasswordConfirm);
		if (!bConfirmed){
			CP.setValidationBox('verify', false, 'Password fields do not match.');
			return false;
		}
		
		var oData1 = {
			action: "VerifyAccount",
			password: sPassword,
			verifyid: a,
			contactid: b,
			emailaddress: c
		};

		$.post(CP.apiURL(), oData1, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				var sAPIToken = obj.Data.token;
				if (CP.isNotNullOrEmpty(sAPIToken)) {
					localStorage.setItem("TOKEN", sAPIToken);
					document.location.href = '../member/index.html';
				}
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('verify', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.Verify();
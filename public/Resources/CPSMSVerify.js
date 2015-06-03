CP.SMSVerify = CP.extend(CP.emptyFn, {

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
		$('#submit-get').on('click', function () {
			pageObj.getCode();
			return false;
		});

		$('#submit-code').on('click', function () {
			pageObj.submitCode();
			return false;
		});
	},

	getCode: function () {
		var oData1 = {
			action: "SMSVerifyPerson",
			token: CP.apiTOKEN(),
			mobilephone: $('#mobilephone').val(),
			verifyaction: "sendcode"
		};

		$.post(CP.apiURL(), oData1, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				CP.setValidationBox('submitget', true, 'SMS has been sent. Please wait for sms to come through with Code');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('submitget', false, sError);
			}
		});
	},

	submitCode: function () {
		var oData2 = {
			action: "SMSVerifyPerson",
			token: CP.apiTOKEN(),
			verifyaction: "verifycode",
			code: $('#verificationcode').val()
		};

		$.post(CP.apiURL(), oData2, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				//redirect to member main page
				document.location.href = '../member/index.html';
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('submitcode', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.SMSVerify();
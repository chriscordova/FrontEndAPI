CP.ChangePassword = CP.extend(CP.emptyFn, {

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
		$('input#change-password').on('click', function () {
			pageObj.changePassword();
		});

	},

	changePassword: function () {
		var sPassword = $('input[name="_password"]').val(),
			sNewPassword = $('input[name="password"]').val(),
			sConfirmPassword = $('input[name="confirmpassword"]').val();

		var aRequired = $("#change-password *[required]");
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid) {
			CP.setValidationBox('updatepassword', false, CP.Message.incompleteFields);
			return false;
		}

		var bConfirmed = CP.checkConfirmFields(sNewPassword, sConfirmPassword);
		if (!bConfirmed) {
			CP.setValidationBox('updatepassword', false, 'New password\'s do not match.');
			return false;
		}

		var oData = {
			action: "ChangePanelMemberPassword",
			token: CP.apiTOKEN(),
			password: sPassword,
			newpassword: sNewPassword
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('updatepassword', true, 'Password change successful.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('updatepassword', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.ChangePassword();
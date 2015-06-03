CP.DeclineSurvey = CP.extend(CP.emptyFn, {

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
		$('#btnDecline').on('click', function () {
			pageObj.decline();
		});

	},

	decline: function () {
		var sContactCode = CP.getURLParam("id");
		var sReason = $('#txtReason').val();
		var oData1 = {
			action: "DeclineSurvey",
			contactcode: sContactCode,
			reason: sReason
		};

		$.post(CP.apiURL(), oData1, function (response) {
			var bSuccess = response.Success;
			if (bSuccess) {
				CP.setValidationBox('save', true, 'You have successfully declined this survey.');
			}
			else {
				var sError = CP.Message.getError(response);
				CP.setValidationBox('save', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.DeclineSurvey();
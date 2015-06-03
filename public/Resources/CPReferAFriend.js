CP.ReferAFriend = CP.extend(CP.emptyFn, {

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
		pageObj.setReferralLink();

		$('#send-referral').on('click', function () {
			pageObj.sendReferral();
		});
	},

	setReferralLink: function () {
		var oData1 = {
			action: "GetAdvancedReferralLink",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData1, function (response) {
			var obj = response;
			if (obj.Success) {
				$('#referral-link').html(obj.Data.referrallink);
			}
		});
	},
	
	validateForm: function(){
		var aRequired = $('#referral *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('sendreferral', false, CP.Message.incompleteFields);
			return false;
		}
		
		return true;
	},
	
	sendReferral: function () {
		var pageObj = this;
		if (!pageObj.validateForm()){
			return false;
		}
		
		var sEmailAddresses = $('textarea#emailaddresses').val();
		var sMessage = $('textarea#message').val();

		var oData4 = {
			action: "SendReferralEmail",
			token: CP.apiTOKEN(),
			emailaddresses: sEmailAddresses,
			message: sMessage
		};

		$.post(CP.apiURL(), oData4, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('sendreferral', true, 'Referral email sent.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('sendreferral', false, sError);
			}
		});
	}

});

CP.CurrentPage = new CP.ReferAFriend();
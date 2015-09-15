CP.LostPassword = CP.extend(CP.emptyFn, {

	constructor: function () {
		CP.LostPassword.superclass.constructor.call(this);
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
		$('#sendemail').on('click', function () {
			pageObj.validateForm();
		});

	},
	
	validateForm: function(){
		var pageObj = this;
		var aRequired = $('#lost-password *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('reset-password', false, CP.Message.incompleteFields)
			return false;
		}
		
		pageObj.submit();
	},

	submit: function () {
		var oData = {
			action: "SendLostPasswordEmail",
			emailaddress: $('#emailaddress').val()
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				CP.setValidationBox('reset-password', true, CP.Message.lostPasswordEmail);
			}
			else {
				var oMessage = CP.Message.getError(obj);
				CP.setValidationBox('reset-password', false, oMessage);
			}
		});
	}



});

CP.CurrentPage = new CP.LostPassword();
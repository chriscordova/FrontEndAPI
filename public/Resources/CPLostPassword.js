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
        
        var sendTo = "";
        var emailAddress = $('#emailaddress');
        
        //Check to make sure either Email address OR Mobile Number (not both) is filled
        if (CP.allowRegisterLoginWithMobile()){
            
            emailAddress.removeAttr('required');
            var aValues = $('#lost-password').find('input.form-control');
            if (!CP.atLeastOneNotAll(aValues)){
                CP.setValidationBox('reset-password', false, CP.Message.atLeastOneButNotAll )
                return false;
            }
            
            if (CP.isNotNullOrEmpty(emailAddress.val())){
               sendTo = "Email";  
            }
            else {
               sendTo = "Mobile"; 
            }
            
        }
        else {
            var aRequired = $('#lost-password *[required]');
            var bValid = CP.checkRequiredFields(aRequired);
            if (!bValid){
                CP.setValidationBox('reset-password', false, CP.Message.incompleteFields)
                return false;
            }
            
            sendTo = "Email";
        }
        
		pageObj.submit(sendTo);
	},

	submit: function (SendTo) {
        
        var oData = {
          action: "SendLostPasswordEmail"  
        };
        
        switch (SendTo){
            case "Email":
                oData.emailaddress = $('#emailaddress').val();
                break;
            case "Mobile":
                oData.mobilenumber = $('#mobilenumber').val();
        }

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				CP.setValidationBox('reset-password', true, "Lost password recovery has been sent.");
			}
			else {
				var oMessage = CP.Message.getError(obj);
				CP.setValidationBox('reset-password', false, oMessage);
			}
		});
	}



});

CP.CurrentPage = new CP.LostPassword();
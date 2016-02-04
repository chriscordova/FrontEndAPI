CP.Unsubscribe = CP.extend(CP.emptyFn, {

	constructor: function () {
		//CP.shouldIBeHere('member');
		this.initPage();
	},

	initPage: function () {
		this.initForm();
	},

	initPageContent: function () {

	},

	setPageContent: function () {

	},
    
    sendTo: "",

	initForm: function () {
		var pageObj = this;
		$('#cancel').on('click', function () {
			document.location.href = 'unsubscribe.html';
		});

		$('#next').on('click', function () {
			pageObj.clickNext(pageObj);
		});

		$('#unsubscribe').on('click', function () {
			pageObj.unsubscribe(pageObj.sendTo);
		});

	},

	clickNext: function (pageObj) {
        var emailAddress = $('input[name="emailaddress"]');
        if (CP.allowRegisterLoginWithMobile()){
            emailAddress.removeAttr('required');
            var aValues = $('#unsubscribe-details').find('input.user');
            if (!CP.atLeastOneNotAll(aValues)){
                CP.setValidationBox('unsubscribe', false, CP.Message.atLeastOneButNotAll )
                return false;
            }
            
            if (CP.isNotNullOrEmpty(emailAddress.val())){
               pageObj.sendTo = "Email";  
            }
            else {
               pageObj.sendTo = "Mobile"; 
            }
        }
        else {
            var aRequired = $('#unsubscribe-details *[required]');
            var bValid = CP.checkRequiredFields(aRequired);
            if (!bValid) {
                CP.setValidationBox('unsubscribe', false, CP.Message.incompleteFields);
                return false;
            }
            
            pageObj.sendTo = "Email";
        }
        
        $('#unsubscribe-fail').hide();
        $('#confirm-unsubscribe').show();
        $('#unsubscribe-details').hide();
		
	},

	unsubscribe: function (SendTo) {
        var sPassword = $('input[name="password"]').val();
        var oData4 = {
			action: "UnsubscribePanelMember",
			password: sPassword
		};
        
        switch (SendTo){
            case "Email":
                oData4.emailaddress = $('input[name="emailaddress"]').val();
                break;
            case "Mobile":
                oData4.mobilenumber = $('input[name="mobilenumber"]').val();
        }
        
        var oVData = {
            validationbox: "unsubscribe",
            success: true,
            successmessage: "You have been unsubscribed from the panel.",
            fail: true,
            failmessage: null
        }
        
        function success(){
            localStorage.removeItem("TOKEN");
            setTimeout(function(){
                location.reload(true);    
            },2000)
        }
        
        CP.ajaxRequest(
            oData4,
            success,
            null,
            oVData,
            false
        );
	}

});

CP.CurrentPage = new CP.Unsubscribe();
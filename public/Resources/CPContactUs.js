CP.ContactUs = CP.extend(CP.emptyFn, {
	
	constructor: function(){
		CP.shouldIBeHere('panel');
		this.initPage();
	},
	
	initPage: function(){
		this.initForm();
	},
	
	initPageContent: function () {

	},

	setPageContent: function () {

	},
	
	initForm: function(){
		var pageObj = this;
		$('input#sendmessage').on('click', function(){
			pageObj.validateForm();
		});
		
	},
	
	validateForm: function(){
		var pageObj = this;
		var aRequired = $("#contact *[required]");
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid){
			CP.setValidationBox('contact', false, CP.Message.incompleteFields);
			return false;
		}
		
		pageObj.submitForm();
	},
	
	submitForm: function(){
		var oData = $("#contact").serializeArray();
		oData.push({ name: "action", value: "SendContactUsMessage" });
		
		$.post(CP.apiURL(), oData, function(response){
			var obj = response;
			if (obj.Success){
				CP.setValidationBox('contact', true, 'Your message has been sent.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('contact', false, sError);
				return false;
			}
		});
	}
	
});

CP.CurrentPage = new CP.ContactUs();
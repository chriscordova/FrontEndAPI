CP.AgreeToTerms = CP.extend(CP.emptyFn, {

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
		
		$('#save').on('click', function(){
			pageObj.saveAgreeToTerms();
		});
	},
	
	saveAgreeToTerms: function(){
		
		var aFields = $('#agreetoterms *[required]');
		var bValid = CP.checkRequiredFields(aFields);
		if (!bValid) {
			CP.setValidationBox('save', false, CP.Message.agreeToTerms);
			return false;
		}
		
		var oData = {
			action: "UpdatePanelMemberDetails",
			token: CP.apiTOKEN(),
			agreetoterms: true
		};
		
		$.post(CP.apiURL(), oData, function(response){
			var obj = response;
			if (obj.Success){
				document.location.href = "index.html";
			}
			else{
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('save', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.AgreeToTerms();
CP.Template = CP.extend(CP.emptyFn, {
	
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
		
	}
	
});

CP.CurrentPage = new CP.Template();
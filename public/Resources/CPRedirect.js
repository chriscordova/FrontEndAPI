CP.Redirect = CP.extend(CP.emptyFn, {

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
		var sPage = CP.getURLParam("page");
		var sToken = CP.getURLParam("t");
		if (CP.isNotNullOrEmpty(sToken)) {
			localStorage.setItem("TOKEN", sToken.toString());
			document.location.href = '../member/' + sPage;
		}

	}

});

CP.CurrentPage = new CP.Redirect();
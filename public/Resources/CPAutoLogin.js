CP.AutoLogin = CP.extend(CP.emptyFn, {

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
		var sToken = CP.getURLParam("t");
		if (CP.isNotNullOrEmpty(sToken)) {
			localStorage.setItem("TOKEN", sToken.toString());
			document.location.href = '../member/index.html';
		}
	}

});

CP.CurrentPage = new CP.AutoLogin();
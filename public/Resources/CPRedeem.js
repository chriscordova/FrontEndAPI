/// <reference path="../../typings/knockout/knockout.d.ts"/>
CP.Redeem = CP.extend(CP.emptyFn, {

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
		
		var data = {
			action: "GetRedeemOfferGroupsAndLists",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), data, function (response) {
			var obj = response;
			var aGroups = obj.Data.offergroupswithlist;
			var groups = {
				"offerGroups": aGroups
			};
			ko.applyBindings(new pageObj.offerGroupsViewModel(groups));
		});
	},

	offerGroupsViewModel: function (data) {
		var self = this;
		self.groups = ko.observable();
		self.imageSource = ko.observable();

		self.loadGroups = function (e) {
			self.groups = e;
		};

		self.goToOffers = function (id) {
			document.location.href = "offers.html?offerid=" + id;
		};

		self.imageSource = function (url) {
			var logohref = CP.apiOrigin() + url;
			return logohref;
		};

		self.loadGroups(data);
		
		ko.mapping.fromJS(data, {}, self);
	}

});

CP.CurrentPage = new CP.Redeem();
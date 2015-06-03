CP.Redeem = CP.extend(CP.emptyFn, {
	
	constructor: function(){
		CP.shouldIBeHere('member');
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
		//Get Offer Groups and Offers
		var data = {
			action: "GetRedeemOfferGroupsAndLists",
			token: CP.apiTOKEN()
		};

		var groups;
		var aGroups;

		function OfferGroupsViewModel() {
			var self = this;
			self.groups = ko.observable();
			self.imageSource = ko.observable();

			self.loadGroups = function (e) {
				self.groups = e;
			};

			self.goToOffers = function (group) {
				var id = group.groupid;
				document.location.href = "offers.html?offerid=" + id;
			};

			self.imageSource = function (group) {
				var logohref = CP.apiOrigin() + group.logoURL;
				return logohref;
			};

			self.loadGroups(groups);

		}

		$.post(CP.apiURL(), data, function (response) {
			var o = response;
			aGroups = o.Data.offergroupswithlist;
			groups = {
				"offergroups": aGroups
			};
			ko.applyBindings(new OfferGroupsViewModel());
		});
	}
	
});

CP.CurrentPage = new CP.Redeem();
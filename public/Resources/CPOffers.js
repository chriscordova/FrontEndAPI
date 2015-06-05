CP.Offers = CP.extend(CP.emptyFn, {

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
		var oData = {
			action: "GetRedeemOfferGroupsAndLists",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var sOfferId = CP.getURLParam('offerid');
			var sTable = pageObj.buildTable(obj, sOfferId);
			$('#dvOffers').html(sTable);
		});
	},

	buildTable: function (data, offerid) {
		var sTable = "";
		sTable += '<h3>Redeem Offers</h3>';

		$.each(data.Data.offergroupswithlist, function (index, value) {
			if (value.groupid == offerid) {
				$.each(this.offerlist, function (i, v) {
					var bAvailableCards = v.cardsavailable;
					if (bAvailableCards) {
						var nTitle = v.title;
						var nDescription = v.pagedescription;
						var nElectronic = v.iselectronic;
						var nLogo = v.logoURL;
						var nCost = v.cost;
						var nCredits = v.credits;
						var nIdentity = v.listid;
						sTable += '<table class="table table-striped">';
						sTable += '<tr><td><b>Title:</b></td><td>' + nTitle + '</td></tr>';
						sTable += '<tr><td><b>Description:</b></td><td>' + nDescription + '</td></tr>';
						sTable += '<tr><td><b>Electronic:</b></td><td>' + nElectronic + '</td></tr>';
						sTable += '<tr><td><b>Logo:</b></td><td>' + nLogo + '</td></tr>';
						sTable += '<tr><td><b>Cost:</b></td><td>' + nCost + '</td></tr>';
						sTable += '<tr><td><b>Credits:</b></td><td>' + nCredits + '</td></tr>';
						sTable += '<tr><td><a href="confirmoffer.html?offerid=' + nIdentity + '"><input type="button" class="btn btn-default" value="Choose Offer"/></a></td></tr>';
						sTable += '<table><br />';
					}

				});
			}
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.Offers();
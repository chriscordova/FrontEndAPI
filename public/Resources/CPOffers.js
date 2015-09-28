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
						
						sTable += '<table class="table table-striped visible-xs">';
 						sTable += '<tr>';
						sTable += '<td colspan="2">';
						sTable += '<img src="'+CP.apiOrigin()+nLogo+'" class="img-responsive" style="height: 110px;"/>';
						sTable += '</td>';
						sTable += '<tr>';
						sTable += '<td><b>Title</b></td>';
						sTable += '<td>'+nTitle+'</td>';
						sTable += '</tr>';
						sTable += '<tr>';
						sTable += '<td><b>Description</b></td>';
						sTable += '<td>'+nDescription+'</td>';
						sTable += '</tr>';
						sTable += '<tr>';
						sTable += '<td><b>Cost</b></td>';
						sTable += '<td>'+nCredits+'</td>';
						sTable += '</tr>';
						sTable += '<tr>';
						sTable += '<td style="vertical-align: middle;" colspan="2">';
						sTable += '<a href="confirmoffer.html?offerid=' + nIdentity + '"><input type="button" class="btn btn-success" value="Choose Offer"/></a>';
						sTable += '</td>';
						sTable += '</tr>';
						sTable += '</table>';
						
						sTable += '<table class="table table-striped hidden-xs">';
 						sTable += '<tr>';
						sTable += '<td>';
						sTable += '<img src="'+CP.apiOrigin()+nLogo+'" class="img-responsive" style="height: 110px;"/>';
						sTable += '</td>';
						sTable += '<td>';
						sTable += '<table class="table table-striped">';
						sTable += '<tr>';
						sTable += '<td><b>Title</b></td>';
						sTable += '<td>'+nTitle+'</td>';
						sTable += '</tr>';
						sTable += '<tr>';
						sTable += '<td><b>Description</b></td>';
						sTable += '<td>'+nDescription+'</td>';
						sTable += '</tr>';
						sTable += '<tr>';
						sTable += '<td><b>Cost</b></td>';
						sTable += '<td>'+nCredits+'</td>';
						sTable += '</tr>';
						sTable += '</table>';
						sTable += '</td>';
						sTable += '<td style="vertical-align: middle;">';
						sTable += '<a href="confirmoffer.html?offerid=' + nIdentity + '"><input type="button" class="btn btn-success" value="Choose Offer"/></a>';
						sTable += '</td>';
						sTable += '</tr>';
						sTable += '</table>';
					}

				});
			}
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.Offers();
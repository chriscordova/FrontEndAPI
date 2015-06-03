CP.ConfirmOffer = CP.extend(CP.emptyFn, {

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
		var oData4 = {
			action: "GetRedeemOfferGroupsAndLists",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData4, function (response) {
			var obj = response;
			var sOfferId = CP.getURLParam('offerid');
			var sTable = pageObj.buildTable(obj, sOfferId);

			$('#dvOffers').html(sTable);
		});

		$(document).on('click', 'input#purchase', function () {
			pageObj.confirm();
		});

	},

	confirm: function () {
		var OfferId = CP.getURLParam('offerid');
		var oData5 = {
			action: "PurchaseOffer",
			token: CP.apiTOKEN(),
			usealternateaddress: false,
			offerid: OfferId
		};

		$.post(CP.apiURL(), oData5, function (response) {
			var obj = response;
			if (obj.Success) {
				CP.setValidationBox('confirm', true, 'You have successfully purchased the selected offer.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('confirm', false, sError);
				return false;
			}
		});
	},

	buildTable: function (data, offerid) {
		var sTable = "";
		sTable += '<h3>Confirm Offer</h3>';
		var sOfferGroupId = data.Data.offergroupswithlist[0].groupid;
		$('.prev a').attr('href', 'offers.html?offerid=' + sOfferGroupId);

		$.each(data.Data.offergroupswithlist, function (index, value) {

			$.each(this.offerlist, function (i, v) {
				var nTitle = v.title;
				var nDescription = v.pagedescription;
				var nElectronic = v.iselectronic;
				var nLogo = v.logoURL;
				var nCost = v.cost;
				var nCredits = v.credits;
				var nIdentity = v.listid;

				if (nIdentity == offerid) {
					sTable += '<table id="offer" class="table table-striped">';
					sTable += '<tr><td><b>Title:</b></td><td>' + nTitle + '</td></tr>';
					sTable += '<tr><td><b>Description:</b></td><td>' + nDescription + '</td></tr>';
					sTable += '<tr><td><b>Electronic:</b></td><td>' + nElectronic + '</td></tr>';
					sTable += '<tr><td><b>Logo:</b></td><td>' + nLogo + '</td></tr>';
					sTable += '<tr><td><b>Cost:</b></td><td>' + nCost + '</td></tr>';
					sTable += '<tr><td><b>Credits:</b></td><td>' + nCredits + '</td></tr>';
					sTable += '<tr><td><input type="button" class="btn btn-default" id="purchase" value="Purchase Offer" /></td></tr>';
					sTable += '</table>';
				}
			});
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.ConfirmOffer();
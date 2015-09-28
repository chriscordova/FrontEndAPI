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
			
			var oOffer = $.grep(this.offerlist, function(s){
				return s.listid == offerid;
			});
			
			var o = oOffer[0];
			if (o){
				var nTitle = o.title;
				var nDescription = o.pagedescription;
				var nElectronic = o.iselectronic;
				var nLogo = o.logoURL;
				var nCost = o.cost;
				var nCredits = o.credits;
				var nIdentity = o.listid;
				
				sTable += '<table id="offer" class="table table-striped visible-xs">';
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
				sTable += '<input type="button" class="btn btn-success" id="purchase" value="Purchase Offer" />';
				sTable += '</td>';
				sTable += '</tr>';
				sTable += '</table>';
				
				sTable += '<table id="offer" class="table table-striped hidden-xs">';
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
				sTable += '<input type="button" class="btn btn-success" id="purchase" value="Purchase Offer" />';
				sTable += '</td>';
				sTable += '</tr>';
				sTable += '</table>';
			}
			
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.ConfirmOffer();
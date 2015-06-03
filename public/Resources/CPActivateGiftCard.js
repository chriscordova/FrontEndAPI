CP.ActivateGiftCard = CP.extend(CP.emptyFn, {

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
		var oData2 = {
			action: "CardHasRepeatedLast4Digits",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData2, function (response) {
			var obj = response;
			if (obj.Success) {
				var bHasRepeated = obj.Data.repeat;
				switch (bHasRepeated) {
					case true:
						$('#instructions').html('Please enter the full gift card number');
						break;
					case false:
						$('#instructions').html('Please enter the last 4 digits of the gift card number');
						$('input[name="cardnumber"]').attr('maxlength', '4');
						break;
					default:
						break;
				}
			}
		});

		$('#activate').on('click', function () {
			pageObj.activate();
		});

	},

	activate: function () {
		var oData = {
			action: "ActivateRedemptionCard",
			token: CP.apiTOKEN(),
			cardnumber: $('input[name="cardnumber"]').val()
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			if (obj.Success == true) {
				CP.setValidationBox('activate', true, 'Your activation request has been sent.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('activate', false, sError);
				return false;
			}
		});
	}

});

CP.CurrentPage = new CP.ActivateGiftCard();
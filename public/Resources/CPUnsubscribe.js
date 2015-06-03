CP.Unsubscribe = CP.extend(CP.emptyFn, {

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
		$('#cancel').on('click', function () {
			document.location.href = 'unsubscribe.html';
		});

		$('#next').on('click', function () {
			pageObj.clickNext();
		});

		$('#unsubscribe').on('click', function () {
			pageObj.unsubscribe();
		});

	},

	clickNext: function () {
		var aRequired = $('#unsubscribe-details *[required]');
		var bValid = CP.checkRequiredFields(aRequired);
		if (!bValid) {
			CP.setValidationBox('unsubscribe', false, CP.Message.incompleteFields);
			return false;
		}
		else {
			$('#unsubscribe-fail').hide();
			$('#confirm-unsubscribe').show();
			$('#unsubscribe-details').hide();
		}
	},

	unsubscribe: function () {
		var sPassword = $('input[name="password"]').val();
		var sEmailAddress = $('input[name="emailaddress"]').val();

		var oData4 = {
			action: "UnsubscribePanelMember",
			token: CP.apiTOKEN(),
			password: sPassword,
			emailaddress: sEmailAddress
		};

		$.post(CP.apiURL(), oData4, function (response) {
			var obj = response;
			if (obj.Success) {
				localStorage.removeItem("TOKEN");
				CP.setValidationBox('unsubscribe', true, 'You have been unsubscribed from the panel.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('unsubscribe', false, sError);
			}
		});
	}

});

CP.CurrentPage = new CP.Unsubscribe();
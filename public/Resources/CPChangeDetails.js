CP.ChangeDetails = CP.extend(CP.emptyFn, {

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
			action: "GetPanelMemberDetails",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData4, function (response) {
			var obj = response;
			if (obj.Success) {
				pageObj.fillDetails(obj.Data.panelmemberdetails[0]);
			}
		});

		$('#submit').on('click', function () {
			pageObj.submit();
			return false;
		});
	},

	submit: function () {
		var oData = $("#details").serializeArray();
		oData.push({ name: 'token', value: CP.apiTOKEN() });

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			var bSuccess = obj.Success;
			if (bSuccess) {
				CP.setValidationBox('update', true, 'Details saved.');
			}
			else {
				var sError = CP.Message.getError(obj);
				CP.setValidationBox('update', false, sError);
				return false;

			}
		});
	},

	fillDetails: function (oData) {
		$('input[name="title"]').val(oData.title);
		$('input[name="firstname"]').val(oData.firstname);
		$('input[name="lastname"]').val(oData.lastname);
		$('input[name="address1"]').val(oData.address1);
		$('input[name="address2"]').val(oData.address2);
		$('input[name="city"]').val(oData.suburb);
		$('input[name="state"]').val(oData.state);
		$('input[name="postalcode"]').val(oData.postalcode);
		$('input[name="mobilephone"]').val(oData.mobilephone);
		$('input[name="homephone"]').val(oData.homephone);
		$('input[name="workphone"]').val(oData.workphone);
		$('input[name="faxnumber"]').val(oData.faxnumber);
		$('input[name="voicephone"]').val(oData.voicephone);

		var bOptOut = oData.optoutsms;
		$('input[name="optoutsms"]').prop('checked', bOptOut);

		$('#membertype').val(oData.membertype);

		switch (oData.usehtmlemails) {
			case true:
				$('input[name="usehtmlemails"][value=true]').prop('checked', true);
				break;
			case false:
				$('input[name="usehtmlemails"][value=false]').prop('checked', true);
				break;
			default:
				break;

		}

		$('#country').val(oData.country);

		var sPreferredPhone = oData.preferredphone;
		var aPhones = ["mobilephone", "homephone", "workphone", "faxnumber", "voicephone"];
		$(aPhones).each(function (i, v) {
			var oInput = $('input[name="' + v + '"]');
			var oValue = oInput.val();
			if (oValue == sPreferredPhone) {
				var newInput = oInput.next().find('input');
				newInput.prop('checked', true);
			}
		});
	}

});

CP.CurrentPage = new CP.ChangeDetails();
CP.Participation = CP.extend(CP.emptyFn, {

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
			action: "GetParticipationHistory",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData, function (response) {
			var obj = response;
			if (obj.Success) {
				var aParticipation = obj.Data.participationhistory;
				var participationhistory = {
					"participationData": aParticipation
				};

				ko.applyBindings(new pageObj.participationsViewModel(participationhistory));

				$('#participation-table').DataTable({
					oLanguage: {
						'sEmptyTable': CP.Message.emptyParticipation
					}
				});
			}
		});
	},

	participationsViewModel: function (data) {
		var self = this;
		self.participation = ko.observable();

		self.loadParticipation = function (e) {
			self.participation = e;
		};

		self.loadParticipation(data);

		ko.mapping.fromJS(data, {}, self);
	}

});

CP.CurrentPage = new CP.Participation();
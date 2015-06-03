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
				pageObj.buildTable(obj.Data.participationhistory);
			}
		});
	},

	buildTable: function (data) {
//		if (data.length == 0) {
//			$('#dvParticipation').append('No transactions!');
//			return;
//		}

		var sTable = "";
		sTable += "<table class='table table-striped' id='participation-table'>";
		sTable += "<thead>";
		sTable += "<th>Event Title</th>";
		sTable += "<th>Event Type</th>";
		sTable += "<th>Credits</th>";
		sTable += "<th>Date</th>";
		sTable += "</thead>";
		$.each(data, function (i, v) {
			sTable += "<tr>";
			sTable += "<td>" + v.eventtitle + "</td>";
			sTable += "<td>" + v.eventtype + "</td>";
			sTable += "<td>" + v.credits + "</td>";
			sTable += "<td>" + v.createdate + "</td>";
			sTable += "</tr>";
		});
		sTable += "</table>";

		$('#dvParticipation').append(sTable);

		$('#participation-table').DataTable({
			oLanguage: {
				'sEmptyTable': CP.Message.emptyParticipation
			}
		});
	}

});

CP.CurrentPage = new CP.Participation();
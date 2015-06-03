CP.UpcomingGroups = CP.extend(CP.emptyFn, {

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
			action: "GetUpcomingGroupsAndCounts",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success) {
				var oTable = pageObj.buildTable(obj.Data);
				$('#dvRightPanel').append(oTable);
			}
		});

	},

	buildTable: function (oData) {
		var iGroupCount = oData.recruitmentgroupcount;
		var aGroupData = oData.recruitmentgroupdata;
		var sTable = "";

		sTable += "<h4>Upcoming Groups - " + iGroupCount + "</h4>";
		$.each(aGroupData, function (i, v) {
			var sStartDate = v.startdate;
			var bNeedToConfirm = v.confirmattendance;
			var sConfirmLink = v.confirmattendancelink;
			sTable += "<table class='table table-striped'>";
			sTable += "<tr><td>Group Start Date: </td><td>" + sStartDate + "</td></tr>";
			if (bNeedToConfirm) {
				sTable += "<tr><td colspan='2'><a href='" + sConfirmLink + "'>Confirm Attendance</a></td></tr>";
			}

			sTable += "</table>";
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.UpcomingGroups();
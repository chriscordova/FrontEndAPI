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
		var aGroupData = oData.recruitmentgroupdata;
		var sTable = "";

		$.each(aGroupData, function (i, v) {
			var sStartDate = v.startdate;
			var bNeedToConfirm = v.confirmattendance;
			var sConfirmLink = v.confirmattendancelink;
			var sLocation = v.locationdescription;
			var sDuration = v.duration;
			var sDetails = v.groupdetails;
			sTable += "<table class='table table-striped'>";
			if (bNeedToConfirm) {
				
				sTable += "<tr><td colspan='2'><a href='" + sConfirmLink + "'>Confirm Attendance</a></td></tr>";
			}
			else {
				sTable += "<tr><td width='150px'>Group Start Date: </td><td>" + sStartDate + "</td></tr>";
				sTable += "<tr><td>Location: </td><td>" + sLocation + "</td>";
				sTable += "<tr><td>Duration: </td><td>" + sDuration  + " minutes</td>"
				sTable += "<tr><td>Details: </td><td>" + sDetails  + "</td>"
			}

			sTable += "</table>";
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.UpcomingGroups();
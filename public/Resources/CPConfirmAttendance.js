CP.ConfirmAttendance = CP.extend(CP.emptyFn, {

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
		var oDataLoad = {
			action: "GetUpcomingGroupsAndCounts",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oDataLoad, function (response) {
			var obj = response;
			if (obj.Success) {
				var oTable = pageObj.buildTable(obj.Data);
				$('#dvConfirm').append(oTable);
			}
		});

		$(document).on('click', 'input#btnConfirm', function () {
			pageObj.confirm('confirm');
			return false;
		});

		$(document).on('click', 'input#btnReject', function () {
			pageObj.confirm('reject');
			return false;
		});

	},

	confirm: function (status) {
		var sTimeslotId = CP.getURLParam("id");
		var sNotes = $('#txtNotes').val();
		
		var oData = {
			action: "ConfirmAttendance",
			token: CP.apiTOKEN(),
			timeslotid: sTimeslotId,
			attendancestatus: status,
			notes: sNotes
		};

		$.post(CP.apiURL(), oData, function (response) {
			var bSuccess = response.Success;
			if (bSuccess) {
				CP.setValidationBox('confirm', true, 'Confirmation accepted.');
				setTimeout(function () {
					document.location.href = "/member/index.html";
				}, 3000);
			}
			else {
				var sErrorMessage = CP.Message.getError(response);
				CP.setValidationBox('confirm', false, sErrorMessage);
				return false;
			}
		});
	},

	buildTable: function (oData) {
		var aGroupData = oData.recruitmentgroupdata;
		var sTable = "";

		sTable += "<h3>Confirm Attendance</h3>";
		$.each(aGroupData, function (i, v) {
			var sDescription = v.locationdescription;
			var sStartDate = v.startdate;
			var sDuration = v.duration;
			sTable += "<table class='table table-striped'>";
			sTable += "<tr><td>Group Start Date: </td><td>" + sStartDate + "</td></tr>";
			sTable += "<tr><td>Duration: </td><td>" + sDuration + "</td></tr>";
			sTable += "<tr><td>Location Description: </td><td>" + sDescription + "</td></tr>";
			sTable += "<tr><td>Notes:</td><td><textarea style='width: 100%;height: 100px;' id='notes'></textarea></td></tr>";

			sTable += "</table>";
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.ConfirmAttendance();
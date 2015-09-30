CP.JobActivity = CP.extend(CP.emptyFn, {

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
			action: "GetJobActivityandCounts",
			token: CP.apiTOKEN()
		};

		$.post(CP.apiURL(), oData, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success == true) {
				var oTable = pageObj.buildTable(obj.Data);
				$('#dvRightPanel').append(oTable);
			}
		});

	},

	buildTable: function (oData) {
		var iJobSurveyCount = oData.jobsurveycount;
		var aJobSurveyData = oData.jobsurveydata;
		var sTable = "";

		sTable += "<h4>Incomplete Surveys - " + iJobSurveyCount + "</h4>";
		$.each(aJobSurveyData, function (i, v) {
			var sEmailId = v.emailid;
			var sCredits = v.credits;
			var sCreateDate = v.createdate;
			var sSurveyLink = v.surveylink;
			sTable += "<table class='table table-striped'>";
			sTable += "<tr><td>Survey Link: </td><td><a href='" + sSurveyLink + "' target='_blank'>"+ sSurveyLink +"</a></td></tr>";
			sTable += "<tr><td>Survey Create Date: </td><td>" + sCreateDate + "</td></tr>";
			sTable += "<tr><td>Completion Credits: </td><td>" + sCredits + "</td></tr>";
			if (sEmailId == CP.emptyGuid) {
				sTable += "<tr><td colspan='2'>No Survey Email Invite</td></tr>";
			}
			else {
				sTable += "<tr><td colspan='2'><a href='emails.html?emailid=" + sEmailId + "'>View Survey Email Invite</a></td></tr>";
			}

			sTable += "</table>";
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.JobActivity();
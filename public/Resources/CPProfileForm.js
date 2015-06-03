CP.ProfileForm = CP.extend(CP.emptyFn, {

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
			action: "GetProfileFormDetails",
			token: CP.apiTOKEN(),
			postregistration: false
		};

		$.post(CP.apiURL(), oData, function (response) {
			$('#loading').hide();
			var obj = response;
			if (obj.Success == true) {
				var oTable = pageObj.buildForm(obj.Data);
				$('#dvProfileForm').append(oTable);
			}
		});
	},

	buildForm: function (oData) {
		
		function GetClass(status) {
			var oClass = "";
			switch (status) {
				case "NotStarted":
					oClass = "list-group-item-danger";
					break;
				case "Completed":
					oClass = "list-group-item-success";
					break;
				case "NotCompleted":
					oClass = "list-group-item-warning";
					break;
				default:
					break;
			}

			return oClass;
		}

		function GetIcon(status) {
			var oIcon = "";
			switch (status) {
				case "NotStarted":
					oIcon = "glyphicon-plus";
					break;
				case "Completed":
					oIcon = "glyphicon-ok";
					break;
				case "NotCompleted":
					oIcon = "glyphicon-pencil";
					break;
				default:
					break;
			}

			return oIcon;
		}
		
		var sTable = "";
		sTable += '<h3>Profile Form</h3>';
		$.each(oData.formgroups, function (i, v) {
			sTable += "<table class='table' id='" + v.groupid + "'>";
			sTable += "<tr><td>" + v.pagetitle + " ( " + v.totalcompletedforms + " of " + v.totalforms + " completed )</td></tr>";
			sTable += "<tr><td><ul class='list-group'>";
			$.each(v.forms, function (i, v) {
				var oClass = GetClass(v.completestatus);
				var oIcon = GetIcon(v.completestatus);
				sTable += "<li class='list-group-item " + oClass + "'>";
				sTable += "<span class='glyphicon " + oIcon + " form-control-feedback' aria-hidden='true'></span>";
				sTable += "<a style='color: #ffffff;' href='form.html?formid=" + v.formid + "'>" + v.pagetitle + "</a></li>";
			});
			sTable += "</ul></td></tr>";
			sTable += "</table>";
		});

		return sTable;
	}

});

CP.CurrentPage = new CP.ProfileForm();
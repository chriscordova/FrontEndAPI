CP.PanelIndex = CP.extend(CP.emptyFn, {
	
	constructor: function(){
		CP.shouldIBeHere('panel');
		this.initPage();
	},
	
	initPage: function(){
		
		this.initPageContent();
		this.initForm();
	},
	
	initPageContent: function () {
		var pageObj = this;

		var dataContent = {
			action: "GetWebPageContentByPageCode",
			pagecode: "DEF"
		};

		$.post(CP.apiURL(), dataContent, function (response) {
			var bSuccess = response.Success;
			if (bSuccess) {
				var obj = response.Data;
				pageObj.setPageContent(obj);
			}
		});

	},

	setPageContent: function (data) {
		var page = data.webpage;
		if (page.length > 0) {
			var contentlinks = page[0].contentlinks;
			$.each(contentlinks, function (i, v) {
				var zone = v.zone;
				var content = '';
				var html = '';

				content = v.linkcontent;
				if (CP.isNotNullOrEmpty(content)) {
					html = content[0].html;
				}

				switch (zone) {
					case 0:
						$('#zone1').append(html);
						break;
					case 1:
						$('#zone2').append(html);
						break;
					default:
						break;
				}
			});
		}
	},
	
	initForm: function(){
		var pageObj = this;
		
	}
	
});

CP.CurrentPage = new CP.PanelIndex();
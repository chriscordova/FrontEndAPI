/// <reference path="../typings/knockout/knockout.d.ts"/>
CP.Emails = CP.extend(CP.emptyFn, {
	
	constructor: function(){
		CP.shouldIBeHere('member');
		this.initPage();
	},
	
	initPage: function(){
		this.initForm();
	},
	
	initPageContent: function () {

	},

	setPageContent: function () {

	},
	
	initForm: function(){
		var data = {
			action: "GetPanelMemberEmails",
			token: CP.apiTOKEN()
		};

		var emails;
		var aEmails;

		function EmailsViewModel(data) {
			var self = this;
			self.emails = ko.observable();
			self.emailContent = ko.observable();

			self.loadEmails = function (e) {
				self.emails = e;
			};

			self.goToEmail = function (id) {
				document.location.href = "emails.html?emailid=" + id;
			};

			self.loadContent = function (e) {
				self.emailContent = e;
			};

			self.loadEmails(emails);

			var sEmailId,
			jsEmail = {};
			sEmailId = CP.getURLParam("emailid");
			if (CP.isGuid(sEmailId)) {
				$(emails.emaildata).each(function (i, v) {
					if (v.emailid == sEmailId) {
						jsEmail = v;
					}
				});
				self.loadContent(jsEmail);
				
			}
			else {
				self.emailContent(null);
			}
			
			ko.mapping.fromJS(data, {}, self);
		}
		
		$.post(CP.apiURL(), data, function (response) {
			var obj = response;
			aEmails = obj.Data.panelmemberemails;
			emails = {
				"emaildata": aEmails
			};
			ko.applyBindings(new EmailsViewModel(emails));
			
			$('.emaildata').DataTable({ 
				responsive: true,
				oLanguage: {
					'sEmptyTable': CP.Message.emptyEmails
				}
			});
			
		});
		
		
	}
	
});

CP.CurrentPage = new CP.Emails();
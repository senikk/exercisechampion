Template.admin.helpers({
	instruments: function () {
		return Instrument.find();
	}
});

Template.admin.events({
	"change .instrument": function (event, template) {
		var instrument = template.find(".instrument").value;

		Meteor.call("addinstrument", instrument, function (error) {
			if (error != null) {		
				setAlertInfo(error.reason);
				return;
			}

			template.find(".instrument").value = "";
		});
	}
});


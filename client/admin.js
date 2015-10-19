Template.admininstrument.helpers({
	instruments: function () {
		return Instrument.find();
	}
});

Template.admininstrument.events({
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

Template.adminemails.helpers({
	users: function () {
		return Profile.find({}, {sort: {name: 1}});
	},
	email: function () {
		console.log();
		var user = Meteor.users.findOne(this.owner);
		return user.emails[0].address;
	}
});
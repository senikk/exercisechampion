Template.prices.helpers({
	"recommended": function () {
		var owner = Meteor.userId();
		var profile = null;
		var recommended = null;
		var addedby = "";

		if (!!owner) {			
			profile = Profile.findOne({owner: owner});
			if (!!profile) {
				recommended = Recommended.findOne({group: profile.group}, {sort: {timestamp: 1}});
				if (!!recommended) {
					addedby = Profile.findOne({owner: recommended.owner});
				}
			}
		}

		return {
			profile: profile,
			current: recommended,
			addedby: addedby.name
		}
	},
});
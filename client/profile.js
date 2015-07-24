Template.profile.helpers({
	"profile": function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		if (!!profile) return profile;
	},
	acgroup: function() {
    return {
      position: "bottom",
      limit: 3,
      rules: [
        {
          collection: Group,
          field: "name",
          template: Template.groupPill
        }
      ]
    };
  	},
  	conductor: function () {
		return Group.find({conductors: { $in: [ Meteor.userId() ] }}).count() > 0;
  	}
});

Template.profile.events({
	"change .name": function (event, template) {
		var name = template.find(".name").value;
		ChangeProfile({name: name.trim()});
	},
	"autocompleteselect input": function (event, template, group) {
		ChangeProfile({groupname: group.name.trim(), group: group._id});
	},
	"change .groupname": function (event, template) {
		var groupname = template.find(".groupname").value;
		groupname = groupname.trim();
		var group = Group.insert({
			owner: Meteor.userId(),
			timestamp: (new Date()).getTime(),
			name: groupname
		});

		ChangeProfile({groupname: groupname, group: group});

		// update score (need to move)
		Meteor.call("score", Meteor.userId(), function (error, score) {
			if (!!error) return;
			Session.set("score", score);
		});
	}
});

Template.recommended.events({
	"click .addrecommended": function (event, template) {
		var profile = Profile.findOne({owner: Meteor.userId()});
		Recommended.insert({
			owner: Meteor.userId(),
			timestamp: (new Date()).getTime(),
			description: template.find(".recommended").value,
			group: profile.group
		});
	}
});
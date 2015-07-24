Template.comments.helpers({
	"comments": function () {
		var currentlog = Session.get("currentlog");
		return Comment.find({log: currentlog}, {sort: {timestamp: 1}}).map(function(document, index){
    		document.profile = Profile.findOne({owner: document.owner});
    		return document;
    	});
	}
});

Template.comments.events({
	"click .addcomment": function (event, template) {
		var comment = template.find(".body").value;
		var currentlog = Session.get("currentlog");

		if (comment.length > 0) {
			Comment.insert({
				owner: Meteor.userId(),
				timestamp: (new Date()).getTime(),
				log: currentlog,
				body: comment
			});

			Log.update({_id: currentlog}, {$inc: {comments: 1}});

			template.find(".body").value = "";
		} else {
			setAlertInfo("Write a comment before posting");
		}
	},
	"click .tolog": function () {
		Router.go("log");
	}
});
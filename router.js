Router.configure({
  layoutTemplate: 'applayout'
});

Router.route('/', function () {
	this.render('exercise');
});

Router.route('/forgot', function () {
	this.render('forgotPassword');
});

Router.route('/admin/remove/profile/:profile', function () {
	Meteor.call("removeprofile", this.params.profile);
	Router.go("/");
});

Router.route('/admin/remove/group/:group', function () {
	Meteor.call("removegroup", this.params.group);
	Router.go("/");
});

Router.route('/profile', function () {
	this.render('profile');
});

Router.route('/log', function () {
	if (Session.get("logwho") == "all") {
		Router.go("/log/all");
	} else {
		Router.go("/log/you");
	}
});

Router.route('/log/:type', function () {
	Session.set("logwho", this.params.type);
	this.render('exerciselog');
});

Router.route('/comments/log/:id', function () {
	Session.set('currentlog', this.params.id);
	this.render('comments');
});

Router.route('/result', function () {
	if (Session.get("resultwho") == "champion") {
		Router.go("/result/champion");
	} else {
		Router.go("/result/group");
	}
});

Router.route('/result/group', function () {
	this.render('exerciseresult');
});

Router.route('/result/group/:group', function () {
	Session.set("group", this.params.group);
	this.render('exerciseresult');
});

Router.route('/result/champion', function () {
	this.render('exerciseresult');
});

Router.route('/result/bands', function () {
	this.render('exerciseresult');
});

Router.route('/endexercise', function () {
	this.render('endexercise');
});
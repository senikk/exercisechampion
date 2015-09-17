Template.bandinfo.helpers({
	group: function () {
		if (Session.get("group")) {
			return Group.findOne(Session.get("group"));
		} else {
			var profile = Profile.findOne({owner: Meteor.userId()});
			return Group.findOne(profile.group);
		}
	}
})

Template.exerciseresult.helpers({
	profile: function () {
		return Profile.findOne({owner: Meteor.userId()});
	}
});

function resultListMap(results) {
	var periode = Session.get("periode");
  	var curr_year = (new Date()).getFullYear();
	var curr_month = (new Date()).getMonth() + 1;
	var curr_week = (new Date()).getWeekNumber();
	var lastmonth = curr_month - 1;
	var lastweek = curr_week - 1;
	var lastweekyear = curr_year;
	var lastmonthyear = curr_year;
	if (curr_month == 1) {
		lastmonthyear = curr_year - 1;
		lastmonth = 12;
	}
	if (curr_week == 0) { 
	  	lastweek = 52;
	  	lastweekyear = curr_year - 1;
	}
	
	return results.map(function(result, index){
		result.index = index + 1;
		if (!!result.mins) {
		  	switch(periode) {
		  		case "year":
		    		result.result = result.mins[curr_year].year || 0;
		  			break;
		  		case "month":
		    		result.result = result.mins[curr_year].month[curr_month] || 0;
		  			break;
		  		case "week":
		    		result.result = result.mins[curr_year].week[curr_week] || 0;
		  			break;
			  	case "lastweek":
	  				result.result = result.mins[lastweekyear].week[lastweek] || 0;
	  				break;
	  			case "lastmonth":
					result.result = result.mins[lastmonthyear].month[lastmonth] || 0;
	  				break;
		  	}
		} else {
			result.result = 0;
		}
		return result;
	});
}

Template.exerciseresultband.helpers({
	resultyearband: function () {
	  	var curr_year = (new Date()).getFullYear();
	  	var curr_month = (new Date()).getMonth() + 1;
	  	var curr_week = (new Date()).getWeekNumber();
	  	var lastweek = curr_week - 1;
	  	var lastmonth = curr_month - 1;
	  	var lastweekyear = curr_year;
	  	var lastmonthyear = curr_year;
	  	if (curr_month == 1) {
	  		lastmonthyear = curr_year - 1;
	  		lastmonth = 12;
	  	}
	  	if (curr_week == 0) { 
	  		lastweek = 52;
	  		lastweekyear = curr_year - 1;
	  	}
	  	var periode = Session.get("periode"); 
	  	var sort = {};
	  	var filter = {};

	  	if (ActiveRoute.path(new RegExp('/result/group/\w*')))
	  	{
	  		filter = {group: Session.get("group")};
	  	} else if (ActiveRoute.path('/result/group')) {
	  		var profile = Profile.findOne({owner: Meteor.userId()});
		  	if (profile) { filter = {group: profile.group}; }
	  	}

	  	filter["groupname"] = {$exists: true};
	  	filter["$where"] = "this.groupname.length > 1";
	 	
	  	switch(Session.get("periode")) {
	  		case "year":
			  	sort["mins." + curr_year + ".year"] = -1;
	  			break;
	  		case "month":
	  		  	sort["mins." + curr_year + ".month." + curr_month] = -1;
	  			break;
	  		case "week":
	  			sort["mins." + curr_year + ".week." + curr_week] = -1;
	  			break;
	  		case "lastweek":
	  			sort["mins." + lastweekyear + ".week." + lastweek] = -1;
	  			break;
	  		case "lastmonth":
	  			sort["mins." + lastmonthyear + ".month." + lastmonth] = -1;
	  			break;
	  	}

	  	sort["timestamp"] = -1;

	  	return resultListMap(Profile.find(filter, {sort: sort, limit: 20}));
	},
	resultband: function () {
	  	var curr_year = (new Date()).getFullYear();
	  	var curr_month = (new Date()).getMonth() + 1;
	  	var curr_week = (new Date()).getWeekNumber();
	  	var lastweek = curr_week - 1;
	  	var lastweekyear = curr_year;
	  	if (curr_week == 0) { 
	  		lastweek = 52;
	  		lastweekyear = curr_year - 1;
	  	}
	  	var periode = Session.get("periode"); 
	  	var sort = {};
 	
	  	switch(Session.get("periode")) {
	  		case "year":
			  	sort["mins." + curr_year + ".year"] = -1;
	  			break;
	  		case "month":
	  		  	sort["mins." + curr_year + ".month." + curr_month] = -1;
	  			break;
	  		case "week":
	  			sort["mins." + curr_year + ".week." + curr_week] = -1;
	  			break;
	  		case "lastweek":
	  			sort["mins." + lastweekyear + ".week." + lastweek] = -1;
	  			break;
	  	}

	  	sort["timestamp"] = -1;

	  	return resultListMap(Group.find({name: {$exists: true}, $where: "this.name.length > 1"}, {sort: sort, limit: 20}));
	},
	periode: function () {
		return Session.get("periode");
	}
});

/* Periode */

Template.periodeselector.helpers({
	periode: function () {
		return Session.get("periode");
	},
	week: function () {
		return (new Date()).getWeekNumber();
	},
	lastweek: function () {
		var week = (new Date()).getWeekNumber();
		if (week == 1) week = 52;
		return week - 1;
	}
})

Template.periodeselector.events({
	"click .periode-year": function () {
		Session.set("periode", "year");
	},
	"click .periode-month": function () {
		Session.set("periode", "month");
	},
	"click .periode-week": function () {
		Session.set("periode", "week");
	},
	"click .periode-lastweek": function () {
		Session.set("periode", "lastweek");
	},
	"click .periode-lastmonth": function () {
		Session.set("periode", "lastmonth");
	}
});
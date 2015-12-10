Template.bandinfo.helpers({
	group: function () {
		if (Session.get("group")) {
			return Group.findOne(Session.get("group"));
		} else {
			var profile = Profile.findOne({owner: Meteor.userId()});
			if (profile == null) return;
			return Group.findOne(profile.group);
		}
	}
})

Template.exerciseresult.helpers({
	profile: function () {
		return Profile.findOne({owner: Meteor.userId()});
	}
});

function resultListMap(results, instrumentid) {
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
	
	return results.map(function(result, index) {
		result.index = index + 1;

		if (instrumentid != undefined && instrumentid != "") {
			if (!!result.instrument && !!result.instrument[instrumentid]) {
			  	switch(periode) {
			  		case "year":
			    		result.result = result.instrument[instrumentid].mins[curr_year].year || 0;
			  			break;
			  		case "month":
			    		result.result = result.instrument[instrumentid].mins[curr_year].month[curr_month] || 0;
			  			break;
			  		case "week":
			    		result.result = result.instrument[instrumentid].mins[curr_year].week[curr_week] || 0;
			  			break;
				  	case "lastweek":
		  				result.result = result.instrument[instrumentid].mins[lastweekyear].week[lastweek] || 0;
		  				break;
		  			case "lastmonth":
						result.result = result.instrument[instrumentid].mins[lastmonthyear].month[lastmonth] || 0;
		  				break;
			  	}
			} else {
				result.result = 0;
			}
		} else {
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
		}

		return result;
	});
}

function currentPosition(instrumentid) {
	var gtmins = {};
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
	var profile = Profile.findOne({owner: Meteor.userId()});

  	if (ActiveRoute.path(new RegExp('/result/group/\w*')))
  	{
  		filter = {group: Session.get("group")};
  	} else if (ActiveRoute.path('/result/group')) {
  	  	filter = {group: profile.group};
  	}

	filter["name"] = {$exists: true};
	filter["$where"] = "this.name.length > 1";

	var mins = 0;
	var prefix = "";
	var minsobj = null;

	if (instrumentid != undefined && instrumentid != "") {
		prefix = "instrument." + instrumentid + ".";
		try { minsobj = profile['instrument'][instrumentid]['mins']; } catch(e) { return 0; };
	} else {
		minsobj = profile['mins'];
	}
 	
  	switch(periode) {
  		case "year":
		  	try { mins = minsobj[curr_year]['year']; } catch(e) {};
		  	filter[prefix + "mins." + curr_year + ".year"] = {$gt: mins};
  			break;
  		case "month":
		  	try { mins = minsobj[curr_year]['month'][curr_month]; } catch(e) {};
		  	filter[prefix + "mins." + curr_year + ".month." + curr_month] = {$gt: mins};
  			break;
  		case "week":
  			try { mins = minsobj[curr_year]['week'][curr_week]; } catch(e) {};
  			filter[prefix + "mins." + curr_year + ".week." + curr_week] = {$gt: mins};
  			break;
  		case "lastweek":
		  	try { mins = minsobj[lastweekyear]['week'][lastweek]; } catch(e) {}
		  	filter[prefix + "mins." + lastweekyear + ".week." + lastweek] = {$gt: mins};
  			break;
  		case "lastmonth":
		  	try { mins = minsobj[lastmonthyear]['month'][lastmonth]; } catch(e) {}
		  	filter[prefix + "mins." + lastmonthyear + ".month." + lastmonth] = {$gt: mins};
  			break;
  	}

  	sort["timestamp"] = -1;
 
	return Profile.find(filter).count()+1;
}

Template.exerciseresultband.events({
	"click .clearsearch": function (event, template) {
		template.find(".instrument").value = "";
	}
});

Template.exerciseresultband.helpers({
	instrumentname: function () {
		var instrument = Session.get("instrument2");
		if (instrument != null) return instrument.name;
		return "";
	},
	instruments: function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		var instruments = [];
		if (!!profile && !!profile.instrument) {
			Object.keys(profile.instrument).forEach(function (instrumentid) {
				instruments.push(Instrument.findOne(instrumentid));		
			});			
		}

		return instruments;
	},	
	resultyearband: function () {
		var limit = 50;
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
	  	var prefix = "";
	  	var instrumentid = "";

	  	if (ActiveRoute.path(new RegExp('/result/group/\w*')))
	  	{
	  		filter = {group: Session.get("group")};
	  	} else if (ActiveRoute.path('/result/group')) {
		  	var profile = Profile.findOne({owner: Meteor.userId()});
		  	if (profile) { filter = {group: profile.group}; }
	  	} else if (ActiveRoute.path(new RegExp('/result/instrument*'))) {
	  		var instrument = Session.get("instrument2");
	  		if (instrument == null) {
	  			return [];
	  		}

	  		prefix = "instrument." + instrument._id + ".";
	  		instrumentid = instrument._id;
	  	}

	  	filter["name"] = {$exists: true};
	  	filter["$where"] = "this.name.length > 1";

	  	if (instrumentid != "") {
	  		filter["instrument." + instrumentid] = {$exists: true};
	  	}
	 	
	  	switch(periode) {
	  		case "year":
			  	sort[prefix + "mins." + curr_year + ".year"] = -1;
	  			break;
	  		case "month":
	  		  	sort[prefix + "mins." + curr_year + ".month." + curr_month] = -1;
	  			break;
	  		case "week":
	  			sort[prefix + "mins." + curr_year + ".week." + curr_week] = -1;
	  			break;
	  		case "lastweek":
	  			sort[prefix + "mins." + lastweekyear + ".week." + lastweek] = -1;
	  			break;
	  		case "lastmonth":
	  			sort[prefix + "mins." + lastmonthyear + ".month." + lastmonth] = -1;
	  			break;
	  	}

	  	sort["timestamp"] = -1;

	  	var you = resultListMap(Profile.find({owner: Meteor.userId()}), instrumentid); 
	  	if (you != null && you.length == 1) {
	  		you[0].index = currentPosition(instrumentid);
	  	
	  		if (you[0].index > limit) {
	  			var all = resultListMap(Profile.find(filter, {sort: sort, limit: limit - 1}), instrumentid);
	  			return all.concat(you)
	  		}
	  	}

	  	return resultListMap(Profile.find(filter, {sort: sort, limit: limit}), instrumentid); 
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

	  	return resultListMap(Group.find({name: {$exists: true}, $where: "this.name.length > 1"}, {sort: sort, limit: 50}));
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
Handlebars.registerHelper("zero", function(value) {
  	return value || 0;
});

Handlebars.registerHelper("empty", function(body, emptytext) {
	return body || emptytext;
});

Handlebars.registerHelper("ago", function(value) {
	var diff = (new Date()).getTime() - value;
	var mins = Math.floor(diff / 1000 / 60);

	if (mins < 60) {
		return mins + " mins";
	} else if (mins < 60*24) {
		return Math.floor(mins / 60) + " hrs";
	} else {
		return Math.floor(mins / 60 / 24) + " days";
	}
});

Handlebars.registerHelper("mins", function(start, end) {
	var diff = end - start;
	var mins = Math.floor(diff / 1000 / 60);

	return mins + " mins";
});

Handlebars.registerHelper("minsastime", function(mins) {
	mins = mins || 0;
	var hours = Math.floor(mins / 60);
	var min = Math.floor(mins - hours * 60)

	return hours + "h " + min + "min";
});

Handlebars.registerHelper("formatTimestampOnlyTime", function(timestamp) {
  if(timestamp == null) return "";

  var d = new Date(timestamp);

  var curr_hours = d.getHours();
  var curr_minutes = d.getMinutes();
  
  return ("0"+curr_hours).slice(-2) + ":" + ("0"+curr_minutes).slice(-2);  
});

Handlebars.registerHelper("formatTimestampWithTime", function(timestamp) {
  if(timestamp == null) return "";

  var d = new Date(timestamp);
  var curr_date = d.getDate();
  var curr_month = d.getMonth(); curr_month++;
  var curr_year = d.getFullYear();

  var curr_hours = d.getHours();
  var curr_minutes = d.getMinutes();
  
  return curr_date + "." + curr_month + "." + curr_year + " " + ("0"+curr_hours).slice(-2) + ":" + ("0"+curr_minutes).slice(-2);  
});

ChangeProfile = function (data) {
	var profile = Profile.findOne({owner: Meteor.userId()});
	if (profile != undefined) {
		Profile.update({_id: profile._id}, {$set: data});
	} else {
		data.owner = Meteor.userId();
		data.timestamp = (new Date()).getTime();

		Profile.insert(data);
	}
}

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

setAlertInfo = function (text) {
	Session.set("alert-info", text);
	Meteor.setTimeout(function () {
		Session.set("alert-info", "");
	}, 3700);
}

setAlertOk = function (text) {
	Session.set("alert-ok", text);
	Meteor.setTimeout(function () {
		Session.set("alert-ok", "");
	}, 3700);
}

Profile = new Meteor.Collection("profile");
Log = new Meteor.Collection("log");
Comment = new Meteor.Collection("comment");
Group = new Meteor.Collection("group");
Stat = new Meteor.Collection("stat");
Recommended = new Meteor.Collection("recommended");

// Profile
//  owner: user id
//  name: String
//  groupname: String
//  group: id
//	mins:
//		2015:
//			year: 20
//			month:
//				9: 5
//				8: 4
//			week:
//				26: 10 

// Log
//  owner: user id
//  startdate: Timestamp
//  enddate: Timestamp
//  body: String
//  recommended: Boolean
//  comments: Integer (count)
//  mins: Integer
//  groupmins: Integer
//  group: group id
//  groupcontesters: Integer

// Comment
//  owner: user id
//  timestamp: Timestamp // created
//  log: log id
//  body: String

// Group
//  owner: user id
//  timestamp: Timestamp // created
//  name: String
//  conductors: Array
//	mins:
//		2015:
//			year: 20
//			month:
//				9: 5
//				8: 4
//			week:
//				26: 10 

// Stat
//  

// Recommended
//  owner: user id
//  timestamp: Timestamp // created
//  description: String
//
// Icons: http://www.icons4android.com/icon/1524



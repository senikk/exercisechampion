Template.instrument.helpers({
	instruments: function() {
    return {
      position: "bottom",
      limit: 3,
      rules: [
        {
          collection: Instrument,
          field: "name",
          template: Template.groupPill
        }
      ]
    };
  	},
  instrument: function() {
    return Session.get("instrument");
  }
});

Template.instrument.events({
  "autocompleteselect input": function (event, template, instrument) {
    Session.set("instrument", instrument);
  },
  "click .clearsearch": function (event, template) {
    template.find(".instrument").value = "";
    //Session.set("instrument", null);
  }
});

Template.instrument2.helpers({
  instruments: function() {
    return {
      position: "bottom",
      limit: 3,
      rules: [
        {
          collection: Instrument,
          field: "name",
          template: Template.groupPill
        }
      ]
    };
    },
  instrument: function() {
    return Session.get("instrument2");
  }
});

Template.instrument2.events({
  "autocompleteselect input": function (event, template, instrument) {
    Session.set("instrument2", instrument);
  },
  "click .clearsearch": function (event, template) {
    template.find(".instrument").value = "";
    Session.set("instrument2", null);
    Router.go("/result/instrument");
  }
});

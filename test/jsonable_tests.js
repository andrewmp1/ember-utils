var App = window.App;
App = (App) ? App : Ember.Application.create();

test('returns a hash of attributes of an ember object', function() {
	var testObject = Ember.Object.create(Ember.JsonableMixin, {
	    testAttr1: "yes",
	    testAttr2: "no",
	    funky: function(){
	      return "this is a function";
	    },
	    funky2: function(){
	    	return "this is like a property";
	    }.property()
	});
    var jsonObject = testObject.getJson();
    equal(jsonObject.testAttr1, "yes", "hash object includes attributes")
});
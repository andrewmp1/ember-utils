A short collection of mixins that I keep using for emberjs Apps.

- JsonableMixin

  - A simple way to dump all attributes on an ember object.
  - Adds .propertyNames() method to return an array of all the property names.
  - Adds .getJson() method to your object that returns a hash of the attributes.

- SyncableMixin

  - This is a port of the backbone.js sync pattern to be mixed into an Ember model.
  - This might work for a controller. Probably need to write a seperate mixin for ArrayController.


Tests:
  
  - Tests via Qunit.  Run test/index.


License
Copyright (c) 2012 JiggyPop LLC.

Licensed under the MIT license.

http://appendto.com/open-source-licenses
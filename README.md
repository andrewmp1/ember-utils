A short collection of mixins that I keep using for emberjs Apps.

All mixins are currently in coffeescript.

- JsonableMixin

  - A simple way to dump all attributes on an ember object.  Adds .getJson() method to your object that returns a has of the attributes

- SyncableMixin

  - This is a port of the backbone.js sync pattern to be mixed into any ember object
  - Super alpha.  Work in process
Ember.JsonableMixin = Ember.Mixin.create(getJson: ->
  v = undefined
  ret = []
  for key of this
    if @hasOwnProperty(key)
      v = this[key]
      continue  if v is "toString"
      continue  if Ember.typeOf(v) is "function"
      ret.push key
  @getProperties(ret)
)
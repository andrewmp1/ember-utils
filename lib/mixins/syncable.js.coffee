# A mixin to add ajax calls to/from a restful server to any ember object
# Taken inspiration from backbone's simple sync api
#
#
#
#
#
Ember.SyncableMixin = Ember.Mixin.create(
  urlRoot: null
  paramRoot: null

  methodMap: {
  'create': 'POST',
  'update': 'PUT',
  'delete': 'DELETE',
  'read'  : 'GET'
  }

  fetch: (options) ->
    options = (if options then _.clone(options) else {})
    options.parse = true  if options.parse is undefined
    collection = this
    success = options.success
    options.success = (resp, status, xhr) ->
      collection[(if options.add then "add" else "reset")] collection.parse(resp, xhr), options
      success collection, resp, options  if success
      collection.trigger "sync", collection, resp, options

    options.error = Backbone.wrapError(options.error, collection, options)
    @sync "read", this, options

  save: (key, value, options) ->
    attrs = undefined
    current = undefined
    done = undefined
    if _.isObject(key) or not key?
      attrs = key
      options = value
    else
      attrs = {}
      attrs[key] = value
    options = (if options then _.clone(options) else {})
    if options.wait
      return false  unless @_validate(attrs, options)
      current = _.clone(@attributes)
    silentOptions = _.extend({}, options,
      silent: true
    )
    return false  if attrs and not @set(attrs, (if options.wait then silentOptions else options))
    return false  if not attrs and not @isValid()
    model = this
    success = options.success
    options.success = (resp, status, xhr) ->
      done = true
      serverAttrs = model.parse(resp, xhr)
      serverAttrs = _.extend(attrs or {}, serverAttrs)  if options.wait
      return false  unless model.set(serverAttrs, options)
      success model, resp, options  if success
      model.trigger "sync", model, resp, options

    options.error = Backbone.wrapError(options.error, model, options)
    xhr = @sync((if @isNew() then "create" else "update"), this, options)
    if not done and options.wait
      @clear silentOptions
      @set current, silentOptions
    xhr

  destroy: (options) ->
    options = (if options then _.clone(options) else {})
    model = this
    success = options.success
    destroy = ->
      model.trigger "destroy", model, model.collection, options

    options.success = (resp) ->
      destroy()  if options.wait or model.isNew()
      success model, resp, options  if success
      model.trigger "sync", model, resp, options  unless model.isNew()

    if @isNew()
      options.success()
      return false
    options.error = Backbone.wrapError(options.error, model, options)
    xhr = @sync("delete", this, options)
    destroy()  unless options.wait
    xhr


  parse: (response, xhr) ->
    response

  sync: (method, model, options) ->
    type = _methodMap[method]
    params = _.extend(
      type: type
      dataType: "json"
      beforeSend: (xhr) ->
        token = $("meta[name=\"csrf-token\"]").attr("content")
        xhr.setRequestHeader "X-CSRF-Token", token  if token
        model.trigger "sync:start"
    , options)
    params.url = getUrl(model) or urlError()  unless params.url
    if not params.data and model and (method is "create" or method is "update")
      params.contentType = "application/json"
      data = {}
      if model.paramRoot
        data[model.paramRoot] = model.toJSON()
      else
        data = model.toJSON()
      params.data = JSON.stringify(data)
    params.processData = false  if params.type isnt "GET"
    complete = options.complete
    params.complete = (jqXHR, textStatus) ->
      model.trigger "sync:end"
      complete jqXHR, textStatus  if complete

    $.ajax params
)
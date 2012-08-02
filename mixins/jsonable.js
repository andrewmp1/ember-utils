Ember.JsonableMixin = Ember.Mixin.create({
    getJson: function () {
        return this.getProperties(this.propertyNames());
    },

    propertyNames: function () {
        var key, ret, v;
        v = void 0;
        ret = [];
        for (key in this) {
            if (this.hasOwnProperty(key)) {
                v = this[key];
                if (v === "toString") {
                    continue;
                }
                if (Ember.typeOf(v) === "function") {
                    continue;
                }
                ret.push(key);
            }
        }
        return ret
    }
});
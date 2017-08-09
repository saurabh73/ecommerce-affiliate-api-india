'use strict'
const _ = require('lodash');
module.exports = {

    isNotNullOrUndefined: function (obj) {
        return !_.isNull(obj) && !_.isUndefined(obj);
    },

    isNonEmptyArray: function (obj) {
        return _.isArray(obj) && !_.isEmpty(obj);
    },

    toCamelCase: function (input) {
        if (!input[0].match(/^[A-Za-z0-9]$/)) {
            return input;
        } else {
            return _.camelCase(input);
        }
    }

}
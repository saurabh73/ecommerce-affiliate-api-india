'use strict'

const ebay = require('ebay-api');
const _ = require('lodash');

module.exports = {

    callEbayAPI: function (credentials) {
        return function (query) {

            const defaultOptions = {
                serviceName: 'Finding',
                opType: 'findItemsByKeywords',
                appId: credentials.affiliateId,
                params: {
                    keywords: query.keywords,
                    outputSelector: [],
                    paginationInput: {
                        entriesPerPage: 20,
                        pageNumber: 1
                    },
                    itemFilter: []
                },
                reqOptions: {
                    headers: {
                        'X-EBAY-SOA-GLOBAL-ID': 'EBAY-IN'
                    }
                },
                sandbox: false,
                raw: false
            }

            if(isNotNullOrUndefined(query.itemFilter) && isNonEmptyArray(query.itemFilter)) {
                defaultOptions.params.itemFilter = query.itemFilter;
            }

            if(isNotNullOrUndefined(query.outputSelector) && isNonEmptyArray(query.outputSelector)) {
                defaultOptions.params.outputSelector = query.outputSelector;
            }

            if(isNotNullOrUndefined(query.page) && _.isFinite(query.page)) {
                defaultOptions.params.paginationInput.pageNumber = query.page;
            }

            if(isNotNullOrUndefined(query.perPage) && _.isFinite(query.perPage)) {
                defaultOptions.params.paginationInput.entriesPerPage = query.perPage;
            }

            if(isNotNullOrUndefined(query.headers)) {
                _.assignIn( defaultOptions.params.reqOptions.headers, query.headers);
            }

            return new Promise((resolve, reject) => {
                ebay.xmlRequest(defaultOptions, function(error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
            
        }
    }
}

function isNotNullOrUndefined(obj) {
    return !_.isNull(obj) && !_.isUndefined(obj);
}

function isNonEmptyArray(obj) {
    return _.isArray(obj) && !_.isEmpty(obj);
}
'use strict'

const ebay = require('ebay-api');
const _ = require('lodash');
const util = require('./util');

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
                    itemFilter: [],
                    domainFilter: []
                },
                reqOptions: {
                    headers: {
                        'X-EBAY-SOA-GLOBAL-ID': 'EBAY-IN'
                    }
                },
                sandbox: false,
                raw: false
            }

            if(util.isNotNullOrUndefined(query.outputSelector) && util.isNonEmptyArray(query.outputSelector)) {
                defaultOptions.params.outputSelector = query.outputSelector;
            }

            if(util.isNotNullOrUndefined(query.page) && _.isFinite(query.page)) {
                defaultOptions.params.paginationInput.pgeNumber = query.page;
            }

            if(util.isNotNullOrUndefined(query.perPage) && _.isFinite(query.perPage)) {
                defaultOptions.params.paginationInput.entriesPerPage = query.perPage;
            }

            if(util.isNotNullOrUndefined(query.headers)) {
                _.assignIn( defaultOptions.params.reqOptions.headers, query.headers);
            }

            if(util.isNotNullOrUndefined(query.itemFilter) && util.isNonEmptyArray(query.itemFilter)) {
                defaultOptions.params.itemFilter = query.itemFilter;
            }

            if(util.isNotNullOrUndefined(query.domainFilter) && util.isNonEmptyArray(query.domainFilter)) {
                defaultOptions.params.domainFilter = query.domainFilter;
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


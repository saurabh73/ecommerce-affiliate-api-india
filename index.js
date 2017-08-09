'use strict';

const flipkartApi = require('./lib/flipkart-api');
const snapdealApi = require('./lib/snapdeal-api');
const ebayApi = require('./lib/ebay-api');
const amazonApi = require('./lib/amazon-api');

module.exports = {
    createFlipkartClient: function (credentials) {

        return {
            searchByKeyword: flipkartApi.callFlipkartAPI(credentials, 'search'),
            searchById: flipkartApi.callFlipkartAPI(credentials, 'product'),
            getTopSellingProudcts: flipkartApi.callFlipkartAPI(credentials, 'topFeed')
        };
    },

    createSnapdealClient: function (credentials) {
        return {
            searchByKeyword: snapdealApi.callSnapdealSearchAPI(credentials)
        }
    },

    createEbayClient: function (credentials) {
        return {
            searchByKeyword: ebayApi.callEbayAPI(credentials)
        }
    }, 

    createAmazonClient : function (credentials) {
        return {
            searchByKeyword: amazonApi.callAmazonAPI(credentials)
        }
    }

}
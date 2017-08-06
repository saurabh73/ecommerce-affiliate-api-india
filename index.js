'use strict';

const flipkartApi = require('./lib/flipkart-api');

module.exports = {
    createFlipkartClient: function (credentials) {
        
        return {
            keywordSearch: flipkartApi.callFlipkartAPI(credentials, 'search'),
            idSearch: flipkartApi.callFlipkartAPI(credentials, 'product'),
            topSellingProudcts: flipkartApi.callFlipkartAPI(credentials, 'topFeeds')
        };
    }
}
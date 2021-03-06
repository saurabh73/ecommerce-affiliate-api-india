'use strict'

const rp = require('request-promise');
const UrlAssembler = require('url-assembler');
const _ = require('lodash');

module.exports = {
    callSnapdealAPI: function (credentials, method) {
        return function (query) {

            let requestUrl = generateSnapdealURL(method, query);

            let requestOptions = {
                url: requestUrl,
                headers: {
                    'Snapdeal-Affiliate-Id': credentials.affiliateId,
                    'Snapdeal-Token-Id': credentials.affiliateToken,
                    'Accept': 'application/json'
                },
                json: true
            }

            return rp(requestOptions);

        }
    },

    callSnapdealSearchAPI: function (credentials) {
        return function (query) {

            let requestUrl = generateSnapdealURL('search', query);
            let requestOptions = {
                url: requestUrl,
                headers: {
                    'Snapdeal-Affiliate-Id': credentials.affiliateId,
                    'Snapdeal-Token-Id': credentials.affiliateToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                json: true
            }

            return new Promise((resolve, reject) => {
                rp(requestOptions).then((response) => {
                    response.productDtos.forEach((product) => {
                        let splitUrls = product.pageUrl.split('\/');
                        product.id = splitUrls[splitUrls.length - 1];

                        product.productUrl = UrlAssembler('http://www.snapdeal.com')
                                                .prefix(product.pageUrl)
                                                .param({
                                                    utm_source: 'aff_prog',
                                                    utm_campaign: 'afts',
                                                    offer_id: '17',
                                                    aff_id: credentials.affiliateId
                                                }).toString();
                    });
                    resolve(response);

                }).catch((err) => {
                    reject(err);
                });
            })
        }
    }
}


function generateSnapdealURL(method, query) {
    const baseUrl = 'https://affiliate.snapdeal.com';
    let urlResource = UrlAssembler(baseUrl);

    let url = null;
    switch (method) {
        case 'search':
            url = urlResource
                .prefix('affiliate/search/products')
                .param(_.assignIn(query, {
                    option: 'getSearchResult'
                }))
                .toString();
            break;
        case 'product':
            url = urlResource
                .prefix('feed/product')
                .param(query)
                .toString();
            break;
        case 'offerDetail':
            url = urlResource
                .prefix('feed/api/order')
                .param(query)
                .toString();
            break;

        case 'appInstall':
            url = urlResource
                .prefix('feed/app_reports')
                .param(query)
                .toString();
            break;

        default: // product feed
            url = query.url

    }

    return url;

}
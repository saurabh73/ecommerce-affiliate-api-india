'use strict'

const amazon = require('amazon-product-api');
const _ = require('lodash');
const util = require('./util');

module.exports = {

    callAmazonAPI: function (credentials) {
        return function (query) {

            const defaultOptions  = {
                keywords: query.keywords,
                domain: 'webservices.amazon.in',
                itemPage: 1,
                responseGroup: 'ItemAttributes'
            }

            if(util.isNotNullOrUndefined(query.page) && _.isFinite(query.page)) {
                defaultOptions.itemPage = query.page;
            }

            if(util.isNotNullOrUndefined(query.responseGroup)) {
                defaultOptions.responseGroup = query.responseGroup;
            }

            if(util.isNotNullOrUndefined(query.domain)) {
                delete query.domain;
            }
            _.assignIn(defaultOptions, query);

            console.log(JSON.stringify(defaultOptions));

            const amazonAffiliateClient = amazon.createClient({
                awsId: credentials.awsId,
                awsSecret: credentials.awsSecret,
                awsTag: credentials.awsTag
            });

            return new Promise((resolve, reject) => {
                amazonAffiliateClient.itemSearch(defaultOptions).then((results) => {
                    const formattedResponse = formatAmazonKey(results);
                    resolve(formattedResponse);
                }).catch((error) => {
                    reject(error);
                });

            })

        }
    }
}


function formatAmazonKey(object) {
    if (!util.isNotNullOrUndefined(object) || _.isString(object) || _.isNumber(object)) {
      return object;
    } else if (_.isArray(object)) {
      let formattedArr = [];
      object.forEach((item) => {
        formattedArr.push(formatAmazonKey(item))
      });
      return formattedArr;
    } else {
      const formattedKeyObj = {};
      Object.keys(object).forEach((key) => {
        if (_.isArray(object[key])) {
          let formattedArr = [];
          object[key].forEach((item) => {
            formattedArr.push(formatAmazonKey(item));
          });
          if (formattedArr.length === 1) {
            formattedKeyObj[util.toCamelCase(key)] = formattedArr[0];
          } else {
            formattedKeyObj[util.toCamelCase(key)] = formattedArr;
          }
        } else if (_.isObject(object[key])) {
          formattedKeyObj[util.toCamelCase(key)] = formatAmazonKey(object[key]);
        } else {
          formattedKeyObj[util.toCamelCase(key)] = object[key];
        }
      });

      return formattedKeyObj;
    }
  }
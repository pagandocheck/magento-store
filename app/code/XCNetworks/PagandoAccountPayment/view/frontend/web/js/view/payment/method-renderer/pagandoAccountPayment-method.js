 define([
    'Magento_Checkout/js/view/payment/default',
    'jquery',
    'ko',
    'mage/url',
    'Magento_Checkout/js/model/quote',
    'mage/validation',
], function (Component, $, ko, url, quote) {
    'use strict';

    let configPayment = window.checkoutConfig.payment.pagandoAccountPayment;
    return Component.extend({
        defaults: {
            redirectAfterPlaceOrder: false,
            template: 'XCNetworks_PagandoAccountPayment/payment/pagandoAccountPayment-form'
        },
        initialize: function() {
            this._super();
            self = this;
        },
        afterPlaceOrder: function () {
            $('body').trigger('processStart');
            window.location.replace(url.build('pagando/checkout/index'));
        },
        validate: function() {
            var billingAddress = quote.billingAddress();
            var allowedCountries = self.getAllowedCountries();
            var allowedCountriesArray = [];

            if(typeof(allowedCountries) == 'string' && allowedCountries.length > 0){
                allowedCountriesArray = allowedCountries.split(',');
            }

            self.messageContainer.clear();

            if (allowedCountriesArray.indexOf(billingAddress.countryId) == -1) {
                self.messageContainer.addErrorMessage({'message': 'Orders from this country are not supported by Pagando.'});
                return false;
            }


            return true;
        },
        getAllowedCountries: function() {
            return window.checkoutConfig.payment.pagandoAccountPayment.allowed_countries;
        },
        getCountries: function() {
            return  window.checkoutConfig.payment.checkmo.countries;
        },

        getCountriesList: function() {
            return _.map(this.getCountries(), function(value, key) {
                return {
                    'value': key,
                    'type': value
                }
            });
        },

        getStoreCard: function() {
            return  window.checkoutConfig.payment.pagandoAccountPayment.storedCards;
        },

        getCardList: function() {
            // var testOptions= [{
            //     'value': "Test1",
            //     'type': "Test1"
            // },
            //     {
            //         'value': "Test2",
            //         'type': "Test2"
            //     }];

            console.log("TESTTTT222", window.checkoutConfig);
            console.log("TESTTTT", window.checkoutConfig.payment);
            // return testOptions;
            return _.map(this.getStoreCard(), function(value, key) {
                return {
                    'value': key,
                    'type': value
                }
            });
        },
    });
});

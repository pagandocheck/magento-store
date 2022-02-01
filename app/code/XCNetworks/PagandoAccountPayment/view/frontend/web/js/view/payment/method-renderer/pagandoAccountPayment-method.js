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
            // return  window.checkoutConfig.payment.pagandoAccountPayment.countries;
            var testOptions= [{
                'value': "Test1",
                'type': "Test1"
            },
                {
                    'value': "Test2",
                    'type': "Test2"
                }];
        },

        getCountriesList: function() {
            return _.map(this.getCountries(), function(value, key) {
                return {
                    'value': key,
                    'type': value
                }
            });

            return testOptions;
        },

        getStoreCard: function() {
            return  window.checkoutConfig.payment.pagandoAccountPayment.storedCards;
        },

        getCardList: function() {
            var testOptions= [{
                'value': "Test1",
                 'type': "Test1"
                },
                 {
                     'value': "Test2",
                     'type': "Test2"
                 }];

            // console.log("TESTTTT11111", window.checkoutConfig);
            // console.log("TESTTTT2222", window.checkoutConfig.payment);
            console.log("AQUIIIII ENTROOOO 2" , testOptions);
            return testOptions;

            var request = $.ajax({
                method: "GET",
                url: "https://api.pagandocheck.com:443/v1/countries/countries",
                dataType: 'json',
                data: {}
            });
            console.log("AQUIIIII ENTROOOO", request);
            request.done(function( msg ) {
                console.log("AQUIIIII ENTROOOO request");
                var objects= request.responseJSON.object;
                var mapTest= _.map(objects, function(value, key) {
                    return {
                        'isoCode': value.isoCode,
                        'name': value.name
                    }
                });
                console.log("MAPTEST", mapTest);
                return mapTest
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
                return []
            });

            /**return _.map(, function(value, key) {
                return {
                    'isoCode': key,
                    'name': value
                }
            });*/
        },

        getCountriesList: function() {

            var request = $.ajax({
                method: "GET",
                url: "https://api.pagandocheck.com:443/v1/countries/countries",
                headers: {
                    "Content-Type": "application/json"
                },
                dataType: 'json',
                data: {},
                crossDomain: true
            });
            request.done(function( msg ) {

                var objects= request.responseJSON.object;
                var mapTest= _.map(objects, function(value, key) {
                    return {
                        'value': value.isoCode,
                        'type': value.name
                    }
                });
                console.log("MAPTEST", mapTest);
                var $select = $('#countrie'); // you might wanna empty it first with .empty()
                for(let val of mapTest){
                    var o = $('<option/>', val)
                        .text(val.type);
                    o.appendTo($select);
                }
                return mapTest
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log( "Request failed: " + textStatus );
                return []
            });
            // return testOptions;
            /**return _.map(, function(value, key) {
                return {
                    'isoCode': key,
                    'name': value
                }
            });*/
        },
    });
});

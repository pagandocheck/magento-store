 define([
    'Magento_Checkout/js/view/payment/default',
    'jquery',
    'ko',
    'mage/url',
    'Magento_Checkout/js/model/quote',
    'mage/validation',
    'domReady!'
], function (Component, $, ko, url, quote) {
    'use strict';

    let configPayment = window.checkoutConfig.payment.pagandoAccountPayment;
     let carnetBinsPagando = [
         '506432',
         '506430',
         '506410',
         '506369',
         '506357',
         '506353',
         '506332',
         '506313',
         '286900',
         '639484',
         '639559',
         '506202',
         '506201',
         '506203',
         '506212',
         '506215',
         '506214',
         '506217',
         '506281',
         '506283',
         '506280',
         '506297',
         '506299',
         '506262',
         '506263',
         '506265',
         '506269',
         '506273',
         '506272',
         '506274',
         '506277',
         '506276',
         '506279',
         '506278',
         '506245',
         '506247',
         '506251',
         '506250',
         '506253',
         '506255',
         '506254',
         '506257',
         '506259',
         '506258',
         '506222',
         '506221',
         '506228',
         '506237',
         '506199',
         '506320',
         '506329',
         '506319',
         '506336',
         '506339',
         '506301',
         '506300',
         '506303',
         '506302',
         '506306',
         '506312',
         '506311',
         '506318',
         '506309',
         '506393',
         '506340',
         '506343',
         '636379',
         '606333',
         '627535'
     ];
     const carnetBinsRegexpConcat = carnetBinsPagando.reduce((acc, bin) => `${acc}|^${bin}`, '').substring(1);
     const carnetBinsRegexp = new RegExp(`(${carnetBinsRegexpConcat})`);
     let ccCardType = '';
     const ccCardTypePatterns = {
         carnet: carnetBinsRegexp,
         visa: /^4/,
         mastercard: /^5/,
     };

     $("#card_pan").on('change', function(e){
         console.log("ENTROOOO al change", ccCardTypePatterns);
     });

    return Component.extend({
        defaults: {
            redirectAfterPlaceOrder: false,
            template: 'XCNetworks_PagandoAccountPayment/payment/pagandoAccountPayment-form'
        },
        initialize: function() {
            this._super();
            self = this;

            console.log("ENTROOOO al initialize", ccCardTypePatterns);
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
        myFunction: function(data, event) {
            console.log("Entroooo1", event);
            console.log("Entroooo 2", data);
        },
        mainInfo: function(val) {
            console.log("Entro al mainInfo");
         if(id.length > 5){
             for (const cardType in ccCardTypePatterns) {
                 if ( ccCardTypePatterns[cardType].test(id.replace(/ /g, '')) ) {
                     ccCardType = cardType;
                     break;
                 }
             }
             console.log("Cardtype", ccCardType);
             // fetchPromotions(id, ccCardType, document.getElementById("pmx_total").value, document.getElementById("pmx_number").value );
         }
        }
    });
});

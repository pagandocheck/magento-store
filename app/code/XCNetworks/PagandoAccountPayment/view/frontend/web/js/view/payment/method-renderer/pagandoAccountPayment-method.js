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

     let cardPan= '';

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
        },
        mainInfo: function(data, event) {
            console.log("Entroooo1", data);
            console.log("ENTROOO 2", event);
            cardPan= cardPan + event.key;
            document.getElementById("card_pan").value = cardPan;
            if(cardPan.length > 5){
                for (const cardType in ccCardTypePatterns) {
                    if ( ccCardTypePatterns[cardType].test(cardPan.replace(/ /g, '')) ) {
                        ccCardType = cardType;
                        break;
                    }
                }
                const total= quote.totals._latestValue.grand_total;
                const jwt_token= window.checkoutConfig.payment.pagandoAccountPayment.jwt_token;
                console.log("TOTAL", ccCardType);
                console.log("config payment", window.checkoutConfig.payment);
                //fetchPromotions(cardPan, ccCardType, total, jwt_token);
                const payload = {
                    bin: cardPan,
                    cardBrand: ccCardType,
                    amount: total
                };
                console.log("PAYLOAD", payload);
                var request = $.ajax({
                    method: "POST",
                    url: "https://api.pagandocheck.com/v1/pagando/promotions/get-terminal-promotions-nouser",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+token
                    },
                    dataType: 'json',
                    data: payload,
                    crossDomain: true
                });

                request.done(function( msg ) {
                    console.log("EXITOOOO");
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                    return []
                });
            }
        },
        fetchPromotions: function(bin, cardBrand, amount, token) {
         // const request = new XMLHttpRequest();
         // request.onreadystatechange = () => {
         //     if(request.readyState === 4) {
         //         if(request.status === 200) {
         //             const response = JSON.parse(request.response);
         //             let promotions = [{name: 'Ingrese el el número de tarjeta para ver las promociones'}];
         //             if (response.data.length === 0) {
         //                 promotions = [{name: 'No hay promociones disponibles'}];
         //             } else {
         //                 promotions = [{name: 'Seleccione una promoción'}].concat(response.data);
         //             }
         //             updatePromotions(promotions);
         //         } else {
         //             console.error(request);
         //         }
         //     }
         // }
         const payload = {
             bin,
             cardBrand,
             amount
         };

        var request = $.ajax({
            method: "POST",
            url: "https://api.pagandocheck.com/v1/pagando/promotions/get-terminal-promotions-nouser",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            dataType: 'json',
            data: payload,
            crossDomain: true
        });

        request.done(function( msg ) {
            console.log("EXITOOOO");
        });

        request.fail(function( jqXHR, textStatus ) {
            console.log( "Request failed: " + textStatus );
            return []
        });

         // request.open('POST', `https://api.pagandocheck.com/v1/pagando/promotions/get-terminal-promotions-nouser`, true);
         // request.setRequestHeader('Content-Type', 'application/json');
         // request.setRequestHeader('Authorization', token);
         // request.send(JSON.stringify(payload));
     }
    });
});

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
     // let countrie= document.getElementById("countrie").value;
     // let card_state= document.getElementById("card_state").value;
     // let card_city= document.getElementById("card_city").value;
     // let card_district= document.getElementById("card_district").value;
     // let card_zipCode= document.getElementById("card_zipCode").value;
     // let card_street= document.getElementById("card_street").value;
     // let card_promotion= document.getElementById("card_promotion").value;

     // const addressData= {
     //     countrie,
     //     card_state,
     //     card_city,
     //     card_district,
     //     card_zipCode,
     //     card_street,
     //     card_promotion
     // };
     //
     // let card_pan_no_spaces= document.getElementById("card_pan_no_spaces").value;
     // let card_promotion_promotion_type= document.getElementById("card_promotion_promotion_type").value;
     // let card_promotion_promotion_time_to_apply= document.getElementById("card_promotion_promotion_time_to_apply").value;
     // let card_promotion_promotion_months_to_wait= document.getElementById("card_promotion_promotion_months_to_wait").value;


    return Component.extend({
        defaults: {
            redirectAfterPlaceOrder: false,
            template: 'XCNetworks_PagandoAccountPayment/payment/pagandoAccountPayment-form'
        },
        initialize: function() {
            this._super();
            self = this;
            setTimeout(function(){
                var x, i, j, selElmnt, a, b, c;
                x = document.getElementsByClassName("pagando-select");
                for (i = 0; i < x.length; i++) {
                    selElmnt = x[i].getElementsByTagName("select")[0];
                    a = document.createElement("DIV");
                    a.setAttribute("class", "pagando-select-selected");
                    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
                    x[i].appendChild(a);
                    b = document.createElement("DIV");
                    b.setAttribute("class", "pagando-select-items pagando-select-hide");
                    for (j = 1; j < selElmnt.length; j++) {
                        c = document.createElement("DIV");
                        c.innerHTML = selElmnt.options[j].innerHTML;
                        c.addEventListener("click", function(e) {
                            var y, i, k, s, h;
                            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                            h = this.parentNode.previousSibling;
                            for (i = 0; i < s.length; i++) {
                                if (s.options[i].innerHTML == this.innerHTML) {
                                    s.selectedIndex = i;
                                    h.innerHTML = this.innerHTML;
                                    y = this.parentNode.getElementsByClassName("pagando-selected-option");
                                    for (k = 0; k < y.length; k++) {
                                        y[k].removeAttribute("class");
                                    }
                                    this.setAttribute("class", "pagando-selected-option");
                                    break;
                                }
                            }
                            h.click();
                        });
                        b.appendChild(c);
                    }
                    x[i].appendChild(b);
                    a.addEventListener("click", function(e) {
                        e.stopPropagation();
                        closeAllSelect(this);
                        this.nextSibling.classList.toggle("pagando-select-hide");
                        this.classList.add("selected-option");
                    });
                }

                document.addEventListener("click", self.closeAllSelect);
            }, 2000);
        },
        closeAllSelect: function(elmnt) {
             var x, y, i, arrNo = [];
             x = document.getElementsByClassName("pagando-select-items");
             y = document.getElementsByClassName("pagando-select-selected");
             for (i = 0; i < y.length; i++) {
                 if (elmnt == y[i]) {
                     arrNo.push(i)
                 }
             }
             for (i = 0; i < x.length; i++) {
                 if (arrNo.indexOf(i)) {
                     x[i].classList.add("pagando-select-hide");
                 }
             }
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
            cardPan= cardPan + event.key;
            document.getElementById("card_pan").value = cardPan;
            if(cardPan.length > 5){
                for (const cardType in ccCardTypePatterns) {
                    if ( ccCardTypePatterns[cardType].test(cardPan.replace(/ /g, '')) ) {
                        ccCardType = cardType;
                        break;
                    }
                }

                const jwt_token= window.checkoutConfig.payment.pagandoAccountPayment.jwt_token;
                console.log("TOKEN", jwt_token);
                console.log("window.checkoutConfig.payment", window.checkoutConfig.payment);
                const total= quote.totals._latestValue.grand_total;
                const payload = {
                    bin: cardPan,
                    cardBrand: 'visa',
                    amount: total,
                    country: "004"
                };
                console.log("PAYLOAD", payload);

                var request = $.ajax({
                    method: "POST",
                    type: "POST",
                    withCredentials: true,
                   // headers: {
                    //     "Content-Type": "application/json",
                    //         "Access-Control-Allow-Credentials": true,
                    //         "Access-Control-Allow-Headers": "*",
                     //   "Authorization": `Bearer ${jwt_token}`,
                    //         "Access-Control-Allow-Origin": "https://44dc-2806-104e-4-15d4-b0b4-e80b-2acc-2c44.ngrok.io"
                    //},
                    url: "https://ee4c-2806-104e-4-bab-f85f-831c-3ece-9f13.ngrok.io/v1/pagando/promotions/get-terminal-promotions-nouser",
                    dataType: 'json',
                    data: payload,
                    crossDomain: true
                });

                // headers: {
                //     "Content-Type": "application/json",
                //         "Access-Control-Allow-Credentials": true,
                //         "Access-Control-Allow-Headers": "*",
                //         "Authorization": `Bearer ${jwt_token}`,
                //         "Access-Control-Allow-Origin": "https://44dc-2806-104e-4-15d4-b0b4-e80b-2acc-2c44.ngrok.io"
                // },

                request.done(function( msg ) {
                    console.log("EXITOOOO", request);
                        var objects= request.responseJSON.data;
                        var mapObjects= _.map(objects, function(value, key) {
                            return {
                                'value': value.promotionType,
                                'type': value.name
                            }
                        });
                        console.log("MAPTEST", mapObjects);
                        var $select = $('#card_promotion');
                        $select.children().first().remove();
                        var textDefault= "No hay promociones disponibles";
                        if(mapObjects.length > 0){
                            textDefault= "Seleccione una promoción";
                        }
                        var defaultOption = $('<option/>', "").text(textDefault);
                        defaultOption.appendTo($select);
                        for(let val of mapObjects){
                            var o = $('<option/>', val)
                                .text(val.type);
                            o.appendTo($select);
                        }
                        return mapObjects
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                    return []
                });

            }
        },
        payOrder: function(data, event) {
            const total= quote.totals._latestValue.grand_total;
            let card_name= document.getElementById("card_name").value;
            let card_exp= document.getElementById("card_exp").value;
            let card_exp_month= document.getElementById("card_exp_month").value;
            let card_exp_year= document.getElementById("card_exp_year").value;

            const cardData= {
                "card_name": card_name,
                "card_exp": card_exp,
                "card_exp_month": card_exp_month,
                "card_exp_year": card_exp_year
            };
            const payload = {
                "userId": "a4440ec7-3a60-4848-b7f6-088eca50a560",
                "amount": total,
                "cardId": "cd_t0jpxouup-203vy9",
                "cardData": cardData
            };
            console.log("PAYLOAD", quote);

            var request = $.ajax({
                method: "POST",
                type: "POST",
                withCredentials: true,
                url: "https://ee4c-2806-104e-4-bab-f85f-831c-3ece-9f13.ngrok.io/v1/pagando/orders/create-order",
                dataType: 'json',
                data: payload,
                crossDomain: true
            });

            request.done(function( msg ) {
                console.log("EXITOOOO", request);
                const response= request.responseJSON;
                if(response.key !== "SUCCESS_ORDER"){
                    console.log("EXITOOOO1");
                    self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                    window.location.replace(url.build('pagando/checkout/index'));
                }
                console.log("EXITOOOO2");
                const data= request.responseJSON.data;
                self.messageContainer.addSuccessMessage({'message': 'Your payment with Pagando is complete.'});
                // window.location.replace(url.build('checkout/onepage/success'));
                var options={
                    method: 'get',
                    parameters: 'orderStatus='+response.key,
                    onSuccess: function(xhr) {
                        // TODO: Whatever needs to happen on success
                        console.log("Si se hizooooooo");
                        // alert('it worked');
                    },
                    onFailure: function(xhr) {
                        // TODO: Whatever needs to happen on failure
                        console.log('it failed');
                    }
                };

                new Ajax.Request('processResponse.php', options);
                // $.ajax({
                //     url: "success",
                //     data: { orderStatus: response.key }
                // })
                //     .done(function( response ) {
                //         console.log("Si se hizooooooo");
                //     });

            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("EXITOOOO3");
                console.log( "Request failed: " + textStatus );
                self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                // window.location.replace(url.build('checkout/index'));
            });
        }

    });
});

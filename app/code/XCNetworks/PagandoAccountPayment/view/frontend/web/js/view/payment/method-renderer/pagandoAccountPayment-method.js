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

     const urlBase= "https://57d5-2806-104e-4-bab-45fa-9ca2-6441-5fc8.ngrok.io"
     const urlCountries= "https://api.pagandocheck.com:443/v1/countries/countries";
     const urlPromotions= urlBase + "/v1/pagando/promotions/get-terminal-promotions-nouser";
     const urlCreateEcommerceOrder= urlBase +"/v1/pagando/orders/create-ecommerce-order";
     const urlCreateUser= urlBase + "/v1/pagando/users/user";
     const urlAddCard= urlBase+ "/v1/pagando/payment_methods/add_card";
     const urlCreateOrder= urlBase + "/v1/pagando/orders/create-order";
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
     let orderId= '';
     let userId= '';
     let cardId= '';

     const promotions= {};
     const cardPromotionSelectId = 'card_promotion';
     const cardPromotionTypeId = "card_promotion_promotion_type";
     const cardPromotionTimeToApplyId = "card_promotion_promotion_time_to_apply";
     const cardPromotionMonthsToWaitId = "card_promotion_promotion_months_to_wait";

    return Component.extend({
        defaults: {
            redirectAfterPlaceOrder: false,
            template: 'XCNetworks_PagandoAccountPayment/payment/pagandoAccountPayment-form'
        },
        initialize: function() {
            this._super();
            self = this;
            setTimeout(function(){
                self.updateSelects();

                document.addEventListener("click", self.closeAllSelect);
            }, 3000);
        },
        updateSelects: function(){
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
                        self.promotionSelected(s, self);
                    });
                    b.appendChild(c);
                }
                x[i].appendChild(b);
                a.addEventListener("click", function(e) {
                    e.stopPropagation();
                    self.closeAllSelect(this);
                    this.nextSibling.classList.toggle("pagando-select-hide");
                    this.classList.add("selected-option");
                });
            }
        },
        promotionSelected: function(select, option) {
         if (select.id === cardPromotionSelectId) {
             const selectedPromotion = promotions.find((p) => p.name === option.innerHTML);
             const typeInput = document.getElementById(cardPromotionTypeId);
             const timeToApplyInput = document.getElementById(cardPromotionTimeToApplyId);
             const monthsToWaitInput = document.getElementById(cardPromotionMonthsToWaitId);

             if(selectedPromotion && selectedPromotion.time && selectedPromotion.minAmount && selectedPromotion.promotionType) {
                 typeInput.value = selectedPromotion.promotionType;
                 timeToApplyInput.value = selectedPromotion.time;
                 monthsToWaitInput.value = selectedPromotion.monthsToWait || 0;
             } else {
                 typeInput.value = null;
                 timeToApplyInput.value = null;
                 monthsToWaitInput.value = null;
             }
         }
        },
        updatePromotions: function() {
             const promotionsSelect = document.getElementById(cardPromotionSelectId);
             const options = [];
             promotionsSelect.innerHTML = '';
             promotions.forEach(({name}, i) => {
                 const newOption = document.createElement("option");
                 newOption.text = name;
                 newOption.value = i;
                 promotionsSelect.appendChild(newOption);
             });
             self.updateSelects();
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
                url: urlCountries,
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
                var $select = $('#country'); // you might wanna empty it first with .empty()
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
        fetchPromotions: function(data, event) {
            console.log("EVENT KEY", event);
            const inputPan = document.getElementById("card_pan").value;
            cardPan= inputPan + event.key;
            console.log("EVENT KEY", cardPan);
            const panNoSpaces = cardPan.replace(/ /g, '');
            document.getElementById("card_pan").value = panNoSpaces;
            if(panNoSpaces.length >= 8){
                for (const cardType in ccCardTypePatterns) {
                    if ( ccCardTypePatterns[cardType].test(cardPan.replace(/ /g, '')) ) {
                        ccCardType = cardType;
                        break;
                    }
                }
                console.log("ccCardType", ccCardType);
                const jwt_token= window.checkoutConfig.payment.pagandoAccountPayment.jwt_token;
                console.log("TOKEN", jwt_token);
                console.log("window.checkoutConfig.payment", window.checkoutConfig.payment);
                const total= quote.totals._latestValue.grand_total;
                const shippingAddress= quote.shippingAddress._latestValue;
                const payload = {
                    bin: cardPan,
                    cardBrand: 'visa', // ccCardType
                    amount: total,
                    country: "004" // shippingAddress.countryId
                };
                console.log("PAYLOAD", payload);

                var request = $.ajax({
                    method: "POST",
                    type: "POST",
                    withCredentials: true,
                    headers: {
                    //     "Content-Type": "application/json",
                    //         "Access-Control-Allow-Credentials": true,
                    //         "Access-Control-Allow-Headers": "*",
                        "Authorization": `Bearer ${jwt_token}`
                    //         "Access-Control-Allow-Origin": "https://44dc-2806-104e-4-15d4-b0b4-e80b-2acc-2c44.ngrok.io"
                    },
                    url: urlPromotions,
                    dataType: 'json',
                    data: payload,
                    crossDomain: true
                });

                request.done(function( msg ) {
                    console.log("EXITOOOO", request);
                    const objects= request.responseJSON.data;
                    if (objects.length === 0) {
                        promotions = [{name: 'No hay promociones disponibles'}];
                    } else {
                        promotions = [{name: 'Seleccione una promoción'}].concat(response.data);
                    }
                    self.updatePromotions();

                        // var mapObjects= _.map(objects, function(value, key) {
                        //     return {
                        //         'value': value.promotionType,
                        //         'type': value.name
                        //     }
                        // });
                        // console.log("MAPTEST", mapObjects);
                        // var $select = $('#card_promotion');
                        // $select.children().first().remove();
                        // var textDefault= "No hay promociones disponibles";
                        // if(mapObjects.length > 0){
                        //     textDefault= "Seleccione una promoción";
                        // }
                        // var defaultOption = $('<option/>', "").text(textDefault);
                        // defaultOption.appendTo($select);
                        // for(let val of mapObjects){
                        //     var o = $('<option/>', val)
                        //         .text(val.type);
                        //     o.appendTo($select);
                        // }
                        // console.log("MAPOBJECTS", mapObjects);
                        // console.log("MAPOBJECTS", mapObjects);
                        // return mapObjects
                });

                request.fail(function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                    return []
                });

            }
        },
        payOrder: function(data, event) {
            const total= quote.totals._latestValue.grand_total;
            const currency= quote.totals._latestValue.quote_currency_code;
            const shippingAddress= quote.shippingAddress._latestValue;

            if (currency != 'MXN') {
                self.messageContainer.addErrorMessage({'message': 'Los pagos no son aceptados en el tipo de moneda seleccionada.'});
            }

            const userdata = self.getUserData(shippingAddress);
            const jwt_token= window.checkoutConfig.payment.pagandoAccountPayment.jwt_token;
            console.log("TOKEN", jwt_token);
            const dataOrder= self.getEcommerceData(shippingAddress);
            const order_id= await self.createEcommerceOrder(dataOrder);
            // jwt_token &&
            if(order_id){
                const user_id= self.addUser(userdata);
                if(user_id){
                    self.addCard();
                    console.log("Si llego HASTA AQUIII");
                }
            }

        },
        getEcommerceData: function(shippingAddress){
            const dataOrder= {
                'email': quote.guestEmail,
                'name': shippingAddress.firstname,
                'lastName': shippingAddress.lastname,
                'phone': shippingAddress.telephone,
                'street': shippingAddress.street[0],
                'zipCode': shippingAddress.postcode,
                'city': shippingAddress.city,
                'state': shippingAddress.region,
                'country': shippingAddress.countryId,
                'cartId': quote.getQuoteId(),
                'total': quote.totals._latestValue.grand_total,
                'originECommerce': 'MAGENTO',
                'productsList': new Array()
            }

            const shippingInfo= {
                'street': shippingAddress.street[0],
                'noExt': '11',
                'district': '',
                'zipCode': shippingAddress.postcode,
                'city': shippingAddress.city,
                'state': shippingAddress.region,
                'country': shippingAddress.countryId
            };

            dataOrder['shippingInfo'] = shippingInfo;
            const items= quote.totals._latestValue.items;

            for(var item in items){
                const tempItem= {};
                tempItem['quantity'] = items[item]["qty"];
                tempItem['productName'] = items[item]["name"];
                tempItem['unitPrice'] = items[item]["price"];
                tempItem['totalAmount'] = items[item]["row_total"];
                console.log("Item", items[item]);
                console.log("tempItem", tempItem);
                dataOrder['productsList'].push(tempItem);
            };

            return dataOrder;
        },
        getUserData: function(shippingAddress){
            const user= {};
            user['email'] = quote.guestEmail;
            user['name'] = shippingAddress.firstname;
            user['lastName'] = shippingAddress.lastname;
            user['phone'] = shippingAddress.telephone;

            return user;
        },
        createEcommerceOrder: function(data){
            var request = $.ajax({
                method: "POST",
                type: "POST",
                withCredentials: true,
                url: urlCreateEcommerceOrder,
                dataType: 'json',
                data: data,
                crossDomain: true
            });

            request.done(function( msg ) {
                console.log("EXITOOOO con la funcion", request);
                const response= request.responseJSON;
                orderId= response.data.orderId;
                if(orderId){
                    const shippingAddress= quote.shippingAddress._latestValue;
                    const userdata= self.getUserData(shippingAddress);
                    self.addUser(userdata);
                }
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("EXITOOOO3 fail");
                console.log( "Request failed: " + textStatus );
                self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                return null
                // window.location.replace(url.build('checkout/index'));
            });
        },
        addUser: function(data){
            var request = $.ajax({
                method: "POST",
                type: "POST",
                withCredentials: true,
                url: urlCreateUser,
                dataType: 'json',
                data: data,
                crossDomain: true
            });

            request.done(function( msg ) {
                console.log("EXITOOOO con la funcion addUser", request);
                const response= request.responseJSON;
                userId= response.data.userId;
                if(userId){
                    console.log("Si llego HASTA AQUIII");
                    self.addCard();

                    // if(!empty(cardId)){
                    //     self.orderCreate();
                    //
                    //     $get_data = (Object)[
                    //         'orderId' => $this->order_id,
                    // ];
                    //     $this->getEcommerceOrderData($get_data);
                    // }
                }
                return userId;
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("EXITOOOO4 fail");
                console.log( "Request failed addUser: " + textStatus );
                self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                return null
                // window.location.replace(url.build('checkout/index'));
            });
        },
        addCard: function(){

            const shippingAddress= quote.shippingAddress._latestValue;
            const name= document.getElementById("card_name").value;
            const street = document.getElementById("card_street").value;
            const noExt = document.getElementById("card_street").value;
            const district = document.getElementById("card_district").value;
            const zipCode = document.getElementById("card_zipCode").value;
            const city = document.getElementById("card_city").value;
            const state = document.getElementById("card_state").value;
            const country = document.getElementById("country").value;

            const card_exp= document.getElementById("card_exp").value;
            const [month, year] = card_exp.split('/');
            const cvv= document.getElementById("card_cvv").value;
            const pan= document.getElementById("card_pan").value;

            const data= {
                userId: userId,
                name: name,
                email: quote.guestEmail,
                phone: shippingAddress.telephone,
                street: street,
                noExt: noExt,
                district: district,
                zipCode: zipCode,
                city: city,
                state: state,
                country: country,
                pan: pan,
                exp_month: month,
                exp_year: year,
                cvv: cvv,
                brand: ccCardType
            }

            var request = $.ajax({
                method: "POST",
                type: "POST",
                withCredentials: true,
                url: urlAddCard,
                dataType: 'json',
                data: data,
                crossDomain: true
            });

            request.done(function( msg ) {
                console.log("EXITOOOO con la funcion addCard", request);
                const response= request.responseJSON;
                cardId= response.data.cardId;
                if(cardId) {
                    self.orderCreate();
                };
            });

            request.fail(function( jqXHR, textStatus ) {
                console.log("EXITOOOO4 fail addCard");
                console.log( "Request failed: " + textStatus );
                self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                // window.location.replace(url.build('checkout/index'));
            });

         },
         orderCreate: function(){
             // const payload = {
             //     "userId": userId,
             //     "amount": quote.totals._latestValue.grand_total,
             //     "cardId": cardId
             // };
             console.log("getOrderData", self.getOrderData());
             var request = $.ajax({
                 method: "POST",
                 type: "POST",
                 withCredentials: true,
                 url: urlCreateOrder,
                 dataType: 'json',
                 data: self.getOrderData(),
                 crossDomain: true
             });

             request.done(function( msg ) {
                 console.log("EXITOOOO order create", request);
                 const response= request.responseJSON;
                 if(response.key !== "SUCCESS_ORDER"){
                     console.log("EXITOOOO1");
                     self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                     // window.location.replace(url.build('pagando/checkout/index'));
                 }
                 console.log("EXITOOOO2", url.build('pagandoaccount/checkout/success'));
                 const data= request.responseJSON.data;
                 self.messageContainer.addSuccessMessage({'message': 'Your payment with Pagando is complete.'});
                 // window.location.replace(url.build('checkout/onepage/success'));

                 $.ajax({
                     url: url.build('pagandoaccount/checkout/success'),
                     data: { orderStatus: response.key }
                 })
                     .done(function( response ) {
                         console.log("Si se hizooooooo");
                     });

             });

             request.fail(function( jqXHR, textStatus ) {
                 console.log("EXITOOOO3");
                 console.log( "Request failed order: " + textStatus );
                 self.messageContainer.addErrorMessage({'message': 'Ha ocurrido un error inesperado.'});
                 // window.location.replace(url.build('checkout/index'));
             });
         },
        getOrderData: function(){
            const shippingAddress= quote.shippingAddress._latestValue;
            const cvv= document.getElementById("card_cvv").value;
            const data= {
                "userId": userId,
                "cardId": cardId,
                "pin": cvv,
                "amount": quote.totals._latestValue.grand_total,
                "orderId": orderId,
                'street': shippingAddress.street[0],
                'zipCode': shippingAddress.postcode,
                'city': shippingAddress.city,
                'state': shippingAddress.region,
                'country': shippingAddress.countryId,
                'productsList': new Array()
            }

            const items= quote.totals._latestValue.items;

            for(var item in items){
                const tempItem= {};
                tempItem['quantity'] = items[item]["qty"];
                tempItem['productName'] = items[item]["name"];
                tempItem['unitPrice'] = items[item]["price"];
                tempItem['totalAmount'] = items[item]["row_total"];
                data['items'].push(tempItem);
            };

            const promotion = array(
                'promotionType': document.getElementById("card_promotion_promotion_type").value,
                'timeToApply': document.getElementById("card_promotion_promotion_time_to_apply").value,
                'monthsToWait': document.getElementById("card_promotion_promotion_months_to_wait").value
            );

            data['paymentPromotion'].push(promotion);
            return data;
        },

    });
});

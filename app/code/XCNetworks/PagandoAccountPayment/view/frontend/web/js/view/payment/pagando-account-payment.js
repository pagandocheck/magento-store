define([
    'uiComponent',
    'Magento_Checkout/js/model/payment/renderer-list'
], function (Component, rendererList) {
    'use strict';

    rendererList.push(
        {
            type: 'pagandoAccountPayment',
            component: 'XCNetworks_PagandoAccountPayment/js/view/payment/method-renderer/pagandoAccountPayment-method'
        }
    );

    /** Add view logic here if needed */
    return Component.extend({});
});

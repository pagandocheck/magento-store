<?php

namespace XCNetworks\PagandoAccountPayment\Controller\Order;

use Magento\Framework\App\Action\Action;
use Magento\Checkout\Model\Session;
use Magento\Framework\App\Action\Context;
use Magento\Sales\Model\OrderFactory;
use XCNetworks\PagandoAccountPayment\Helper\Checkout;
use XCNetworks\PagandoAccountPayment\Model\PagandoAccountPayment;
use Psr\Log\LoggerInterface;
use Magento\Framework\App\Action\HttpGetActionInterface;

/**
 * @package
 */
abstract class AbstractAction implements HttpGetActionInterface {

    const LOG_FILE = 'pagando.log';

    private $_context;

    private $_checkoutSession;

    private $_orderFactory;

    private $_checkoutHelper;

    protected $messageManager;

    private $_logger;

    protected $_pagandoAccountPayment;

    protected $order;

    public function __construct(
        Session $checkoutSession,
        Context $context,
        OrderFactory $orderFactory,
        Checkout $checkoutHelper,
        PagandoAccountPayment $pagandoAccountPayment,
        LoggerInterface $logger,
        \Magento\Framework\Message\ManagerInterface $messageManager
        ) {
        $this->__construct($context);
        $this->_checkoutSession = $checkoutSession;
        $this->_orderFactory = $orderFactory;
        $this->_checkoutHelper = $checkoutHelper;
        $this->messageManager = $messageManager;
        $this->_logger = $logger;
        $this->_pagandoAccountPayment = $pagandoAccountPayment;
    }

    protected function getContext() {
        return $this->_context;
    }

    protected function getCheckoutSession() {
        return $this->_checkoutSession;
    }

    protected function getOrderFactory() {
        return $this->_orderFactory;
    }

    protected function getCheckoutHelper() {
        return $this->_checkoutHelper;
    }

    protected function getMessageManager() {
        return $this->_messageManager;
    }

    protected function getLogger() {
        return $this->_logger;
    }

    protected function getPagandoAccountPayment() {
        return $this->_pagandoAccountPayment;
    }

    protected function getOrder()
    {
        $orderId = $this->_checkoutSession->getLastRealOrderId();

        $this->getLogger()->info('ORDER PAGANDO orderId -> ' . json_encode($this->_checkoutSession));

        if (!isset($orderId)) {
            return null;
        }

        return $this->getOrderById($orderId);
    }

    protected function getOrderById($orderId)
    {
        $order = $this->_orderFactory->create()->loadByIncrementId($orderId);

        if (!$order->getId()) {
            return null;
        }

        return $order;
    }

    protected function getObjectManager()
    {
        return \Magento\Framework\App\ObjectManager::getInstance();
    }

}

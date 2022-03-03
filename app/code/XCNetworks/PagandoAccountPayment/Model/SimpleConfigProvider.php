<?php

namespace XCNetworks\PagandoAccountPayment\Model;

use Exception;
use Magento\Checkout\Model\ConfigProviderInterface;
use Magento\Payment\Helper\Data as PaymentHelper;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Checkout\Model\Session;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\App\ProductMetadataInterface;
use Magento\Framework\App\Action\Context;
use XCNetworks\PagandoAccountPayment\Model\PagandoAccountPayment;


/**
 * Class SimpleConfigProvider
 * @package XCNetworks\PagandoAccountPayment\Model
 */
class SimpleConfigProvider implements ConfigProviderInterface
{

    protected const API_URI = 'https://api.pagandocheck.com/v1/pagando/';
    protected $methodCode = 'pagandoAccountPayment';
    protected $_scopeConfig;
    protected $_methodInstance;
    protected $_checkoutSession;
    protected $_assetRepo;
    protected $_productMetaData;
    protected $_coreHelper;
    protected $_context;
    protected $_paymentFactory;
    protected $logger;
    protected $countries;
    protected $_apiUri = self::API_URI;

    public $error_msg, $error, $id, $token;
    protected $api_user, $api_pass;


    /**
     * SimpleConfigProvider constructor.
     * @param Context $context
     * @param PaymentHelper $paymentHelper
     * @param ScopeConfigInterface $scopeConfig
     * @param Session $checkoutSession
     * @param Repository $assetRepo
     * @param ProductMetadataInterface $productMetadata
     * @throws \Magento\Framework\Exception\LocalizedException
     */
    public function __construct(
        Context $context,
        Repository $assetRepo,
        Session $checkoutSession,
        PaymentHelper $paymentHelper,
        ScopeConfigInterface $scopeConfig,
        ProductMetadataInterface $productMetadata,
        PagandoAccountPayment $paymentFactory,
        \Psr\Log\LoggerInterface $customLogger

    )
    {
        $this->_context = $context;
        $this->_assetRepo = $assetRepo;
        $this->_scopeConfig = $scopeConfig;
        $this->_methodInstance = $paymentHelper->getMethodInstance($this->methodCode);
        $this->_checkoutSession = $checkoutSession;
        $this->_productMetaData = $productMetadata;
        $this->_paymentFactory = $paymentFactory;
        $this->logger = $customLogger;
        $this->api_user = $this->_scopeConfig->getValue('payment/pagandoAccountPayment/user', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);
        $this->api_pass = $this->_scopeConfig->getValue('payment/pagandoAccountPayment/public_key', \Magento\Store\Model\ScopeInterface::SCOPE_STORE);

    }

    /**
     * @return array
     */

    public function getConfig()
        {
            try {
                if (!$this->_methodInstance->isAvailable()) {
                    return [];
                }

                $data = [
                    'payment' => [
                        $this->methodCode => [
                            'jwt_token' => $this->getToken(),
                            'user' => $this->api_user,
                            'pass' => $this->api_pass,
                            'orderId' => $this->getOrderId(),
                            'incrementId' => $this->getIncrementId()
                        ],
                    ],
                ];

                return $data;
            } catch (\Exception $e) {
                return [];
            }
        }

    public function getToken(){
        $token= '';
        $jwt_token= $this->_paymentFactory->getToken();
        if($jwt_token->error === 0){
            $token= $jwt_token->data->token;
        }

        return $token;
    }

    protected function getObjectManager()
    {
        return \Magento\Framework\App\ObjectManager::getInstance();
    }

    public function getOrderId(){
        $request = $this->getObjectManager()->get('Magento\Framework\App\Request\Http');
        $orderId = $request->getParam('orderId');
    }

    public function getIncrementId(){
        return Mage::getSingleton('checkout/session')->getLastRealOrderId();
    }


}

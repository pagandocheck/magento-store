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

    /**
     * BasicConfigProvider constructor.
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
                        'active' => $this->_scopeConfig->getValue(
                            'payment/pagandoAccountPayment/active',
                            ScopeInterface::SCOPE_STORE
                        ),
                        'order_status' => $this->_scopeConfig->getValue(
                            'payment/pagandoAccountPayment/order_status',
                            ScopeInterface::SCOPE_STORE
                        ),
                        'logoUrl' => $this->_assetRepo->getUrl("XCNetworks_PagandoAccountPayment::images/logo-color.png"),
                        'platform_version' => $this->_productMetaData->getVersion(),
                        'allowed_countries' => $this->_scopeConfig->getValue(
                            'payment/pagandoAccountPayment/specificcountry',
                            ScopeInterface::SCOPE_STORE
                        ),
                        'countries' => $this->getCountries()
                    ],
                    'XCNetworks\PagandoAccountPayment\Model\PagandoAccountPayment::CODE => [
                        'storedCards' => $this->getStoredCards(),
                    ],
                ],
            ];

            return $data;
        } catch (\Exception $e) {
            return [];
        }
    }

    // PagandoAccount
    public function getCountries(){

     // $countries_response = $this->_paymentFactory->request('countries/countries', null, "POST");
     // if(!$res->error) {
      //    $this->countries = $countries_response->data;
     // }
     // echo $this->countries;

      $result = array();
      $result['0'] = "Pais1";
      $result['1'] = "Pais 2";
      return $result;
    }

    public function getStoredCards(){
      $result = array();
      $result['0'] = "Test";
      $result['1'] = "Test1";
      return $result;
    }

}

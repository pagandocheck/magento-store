<?php

namespace XCNetworks\PagandoAccountPayment\Model;

// use Exception;
use Magento\Checkout\Model\ConfigProviderInterface;
/**use Magento\Payment\Helper\Data as PaymentHelper;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Checkout\Model\Session;
use Magento\Framework\View\Asset\Repository;
use Magento\Framework\App\ProductMetadataInterface;
use Magento\Framework\App\Action\Context;
use XCNetworks\PagandoAccountPayment\Model\PagandoAccountPayment;
*/

/**
 * Class SimpleConfigProvider
 * @package XCNetworks\PagandoAccountPayment\Model
 */
class SimpleConfigProvider implements ConfigProviderInterface
{

    protected $_config;

    public function getStoredCards(){
      $result = array();
      $result['0'] = "Test";
      $result['1'] = "Test1";
      return $result;
    }

    public function getConfig()
    {
        $this->_config = [];

        $this->_config = array_merge_recursive($config, [
            'payment' => [
                XCNetworks\PagandoAccountPayment\Model\PagandoAccountPayment::CODE => [
                    'storedCards' => $this->getStoredCards(),
                ],
            ],
        ]);
        return $this->_config;
   }
}

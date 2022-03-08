<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Awesome;

use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;

class Top extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\CsrfAwareActionInterface
{
    private $jsonFactory;

    public function __construct(
        JsonFactory $jsonFactory,
        \Magento\Framework\App\Action\Context $context
    ) {
        $this->jsonFactory = $jsonFactory;
        parent::__construct($context);
    }

    public function execute(): Json
    {
        $request = $this->getObjectManager()->get('Magento\Framework\App\Request\Http');
        $order = $request->getParam('orderId');
        $json = $this->jsonFactory->create();
        $data = [
            'test2' => $order,
        ];
        $json->setData($data);

        return $json;
    }
    protected function getObjectManager()
    {
        return \Magento\Framework\App\ObjectManager::getInstance();
    }

    /** * @inheritDoc */
    public function createCsrfValidationException( RequestInterface $request ): ? InvalidRequestException {
         return null;
    }
     /** * @inheritDoc */
    public function validateForCsrf(RequestInterface $request): ?bool {
        return true;
   }
}

<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Awesome;

use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Tip extends ApiController
{
    private $jsonFactory;

    public function __construct(
        JsonFactory $jsonFactory
    ) {
        $this->jsonFactory = $jsonFactory;
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
}

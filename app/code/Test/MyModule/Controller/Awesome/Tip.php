<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Awesome;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Tip implements HttpGetActionInterface
{
    private $jsonFactory;

    public function __construct(
        JsonFactory $jsonFactory
    ) {
        $this->jsonFactory = $jsonFactory;
    }

    public function execute(): Json
    {
        $order= $this->getRequest()->getParam('order');
        $json = $this->jsonFactory->create();
        $data = [
            'test2' => $order,
        ];
        $json->setData($data);

        return $json;
    }
}

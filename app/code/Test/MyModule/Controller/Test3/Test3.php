<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Test3;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Test3 implements HttpPostActionInterface
{
    private $jsonFactory;

    public function __construct(
        JsonFactory $jsonFactory
    ) {
        $this->jsonFactory = $jsonFactory;
    }

    public function execute(): Json
    {
        $json = $this->jsonFactory->create();
        $data = [
            'test3' => 'test3',
        ];
        $json->setData($data);

        return $json;
    }
}

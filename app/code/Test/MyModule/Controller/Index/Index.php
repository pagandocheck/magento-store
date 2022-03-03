<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Index;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;

class Index implements HttpGetActionInterface
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
            'foo' => 'bar',
        ];
        $json->setData($data);

        return $json;
    }
}
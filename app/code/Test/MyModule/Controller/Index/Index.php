<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Index;

use Magento\Framework\App\Action\HttpGetActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\App\RequestInterface;

class Index implements HttpGetActionInterface
{
    private $jsonFactory;
    protected $request;
    
    public function __construct(
        JsonFactory $jsonFactory,
        RequestInterface $request
    ) {
        $this->jsonFactory = $jsonFactory;
        $this->request = $request;
    }

    public function execute(): Json
    {
        $json = $this->jsonFactory->create();
        $data = [
            'foo' => $this->request->getParam('bar'),
        ];
        $json->setData($data);

        return $json;
    }
}

<?php declare(strict_types=1);

namespace Test\MyModule\Controller\Test3;

use Magento\Framework\App\Action\HttpPostActionInterface;
use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\App\Request\InvalidRequestException;

class Test3 extends \Magento\Framework\App\Action\Action implements CsrfAwareActionInterface
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

    public function createCsrfValidationException(RequestInterface $request): ? InvalidRequestException
    {
      return null;
    }

    public function validateForCsrf(RequestInterface $request): ?bool
    {
         return true;
    }
}

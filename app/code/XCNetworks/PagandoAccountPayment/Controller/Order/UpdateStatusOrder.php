<?php declare(strict_types=1);

namespace XCNetworks\PagandoAccountPayment\Controller\Order;

use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Sales\Model\Order;

abstract class UpdateStatusOrder extends AbstractAction
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
    private function statusExists($orderStatus)
    {
        $statuses = $this->getObjectManager()
            ->get('Magento\Sales\Model\Order\Status')
            ->getResourceCollection()
            ->getData();
        foreach ($statuses as $status) {
            if ($orderStatus === $status["status"]) return true;
        }
        return false;
    }
    protected function getObjectManager()
    {
        return \Magento\Framework\App\ObjectManager::getInstance();
    }
}

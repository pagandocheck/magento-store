<?php

namespace XCNetworks\PagandoPayment\Controller\Checkout;

use Magento\Sales\Model\Order;

class SuccessPagandoAccount extends AbstractAction {


    public function execute($orderStatus) {

        echo 'ENTROOOO AL CODIGO PHP';
        echo $orderStatus;
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

}

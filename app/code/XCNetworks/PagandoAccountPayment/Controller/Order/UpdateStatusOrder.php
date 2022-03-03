<?php declare(strict_types=1);

namespace XCNetworks\PagandoAccountPayment\Controller\Order;

use Magento\Framework\Controller\Result\Json;
use Magento\Framework\Controller\Result\JsonFactory;
use Magento\Sales\Model\Order;
use Magento\Checkout\Model\Session;

class UpdateStatusOrder extends AbstractAction
{
    private $jsonFactory;
    public $error_msg, $error;

    public function __construct(
        JsonFactory $jsonFactory,
        Session $checkoutSession
    ) {
        $this->jsonFactory = $jsonFactory;
        $this->_checkoutSession = $checkoutSession;
    }

    public function execute()
    {
        $request = $this->getObjectManager()->get('Magento\Framework\App\Request\Http');
        $transactionId = $request->getParam('transactionId');
        $orderIdECommerce = $request->getParam('orderIdECommerce');
        $payResponse = $request->getParam('payResponse');

        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $order = $objectManager->create('Magento\Sales\Model\Order')->loadByIncrementId($orderIdECommerce);

        if(!$order) {
            $this->_redirect('checkout/onepage/error', array('_secure'=> false));
            return;
        }

        if ($payResponse == "APPROVED") {

            $orderState = Order::STATE_PROCESSING;

            $orderStatus = 'pagando_processed';
            if (!$this->statusExists($orderStatus)) {
                $orderStatus = $order->getConfig()->getStateDefaultStatus($orderState);
            }

            $order->setState($orderState)
                ->setStatus($orderStatus)
                ->addStatusHistoryComment("Pagando authorization success. Transaction #$transactionId")
                ->setIsCustomerNotified(true);

	        $payment = $order->getPayment();

	        $payment->setTransactionId($transactionId);
	        $payment->addTransaction(\Magento\Sales\Model\Order\Payment\Transaction::TYPE_CAPTURE, null, true);
            $order->save();

            $emailSender = $objectManager->create('\Magento\Sales\Model\Order\Email\Sender\OrderSender');
            $emailSender->send($order);


            $this->messageManager->addSuccess(__("Your payment with Pagando is complete"));
            $this->_redirect('checkout/onepage/success', array('_secure'=> false));
        } else {
            $this->getCheckoutHelper()->cancelCurrentOrder("Order #".($order->getId())." was rejected by Pagando. Transaction #$transactionId.");
            $this->getCheckoutHelper()->restoreQuote(); //restore cart
            $this->messageManager->addError(__("There was an error in the Pagando payment"));
            $this->_redirect('checkout/cart', array('_secure'=> false));
        }
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

    function getEcommerceOrderData($orderId) {

        $res = $this->request('orders/get-order-info?orderId='.$orderId);

        if(!$res->error)
            return $res->data;

        return $res->error;
    }

    function request( $path, $data = [], $type = "GET" )
        {
            $url = 'https://4c10-2806-104e-4-bab-8907-3041-f7b7-5b89.ngrok.io/v1/pagando/orders/get-order-info?orderId=609381cb9e7858ca58dbfebf';

            $headers[] = "Content-Type: application/x-www-form-urlencoded";

            if(!empty($this->_checkoutSession->getToken())){
                $headers[] = "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOiI2MTM2YTQyZDQzNjM0MTU5Nzg1YTU2MmIiLCJ0eXBlIjoiVGVzdCIsImV4cCI6MTY0NjQwOTAyOSwiY2hlY2tvdXQiOiJXT09DT01FUkNFIiwiaWF0IjoxNjQ2MzIyNjI5fQ.cqicrulc1USPkHH_HJ1yfrF5M08iQASG49gssaVdvgE";
            }

            $headers[] = "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdhbml6YXRpb24iOiI2MTM2YTQyZDQzNjM0MTU5Nzg1YTU2MmIiLCJ0eXBlIjoiVGVzdCIsImV4cCI6MTY0NjQwOTAyOSwiY2hlY2tvdXQiOiJXT09DT01FUkNFIiwiaWF0IjoxNjQ2MzIyNjI5fQ.cqicrulc1USPkHH_HJ1yfrF5M08iQASG49gssaVdvgE";
            $settings = array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_HTTPHEADER => $headers,
            );

            if($type != "GET")
            {
                $settings[CURLOPT_CUSTOMREQUEST] = $type;

                if(!empty($data)){
                    $settings[CURLOPT_POSTFIELDS] = http_build_query($data);
                }

            }

            $curl = curl_init();
            curl_setopt_array($curl, $settings);
            $response = curl_exec($curl);
            curl_close($curl);

            $result = json_decode($response);

            $this->error_msg = $result->message;

            $return = new \stdClass();

            if(!empty($result->data)){
                $this->error = 0;
                $return->error = 0;
                $return->data = $result->data;
            } else {
                $this->error = 1;
                $return->error = 1;
                $return->message = $result->message;
            }

            return $return;
        }

}

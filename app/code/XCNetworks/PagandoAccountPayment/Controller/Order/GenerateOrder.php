<?php

namespace XCNetworks\PagandoAccountPayment\Controller\Order;

class GenerateOrder extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\CsrfAwareActionInterface {

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $resultPageFactory;

    /**
     * @var \Magento\Sales\Api\OrderRepositoryInterface
     */
    protected $orderRepository;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
     * @var \Magento\Customer\Model\CustomerFactory
     */
    protected $customerFactory;

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * @var \Magento\Catalog\Api\ProductRepositoryInterface
     */
    protected $customerRepository;

    /**
     * @var \Magento\Quote\Model\QuoteFactory
     */
    protected $quote;

    /**
     * @var \Magento\Quote\Model\QuoteManagement
     */
    protected $quoteManagement;

    /**
     * @var \Magento\Sales\Model\Order\Email\Sender\OrderSender
     */
    protected $orderSender;

    /**
     * @param \Magento\Framework\App\Action\Context               $context
     * @param \Magento\Framework\View\Result\PageFactory          $resultPageFactory
     * @param \Magento\Sales\Api\OrderRepositoryInterface         $orderRepository
     * @param \Magento\Store\Model\StoreManagerInterface          $storeManager
     * @param \Magento\Customer\Model\CustomerFactory             $customerFactory
     * @param \Magento\Catalog\Api\ProductRepositoryInterface     $productRepository
     * @param \Magento\Customer\Api\CustomerRepositoryInterface   $customerRepository
     * @param \Magento\Quote\Model\QuoteFactory                   $quote
     * @param \Magento\Quote\Model\QuoteManagement                $quoteManagement
     * @param \Magento\Sales\Model\Order\Email\Sender\OrderSender $orderSender
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Sales\Api\OrderRepositoryInterface $orderRepository,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Customer\Model\CustomerFactory $customerFactory,
        \Magento\Catalog\Api\ProductRepositoryInterface $productRepository,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository,
        \Magento\Quote\Model\QuoteFactory $quote,
        \Magento\Quote\Model\QuoteManagement $quoteManagement,
        \Magento\Sales\Model\Order\Email\Sender\OrderSender $orderSender
    ) {
        $this->resultPageFactory = $resultPageFactory;
        $this->orderRepository = $orderRepository;
        $this->storeManager = $storeManager;
        $this->customerFactory = $customerFactory;
        $this->productRepository = $productRepository;
        $this->customerRepository = $customerRepository;
        $this->quote = $quote;
        $this->quoteManagement = $quoteManagement;
        $this->orderSender = $orderSender;
        parent::__construct($context);
    }
    /**
     * Hello World Action Page
     *
     * @return void
     */
    public function execute() {
        $orderInfo =[
            'email'        => 'test@gmail.com', //customer email id
            'currency_id'  => 'USD',
            'address' =>[
                'firstname'    => 'Rohan',
                'lastname'     => 'Hapani',
                'prefix' => '',
                'suffix' => '',
                'street' => 'Test Street',
                'city' => 'Miami',
                'country_id' => 'US',
                'region' => 'Florida',
                'region_id' => '18', // State region id
                'postcode' => '98651',
                'telephone' => '1234567890',
                'fax' => '1234567890',
                'save_in_address_book' => 1
            ],
            'items'=>
                [
                    //simple product
                    [
                        'product_id' => '10',
                        'qty' => 10
                    ],
                    //configurable product
                    [
                        'product_id' => '70',
                        'qty' => 2,
                        'super_attribute' => [
                            93 => 52,
                            142 => 167
                        ]
                    ]
                ]
        ];
        $store = $this->storeManager->getStore();
        $storeId = $store->getStoreId();
        $websiteId = $this->storeManager->getStore()->getWebsiteId();
        $customer = $this->customerFactory->create()
        ->setWebsiteId($websiteId)
        ->loadByEmail($orderInfo['email']); // Customer email address
        if(!$customer->getId()){
            /**
             * If Guest customer, Create new customer
             */
            $customer->setStore($store)
                    ->setFirstname($orderInfo['address']['firstname'])
                    ->setLastname($orderInfo['address']['lastname'])
                    ->setEmail($orderInfo['email'])
                    ->setPassword('admin@123');
            $customer->save();
        }
        $quote = $this->quote->create(); //Quote Object
        $quote->setStore($store); //set store for our quote

        /**
         * Registered Customer
         */
        $customer = $this->customerRepository->getById($customer->getId());
        $quote->setCurrency();
        $quote->assignCustomer($customer); //Assign Quote to Customer

        //Add Items in Quote Object
        foreach($orderInfo['items'] as $item){
            $product=$this->productRepository->getById($item['product_id']);
            if(!empty($item['super_attribute']) ) {
                /**
                 * Configurable Product
                 */
                $buyRequest = new \Magento\Framework\DataObject($item);
                $quote->addProduct($product,$buyRequest);
            } else {
                /**
                 * Simple Product
                 */
                $quote->addProduct($product,intval($item['qty']));
            }
        }

        //Billing & Shipping Address to Quote
        $quote->getBillingAddress()->addData($orderInfo['address']);
        $quote->getShippingAddress()->addData($orderInfo['address']);

        // Set Shipping Method
        $shippingAddress = $quote->getShippingAddress();
        $shippingAddress->setCollectShippingRates(true)
                        ->collectShippingRates()
                        ->setShippingMethod('freeshipping_freeshipping'); //shipping method code, Make sure free shipping method is enabled
        $quote->setPaymentMethod('checkmo'); //Payment Method Code, Make sure checkmo payment method is enabled
        $quote->setInventoryProcessed(false);
        $quote->save();
        $quote->getPayment()->importData(['method' => 'checkmo']);

        // Collect Quote Totals & Save
        $quote->collectTotals()->save();
        // Create Order From Quote Object
        $order = $this->quoteManagement->submit($quote);
        // Send Order Email to Customer Email ID
        $this->orderSender->send($order);
        // Get Order Increment ID
        $orderId = $order->getIncrementId();
        if($orderId){
            $result['success'] = $orderId;
        } else {
            $result = [ 'error' => true,'msg' => 'Error occurs for Order placed'];
        }
        print_r($result);
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

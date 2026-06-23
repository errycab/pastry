<?php
// Test full GCash flow

// 1. Create order
$orderPayload = [
    'items' => [[
        'name' => 'Chocolate Ganache Cake',
        'qty' => 3,
        'price' => 100,
        'selectionDetails' => []
    ]],
    'subtotal' => 300,
    'delivery_fee' => 45,
    'total' => 345,
    'method' => 'Deliver',
    'payment' => 'GCash',
    'address' => '123 Test Street',
    'phone' => '09123456789',
    'latitude' => 13.7565,
    'longitude' => 121.0583,
    'customer' => 'Test Customer',
    'email' => 'test@test.com',
    'user_id' => 2
];

echo "=== Testing GCash Payment Flow ===\n\n";
echo "Step 1: Create order\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/Capstone--Development/customer/api_orders.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderPayload));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

$orderResult = json_decode($response, true);
if ($orderResult['status'] === 'success') {
    $orderId = $orderResult['order_id'];
    echo "Order ID: $orderId\n\n";
    
    // 2. Create payment link
    echo "Step 2: Create GCash payment link\n";
    
    $paymentPayload = [
        'order_id' => $orderId,
        'amount' => 345,
        'payment_method' => 'GCash'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost/Capstone--Development/customer/create_payment.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paymentPayload));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Code: $httpCode\n";
    $paymentResult = json_decode($response, true);
    
    if ($httpCode === 200 && !empty($paymentResult['data']['attributes']['checkout_url'])) {
        echo "✓ Payment link created successfully!\n";
        echo "Checkout URL: " . $paymentResult['data']['attributes']['checkout_url'] . "\n";
    } else {
        echo "✗ Payment link creation failed!\n";
        echo "Response: " . json_encode($paymentResult, JSON_PRETTY_PRINT) . "\n";
    }
} else {
    echo "✗ Order creation failed!\n";
    echo "Error: " . ($orderResult['message'] ?? 'Unknown error') . "\n";
}
?>

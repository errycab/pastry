<?php
$products = json_decode(file_get_contents("http://localhost/Capstone--Development/customer/api_products.php"), true);
echo "Total products: " . count($products) . "\n";
echo "First 2 products:\n";
echo json_encode(array_slice($products, 0, 2), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>

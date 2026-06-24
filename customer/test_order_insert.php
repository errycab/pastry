<?php
$conn = mysqli_connect('localhost', 'root', '', 'pastry_db');

// Test a simple insert
$sql = "INSERT INTO orders (items, subtotal, delivery_fee, total, method, payment, address, phone, customer, email, user_id) 
        VALUES ('[{\"name\":\"Test\",\"qty\":1}]', 100, 45, 145, 'Deliver', 'GCash', '123 St', '09123456789', 'Test', 'test@test.com', 2)";

if (mysqli_query($conn, $sql)) {
    echo "Insert successful\n";
    echo "Last ID: " . mysqli_insert_id($conn) . "\n";
} else {
    echo "Insert failed: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
?>

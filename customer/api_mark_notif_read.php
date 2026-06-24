<?php
require_once __DIR__ . '/cors.php';

error_reporting(0);
ini_set('display_errors', 0);

session_start();

try {
    $conn = mysqli_connect("localhost", "root", "", "pastry_db");
    if (!$conn) {
        throw new Exception("Database Connection Failed");
    }

    if (empty($_POST['order_id'])) {
        throw new Exception("Order ID is required");
    }

    $order_id = (int)$_POST['order_id'];
    
    // Mark order as having notifications read
    $sql = "UPDATE orders SET notif_viewed = 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $order_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to update notification");
    }

    echo json_encode([
        "status" => "success",
        "message" => "Notification marked as read"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>


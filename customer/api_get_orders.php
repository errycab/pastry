<?php
require_once __DIR__ . '/cors.php';

error_reporting(0);
ini_set('display_errors', 0);

try {
    // Connect to database
    $conn = mysqli_connect("localhost", "root", "", "pastry_db");
    if (!$conn) {
        throw new Exception("Database Connection Failed: " . mysqli_connect_error());
    }

    // Detect available columns in orders and order_items tables
    $hasCustomer = false;
    $hasEmail = false;
    $hasOrderItems = false;

    $columnsRes = mysqli_query($conn, "SHOW COLUMNS FROM orders");
    if ($columnsRes) {
        while ($col = mysqli_fetch_assoc($columnsRes)) {
            if ($col['Field'] === 'customer') {
                $hasCustomer = true;
            }
            if ($col['Field'] === 'email') {
                $hasEmail = true;
            }
        }
    }

    $tablesRes = mysqli_query($conn, "SHOW TABLES LIKE 'order_items'");
    if ($tablesRes && mysqli_num_rows($tablesRes) > 0) {
        $hasOrderItems = true;
    }

    // Get user_id from query parameter or POST data (for filtering customer's own orders)
    $user_id = null;
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $user_id = intval($data['user_id'] ?? $_GET['user_id'] ?? 0);
    } elseif (!empty($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);
    }

    // Fetch orders: filter by user_id if provided (for customers), otherwise return all (for admin panel)
    if ($user_id > 0) {
        $sql = "SELECT * FROM orders WHERE user_id = $user_id ORDER BY created_at DESC";
    } else {
        $sql = "SELECT * FROM orders ORDER BY created_at DESC";
    }
    $res = mysqli_query($conn, $sql);

    if (!$res) {
        throw new Exception("SQL Error: " . mysqli_error($conn));
    }

    $orders = [];
    while ($row = mysqli_fetch_assoc($res)) {
        // Fetch the order's item lines from order_items when available.
        // If order_items does not exist, try to parse the JSON items field from orders.
        $items = [];
        if ($hasOrderItems) {
            $itemsRes = mysqli_query($conn, "SELECT product, qty, price FROM order_items WHERE order_id = " . intval($row['id']));
            if ($itemsRes) {
                while ($itemRow = mysqli_fetch_assoc($itemsRes)) {
                    $items[] = [
                        "name" => $itemRow['product'],
                        "product" => $itemRow['product'],
                        "qty" => intval($itemRow['qty']),
                        "price" => floatval($itemRow['price']),
                    ];
                }
            }
        } elseif (isset($row['items']) && $row['items'] !== '') {
            $decoded = json_decode($row['items'], true);
            if (is_array($decoded)) {
                $items = $decoded;
            }
        }

        $orders[] = [
            "id" => intval($row['id']),
            "user_id" => intval($row['user_id'] ?? 0),
            "customer" => $hasCustomer ? ($row['customer'] ?? '') : '',
            "email" => $hasEmail ? ($row['email'] ?? '') : '',
            "items" => $items,
            "total" => floatval($row['total']),
            "payment" => $row['payment'] ?? '',
            "address" => $row['address'] ?? '',
            "notes" => $row['notes'] ?? '',
            "status" => $row['status'] ?? 'Pending', // default to Pending if status not set
            "order_date" => $row['order_date'] ?? '',
            "created_at" => $row['created_at'] ?? '',
            // expose notif_viewed so front-end can compute unread count
            "notif_viewed" => isset($row['notif_viewed']) ? (int)$row['notif_viewed'] : 0,
        ];
    }

    echo json_encode($orders);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

?>

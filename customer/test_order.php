<?php
// Simple same-origin test endpoint to verify session and XSRF behavior
error_reporting(E_ALL);
ini_set('display_errors', 1);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$debugFile = __DIR__ . '/debug_test_order.log';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
require_once __DIR__ . '/cors.php';


// Log incoming request details
$entry = [
    'ts' => date('c'),
    'method' => $_SERVER['REQUEST_METHOD'] ?? '',
    'origin' => $origin,
    'headers' => getallheaders(),
    'cookies' => $_COOKIE,
    'session_id' => session_id(),
    'raw_body' => file_get_contents('php://input')
];
file_put_contents($debugFile, json_encode($entry) . PHP_EOL, FILE_APPEND);

// Echo back the info for quick verification
echo json_encode(['status'=>'ok','entry'=>$entry]);

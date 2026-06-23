<?php
header('Content-Type: application/json');

require_once __DIR__ . '/includes/db.php';

$input = file_get_contents('php://input');
$post = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== false) {
    $post = json_decode($input, true) ?: [];
} else {
    $post = $_POST;
}

$name = trim($post['name'] ?? '');
$email = trim($post['email'] ?? '');
$password = trim($post['password'] ?? '');
$agreeTerms = isset($post['agree_terms']) && $post['agree_terms'];
$agreePrivacy = isset($post['agree_privacy']) && $post['agree_privacy'];

if (!$agreeTerms || !$agreePrivacy) {
    echo json_encode(['success' => false, 'message' => 'You must agree to the Terms & Conditions and Privacy Policy.']);
    exit;
}

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please use a valid email address.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit;
}

// Ensure users table exists
mysqli_query($conn, "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$emailEscaped = mysqli_real_escape_string($conn, $email);
$check = mysqli_query($conn, "SELECT id FROM users WHERE email='$emailEscaped' LIMIT 1");
if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode(['success' => false, 'message' => 'Email already exists.']);
    exit;
}

$hashed = mysqli_real_escape_string($conn, password_hash($password, PASSWORD_DEFAULT));
$insert = mysqli_query($conn, "INSERT INTO users (name, email, password, role) VALUES ('" . mysqli_real_escape_string($conn, $name) . "', '$emailEscaped', '$hashed', 'customer')");

if (!$insert) {
    echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);
    exit;
}

echo json_encode(['success' => true]);
exit;

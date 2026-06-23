<?php
header('Content-Type: application/json');
if (
    $_SERVER['REQUEST_METHOD'] === 'POST' ||
    $_SERVER['REQUEST_METHOD'] === 'GET'
) {
    echo json_encode([
        'method' => $_SERVER['REQUEST_METHOD'],
        'cookies' => $_COOKIE,
        'body' => file_get_contents('php://input'),
        'uri' => $_SERVER['REQUEST_URI'],
    ]);
    exit;
}
http_response_code(405);
echo json_encode(['error' => 'method not allowed']);

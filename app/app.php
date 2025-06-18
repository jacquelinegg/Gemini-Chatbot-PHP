<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

// Debug режим
ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method Not Allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON']));
}

$message = $input['message'] ?? '';
if (empty($message)) {
    http_response_code(400);
    die(json_encode(['error' => 'Empty message']));
}

$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => $message]
            ]
        ]
    ]
];

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => GEMINI_API_URL . '?key=' . GEMINI_API_KEY,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    http_response_code(500);
    die(json_encode(['error' => 'CURL Error: ' . curl_error($ch)]));
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if ($httpCode !== 200) {
    http_response_code($httpCode);
    die(json_encode(['error' => 'API Error: ' . $response]));
}

curl_close($ch);


echo $response;
?>
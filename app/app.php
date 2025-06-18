<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

// 1. Проверка на HTTP метода
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('{"error":"Only POST method is allowed"}');
}

// 2. Входни данни
$input = json_decode(file_get_contents('php://input'), true);
if (empty($input['message'])) {
    http_response_code(400);
    die('{"error":"Message is required"}');
}

// 3. Подготовка на заявката
$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => $input['message']]
            ]
        ]
    ]
];

// 4. Изпращане към Gemini API
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => GEMINI_API_URL . '?key=' . GEMINI_API_KEY,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($data)
]);

$response = curl_exec($ch);
curl_close($ch);

// 5. Извличане само на текста
$responseData = json_decode($response, true);
$botMessage = $responseData['candidates'][0]['content']['parts'][0]['text'];

// 6. Връщане на чист текст (не JSON)
header('Content-Type: text/plain');
echo $botMessage;
?>
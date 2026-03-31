<?php
header('Content-Type: application/json');

$exam = isset($_GET['exam']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['exam']) : '';

if ($exam === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing exam parameter.']);
  exit;
}

$baseDir = dirname(__DIR__);
$examFile = $baseDir . DIRECTORY_SEPARATOR . $exam . '.json';

if (!file_exists($examFile)) {
  http_response_code(404);
  echo json_encode(['error' => 'Exam not found.']);
  exit;
}

$content = file_get_contents($examFile);
$examData = json_decode($content, true);

if (!$examData) {
  http_response_code(500);
  echo json_encode(['error' => 'Invalid exam JSON.']);
  exit;
}

echo json_encode($examData);

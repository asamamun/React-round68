<?php
header('Content-Type: application/json');

$exam = isset($_GET['exam']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['exam']) : '';

if ($exam === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing exam parameter.']);
  exit;
}

$baseDir = dirname(__DIR__);
$resultFile = $baseDir . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'results_' . $exam . '.json';

if (!file_exists($resultFile)) {
  echo json_encode([]);
  exit;
}

$results = json_decode(file_get_contents($resultFile), true);
if (!is_array($results)) {
  echo json_encode([]);
  exit;
}

usort($results, function ($a, $b) {
  if ($a['score'] === $b['score']) {
    return strcmp($a['submittedAt'], $b['submittedAt']);
  }
  return $b['score'] <=> $a['score'];
});

echo json_encode($results);

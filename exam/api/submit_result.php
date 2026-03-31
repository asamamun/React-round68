<?php
header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!$payload) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON payload.']);
  exit;
}

$examId = isset($payload['examId']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $payload['examId']) : '';
$studentName = trim($payload['studentName'] ?? '');
$studentId = trim($payload['studentId'] ?? '');
$answers = $payload['answers'] ?? null;

if ($examId === '' || $studentName === '' || $studentId === '' || !is_array($answers)) {
  http_response_code(422);
  echo json_encode(['error' => 'Missing required fields.']);
  exit;
}

$baseDir = dirname(__DIR__);
$examFile = $baseDir . DIRECTORY_SEPARATOR . $examId . '.json';
$resultsDir = $baseDir . DIRECTORY_SEPARATOR . 'data';
$resultFile = $resultsDir . DIRECTORY_SEPARATOR . 'results_' . $examId . '.json';

if (!file_exists($examFile)) {
  http_response_code(404);
  echo json_encode(['error' => 'Exam not found.']);
  exit;
}

$examData = json_decode(file_get_contents($examFile), true);
if (!$examData || !isset($examData['questions']) || !is_array($examData['questions'])) {
  http_response_code(500);
  echo json_encode(['error' => 'Corrupted exam data.']);
  exit;
}

$score = 0;
foreach ($examData['questions'] as $q) {
  $qid = (string)$q['id'];
  if (isset($answers[$qid]) && (int)$answers[$qid] === (int)$q['answer']) {
    $score++;
  }
}

if (!is_dir($resultsDir)) {
  mkdir($resultsDir, 0777, true);
}

$results = [];
if (file_exists($resultFile)) {
  $parsed = json_decode(file_get_contents($resultFile), true);
  if (is_array($parsed)) {
    $results = $parsed;
  }
}

$normalizedStudentId = strtolower($studentId);
foreach ($results as $attempt) {
  $existingId = strtolower(trim($attempt['studentId'] ?? ''));
  if ($existingId !== '' && $existingId === $normalizedStudentId) {
    http_response_code(409);
    echo json_encode(['error' => 'This student ID has already attempted this exam.']);
    exit;
  }
}

$results[] = [
  'studentName' => $studentName,
  'studentId' => $studentId,
  'score' => $score,
  'totalMarks' => count($examData['questions']),
  'submittedAt' => date('Y-m-d H:i:s'),
];

file_put_contents($resultFile, json_encode($results, JSON_PRETTY_PRINT));

echo json_encode([
  'message' => 'Result saved.',
  'score' => $score,
  'totalMarks' => count($examData['questions']),
]);

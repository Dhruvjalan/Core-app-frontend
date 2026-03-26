#!/bin/bash


BACKEND_URL="${VITE_PROD_BACKEND_URL}"
ROLL_NO="${TEST_ROLL_NO}"
TEST_EMAIL="${TEST_ROLL_NO}@smail.iitm.ac.in"

echo "Starting Backend Health Check..."

sleep 5

echo "Checking User: $ROLL_NO"
USER_CHECK=$(curl -s -X GET "$BACKEND_URL/api/check-user/$ROLL_NO")

EXISTS=$(echo "$USER_CHECK" | jq '.exists')

if [ "$EXISTS" = "true" ]; then
  echo "User check passed."
else
  echo "User check failed! Response: $USER_CHECK"
  exit 1
fi

echo "Performing Search on e21-students..."
SEARCH_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/records/search" \
     -H "Content-Type: application/json" \
     -d "{\"dbName\":\"e21-students\", \"filters\":{}}")

RECORD_COUNT=$(echo "$SEARCH_RESPONSE" | jq '. | length')

if [ "$RECORD_COUNT" -eq 50 ]; then
  echo "Search passed. Found exactly $RECORD_COUNT records."
else
  echo "Search failed! Expected 50 records, but found: $RECORD_COUNT"
  # Print the first bit of the response to help debug
  echo "Preview: $(echo "$SEARCH_RESPONSE" | cut -c1-100)..."
  exit 1
fi

echo "All tests passed! Production is healthy"
exit 0
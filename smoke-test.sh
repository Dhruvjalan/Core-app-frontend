#!/bin/bash

# Configuration
BACKEND_URL="http://13.61.239.146:3000"
TEST_EMAIL="ed24b047@smail.iitm.ac.in"
ROLL_NO="ed24b047"

echo "🚀 Starting Backend Health Check..."

# Wait 5 seconds to ensure PM2 has finished restarting the backend
sleep 5

# 1. Test Login/User Check Endpoint
echo "🔍 Checking User: $ROLL_NO"
USER_CHECK=$(curl -s -X GET "$BACKEND_URL/api/check-user/$ROLL_NO")

# Use jq to check the 'exists' boolean
EXISTS=$(echo "$USER_CHECK" | jq '.exists')

if [ "$EXISTS" = "true" ]; then
  echo "✅ User check passed."
else
  echo "❌ User check failed! Response: $USER_CHECK"
  exit 1
fi

# 2. Test Search Endpoint
echo "🔍 Performing Search on e21-students..."
SEARCH_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/records/search" \
     -H "Content-Type: application/json" \
     -d "{\"dbName\":\"e21-students\", \"filters\":{}}")

# Use jq to count the number of objects in the returned array
RECORD_COUNT=$(echo "$SEARCH_RESPONSE" | jq '. | length')

if [ "$RECORD_COUNT" -eq 50 ]; then
  echo "✅ Search passed. Found exactly $RECORD_COUNT records."
else
  echo "❌ Search failed! Expected 50 records, but found: $RECORD_COUNT"
  # Print the first bit of the response to help debug
  echo "Preview: $(echo "$SEARCH_RESPONSE" | cut -c1-100)..."
  exit 1
fi

echo "🎉 All tests passed! Production is healthy."
exit 0
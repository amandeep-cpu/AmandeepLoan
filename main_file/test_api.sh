#!/bin/bash

echo "========================================="
echo "AmandeeoLoan API - Test Suite"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"

echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq '.'
echo ""
echo ""

echo "2. Testing Signup..."
SIGNUP=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }')
echo "$SIGNUP" | jq '.'
TOKEN=$(echo "$SIGNUP" | jq -r '.token')
echo "Token: $TOKEN"
echo ""
echo ""

echo "3. Testing Get Current User..."
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""
echo ""

echo "4. Testing Create Loan..."
USER_ID=$(echo "$SIGNUP" | jq -r '.user.id')
curl -s -X POST "$BASE_URL/api/loans" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"loanAmount\": 5000,
    \"interestRate\": 8.5,
    \"loanTerm\": 24,
    \"description\": \"Test loan\"
  }" | jq '.'
echo ""
echo ""

echo "========================================="
echo "All tests completed!"
echo "========================================="

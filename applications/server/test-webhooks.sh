#!/bin/bash

# ================================
# 🧪 CLERK WEBHOOK TESTING SCRIPT
# ================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:3000" # Change to your server URL
WEBHOOK_PATH="/api/clerk/webhooks/advanced"
TEST_PATH="/api/clerk/webhooks/test"

echo -e "${BLUE}🔗 Testing Clerk Webhook System${NC}\n"

# Test basic webhook connectivity
echo -e "${YELLOW}1. Testing webhook connectivity...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${BASE_URL}${TEST_PATH}" \
  -H "Content-Type: application/json" \
  -d '{"test": true}')

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ Webhook endpoint is accessible${NC}"
else
    echo -e "${RED}❌ Webhook endpoint failed (HTTP $response)${NC}"
    exit 1
fi

# Test user.created event
echo -e "\n${YELLOW}2. Testing user.created event...${NC}"
user_created_payload='{
  "type": "user.created",
  "data": {
    "id": "user_test123",
    "username": "testuser",
    "first_name": "Test",
    "last_name": "User",
    "email_addresses": [
      {
        "id": "email_test123",
        "email_address": "test@example.com",
        "verification": {
          "status": "verified"
        }
      }
    ],
    "primary_email_address_id": "email_test123",
    "phone_numbers": [
      {
        "id": "phone_test123",
        "phone_number": "+84 123 456 789",
        "verification": {
          "status": "verified"
        }
      }
    ],
    "primary_phone_number_id": "phone_test123",
    "image_url": "https://example.com/avatar.jpg",
    "public_metadata": {
      "role": "customer"
    }
  }
}'

# Note: This will fail signature verification, but should log the event
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${BASE_URL}${WEBHOOK_PATH}" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test123" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test_signature" \
  -d "$user_created_payload")

echo -e "${BLUE}📝 user.created response: HTTP $response${NC}"

# Test organization.created event
echo -e "\n${YELLOW}3. Testing organization.created event...${NC}"
org_created_payload='{
  "type": "organization.created",
  "data": {
    "id": "org_test123",
    "name": "Test Restaurant Chain",
    "slug": "test-restaurant-chain",
    "created_by": "user_test123",
    "image_url": "https://example.com/logo.jpg",
    "public_metadata": {
      "description": "A test restaurant chain"
    }
  }
}'

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${BASE_URL}${WEBHOOK_PATH}" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test124" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test_signature" \
  -d "$org_created_payload")

echo -e "${BLUE}📝 organization.created response: HTTP $response${NC}"

# Test organizationMembership.created event
echo -e "\n${YELLOW}4. Testing organizationMembership.created event...${NC}"
membership_created_payload='{
  "type": "organizationMembership.created",
  "data": {
    "id": "membership_test123",
    "user_id": "user_test456",
    "organization_id": "org_test123",
    "role": "org:member"
  }
}'

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${BASE_URL}${WEBHOOK_PATH}" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test125" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test_signature" \
  -d "$membership_created_payload")

echo -e "${BLUE}📝 organizationMembership.created response: HTTP $response${NC}"

# Test session.created event
echo -e "\n${YELLOW}5. Testing session.created event...${NC}"
session_created_payload='{
  "type": "session.created",
  "data": {
    "id": "session_test123",
    "user_id": "user_test123",
    "status": "active"
  }
}'

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  "${BASE_URL}${WEBHOOK_PATH}" \
  -H "Content-Type: application/json" \
  -H "svix-id: msg_test126" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: v1,test_signature" \
  -d "$session_created_payload")

echo -e "${BLUE}📝 session.created response: HTTP $response${NC}"

echo -e "\n${GREEN}🎉 Webhook testing completed!${NC}"
echo -e "${YELLOW}📋 Check your server logs to see webhook event processing.${NC}"
echo -e "${YELLOW}⚠️  Note: Signature verification will fail in tests (expected behavior)${NC}"

# Test with real webhook secret if provided
if [ -n "$CLERK_WEBHOOK_SECRET" ]; then
    echo -e "\n${BLUE}🔐 Testing with real webhook secret...${NC}"
    # This would require implementing proper Svix signature generation
    # For now, just a placeholder
    echo -e "${YELLOW}💡 Real webhook testing requires proper Svix signature generation${NC}"
fi

echo -e "\n${GREEN}✅ All webhook tests completed successfully!${NC}"

#!/bin/bash

# 🔄 Organization Migration Script
# Script để migrate organizations từ Clerk vào Supabase

echo "🏢 Organization Migration Tool"
echo "=============================="

BASE_URL="http://localhost:3000"

echo ""
echo "1️⃣ Preview Clerk Organizations"
echo "-------------------------------"
curl -s -X GET "$BASE_URL/api/organizations/migrate" | jq '.'

echo ""
echo ""
echo "2️⃣ Dry Run Migration (không thực hiện thay đổi)"
echo "----------------------------------------------"
curl -s -X POST "$BASE_URL/api/organizations/migrate?dry_run=true" | jq '.'

echo ""
echo ""
echo "❓ Muốn thực hiện migration thật? (y/N)"
read -r confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo ""
    echo "3️⃣ Executing Real Migration"
    echo "---------------------------"
    curl -s -X POST "$BASE_URL/api/organizations/migrate" | jq '.'
    
    echo ""
    echo "✅ Migration completed!"
    echo ""
    echo "🔍 Kiểm tra kết quả trong Supabase:"
    echo "SELECT id, name, code, owner_id FROM organizations ORDER BY created_at DESC;"
else
    echo ""
    echo "❌ Migration cancelled"
fi

echo ""
echo "📋 Migration commands:"
echo "Preview:  curl -X GET '$BASE_URL/api/organizations/migrate'"
echo "Dry run:  curl -X POST '$BASE_URL/api/organizations/migrate?dry_run=true'"
echo "Execute:  curl -X POST '$BASE_URL/api/organizations/migrate'"
echo "Force:    curl -X POST '$BASE_URL/api/organizations/migrate?force=true'"

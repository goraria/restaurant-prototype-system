// ================================
// DEPRECATED: Clerk Organization Sync
// ================================
// NOTE: Schema mới không bao gồm clerk_org_id field
// File này được giữ lại để tham khảo, nhưng sẽ không hoạt động với schema hiện tại
// 
// Schema hiện tại:
// model organizations {
//   id          String              @id @default(uuid()) @db.Uuid
//   name        String              @db.VarChar(100)
//   code        String              @unique @db.VarChar(30)
//   description String?             @db.Text
//   logo_url    String?             @db.VarChar(255)
//   owner_id    String              @db.Uuid
//   created_at  DateTime            @default(now()) @db.Timestamptz(6)
//   updated_at  DateTime            @default(now()) @db.Timestamptz(6)
//   owner       users               @relation("organizations_owner", fields: [owner_id], references: [id])
//   chains      restaurant_chains[]
//   restaurants restaurants[]
// }
//
// Để đồng bộ với Clerk, bạn có thể:
// 1. Thêm clerk_org_id field vào schema
// 2. Hoặc sử dụng metadata/external_ids để map
// 3. Hoặc quản lý organizations độc lập không cần Clerk sync

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    error: 'Clerk organization sync is deprecated',
    message: 'Current schema does not include clerk_org_id field',
    suggestion: 'Use /api/organizations endpoint for direct organization management',
    schema_note: 'Organizations are now managed independently without Clerk sync'
  }, { status: 410 }); // 410 Gone
}

export async function DELETE() {
  return NextResponse.json({
    error: 'Clerk organization sync is deprecated',
    message: 'Current schema does not include clerk_org_id field'
  }, { status: 410 }); // 410 Gone
}

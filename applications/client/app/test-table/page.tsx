"use client"

import { DataTableJaptor, columns, Payment } from "@/components/tables/japtor"

// Sample data for testing
const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
    user: "Ken Nguyen",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com", 
    user: "Abe Lincoln",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
    user: "Monserrat Smith",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
    user: "Silas Johnson",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
    user: "Carmella Brown",
  },
]

export default function TestTablePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Test Data Table with Filters</h1>
      <DataTableJaptor columns={columns} data={data} />
    </div>
  )
}

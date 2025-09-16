"use client"

import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "@/components/tables/japtor"
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { DataTableCustom, Payment } from "@/components/tables/custom";
import { DataTableJaptor } from "@/components/tables/japtor";
import { ConfirmDialog } from "@/components/elements/confirm-dialog";
import { FormWizard } from "@/components/elements/form-wizard";
import { ModeToggle } from "@/components/elements/mode-toggle";

import {
  useGraphqlFirstQuery,
  useGraphqlSecondMutation
} from "@/state/api";

export default function Page() {
  const data: Payment[] = [
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "success",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "failed",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "processing",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "failed",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "pending",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "failed",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "success",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "processing",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "failed",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "processing",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "pending",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "pending",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "success",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "success",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "processing",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "failed",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "failed",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "pending",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "processing",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "success",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "failed",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "pending",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "processing",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "processing",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "failed",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "pending",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "pending",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "processing",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "success",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "success",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "failed",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "processing",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "pending",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "processing",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "pending",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "failed",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "failed",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "processing",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "pending",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "failed",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "pending",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "processing",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "success",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "success",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "processing",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "success",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "pending",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "processing",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "pending",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "pending",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "success",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "processing",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "pending",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "pending",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "pending",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "failed",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "success",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "processing",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "processing",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "success",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "success",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "success",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "processing",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "failed",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "pending",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "pending",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "failed",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "processing",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "pending",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "processing",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "pending",
      email: "u@example.com",
    },
    {
      id: "728ed52f",
      amount: 1000,
      user: "Japtor",
      status: "success",
      email: "m@example.com",
    },
    {
      id: "728ed32f",
      amount: 900,
      user: "Ichibulup",
      status: "failed",
      email: "x@example.com",
    },
    {
      id: "718ed52f",
      amount: 102,
      user: "Waddles",
      status: "processing",
      email: "t@example.com",
    },
    {
      id: "928ed50f",
      amount: 120,
      user: "Goraria",
      status: "pending",
      email: "g@example.com",
    },
    {
      id: "428ed51f",
      amount: 420,
      user: "Destine",
      status: "failed",
      email: "q@example.com",
    },
    {
      id: "718ed52f",
      amount: 602,
      user: "Einmalow",
      status: "success",
      email: "l@example.com",
    },
    {
      id: "928ed50f",
      amount: 190,
      user: "Frozthew",
      status: "pending",
      email: "k@example.com",
    },
    {
      id: "428ed51f",
      amount: 320,
      user: "Nobody",
      status: "success",
      email: "u@example.com",
    },
    // ...
  ]

  const query = `query GetMenuItems($menu_id: ID) {
    menuItems(menu_id: $menu_id) {
      id
      name
      description
      price
      is_available
      is_featured
      display_order
    }
  }`

  const { data: menuItems } = useGraphqlFirstQuery({
    query,
    variables: { menu_id: "e1f9375a-7de2-4c3b-9c8d-394f3d4ee292" }, // Provide a sample menu_id
    // operationName: "MenuItems",
  });

  console.log(menuItems)

  return (
    <div className="container-wrapper p-6 gap-6 space-y-6 border-none">
      <FormWizard/>
      <Card className="p-4 py-0">
        {/* <DataTableViewOptions table={table} /> */}
        <DataTableCustom columns={columns} data={data} />
        {/* <DataTablePagination table={table} /> */}
      </Card>

      <div className="p-4"> {/** container mx-auto py-10 */}
        <ModeToggle/>
      </div>

      <DataTableJaptor columns={columns} data={data} />

      <Card className="flex p-6">
        <ConfirmDialog />

        {/*<ConfirmDialog*/}
        {/*  trigger={() => (<Button variant="">Xác nhận</Button>)}*/}
        {/*  title="Xác nhận thay đổi mục này?"*/}
        {/*  description="Thay đổi có thể hoàn tác."*/}
        {/*  confirmText="Xoá"*/}
        {/*  cancelText="Huỷ"*/}
        {/*/>*/}
      </Card>
    </div>
  )
}

// export function Index() {
//   const data = [
//     { email: "alice@example.com" },
//     { email: "bob@example.com" },
//     { email: "charlie@example.com" },
//   ];

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className="container-wrapper p-6 gap-6 border-none">
//       <Card className="p-4">
//         <DataTableViewOptions table={table} />
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {table.getHeaderGroups()[0].headers.map(header => (
//                 <TableHead key={header.id}>
//                   {header.isPlaceholder ? null : header.column.columnDef.header({ column: header.column })}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.map(row => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map(cell => (
//                   <TableCell key={cell.id}>{cell.getValue()}</TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         <DataTablePagination table={table} />
//       </Card>

//     </div>
//   )
// }
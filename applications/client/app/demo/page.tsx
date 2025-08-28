// "use client"

import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "@/components/tables/custom"
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

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
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
    // ...
  ]
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container-wrapper p-6 gap-6 border-none">
      <Card className="p-4 py-0">
        {/* <DataTableViewOptions table={table} /> */}
        <DataTableCustom columns={columns} data={data} />
        {/* <DataTablePagination table={table} /> */}
      </Card>

      <div className=""> {/** container mx-auto py-10 */}
      </div>
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
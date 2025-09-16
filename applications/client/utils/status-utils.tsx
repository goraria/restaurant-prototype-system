import { Badge } from "@/components/elements/badge";
import {
  CheckCircle,
  Users,
  Calendar,
  AlertTriangle,
} from "lucide-react"
import { TableDataColumn } from "@/constants/interfaces";

export function getUserStatus(status: string): { text: string; color: string } {
  switch (status) {
    case "active":
      return { text: "Hoạt động", color: "text-green-500" };
    case "offline":
      return { text: "Ngoại tuyến", color: "text-gray-500" };
    case "idle":
      return { text: "Không hoạt động", color: "text-yellow-500" };
    case "invisible":
      return { text: "Ẩn trạng thái", color: "text-gray-400" };
    default:
      return { text: "Không xác định", color: "text-gray-400" };
  }
}

export function getTableStatus(status: TableDataColumn['status']) {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Trống</Badge>
    case 'occupied':
      return <Badge className="bg-red-100 text-red-800"><Users className="w-3 h-3 mr-1" />Có khách</Badge>
    case 'reserved':
      return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Đã đặt</Badge>
    case 'maintenance':
      return <Badge className="bg-gray-100 text-gray-800"><AlertTriangle className="w-3 h-3 mr-1" />Bảo trì</Badge>
    case 'out_of_order':
      return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Hỏng</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}
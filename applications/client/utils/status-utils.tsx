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
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react"

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: HelpCircle,
  },
  {
    value: "processing",
    label: "Processing",
    icon: Timer,
  },
  {
    value: "success",
    label: "Success",
    icon: CheckCircle,
  },
  {
    value: "failed",
    label: "Failed",
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
]

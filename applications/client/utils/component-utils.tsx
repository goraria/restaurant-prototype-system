import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

// Booking Status Badge
export function badgeBookingStatus(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Confirmed
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Canceled
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Unknown
        </Badge>
      );
  }
}

// Payment Status Badge
export function badgePaymentStatus(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    case "refunded":
      return (
        <Badge variant="secondary" className="gap-1">
          <DollarSign className="h-3 w-3" />
          Refunded
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Unknown
        </Badge>
      );
  }
}

// Order Status Badge
export function badgeOrderStatus(status: string) {
  switch (status) {
    case "preparing":
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Preparing
        </Badge>
      );
    case "ready":
      return (
        <Badge variant="outline" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Ready
        </Badge>
      );
    case "served":
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Served
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Canceled
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Unknown
        </Badge>
      );
  }
}

// Priority Badge
export function badgePriority(priority: string) {
  switch (priority) {
    case "high":
      return (
        <Badge variant="destructive">
          High Priority
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="default">
          Medium Priority
        </Badge>
      );
    case "low":
      return (
        <Badge variant="secondary">
          Low Priority
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          Normal
        </Badge>
      );
  }
}
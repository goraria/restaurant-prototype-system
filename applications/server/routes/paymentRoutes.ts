import Router from "express";
import {
  momoPayment,
  momoCallback,
  momoTransactionStatus,
  zalopayPayment,
  zalopayCallback,
  zalopayCheckStatus,
  vnpayPayment,
  vnpayCallback,
} from "@/controllers/paymentControllers";

const router = Router();

router.post("/momo", momoPayment);
router.post("/momo/callback", momoCallback);
router.post("/momo/transaction-status", momoTransactionStatus);

router.post("/zalopay", zalopayPayment);
router.post("/zalopay/callback", zalopayCallback);
router.post("/zalopay/check-status/:id", zalopayCheckStatus);

router.post("/vnpay", vnpayPayment);
router.post("/vnpay/callback", vnpayCallback);

export default router;
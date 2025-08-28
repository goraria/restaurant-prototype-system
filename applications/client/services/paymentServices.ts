import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

// Payment records
export async function listPayments(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.listPayments.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createPaymentRecord(dispatch: AppDispatch, data: any) {
  const action = endpoints.createPaymentRecord.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function paymentAnalytics(dispatch: AppDispatch) {
  const action = endpoints.paymentAnalytics.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getPaymentDetail(dispatch: AppDispatch, id: string) {
  const action = endpoints.getPaymentDetail.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updatePaymentRecord(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updatePaymentRecord.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function refundPayment(dispatch: AppDispatch, id: string) {
  const action = endpoints.refundPayment.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

// Purchases (gateway)
export async function momoPayment(dispatch: AppDispatch, data: any) {
  const action = endpoints.momoPayment.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function momoCallback(dispatch: AppDispatch, data: any) {
  const action = endpoints.momoCallback.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function momoTransactionStatus(dispatch: AppDispatch, data: any) {
  const action = endpoints.momoTransactionStatus.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function zalopayPayment(dispatch: AppDispatch, data: any) {
  const action = endpoints.zalopayPayment.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function zalopayCallback(dispatch: AppDispatch, data: any) {
  const action = endpoints.zalopayCallback.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function zalopayCheckStatus(dispatch: AppDispatch, id: string) {
  const action = endpoints.zalopayCheckStatus.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function vnpayPayment(dispatch: AppDispatch, data: any) {
  const action = endpoints.vnpayPayment.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function vnpayCallback(dispatch: AppDispatch, data: any) {
  const action = endpoints.vnpayCallback.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}



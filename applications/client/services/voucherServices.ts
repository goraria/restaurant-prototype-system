import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

export async function createVoucher(dispatch: AppDispatch, data: any) {
  const action = endpoints.createVoucher.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getVouchers(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getVouchers.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getVoucherById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getVoucherById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getVoucherByCode(dispatch: AppDispatch, code: string) {
  const action = endpoints.getVoucherByCode.initiate(code);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateVoucher(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateVoucher.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteVoucher(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteVoucher.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function hardDeleteVoucher(dispatch: AppDispatch, id: string) {
  const action = endpoints.hardDeleteVoucher.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function validateVoucher(dispatch: AppDispatch, data: any) {
  const action = endpoints.validateVoucher.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function useVoucher(dispatch: AppDispatch, data: any) {
  const action = endpoints.useVoucher.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}



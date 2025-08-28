import { endpoints } from "../lib/schema-utils";
import type { AppDispatch } from "../lib/schema-utils";

export async function getActiveVouchersForRestaurant(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getActiveVouchersForRestaurant.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getVoucherByCode(dispatch: AppDispatch, code: string) {
  const action = endpoints.getVoucherByCode.initiate(code);
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



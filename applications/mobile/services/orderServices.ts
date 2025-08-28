import { endpoints } from "../lib/schema-utils";
import type { AppDispatch } from "../lib/schema-utils";

export async function getMyOrders(dispatch: AppDispatch) {
  const action = endpoints.getMyOrders.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getCurrentOrder(dispatch: AppDispatch) {
  const action = endpoints.getCurrentOrder.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getOrderByCode(dispatch: AppDispatch, code: string) {
  const action = endpoints.getOrderByCode.initiate(code);
  const res = await dispatch(action);
  return res.unwrap();
}



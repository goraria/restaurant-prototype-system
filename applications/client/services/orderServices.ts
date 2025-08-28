import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

export async function createOrder(dispatch: AppDispatch, body: any) {
  const action = endpoints.createOrder.initiate(body);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getOrders(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getAllOrders.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getOrderById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getOrderById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateOrder(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateOrder.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteOrder(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteOrder.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getOrderStats(dispatch: AppDispatch) {
  const action = endpoints.getOrderStats.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getOrderAnalytics(dispatch: AppDispatch) {
  const action = endpoints.getOrderAnalytics.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

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

export async function cancelOrder(dispatch: AppDispatch, id: string) {
  const action = endpoints.cancelOrder.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}



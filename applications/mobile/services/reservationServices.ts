import { endpoints } from "../lib/schema-utils";
import type { AppDispatch } from "../lib/schema-utils";

export async function createReservation(dispatch: AppDispatch, data: any) {
  const action = endpoints.createReservation.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getReservations(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getReservations.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getTodayReservations(dispatch: AppDispatch) {
  const action = endpoints.getTodayReservations.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getUpcomingReservations(dispatch: AppDispatch) {
  const action = endpoints.getUpcomingReservations.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function checkAvailability(dispatch: AppDispatch, data: any) {
  const action = endpoints.checkAvailability.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createWalkIn(dispatch: AppDispatch, data: any) {
  const action = endpoints.createWalkIn.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}



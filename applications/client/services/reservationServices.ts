import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

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

export async function bulkUpdateReservations(dispatch: AppDispatch, data: any) {
  const action = endpoints.bulkUpdateReservations.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function reservationAnalytics(dispatch: AppDispatch, data: any) {
  const action = endpoints.reservationAnalytics.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getReservationById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getReservationById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateReservation(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateReservation.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateReservationStatus(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateReservationStatus.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteReservation(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteReservation.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}



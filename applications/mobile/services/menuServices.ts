import { endpoints } from "../lib/schema-utils";
import type { AppDispatch } from "../lib/schema-utils";

export async function fetchMenusByRestaurant(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getMenusByRestaurant.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuStatsByRestaurant(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getMenuStatsByRestaurant.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchFeaturedMenuItems(dispatch: AppDispatch) {
  const action = endpoints.getFeaturedMenuItems.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuItems(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getMenuItems.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuItemById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getMenuItemById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}



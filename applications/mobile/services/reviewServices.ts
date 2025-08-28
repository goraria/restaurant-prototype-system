import { endpoints } from "../lib/schema-utils";
import type { AppDispatch } from "../lib/schema-utils";

export async function createRestaurantReview(dispatch: AppDispatch, data: any) {
  const action = endpoints.createRestaurantReview.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createMenuItemReview(dispatch: AppDispatch, data: any) {
  const action = endpoints.createMenuItemReview.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createOrderReview(dispatch: AppDispatch, data: any) {
  const action = endpoints.createOrderReview.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getMyReviews(dispatch: AppDispatch) {
  const action = endpoints.getMyReviews.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getRestaurantReviews(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getRestaurantReviews.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getMenuItemReviews(dispatch: AppDispatch, menuItemId: string) {
  const action = endpoints.getMenuItemReviews.initiate(menuItemId);
  const res = await dispatch(action);
  return res.unwrap();
}



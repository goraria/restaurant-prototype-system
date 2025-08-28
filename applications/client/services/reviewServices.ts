import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

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

export async function getReviews(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getReviews.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getReviewStats(dispatch: AppDispatch) {
  const action = endpoints.getReviewStats.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getMyReviews(dispatch: AppDispatch) {
  const action = endpoints.getMyReviews.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getReviewById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getReviewById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateReview(dispatch: AppDispatch, reviewId: string, data: any) {
  const action = endpoints.updateReview.initiate({ reviewId, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteReview(dispatch: AppDispatch, reviewId: string) {
  const action = endpoints.deleteReview.initiate(reviewId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function addReviewResponse(dispatch: AppDispatch, reviewId: string, data: any) {
  const action = endpoints.addReviewResponse.initiate({ reviewId, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getRestaurantReviews(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getRestaurantReviews.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getRestaurantReviewStats(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getRestaurantReviewStats.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getMenuItemReviews(dispatch: AppDispatch, menuItemId: string) {
  const action = endpoints.getMenuItemReviews.initiate(menuItemId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getMenuItemReviewStats(dispatch: AppDispatch, menuItemId: string) {
  const action = endpoints.getMenuItemReviewStats.initiate(menuItemId);
  const res = await dispatch(action);
  return res.unwrap();
}



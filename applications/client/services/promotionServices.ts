import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

export async function promotionCreateVoucher(dispatch: AppDispatch, data: any) {
  const action = endpoints.promotionCreateVoucher.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetVouchers(dispatch: AppDispatch) {
  const action = endpoints.promotionGetVouchers.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionUpdateVoucher(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.promotionUpdateVoucher.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionDeleteVoucher(dispatch: AppDispatch, id: string) {
  const action = endpoints.promotionDeleteVoucher.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionApplyVoucher(dispatch: AppDispatch, data: any) {
  const action = endpoints.promotionApplyVoucher.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetMyVouchers(dispatch: AppDispatch) {
  const action = endpoints.promotionGetMyVouchers.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionCreatePromotion(dispatch: AppDispatch, data: any) {
  const action = endpoints.promotionCreatePromotion.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetPromotions(dispatch: AppDispatch) {
  const action = endpoints.promotionGetPromotions.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionUpdatePromotion(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.promotionUpdatePromotion.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionDeletePromotion(dispatch: AppDispatch, id: string) {
  const action = endpoints.promotionDeletePromotion.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionCheckPromotions(dispatch: AppDispatch, data: any) {
  const action = endpoints.promotionCheckPromotions.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetMyPromotions(dispatch: AppDispatch) {
  const action = endpoints.promotionGetMyPromotions.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionCalculateBestDiscount(dispatch: AppDispatch, data: any) {
  const action = endpoints.promotionCalculateBestDiscount.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetAnalytics(dispatch: AppDispatch) {
  const action = endpoints.promotionGetAnalytics.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetRestaurantVouchers(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.promotionGetRestaurantVouchers.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function promotionGetRestaurantPromotions(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.promotionGetRestaurantPromotions.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}



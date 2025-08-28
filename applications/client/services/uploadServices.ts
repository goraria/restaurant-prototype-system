import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

export async function uploadAvatar(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadAvatar.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadFile(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadFile.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadCategoryImage(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadCategoryImage.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadMenuImage(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadMenuImage.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadMenuItemImage(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadMenuItemImage.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadRestaurantLogo(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadRestaurantLogo.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function uploadRestaurantCover(dispatch: AppDispatch, formData: FormData) {
  const action = endpoints.uploadRestaurantCover.initiate(formData as any);
  const res = await dispatch(action);
  return res.unwrap();
}



import { z } from "zod";
import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";
import {
  CreateMenuSchema,
  UpdateMenuSchema,
  MenuQuerySchema,
  CreateMenuItemSchema,
  UpdateMenuItemSchema,
  FeaturedItemsQuerySchema,
} from "@/schemas/menuSchemas";

export async function fetchMenus(dispatch: AppDispatch, query: unknown) {
  const params = MenuQuerySchema.parse(query);
  const action = endpoints.getAllMenus.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getMenuById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createMenu(dispatch: AppDispatch, body: unknown) {
  const data = CreateMenuSchema.parse(body);
  const action = endpoints.createMenu.initiate(data as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateMenu(dispatch: AppDispatch, id: string, body: unknown) {
  const data = UpdateMenuSchema.parse(body);
  const action = endpoints.updateMenu.initiate({ id, data } as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteMenu(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteMenu.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

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

export async function fetchFeaturedMenuItems(dispatch: AppDispatch, query: unknown) {
  FeaturedItemsQuerySchema.parse(query);
  const action = endpoints.getFeaturedMenuItems.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuItems(dispatch: AppDispatch, query: unknown) {
  const params = MenuQuerySchema.parse(query);
  const action = endpoints.getMenuItems.initiate(params as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchMenuItemById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getMenuItemById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createMenuItem(dispatch: AppDispatch, body: unknown) {
  const data = CreateMenuItemSchema.parse(body);
  const action = endpoints.createMenuItem.initiate(data as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateMenuItem(dispatch: AppDispatch, id: string, body: unknown) {
  const data = UpdateMenuItemSchema.parse(body);
  const action = endpoints.updateMenuItem.initiate({ id, data } as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteMenuItem(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteMenuItem.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function bulkUpdateMenuItems(dispatch: AppDispatch, body: any) {
  const action = endpoints.bulkUpdateMenuItems.initiate(body);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function bulkToggleMenuItemsAvailability(dispatch: AppDispatch, body: any) {
  const action = endpoints.bulkToggleMenuItemsAvailability.initiate(body);
  const res = await dispatch(action);
  return res.unwrap();
}



import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";

export async function createInventoryItem(dispatch: AppDispatch, data: any) {
  const action = endpoints.createInventoryItem.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getInventoryItems(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getInventoryItems.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function bulkUpdateInventory(dispatch: AppDispatch, data: any) {
  const action = endpoints.bulkUpdateInventory.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getLowStockAlert(dispatch: AppDispatch) {
  const action = endpoints.getLowStockAlert.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getInventoryItemById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getInventoryItemById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateInventoryItem(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateInventoryItem.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteInventoryItem(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteInventoryItem.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getInventoryItemsByRestaurantId(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getInventoryItemsByRestaurantId.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createInventoryTransaction(dispatch: AppDispatch, data: any) {
  const action = endpoints.createInventoryTransaction.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getInventoryTransactions(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getInventoryTransactions.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createRecipe(dispatch: AppDispatch, data: any) {
  const action = endpoints.createRecipe.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getRecipes(dispatch: AppDispatch, params?: Record<string, any>) {
  const action = endpoints.getRecipes.initiate(params ?? {} as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function calculateRecipeCost(dispatch: AppDispatch, data: any) {
  const action = endpoints.calculateRecipeCost.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getRecipeById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getRecipeById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateRecipe(dispatch: AppDispatch, id: string, data: any) {
  const action = endpoints.updateRecipe.initiate({ id, data });
  const res = await dispatch(action);
  return res.unwrap();
}

export async function getInventoryStats(dispatch: AppDispatch) {
  const action = endpoints.getInventoryStats.initiate();
  const res = await dispatch(action);
  return res.unwrap();
}

export async function checkQRInventory(dispatch: AppDispatch, data: any) {
  const action = endpoints.checkQRInventory.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function quickStockUpdate(dispatch: AppDispatch, data: any) {
  const action = endpoints.quickStockUpdate.initiate(data);
  const res = await dispatch(action);
  return res.unwrap();
}



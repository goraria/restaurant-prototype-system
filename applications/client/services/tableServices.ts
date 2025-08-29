import { z } from "zod";
import { endpoints } from "../utils/schema-utils";
import type { AppDispatch } from "../utils/schema-utils";
import {
  CreateTableSchema,
  UpdateTableSchema,
  TableQuerySchema,
  UpdateTableStatusSchema,
  TableAvailabilitySchema,
} from "@/schemas/tableSchemas";

export async function fetchTables(dispatch: AppDispatch, query: unknown) {
  const params = TableQuerySchema.parse(query);
  const action = endpoints.getTables.initiate(params as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchTableById(dispatch: AppDispatch, id: string) {
  const action = endpoints.getTableById.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function createTable(dispatch: AppDispatch, body: unknown) {
  const data = CreateTableSchema.parse(body);
  const action = endpoints.createTable.initiate(data as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateTable(dispatch: AppDispatch, id: string, body: unknown) {
  const data = UpdateTableSchema.parse(body);
  const action = endpoints.updateTable.initiate({ id, data } as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function deleteTable(dispatch: AppDispatch, id: string) {
  const action = endpoints.deleteTable.initiate(id);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function fetchTablesByRestaurant(dispatch: AppDispatch, restaurantId: string) {
  const action = endpoints.getTablesByRestaurant.initiate(restaurantId);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function updateTableStatus(dispatch: AppDispatch, body: unknown) {
  const data = UpdateTableStatusSchema.parse(body);
  const action = endpoints.updateTableStatus.initiate(data as any);
  const res = await dispatch(action);
  return res.unwrap();
}

export async function checkTableAvailability(dispatch: AppDispatch, body: unknown) {
  const data = TableAvailabilitySchema.parse(body);
  const action = endpoints.checkTableAvailability.initiate(data as any);
  const res = await dispatch(action);
  return res.unwrap();
}

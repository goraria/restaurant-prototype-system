import { api } from "@/state/api";

export type AppDispatch = any;

export async function callQuery<TResult, TArg = void>(
  dispatch: AppDispatch,
  endpoint: { initiate: (arg: TArg) => any },
  arg: TArg
): Promise<TResult> {
  const action = endpoint.initiate(arg);
  const result = await dispatch(action);
  return await result.unwrap();
}

export const endpoints = api.endpoints;



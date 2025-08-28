import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";

// Với Expo + Clerk, cách lấy token phụ thuộc vào hook/provider của @clerk/clerk-expo.
// Để không phụ thuộc trực tiếp vào hook trong layer state, ta dùng một setter để
// nhận hàm getToken từ phần khởi tạo app (ví dụ trong provider của Clerk).

type GetTokenFn = () => Promise<string | null>;
let getTokenFn: GetTokenFn | null = null;

export function provideClerkGetToken(fn: GetTokenFn) {
  getTokenFn = fn;
}

const baseQueryWithClerk = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const token = (await getTokenFn?.()) ?? null;
        if (token) headers.set("Authorization", `Bearer ${token}`);
      } catch {}
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result?.data) {
      // Chuẩn hóa data ở dạng { data: ... }
      result.data = result.data.data ?? result.data;
    } else if (
      result?.error?.status === 204 ||
      result?.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: { status: "FETCH_ERROR", error: message } } as any;
  }
};

export const api = createApi({
  baseQuery: baseQueryWithClerk,
  reducerPath: "api",
  tagTypes: ["Users", "Restaurants", "Orders", "Menus"],
  endpoints: (builder) => ({
    // Users CRUD (nếu mobile cần truy vấn cơ bản)
    getAllUsers: builder.query<any[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<any, any>({
      query: (data) => ({ url: "/users", method: "POST", body: data }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/users/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users"],
    }),

    // Restaurants CRUD (mobile thường chỉ đọc)
    getAllRestaurants: builder.query<any[], void>({
      query: () => "/restaurants",
      providesTags: ["Restaurants"],
    }),
    getRestaurantById: builder.query<any, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: "Restaurants", id }],
    }),
    createRestaurant: builder.mutation<any, any>({
      query: (data) => ({ url: "/restaurants", method: "POST", body: data }),
      invalidatesTags: ["Restaurants"],
    }),
    updateRestaurant: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/restaurants/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Restaurants"],
    }),
    deleteRestaurant: builder.mutation<any, string>({
      query: (id) => ({ url: `/restaurants/${id}`, method: "DELETE" }),
      invalidatesTags: ["Restaurants"],
    }),

    // Orders CRUD (mobile khách hàng + nhân viên)
    getAllOrders: builder.query<any[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation<any, any>({
      query: (data) => ({ url: "/orders", method: "POST", body: data }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/orders/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Orders"],
    }),
    deleteOrder: builder.mutation<any, string>({
      query: (id) => ({ url: `/orders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Orders"],
    }),

    // Menus CRUD (mobile chủ yếu đọc)
    getAllMenus: builder.query<any[], void>({
      query: () => "/menus",
      providesTags: ["Menus"],
    }),
    getMenuById: builder.query<any, string>({
      query: (id) => `/menus/${id}`,
      providesTags: (result, error, id) => [{ type: "Menus", id }],
    }),
    createMenu: builder.mutation<any, any>({
      query: (data) => ({ url: "/menus", method: "POST", body: data }),
      invalidatesTags: ["Menus"],
    }),
    updateMenu: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/menus/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Menus"],
    }),
    deleteMenu: builder.mutation<any, string>({
      query: (id) => ({ url: `/menus/${id}`, method: "DELETE" }),
      invalidatesTags: ["Menus"],
    }),

    // Menu extras (public + staff)
    getMenusByRestaurant: builder.query<any, string>({
      query: (restaurantId) => `/menus/restaurant/${restaurantId}`,
      providesTags: ["Menus"],
    }),
    getMenuStatsByRestaurant: builder.query<any, string>({
      query: (restaurantId) => `/menus/restaurant/${restaurantId}/stats`,
      providesTags: ["Menus"],
    }),
    getFeaturedMenuItems: builder.query<any[], void>({
      query: () => `/menus/items/featured`,
      providesTags: ["Menus"],
    }),
    getMenuItems: builder.query<any[], Record<string, any> | void>({
      query: (params) => ({ url: `/menus/items`, params: params ?? {} }),
      providesTags: ["Menus"],
    }),
    getMenuItemById: builder.query<any, string>({
      query: (id) => `/menus/items/${id}`,
      providesTags: ["Menus"],
    }),

    // Orders extras (user facing)
    getMyOrders: builder.query<any[], void>({
      query: () => `/orders/my-orders`,
      providesTags: ["Orders"],
    }),
    getCurrentOrder: builder.query<any, void>({
      query: () => `/orders/current`,
      providesTags: ["Orders"],
    }),
    getOrderByCode: builder.query<any, string>({
      query: (orderCode) => `/orders/code/${orderCode}`,
      providesTags: ["Orders"],
    }),

    // Voucher (user facing)
    getActiveVouchersForRestaurant: builder.query<any, string>({
      query: (restaurantId) => `/voucher/restaurant/${restaurantId}/active`,
    }),
    getVoucherByCode: builder.query<any, string>({ query: (code) => `/voucher/code/${code}` }),
    validateVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/voucher/validate`, method: "POST", body: data }),
    }),
    useVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/voucher/use`, method: "POST", body: data }),
    }),

    // Reviews (user facing + read)
    createRestaurantReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/restaurant`, method: "POST", body: data }),
    }),
    createMenuItemReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/menu-item`, method: "POST", body: data }),
    }),
    createOrderReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/order`, method: "POST", body: data }),
    }),
    getMyReviews: builder.query<any, void>({ query: () => `/reviews/my-reviews` }),
    getRestaurantReviews: builder.query<any, string>({
      query: (restaurantId) => `/reviews/restaurant/${restaurantId}`,
    }),
    getMenuItemReviews: builder.query<any, string>({
      query: (menuItemId) => `/reviews/menu-item/${menuItemId}`,
    }),

    // Reservations (user facing + staff)
    createReservation: builder.mutation<any, any>({
      query: (data) => ({ url: `/reservations`, method: "POST", body: data }),
    }),
    getReservations: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/reservations`, params: params ?? {} }),
    }),
    getTodayReservations: builder.query<any, void>({ query: () => `/reservations/today` }),
    getUpcomingReservations: builder.query<any, void>({ query: () => `/reservations/upcoming` }),
    checkAvailability: builder.mutation<any, any>({
      query: (data) => ({ url: `/reservations/check-availability`, method: "POST", body: data }),
    }),
    createWalkIn: builder.mutation<any, any>({
      query: (data) => ({ url: `/reservations/walk-in`, method: "POST", body: data }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,

  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,

  useGetAllMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,

  useGetMenusByRestaurantQuery,
  useGetMenuStatsByRestaurantQuery,
  useGetFeaturedMenuItemsQuery,
  useGetMenuItemsQuery,
  useGetMenuItemByIdQuery,

  useGetMyOrdersQuery,
  useGetCurrentOrderQuery,
  useGetOrderByCodeQuery,

  useGetActiveVouchersForRestaurantQuery,
  useGetVoucherByCodeQuery,
  useValidateVoucherMutation,
  useUseVoucherMutation,

  useCreateRestaurantReviewMutation,
  useCreateMenuItemReviewMutation,
  useCreateOrderReviewMutation,
  useGetMyReviewsQuery,
  useGetRestaurantReviewsQuery,
  useGetMenuItemReviewsQuery,

  useCreateReservationMutation,
  useGetReservationsQuery,
  useGetTodayReservationsQuery,
  useGetUpcomingReservationsQuery,
  useCheckAvailabilityMutation,
  useCreateWalkInMutation,
} = api;



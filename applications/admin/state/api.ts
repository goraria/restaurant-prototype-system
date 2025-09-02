import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryReturnValue,
  FetchBaseQueryMeta,
  BaseQueryApi
} from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => headers,
});

const baseQueryWithClerk = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data !== undefined) {
      const payload = result.data as any;
      if (payload && typeof payload === 'object' && 'data' in payload) {
        result.data = payload.data;
      }
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
  }),
  reducerPath: "api",
  tagTypes: ["Users", "Restaurants", "Orders", "Menus"],
  endpoints: (builder) => ({
    // ========== CRUD API ENDPOINTS ==========

    // Users CRUD
    getAllUsers: builder.query<any[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUser: builder.mutation<any, any>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // Restaurants CRUD
    getAllRestaurants: builder.query<any[], void>({
      query: () => "/restaurants",
      providesTags: ["Restaurants"],
    }),
    getRestaurantById: builder.query<any, string>({
      query: (id) => `/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: "Restaurants", id }],
    }),
    createRestaurant: builder.mutation<any, any>({
      query: (data) => ({
        url: "/restaurants",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Restaurants"],
    }),
    updateRestaurant: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/restaurants/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Restaurants"],
    }),
    deleteRestaurant: builder.mutation<any, string>({
      query: (id) => ({
        url: `/restaurants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Restaurants"],
    }),

    // Orders CRUD
    getAllOrders: builder.query<any[], void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),
    createOrder: builder.mutation<any, any>({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
    deleteOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

    // Menus CRUD
    getAllMenus: builder.query<any[], void>({
      query: () => "/menus",
      providesTags: ["Menus"],
    }),
    getMenuById: builder.query<any, string>({
      query: (id) => `/menus/${id}`,
      providesTags: (result, error, id) => [{ type: "Menus", id }],
    }),
    createMenu: builder.mutation<any, any>({
      query: (data) => ({
        url: "/menus",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Menus"],
    }),
    updateMenu: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/menus/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Menus"],
    }),
    deleteMenu: builder.mutation<any, string>({
      query: (id) => ({
        url: `/menus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menus"],
    }),

    // Menu extras
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
    createMenuItem: builder.mutation<any, any>({
      query: (data) => ({ url: `/menus/items`, method: "POST", body: data }),
      invalidatesTags: ["Menus"],
    }),
    getMenuItemById: builder.query<any, string>({
      query: (id) => `/menus/items/${id}`,
      providesTags: ["Menus"],
    }),
    updateMenuItem: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/menus/items/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Menus"],
    }),
    deleteMenuItem: builder.mutation<any, string>({
      query: (id) => ({ url: `/menus/items/${id}`, method: "DELETE" }),
      invalidatesTags: ["Menus"],
    }),
    bulkUpdateMenuItems: builder.mutation<any, any>({
      query: (data) => ({ url: `/menus/items/bulk/update`, method: "PUT", body: data }),
      invalidatesTags: ["Menus"],
    }),
    bulkToggleMenuItemsAvailability: builder.mutation<any, any>({
      query: (data) => ({ url: `/menus/items/bulk/availability`, method: "PUT", body: data }),
      invalidatesTags: ["Menus"],
    }),

    // Orders extras
    getOrderStats: builder.query<any, void>({
      query: () => `/orders/stats`,
      providesTags: ["Orders"],
    }),
    getOrderAnalytics: builder.query<any, void>({
      query: () => `/orders/analytics`,
      providesTags: ["Orders"],
    }),
    getMyOrders: builder.query<any[], void>({
      query: () => `/orders/my-orders`,
      providesTags: ["Orders"],
    }),
    getCurrentOrder: builder.query<any, void>({
      query: () => `/orders/current`,
      providesTags: ["Orders"],
    }),
    getRestaurantOrders: builder.query<any[], void>({
      query: () => `/orders/restaurant`,
      providesTags: ["Orders"],
    }),
    getPendingOrders: builder.query<any[], void>({
      query: () => `/orders/restaurant/pending`,
      providesTags: ["Orders"],
    }),
    getRestaurantDashboard: builder.query<any, void>({
      query: () => `/orders/restaurant/dashboard`,
      providesTags: ["Orders"],
    }),
    getOrderByCode: builder.query<any, string>({
      query: (orderCode) => `/orders/code/${orderCode}`,
      providesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation<any, string>({
      query: (id) => ({ url: `/orders/${id}/cancel`, method: "POST" }),
      invalidatesTags: ["Orders"],
    }),
    bulkOrderActions: builder.mutation<any, any>({
      query: (data) => ({ url: `/orders/bulk-actions`, method: "POST", body: data }),
      invalidatesTags: ["Orders"],
    }),
    getKitchenOrders: builder.query<any[], void>({
      query: () => `/orders/kitchen/orders`,
      providesTags: ["Orders"],
    }),
    updateCookingStatus: builder.mutation<any, any>({
      query: (data) => ({ url: `/orders/kitchen/cooking-status`, method: "PUT", body: data }),
      invalidatesTags: ["Orders"],
    }),

    // Voucher
    createVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/voucher`, method: "POST", body: data }),
      invalidatesTags: ["Menus"],
    }),
    getVouchers: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/voucher`, params: params ?? {} }),
    }),
    getVoucherById: builder.query<any, string>({ query: (id) => `/voucher/${id}` }),
    getVoucherByCode: builder.query<any, string>({ query: (code) => `/voucher/code/${code}` }),
    updateVoucher: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/voucher/${id}`, method: "PUT", body: data }),
    }),
    deleteVoucher: builder.mutation<any, string>({
      query: (id) => ({ url: `/voucher/${id}`, method: "DELETE" }),
    }),
    hardDeleteVoucher: builder.mutation<any, string>({
      query: (id) => ({ url: `/voucher/${id}/hard`, method: "DELETE" }),
    }),
    validateVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/voucher/validate`, method: "POST", body: data }),
    }),
    useVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/voucher/use`, method: "POST", body: data }),
    }),
    getVoucherUsageHistory: builder.query<any, string>({
      query: (id) => `/voucher/${id}/usage`,
    }),
    getActiveVouchersForRestaurant: builder.query<any, string>({
      query: (restaurantId) => `/voucher/restaurant/${restaurantId}/active`,
    }),

    // Promotions bundle (mounted under /payment)
    promotionCreateVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/vouchers`, method: "POST", body: data }),
    }),
    promotionGetVouchers: builder.query<any, void>({ query: () => `/payment/vouchers` }),
    promotionUpdateVoucher: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/payment/vouchers/${id}`, method: "PUT", body: data }),
    }),
    promotionDeleteVoucher: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment/vouchers/${id}`, method: "DELETE" }),
    }),
    promotionApplyVoucher: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/vouchers/apply`, method: "POST", body: data }),
    }),
    promotionGetMyVouchers: builder.query<any, void>({ query: () => `/payment/my-vouchers` }),
    promotionCreatePromotion: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/promotions`, method: "POST", body: data }),
    }),
    promotionGetPromotions: builder.query<any, void>({ query: () => `/payment/promotions` }),
    promotionUpdatePromotion: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/payment/promotions/${id}`, method: "PUT", body: data }),
    }),
    promotionDeletePromotion: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment/promotions/${id}`, method: "DELETE" }),
    }),
    promotionCheckPromotions: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/promotions/check`, method: "POST", body: data }),
    }),
    promotionGetMyPromotions: builder.query<any, void>({ query: () => `/payment/my-promotions` }),
    promotionCalculateBestDiscount: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/calculate-discount`, method: "POST", body: data }),
    }),
    promotionGetAnalytics: builder.query<any, void>({ query: () => `/payment/analytics` }),
    promotionGetRestaurantVouchers: builder.query<any, string>({
      query: (restaurantId) => `/payment/restaurants/${restaurantId}/vouchers`,
    }),
    promotionGetRestaurantPromotions: builder.query<any, string>({
      query: (restaurantId) => `/payment/restaurants/${restaurantId}/promotions`,
    }),

    // Payments (list, detail, update, refund) under /payment
    listPayments: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/payment`, params: params ?? {} }),
    }),
    createPaymentRecord: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment`, method: "POST", body: data }),
    }),
    paymentAnalytics: builder.query<any, void>({ query: () => `/payment/analytics` }),
    getPaymentDetail: builder.query<any, string>({ query: (id) => `/payment/${id}` }),
    updatePaymentRecord: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/payment/${id}`, method: "PUT", body: data }),
    }),
    refundPayment: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment/${id}/refund`, method: "POST" }),
    }),

    // Purchases (momo/zalopay/vnpay) under /payment
    momoPayment: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/momo`, method: "POST", body: data }),
    }),
    momoCallback: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/momo/callback`, method: "POST", body: data }),
    }),
    momoTransactionStatus: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/momo/transaction-status`, method: "POST", body: data }),
    }),
    zalopayPayment: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/zalopay`, method: "POST", body: data }),
    }),
    zalopayCallback: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/zalopay/callback`, method: "POST", body: data }),
    }),
    zalopayCheckStatus: builder.mutation<any, string>({
      query: (id) => ({ url: `/payment/zalopay/check-status/${id}`, method: "POST" }),
    }),
    vnpayPayment: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/vnpay`, method: "POST", body: data }),
    }),
    vnpayCallback: builder.mutation<any, any>({
      query: (data) => ({ url: `/payment/vnpay/callback`, method: "POST", body: data }),
    }),

    // Inventory
    createInventoryItem: builder.mutation<any, any>({
      query: (data) => ({ url: `/inventory-items`, method: "POST", body: data }),
    }),
    getInventoryItems: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/inventory-items`, params: params ?? {} }),
    }),
    bulkUpdateInventory: builder.mutation<any, any>({
      query: (data) => ({ url: `/inventory-items/bulk-update`, method: "PATCH", body: data }),
    }),
    getLowStockAlert: builder.query<any, void>({ query: () => `/inventory-items/low-stock-alert` }),
    getInventoryItemById: builder.query<any, string>({ query: (id) => `/inventory-items/${id}` }),
    updateInventoryItem: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/inventory-items/${id}`, method: "PUT", body: data }),
    }),
    deleteInventoryItem: builder.mutation<any, string>({
      query: (id) => ({ url: `/inventory-items/${id}`, method: "DELETE" }),
    }),
    getInventoryItemsByRestaurantId: builder.query<any, string>({
      query: (restaurantId) => `/restaurants/${restaurantId}/inventory-items`,
    }),
    createInventoryTransaction: builder.mutation<any, any>({
      query: (data) => ({ url: `/inventory-transactions`, method: "POST", body: data }),
    }),
    getInventoryTransactions: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/inventory-transactions`, params: params ?? {} }),
    }),
    createRecipe: builder.mutation<any, any>({
      query: (data) => ({ url: `/recipes`, method: "POST", body: data }),
    }),
    getRecipes: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/recipes`, params: params ?? {} }),
    }),
    calculateRecipeCost: builder.mutation<any, any>({
      query: (data) => ({ url: `/recipes/calculate-cost`, method: "POST", body: data }),
    }),
    getRecipeById: builder.query<any, string>({ query: (id) => `/recipes/${id}` }),
    updateRecipe: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/recipes/${id}`, method: "PUT", body: data }),
    }),
    getInventoryStats: builder.query<any, void>({ query: () => `/stats/inventory` }),
    checkQRInventory: builder.mutation<any, any>({
      query: (data) => ({ url: `/inventory/qr-check`, method: "POST", body: data }),
    }),
    quickStockUpdate: builder.mutation<any, any>({
      query: (data) => ({ url: `/inventory/quick-update`, method: "POST", body: data }),
    }),

    // Tables
    createTable: builder.mutation<any, any>({
      query: (data) => ({ url: `/tables`, method: "POST", body: data }),
    }),
    getTables: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/tables`, params: params ?? {} }),
    }),
    getTableById: builder.query<any, string>({ query: (id) => `/tables/${id}` }),
    updateTable: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/tables/${id}`, method: "PUT", body: data }),
    }),
    deleteTable: builder.mutation<any, string>({
      query: (id) => ({ url: `/tables/${id}`, method: "DELETE" }),
    }),
    getTablesByRestaurant: builder.query<any, string>({
      query: (restaurantId) => `/tables/restaurant/${restaurantId}`,
    }),
    updateTableStatus: builder.mutation<any, any>({
      query: (data) => ({ url: `/tables/status`, method: "PUT", body: data }),
    }),
    checkTableAvailability: builder.mutation<any, any>({
      query: (data) => ({ url: `/tables/availability`, method: "POST", body: data }),
    }),

    // Reservations
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
    bulkUpdateReservations: builder.mutation<any, any>({
      query: (data) => ({ url: `/reservations/bulk-update`, method: "PATCH", body: data }),
    }),
    reservationAnalytics: builder.mutation<any, any>({
      query: (data) => ({ url: `/reservations/analytics`, method: "POST", body: data }),
    }),
    getReservationById: builder.query<any, string>({ query: (id) => `/reservations/${id}` }),
    updateReservation: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/reservations/${id}`, method: "PUT", body: data }),
    }),
    updateReservationStatus: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/reservations/${id}/status`, method: "PATCH", body: data }),
    }),
    deleteReservation: builder.mutation<any, string>({
      query: (id) => ({ url: `/reservations/${id}`, method: "DELETE" }),
    }),

    // Reviews
    createRestaurantReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/restaurant`, method: "POST", body: data }),
    }),
    createMenuItemReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/menu-item`, method: "POST", body: data }),
    }),
    createOrderReview: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/order`, method: "POST", body: data }),
    }),
    getReviews: builder.query<any, Record<string, any> | void>({
      query: (params) => ({ url: `/reviews`, params: params ?? {} }),
    }),
    getReviewStats: builder.query<any, void>({ query: () => `/reviews/stats` }),
    getMyReviews: builder.query<any, void>({ query: () => `/reviews/my-reviews` }),
    getReviewById: builder.query<any, string>({ query: (id) => `/reviews/${id}` }),
    updateReview: builder.mutation<any, { reviewId: string; data: any }>({
      query: ({ reviewId, data }) => ({ url: `/reviews/${reviewId}`, method: "PUT", body: data }),
    }),
    deleteReview: builder.mutation<any, string>({
      query: (reviewId) => ({ url: `/reviews/${reviewId}`, method: "DELETE" }),
    }),
    addReviewResponse: builder.mutation<any, { reviewId: string; data: any }>({
      query: ({ reviewId, data }) => ({ url: `/reviews/${reviewId}/response`, method: "POST", body: data }),
    }),
    bulkReviewAction: builder.mutation<any, any>({
      query: (data) => ({ url: `/reviews/bulk-action`, method: "POST", body: data }),
    }),
    getRestaurantReviews: builder.query<any, string>({
      query: (restaurantId) => `/reviews/restaurant/${restaurantId}`,
    }),
    getRestaurantReviewStats: builder.query<any, string>({
      query: (restaurantId) => `/reviews/restaurant/${restaurantId}/stats`,
    }),
    getMenuItemReviews: builder.query<any, string>({
      query: (menuItemId) => `/reviews/menu-item/${menuItemId}`,
    }),
    getMenuItemReviewStats: builder.query<any, string>({
      query: (menuItemId) => `/reviews/menu-item/${menuItemId}/stats`,
    }),

    // Uploads
    uploadAvatar: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/avatar`, method: "POST", body: formData }),
    }),
    uploadFile: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/file`, method: "POST", body: formData }),
    }),
    uploadCategoryImage: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/images/categories`, method: "POST", body: formData }),
    }),
    uploadMenuImage: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/images/menus`, method: "POST", body: formData }),
    }),
    uploadMenuItemImage: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/images/menu-items`, method: "POST", body: formData }),
    }),
    uploadRestaurantLogo: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/images/restaurants/logo`, method: "POST", body: formData }),
    }),
    uploadRestaurantCover: builder.mutation<any, FormData>({
      query: (formData) => ({ url: `/upload/images/restaurants/cover`, method: "POST", body: formData }),
    }),

    /* 
    ===============
    USER CLERK
    =============== 
    */
    updateUserClerk: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...updatedUser }) => ({
        url: `users/clerk/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* 
    ===============
    COURSES
    =============== 
    */
    // getCourses: build.query<Course[], { category?: string }>({
    //   query: ({ category }) => ({
    //     url: "courses",
    //     params: { category },
    //   }),
    //   providesTags: ["Courses"],
    // }),

    // getCourse: build.query<Course, string>({
    //   query: (id) => `courses/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Courses", id }],
    // }),

    // createCourse: build.mutation<
    //   Course,
    //   { teacherId: string; teacherName: string }
    // >({
    //   query: (body) => ({
    //     url: `courses`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Courses"],
    // }),

    // updateCourse: build.mutation<
    //   Course,
    //   { courseId: string; formData: FormData }
    // >({
    //   query: ({ courseId, formData }) => ({
    //     url: `courses/${courseId}`,
    //     method: "PUT",
    //     body: formData,
    //   }),
    //   invalidatesTags: (result, error, { courseId }) => [
    //     { type: "Courses", id: courseId },
    //   ],
    // }),

    // deleteCourse: build.mutation<{ message: string }, string>({
    //   query: (courseId) => ({
    //     url: `courses/${courseId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Courses"],
    // }),

    // getUploadVideoUrl: build.mutation<
    //   { uploadUrl: string; videoUrl: string },
    //   {
    //     courseId: string;
    //     chapterId: string;
    //     sectionId: string;
    //     fileName: string;
    //     fileType: string;
    //   }
    // >({
    //   query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
    //     url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
    //     method: "POST",
    //     body: { fileName, fileType },
    //   }),
    // }),

    /* 
    ===============
    TRANSACTIONS
    =============== 
    */
    // getTransactions: build.query<Transaction[], string>({
    //   query: (userId) => `transactions?userId=${userId}`,
    // }),
    // createStripePaymentIntent: build.mutation<
    //   { clientSecret: string },
    //   { amount: number }
    // >({
    //   query: ({ amount }) => ({
    //     url: `/transactions/stripe/payment-intent`,
    //     method: "POST",
    //     body: { amount },
    //   }),
    // }),
    // createTransaction: build.mutation<Transaction, Partial<Transaction>>({
    //   query: (transaction) => ({
    //     url: "transactions",
    //     method: "POST",
    //     body: transaction,
    //   }),
    // }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    // getUserEnrolledCourses: build.query<Course[], string>({
    //   query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
    //   providesTags: ["Courses", "UserCourseProgress"],
    // }),

    // getUserCourseProgress: build.query<
    //   UserCourseProgress,
    //   { userId: string; courseId: string }
    // >({
    //   query: ({ userId, courseId }) =>
    //     `users/course-progress/${userId}/courses/${courseId}`,
    //   providesTags: ["UserCourseProgress"],
    // }),

    // updateUserCourseProgress: build.mutation<
    //   UserCourseProgress,
    //   {
    //     userId: string;
    //     courseId: string;
    //     progressData: {
    //       sections: SectionProgress[];
    //     };
    //   }
    // >({
    //   query: ({ userId, courseId, progressData }) => ({
    //     url: `users/course-progress/${userId}/courses/${courseId}`,
    //     method: "PUT",
    //     body: progressData,
    //   }),
    //   invalidatesTags: ["UserCourseProgress"],
    //   async onQueryStarted(
    //     { userId, courseId, progressData },
    //     { dispatch, queryFulfilled }
    //   ) {
    //     const patchResult = dispatch(
    //       api.util.updateQueryData(
    //         "getUserCourseProgress",
    //         { userId, courseId },
    //         (draft) => {
    //           Object.assign(draft, {
    //             ...draft,
    //             sections: progressData.sections,
    //           });
    //         }
    //       )
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    // }),

  }),
});

export const {
  // CRUD API Hooks
  // Users
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Restaurants
  useGetAllRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,

  // Orders
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,

  // Menus
  useGetAllMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetMenuItemsQuery,

  // Tables
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useGetTablesByRestaurantQuery,
  useUpdateTableStatusMutation,
  useCheckTableAvailabilityMutation,

  // useUpdateUserMutation,
  // useCreateCourseMutation,
  // useUpdateCourseMutation,
  // useDeleteCourseMutation,
  // useGetCoursesQuery,
  // useGetCourseQuery,
  // useGetUploadVideoUrlMutation,
  // useGetTransactionsQuery,
  // useCreateTransactionMutation,
  // useCreateStripePaymentIntentMutation,
  // useGetUserEnrolledCoursesQuery,
  // useGetUserCourseProgressQuery,
  // useUpdateUserCourseProgressMutation,
} = api;


// export interface Product {
//     productId: string;
//     name: string;
//     price: number;
//     rating?: number;
//     stockQuantity: number;
// }
//
// export interface NewProduct {
//     name: string;
//     price: number;
//     rating?: number;
//     stockQuantity: number;
// }
//
// export interface SalesSummary {
//     salesSummaryId: string;
//     totalValue: number;
//     changePercentage?: number;
//     date: string;
// }
//
// export interface PurchaseSummary {
//     purchaseSummaryId: string;
//     totalPurchased: number;
//     changePercentage?: number;
//     date: string;
// }
//
// export interface ExpenseSummary {
//     expenseSummaryId: string;
//     totalExpenses: number;
//     date: string;
// }
//
// export interface ExpenseByCategorySummary {
//     expenseByCategorySummaryId: string;
//     category: string;
//     amount: string;
//     date: string;
// }
//
// export interface DashboardMetrics {
//     popularProducts: Product[];
//     salesSummary: SalesSummary[];
//     purchaseSummary: PurchaseSummary[];
//     expenseSummary: ExpenseSummary[];
//     expenseByCategorySummary: ExpenseByCategorySummary[];
// }
//
// export interface User {
//     userId: string;
//     name: string;
//     email: string;
// }
//
// export const api = createApi({
//     baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
//     reducerPath: "api",
//     tagTypes: ["Users", "DashboardMetrics", "Products", "Expenses"],
//     endpoints: (build) => ({
//         getUsers: build.query<User[], void>({
//             query: (id) => `/users/${id}`,
//             providesTags: ["Users"],
//         }),
//         getDashboardMetrics: build.query<DashboardMetrics, void>({
//             query: () => "/dashboard",
//             providesTags: ["DashboardMetrics"],
//         }),
//         getProducts: build.query<Product[], string | void>({
//             query: (search) => ({
//                 url: "/products",
//                 params: search ? { search } : {},
//             }),
//             providesTags: ["Products"],
//         }),
//         createProduct: build.mutation<Product, NewProduct>({
//             query: (newProduct) => ({
//                 url: "/products",
//                 method: "POST",
//                 body: newProduct,
//             }),
//             invalidatesTags: ["Products"],
//         }),
//         getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
//             query: () => "/expenses",
//             providesTags: ["Expenses"],
//         }),
//     }),
// });
//
// export const {
//     useGetDashboardMetricsQuery,
//     useGetProductsQuery,
//     useCreateProductMutation,
//     useGetUsersQuery,
//     useGetExpensesByCategoryQuery,
// } = api;

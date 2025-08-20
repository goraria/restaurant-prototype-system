import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryReturnValue, FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
// import { User, Course, Transaction, UserCourseProgress, SectionProgress } from "@clerk/nextjs/server";
// import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CsrfCache { token: string; at: number }
let csrfCache: CsrfCache | null = null;
const CSRF_TTL = 30 * 60 * 1000; // 30 phút

// Refresh token coordination (avoid multiple parallel refresh calls)
let refreshPromise: Promise<boolean> | null = null;
async function attemptRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'x-csrf-token': await fetchCsrf().catch(()=> '') }
        });
        if (!res.ok) return false;
        const body = await res.json();
        return !!body?.success;
      } catch {
        return false;
      } finally {
        // allow next refresh attempt after settle
        setTimeout(() => { refreshPromise = null; }, 0);
      }
    })();
  }
  return refreshPromise;
}

async function fetchCsrf(): Promise<string> {
  if (csrfCache && Date.now() - csrfCache.at < CSRF_TTL) return csrfCache.token;
  const res = await fetch(`${BASE_URL}/csrf-token`, { credentials: 'include' });
  if (!res.ok) throw new Error('Không lấy được CSRF token');
  const data = await res.json();
  csrfCache = { token: data.csrfToken, at: Date.now() };
  return data.csrfToken;
}

function invalidateCsrf() { csrfCache = null; }

const isMutationMethod = (m?: string) => !!m && ['POST','PUT','PATCH','DELETE'].includes(m.toUpperCase());

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => headers,
});

const baseQueryWithCsrf: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (args, api, extra) => {
  const req: FetchArgs = typeof args === 'string' ? { url: args } : { ...args };
  const method = (req.method || 'GET').toUpperCase();
  if (isMutationMethod(method)) {
    try {
      const token = await fetchCsrf();
  const currentHeaders = (req.headers || {}) as Record<string, string>;
  req.headers = { ...currentHeaders, 'x-csrf-token': token };
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'CSRF error';
  toast.error(`CSRF lỗi: ${msg}`);
  return { error: { status: 'CUSTOM_ERROR', data: { message: msg } } } as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
    }
  }
  let result = await rawBaseQuery(req, api, extra);
  if (result.error?.status === 403) {
    const dataObj = result.error.data as { code?: string } | undefined;
    if (dataObj?.code === 'CSRF_INVALID') {
      invalidateCsrf();
      if (isMutationMethod(method)) {
        try {
          const token = await fetchCsrf();
          const currentHeaders2 = (req.headers || {}) as Record<string, string>;
          req.headers = { ...currentHeaders2, 'x-csrf-token': token };
        } catch {
          toast.error('Làm mới CSRF thất bại');
          return result;
        }
      }
      result = await rawBaseQuery(req, api, extra);
    }
  }
  // Handle expired access token -> attempt silent refresh once then retry
  if (result.error?.status === 401) {
    const errUnknown = result.error.data as unknown;
    let code: string | undefined;
    if (errUnknown && typeof errUnknown === 'object') {
      const maybeObj = errUnknown as { error?: { code?: string }; code?: string };
      code = maybeObj.error?.code || maybeObj.code;
    }
    if (code === 'TOKEN_EXPIRED') {
      const refreshed = await attemptRefresh();
      if (refreshed) {
        // Reattach CSRF header for retry if mutation
        if (isMutationMethod(method)) {
          try {
            const token = await fetchCsrf();
            const currentHeaders3 = (req.headers || {}) as Record<string, string>;
            req.headers = { ...currentHeaders3, 'x-csrf-token': token };
          } catch {/* ignore */}
        }
        const retry = await rawBaseQuery(req, api, extra);
        if (!retry.error) {
          const rawRetry = retry.data as unknown;
          if (rawRetry && typeof rawRetry === 'object' && 'data' in (rawRetry as Record<string, unknown>)) {
            const obj = rawRetry as { data?: unknown; message?: string };
            if (method !== 'GET' && obj.message) toast.success(obj.message);
            return { data: obj.data } as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
          }
          return retry as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
        }
        // fall through to normal error handling if retry still fails
        result = retry;
      }
    }
  }
  if (result.error) {
  const d = result.error.data as { message?: string; error?: string } | undefined;
  const msg = d?.message || d?.error || result.error.status?.toString() || 'Unknown error';
    toast.error(msg);
    return result;
  }
  const raw = result.data as unknown;
  // Special handling: auto refresh once if /auth/me says unauthenticated (access expired) but refresh cookie may still be valid
  if (!result.error && req.url === '/auth/me' && raw && typeof raw === 'object') {
    const r = raw as { authenticated?: unknown; data?: unknown };
    const unauth = r.authenticated === false && r.data === null;
    if (unauth) {
    // attempt silent refresh then retry once
      const refreshed = await attemptRefresh();
      if (refreshed) {
        const retry = await rawBaseQuery(req, api, extra);
        if (!retry.error) return retry as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
      }
    }
  }
  if (raw && typeof raw === 'object') {
    const record = raw as Record<string, unknown>;
    if ('data' in record) {
      // Chỉ unwrap đối với mutation (POST/PUT/PATCH/DELETE) để giữ nguyên envelope GET như /auth/me
      if (method !== 'GET') {
        const obj = raw as { data?: unknown; message?: string };
        if (obj.message) toast.success(obj.message);
        return { data: obj.data };
      }
    }
  }
  return result as QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>;
};


export const api = createApi({
  baseQuery: baseQueryWithCsrf,
  reducerPath: "api",
  tagTypes: ["Users", "Restaurants", "Orders", "Menus"],
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterInput>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation<
      { id: string; email: string; username: string; first_name: string; last_name: string; full_name: string; phone_number?: string|null; phone_code?: string|null; avatar_url?: string|null; cover_url?: string|null; bio?: string|null },
      Partial<UpdateProfileInput>
    >({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Users']
    }),
    getMe: builder.query<{ success: boolean; authenticated: boolean; data: User | null }, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
  // removed duplicate updateProfile pointing to /auth/profile

    getUsers: builder.query<User[], { category?: string }>({
      query: () => "/manage/users",
      providesTags: ["Users"],
    }),

    // Generic access check (role + auth) for a frontend path
    checkAccess: builder.query<{
      success: boolean; path: string; allowed: boolean; public?: boolean; authenticated?: boolean; requiredRoles?: string[]; userRole?: string; reason?: string;
    }, string>({
      query: (path) => ({
        url: `/auth/check-access`,
        method: 'GET',
        params: { path },
      }),
    }),

    // getUsers: build.query<User[], { category?: string }>({
    //   query: () => ({
    //     url: "/manage/users",
    //     method: "GET"
    //   }),
    //   providesTags: ["Users"],
    // }),

    // getUsersNew: build.query<User[], { category?: string }>({
    //   query: ({ category }) => ({
    //     url: "/manage/users",
    //     params: { category },
    //     method: "GET"
    //   }),
    //   providesTags: ["Users"],
    // }),

    // getCourse: build.query<Course, string>({
    //   query: (id) => `courses/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Courses", id }],
    // }),
    //
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
    //
    // updateCourse: build.mutation<
    //   Course,
    //   { courseId: string; formData: FormData }
    // >({
    //   query: ({ courseId, formData }) => ({
    //     url: `courses/${courseId}`,
    //     method: "PUT",
  // baseQuery removed (already defined at root createApi)
    //   }),
    //   invalidatesTags: (result, error, { courseId }) => [
    //     { type: "Courses", id: courseId },
    //   ],
    // }),
    //
    // deleteCourse: build.mutation<{ message: string }, string>({
    //   query: (courseId) => ({
    //     url: `courses/${courseId}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Courses"],
    // }),
    //
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
    //
    // getUserCourseProgress: build.query<
    //   UserCourseProgress,
    //   { userId: string; courseId: string }
    // >({
    //   query: ({ userId, courseId }) =>
    //     `users/course-progress/${userId}/courses/${courseId}`,
    //   providesTags: ["UserCourseProgress"],
    // }),
    //
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

  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetMeQuery,
  useCheckAccessQuery,
  useUpdateProfileMutation,
  
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

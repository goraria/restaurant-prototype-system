import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, QueryReturnValue, FetchBaseQueryMeta, BaseQueryApi } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
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

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
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
  baseQuery: baseQueryWithClerk,
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

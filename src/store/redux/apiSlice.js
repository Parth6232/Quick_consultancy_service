import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:  import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  }),
  tagTypes: ['Blog', 'Portfolio', 'Review', 'Job', 'Application'],
  endpoints: (builder) => ({
    // ── Auth Endpoints ─────────────────────────────────────────────────────
    registerUser: builder.mutation({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    adminLogin: builder.mutation({
      query: (body) => ({ url: '/auth/admin/login', method: 'POST', body }),
    }),

    // ── Blog Endpoints ─────────────────────────────────────────────────────
    getBlogs: builder.query({
      query: () => '/blogs',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Blog', id: _id })), { type: 'Blog', id: 'LIST' }]
          : [{ type: 'Blog', id: 'LIST' }],
    }),

    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    createBlog: builder.mutation({
      query: (body) => ({ url: '/blogs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // Admin: blog post edit karna
    updateBlog: builder.mutation({
      query: ({ id, body }) => ({ url: `/blogs/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    // Admin: blog post delete karna
    deleteBlog: builder.mutation({
      query: (id) => ({ url: `/blogs/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    // Like/unlike toggle — server hi source of truth hai (likes count + likedByUser),
    // isliye optimistic +1 patch hata kar seedha tags invalidate kar rahe hain taaki
    // list aur detail dono jagah sahi state refetch ho jaye.
    likeBlog: builder.mutation({
      query: (id) => ({ url: `/blogs/${id}/like`, method: 'POST' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),

    addComment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/blogs/${id}/comment`, method: 'POST', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }],
    }),

    // ── Portfolio Endpoints ────────────────────────────────────────────────
    getPortfolio: builder.query({
      query: () => '/portfolio',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ _id }) => ({ type: 'Portfolio', id: _id })),
            { type: 'Portfolio', id: 'LIST' },
          ]
          : [{ type: 'Portfolio', id: 'LIST' }],
    }),

    getPortfolioById: builder.query({
      query: (id) => `/portfolio/${id}`,
      providesTags: (result, error, id) => [{ type: 'Portfolio', id }],
    }),

    createPortfolio: builder.mutation({
      query: (body) => ({ url: '/portfolio', method: 'POST', body }),
      invalidatesTags: [{ type: 'Portfolio', id: 'LIST' }],
    }),

    // Admin: portfolio project edit karna
    updatePortfolio: builder.mutation({
      query: ({ id, body }) => ({ url: `/portfolio/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Portfolio', id },
        { type: 'Portfolio', id: 'LIST' },
      ],
    }),

    // Admin: portfolio project delete karna
    deletePortfolio: builder.mutation({
      query: (id) => ({ url: `/portfolio/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Portfolio', id },
        { type: 'Portfolio', id: 'LIST' },
      ],
    }),

    // ── Review Endpoints ───────────────────────────────────────────────────
    getReviews: builder.query({
      query: ({ page = 1, limit = 6 } = {}) => `/reviews?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.reviews
          ? [
              ...result.reviews.map(({ _id }) => ({ type: 'Review', id: _id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    createReview: builder.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),

    // Admin: review delete karna
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),

    // ── Chat Endpoint ──────────────────────────────────────────────────────
    sendChatMessage: builder.mutation({
      query: (body) => ({ url: '/chat', method: 'POST', body }),
    }),
    // ── Job Endpoints ──────────────────────────────────────────────────────
    getJobs: builder.query({
      query: () => '/jobs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Job', id: _id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),
    getAllJobsAdmin: builder.query({
      query: () => '/jobs/admin/all',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Job', id: _id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation({
      query: (body) => ({ url: '/jobs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation({
      query: ({ id, body }) => ({ url: `/jobs/${id}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({ url: `/jobs/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),

    // ── Application Endpoints ──────────────────────────────────────────────
    applyToJob: builder.mutation({
      query: ({ jobId, body }) => ({ url: `/applications/apply/${jobId}`, method: 'POST', body }),
      // Invalidate Application LIST so admin dashboard updates, though this is public
      invalidatesTags: [{ type: 'Application', id: 'LIST' }],
    }),
    getApplications: builder.query({
      query: (params) => {
        let qs = '';
        if (params) {
          const search = new URLSearchParams();
          if (params.job) search.append('job', params.job);
          if (params.status) search.append('status', params.status);
          qs = search.toString() ? `?${search.toString()}` : '';
        }
        return `/applications${qs}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Application', id: _id })),
              { type: 'Application', id: 'LIST' },
            ]
          : [{ type: 'Application', id: 'LIST' }],
    }),
    getApplicationById: builder.query({
      query: (id) => `/applications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Application', id }],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/applications/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({ url: `/applications/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Application', id },
        { type: 'Application', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useAdminLoginMutation,
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useAddCommentMutation,
  useGetPortfolioQuery,
  useGetPortfolioByIdQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useDeletePortfolioMutation,
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useSendChatMessageMutation,
  useGetJobsQuery,
  useGetAllJobsAdminQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
  useGetApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
} = apiSlice
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
  tagTypes: ['Blog', 'Portfolio', 'Review'],
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
      query: ({ id, ...body }) => ({ url: `/blogs/${id}`, method: 'PATCH', body }),
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
      query: ({ id, ...body }) => ({ url: `/portfolio/${id}`, method: 'PATCH', body }),
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
      query: () => '/reviews',
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Review', id: _id })), { type: 'Review', id: 'LIST' }]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    createReview: builder.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: [{ type: 'Review', id: 'LIST' }],
    }),

    // ── Chat Endpoint ──────────────────────────────────────────────────────
    sendChatMessage: builder.mutation({
      query: (body) => ({ url: '/chat', method: 'POST', body }),
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
  useSendChatMessageMutation,
} = apiSlice
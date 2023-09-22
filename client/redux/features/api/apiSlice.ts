import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../auth/authSlice';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
	}),
	endpoints: (builder) => ({
		//endpoints here
		refreshToken: builder.query({
			query: (data) => ({
				url: 'refreshtoken',
				method: 'GET',
				credentials: 'include' as const,
			}),
		}),
		loadUser: builder.query({
			query: (data) => ({
				url: 'me',
				method: 'GET',
				credentials: 'include' as const,
			}),
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				try {
					const result = await queryFulfilled;
					dispatch(
						userLoggedIn({
							accessToken: result.data.accessToken,
							user: result.data.user,
						})
					);
				} catch (err: any) {
					console.log(err.message);
				}
			},
		}),
	}),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../redux/slices/userSlice';

interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  data: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
}

interface GroupRequest {
  name: string;
  description: string;
  members: string[];
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data: {
    groupId: string;
    name: string;
    description: string;
    members: string[];
  };
}
interface Message {
  sender: {
    _id: string;
    name: string;
    email:string
  };
  message: string;
  timestamp: string;
}

interface GetMessagesResponse {
  data: Message[];
}


interface ChatRequest {
  groupId: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    chatId: string;
    groupId: string;
    senderId: string;
    message: string;
    timestamp: string;
  };
}
export interface sendMessage{
  groupId: string;
  message: string;
}
interface InviteRequest {
  groupId: string;
  email: string;
}

interface InviteResponse {
  success: boolean;
  message: string;
  data: {
    inviteId: string;
    groupId: string;
    email: string;
    status: string;
  };
}



export interface JoinResponse {
  success: boolean;
  message: string;
  data: {
    groupId: string;
    userId: string;
    status: string;
  };
}

interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api",
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.warn('Access token expired, trying to refresh token...');

    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/user/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const accessToken = (refreshResult.data as RefreshResponse).data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        // Retry the original request with the new accessToken
        result = await baseQuery(args, api, extraOptions);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.dispatch(logout());
        console.warn('Refresh token is invalid, logging out...');
      }
    } else {
      console.warn('No refresh token found, logging out...');
      api.dispatch(logout());
    }
  }

  return result;
};

export const userService = createApi({
  reducerPath: 'authService',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (newUser) => ({
        url: '/user/signup',
        method: 'POST',
        body: newUser,
      }),
    }),
    createGroup: builder.mutation<GroupResponse, GroupRequest>({
      query: (newGroup) => ({
        url: '/group',
        method: 'POST',
        body: newGroup,
      }),
    }),
    groupbyId: builder.query<GroupResponse, any>({
      query: ({id}) => ({
        url: `/group/${id}`,
        method: 'GET',
      }),
    }),
    getGroups: builder.query<any,void>({
      query: () => ({
        url: '/user/groups',
        method: 'GET',
      }),
    }),
    addUserToGroup: builder.mutation<GroupResponse, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `/group/${groupId}/add-user`,
        method: 'POST',
        body: { userId },
      }),
    }),
    inviteUser: builder.mutation<InviteResponse, InviteRequest>({
      query: (inviteDetails) => ({
        url: `/group/invite`,
        method: 'POST',
        body: { email: inviteDetails.email, groupId: inviteDetails.groupId },
      }),
    }),
    joinGroup: builder.mutation<JoinResponse, any>({
      query: (joinDetails) => ({
        url: `/group/join`,
        method: 'POST',
        body: { groupId: joinDetails.groupId, inviteLink: joinDetails.inviteLink },
      }),
    }),
    sendMessage: builder.mutation<ChatResponse, ChatRequest>({
      query: (newMessage) => ({
        url: '/chat',
        method: 'POST',
        body: newMessage,
      }),
    }),
    getMessages: builder.query<GetMessagesResponse, string>({
      query: (groupId) => ({
        url: `/chat/${groupId}`,
        method: 'GET',
      }),
    }),
    logout: builder.query<{}, { accessToken: string }>({
      query: (accessToken) => ({
        url: '/user/logout',
        method: 'POST',
        body: { accessToken },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutQuery,
  useCreateGroupMutation,
  useGetGroupsQuery,
  useAddUserToGroupMutation,
  useInviteUserMutation,
  useJoinGroupMutation,
  useSendMessageMutation,
  useGetMessagesQuery,
  useLazyGetGroupsQuery,
  useGroupbyIdQuery
} = userService;

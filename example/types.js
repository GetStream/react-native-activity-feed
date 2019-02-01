// @flow

import type {
  StreamUser,
  StreamClient,
  ActivityResponse,
  StreamFeed,
  UserResponse as StreamUserResponse,
  ReactionResponse,
} from 'getstream';

import type { AppCtx } from 'expo-activity-feed';

export type UserData = {
  name: string,
  url?: string,
  desc?: string,
  profileImage?: string,
  coverImage?: string,
};

export type Client = StreamClient<UserData>;

export type StreamAppCtx = AppCtx<UserData>;

export type User = StreamUser<UserData>;
export type UserResponse = StreamUserResponse<UserData>;

export type OgData = {
  title: string,
  description: string,
  images: Array<{ image: string }>,
  url: string,
};
export type CustomActivityData = {
  content: string,
  link?: boolean,
  image?: string,
  attachments?: {
    images?: Array<string>,
    og?: OgData,
  },
};

export type ActivityData = ActivityResponse<UserData, CustomActivityData>;

export type Activities = Array<ActivityData>;

export type Feed = StreamFeed<UserData, CustomActivityData>;

export type CommentData = {
  text: string,
};

export type RepostData = {
  text: string,
};

export type Comment = ReactionResponse<UserData, CommentData>;

export type Heart = ReactionResponse<UserData, {}>;
export type Repost = ReactionResponse<UserData, RepostData>;

export type ReactionMap = {
  comment?: Array<Comment>,
  heart?: Array<Heart>,
  repost?: Array<Repost>,
};

export type NotificationActivity = ActivityResponse<UserData, {}>;
export type NotificationActivities = Array<ActivityResponse<UserData, {}>>;

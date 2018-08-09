// @flow

import * as React from 'react';
import type { NavigationScreenProp } from 'react-navigation';
import type {
  StreamCloudClient,
  StreamUser,
  StreamUserSession,
  ActivityResponse,
  StreamFeed,
  UserResponse as StreamUserResponse,
  EnrichedReactionResponse,
} from 'getstream';

import type { AppCtx } from 'react-native-activity-feed';

export type NavigationProps = {|
  navigation: NavigationScreenProp<{}>,
|};

export type ChildrenProps = {|
  children?: React.Node,
|};

export type UserData = {
  name?: string,
  url?: string,
  desc?: string,
  profileImage?: string,
  coverImage?: string,
};

export type CloudClient = StreamCloudClient<UserData>;

export type UserSession = StreamUserSession<UserData>;

export type StreamAppCtx = AppCtx<UserData>;

export type User = StreamUser<UserData>;
export type UserResponse = StreamUserResponse<UserData>;

export type CustomActivityData = {
  content: string,
  link?: boolean,
  image?: string,
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

export type Comment = EnrichedReactionResponse<UserData, CommentData>;

export type Heart = EnrichedReactionResponse<UserData, {}>;
export type Repost = EnrichedReactionResponse<UserData, RepostData>;

export type ReactionMap = {
  comment?: Array<Comment>,
  heart?: Array<Heart>,
  repost?: Array<Repost>,
};

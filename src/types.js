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

export type NavigationProps = {
  navigation: NavigationScreenProp<{}>,
};

export type ChildrenProps = {
  children?: React.Node,
};

type ReactComponentClass = typeof React.Component;
type ReactComponentFunction = (props: any) => ?React.Element<any>;
export type ReactElementCreator = ReactComponentClass | ReactComponentFunction;

export type UserData = {
  name?: string,
  url?: string,
  desc?: string,
  profileImage?: string,
  coverImage?: string,
};

export type CloudClient = StreamCloudClient<UserData>;

export type UserSession = StreamUserSession<UserData>;

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

export type Comment = EnrichedReactionResponse<UserData, CommentData>;

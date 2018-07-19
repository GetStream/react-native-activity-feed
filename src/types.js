// @flow

import type { NavigationScreenProp } from 'react-navigation';
import type {
  StreamUser,
  StreamUserSession,
  ActivityResponse,
  StreamFeed,
} from 'getstream';

export type NavigationProps = {
  navigation: NavigationScreenProp<{}>,
};

export type UserData = {
  name?: string,
  url?: string,
  desc?: string,
  profileImage?: string,
  coverImage?: string,
};

export type UserSession = StreamUserSession<UserData>;

export type User = StreamUser<UserData>;

export type CustomActivityData = {
  content: string,
  link?: boolean,
  image?: string,
};

export type ActivityData = ActivityResponse<UserData, CustomActivityData>;

export type Activities = Array<ActivityData>;

export type Feed = StreamFeed<UserData, CustomActivityData>;

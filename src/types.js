// @flow

import type { NavigationScreenProp } from 'react-navigation';
import type { StreamUser, StreamUserSession } from 'getstream';

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

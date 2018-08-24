// @flow

import * as React from 'react';
import type { NavigationScreenProp } from 'react-navigation';
import type {
  ActivityResponse,
  StreamUserSession,
  ReactionKindMap,
  UserResponse,
  ReactionRequestOptions,
} from 'getstream';
import type { AppCtx } from './Context';

export type NavigationProps = {|
  navigation?: NavigationScreenProp<{}>,
|};

export type ChildrenProps = {|
  children?: React.Node,
|};

// Copied from react native source code
type StyleSheetInternalStyleIdentifier = number;
type StyleSheetInstance = { [string]: StyleSheetInternalStyleIdentifier };

type StyleSheetLike = { [string]: {} } | StyleSheetInstance;

export type StylesProps = {|
  styles?: StyleSheetLike,
|};
export type StyleProps = {|
  style?: {} | StyleSheetInternalStyleIdentifier,
|};

type ReactComponentClass = Class<React.Component<any>>;
export type ReactComponentFunction = (props: any) => ?React.Element<any>;
export type ReactElementCreator = ReactComponentClass | ReactComponentFunction;

export type BaseActivityResponse = ActivityResponse<{}, {}>;
export type BaseAppCtx = AppCtx<{}>;
export type BaseUserSession = StreamUserSession<{}>;

export type BaseReactionMap = ReactionKindMap<Object, Object>;

export type BaseUserResponse = UserResponse<{}>;

export type UserData = {
  name?: string,
  profileImage?: string,
};

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

export type ToggleReactionCallbackFunction = (
  kind: string,
  activity: BaseActivityResponse,
  options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}>,
) => void | Promise<mixed>;

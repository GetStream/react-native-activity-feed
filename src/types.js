// @flow

import * as React from 'react';
import type { NavigationScreenProp } from 'react-navigation';
import type {
  ActivityResponse,
  StreamUserSession,
  ReactionKindMap,
  UserResponse,
  ReactionRequestOptions,
  EnrichedReactionResponse,
} from 'getstream';
import type { AppCtx, FeedCtx } from './Context';

export type NavigationScreen = NavigationScreenProp<{}>;

// Copied from react native source code
type StyleSheetInternalStyleIdentifier = number;
type StyleSheetInstance = { [string]: StyleSheetInternalStyleIdentifier };

export type StyleSheetLike = { [string]: {} } | StyleSheetInstance;
export type Style = {} | StyleSheetInternalStyleIdentifier;

type ReactComponentClass = Class<React.Component<any>>;
export type ReactComponentFunction = (props: any) => ?React.Element<any>;
export type ReactElementCreator = ReactComponentClass | ReactComponentFunction;

export type BaseActivityResponse = ActivityResponse<{}, {}>;
export type BaseAppCtx = AppCtx<{}>;
export type BaseFeedCtx = FeedCtx;
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
  text?: string,
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

export type AddReactionCallbackFunction = (
  kind: string,
  activity: BaseActivityResponse,
  options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}>,
) => void | Promise<mixed>;

export type RemoveReactionCallbackFunction = (
  kind: string,
  activity: BaseActivityResponse,
  id: string,
  options: { trackAnalytics?: boolean } & ReactionRequestOptions<{}>,
) => void | Promise<mixed>;

export type CommentData = {
  text: string,
};

export type Comment = EnrichedReactionResponse<UserData, CommentData>;

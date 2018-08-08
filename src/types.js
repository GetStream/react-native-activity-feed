// @flow

import * as React from 'react';
import type { NavigationScreenProp } from 'react-navigation';

export type NavigationProps = {
  navigation: NavigationScreenProp<{}>,
};

export type ChildrenProps = {
  children?: React.Node,
};

type ReactComponentClass = Class<React.Component<any>>;
type ReactComponentFunction = (props: any) => ?React.Element<any>;
export type ReactElementCreator = ReactComponentClass | ReactComponentFunction;

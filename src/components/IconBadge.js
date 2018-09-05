// @flow
import * as React from 'react';
import { View, Text } from 'react-native';
import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';

import type { BaseFeedCtx, StyleSheetLike } from '../types';

export type Props = {|
  feedGroup: string,
  userId?: string,
  styles?: StyleSheetLike,
  showNumber?: boolean,
  hidden?: boolean,
  children: React.Node,
|};

type PropsInner = {| ...Props, ...BaseFeedCtx |};

export type State = {
  unread: number,
  subscription: any,
};

/**
 * A badge icon that notifies the user if a feed has new activities
 * @example ./examples/IconBadge.md
 */
export default class IconBadge extends React.Component<Props> {
  static defaultProps = {
    feedGroup: 'notification',
    showNumber: false,
  };

  render() {
    return (
      <Feed feedGroup={this.props.feedGroup} userId={this.props.userId} notify>
        <FeedContext.Consumer>
          {(feedCtx) => {
            return <IconBadgeInner {...this.props} {...feedCtx} />;
          }}
        </FeedContext.Consumer>
      </Feed>
    );
  }
}

class IconBadgeInner extends React.Component<PropsInner, State> {
  async componentDidMount() {
    await this.props.refreshUnreadUnseen();
  }

  render() {
    const { children, showNumber, hidden } = this.props;

    let styles = buildStylesheet('iconBadge', this.props.styles);

    return (
      <View style={styles.container}>
        {children}
        {!hidden &&
          this.props.unseen > 0 && (
            <View style={styles.icon}>
              <View style={styles.iconInner}>
                {showNumber && (
                  <Text style={styles.text}>{this.props.unseen}</Text>
                )}
              </View>
            </View>
          )}
      </View>
    );
  }
}

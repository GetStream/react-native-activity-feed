// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { StreamContext } from '../Context';
import { buildStylesheet } from '../styles';

import type { BaseAppCtx, ReactElementCreator, StyleSheetLike } from '../types';

export type Props = {|
  feedGroup: string,
  mainElement: ReactElementCreator,
  styles?: StyleSheetLike,
  showNumber?: boolean,
  hidden?: boolean,
|};

type PropsInner = {| ...Props, ...BaseAppCtx |};

export type State = {
  loaded: boolean,
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
      <StreamContext.Consumer>
        {(appCtx) => {
          return <IconBadgeInner {...this.props} {...appCtx} />;
        }}
      </StreamContext.Consumer>
    );
  }
}

class IconBadgeInner extends React.Component<PropsInner, State> {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      unread: 0,
      subscription: null,
    };
  }

  componentDidMount() {
    this.props.session
      .feed(this.props.feedGroup)
      .get({ limit: 1 })
      .then((data) => {
        // $FlowFixMe
        this.setState({ loaded: true, unread: data.unread });
      });

    const user = this.props.session.feed(
      this.props.feedGroup,
      this.props.user.id,
    );

    const callback = (data) => {
      this.setState((prevState) => ({
        unread: prevState.unread + data.new.length - data.deleted.length,
      }));
    };

    function successCallback() {
      console.log('now listening to changes in realtime');
      this.setState({ subscription });
    }

    function failCallback(err) {
      console.log('something went wrong, check the console logs');
      console.error(err);
    }

    const subscription = user
      .subscribe(callback)
      .then(successCallback, failCallback);
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.cancel();
    }
  }

  _markAsRead() {
    this.setState({
      unread: 0,
    });
  }

  render() {
    const { mainElement, showNumber, hidden } = this.props;

    let styles = buildStylesheet('iconBadge', this.props.styles);

    return (
      <View style={styles.container}>
        {mainElement}
        {!hidden &&
          this.state.unread > 0 &&
          this.state.loaded && (
            <View style={styles.icon}>
              <View style={styles.iconInner}>
                {showNumber && (
                  <Text style={styles.text}>{this.state.unread}</Text>
                )}
              </View>
            </View>
          )}
      </View>
    );
  }
}

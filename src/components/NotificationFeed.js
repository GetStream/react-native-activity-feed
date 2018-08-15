// @flow
import * as React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import URL from 'url-parse';

import { StreamContext } from '../Context';
import { mergeStyles } from '../utils';
import { buildStylesheet } from '../styles';

import type {
  NavigationProps,
  ChildrenProps,
  StylesProps,
  BaseActivityResponse,
  BaseAppCtx,
  BaseUserSession,
  ReactComponentFunction,
} from '../types';
import type { FeedRequestOptions, FeedResponse, StreamFeed } from 'getstream';

type Props = {|
  feedGroup?: string,
  userId?: string,
  options?: FeedRequestOptions,
  renderGroup: ReactComponentFunction,
  doFeedRequest?: (
    session: BaseUserSession,
    feedGroup: string,
    userId?: string,
    options?: FeedRequestOptions,
  ) => Promise<FeedResponse<{}, {}>>,
  analyticsLocation?: string,
  noPagination?: boolean,
  ...NavigationProps,
  ...ChildrenProps,
  ...StylesProps,
|};

export default function NotificationFeed(props: Props) {
  return (
    <StreamContext.Consumer>
      {(appCtx) => <NotificationFeedInner {...props} {...appCtx} />}
    </StreamContext.Consumer>
  );
}

type PropsInner = {| ...Props, ...BaseAppCtx |};
type State = {
  groups: Array<Object>,
  refreshing: boolean,
  lastResponse: ?FeedResponse<{}, {}>,
};

class NotificationFeedInner extends React.Component<PropsInner, State> {
  constructor(props: PropsInner) {
    super(props);
    this.state = {
      groups: [],
      refreshing: false,
      lastResponse: null,
    };
  }

  static defaultProps = {
    styles: {}
  };

  _feedGroup = () => {
    return this.props.feedGroup || 'notification';
  };

  _doFeedRequest = async (extraOptions) => {
    let options: FeedRequestOptions = {
      ...this.props.options,
      ...extraOptions,
    };

    let { doFeedRequest } = this.props;
    if (doFeedRequest) {
      return await doFeedRequest(
        this.props.session,
        this._feedGroup(),
        this.props.userId,
        options,
      );
    }

    let feed: StreamFeed<{}, {}> = this.props.session.feed(
      this._feedGroup(),
      this.props.userId,
    );
    return await feed.get(options);
  };

  _refresh = async () => {
    this.setState({ refreshing: true });
    let response = await this._doFeedRequest();
    this.setState({
      groups: response.results,
      refreshing: false,
      lastResponse: response,
    });
  };

  _loadNextPage = async () => {
    let lastResponse = this.state.lastResponse;
    if (!lastResponse || !lastResponse.next) {
      return;
    }
    let cancel = false;
    await this.setState((prevState) => {
      if (prevState.refreshing) {
        cancel = true;
        return {};
      }
      return { refreshing: true };
    });

    if (cancel) {
      return;
    }

    let nextURL = new URL(lastResponse.next, true);
    let response = await this._doFeedRequest(nextURL.query);
    return this.setState((prevState) => {
      return {
        groups: prevState.groups.concat(response.results),
        refreshing: false,
        lastResponse: response,
      };
    });
  };

  async componentDidMount() {
    await this._refresh();
  }

  _renderWrappedGroup = ({ item }: { item: BaseActivityResponse }) => {
    return (
      <PureItemWrapper
        renderItem={this._renderGroup}
        item={item}
        navigation={this.props.navigation}
        feedGroup={this._feedGroup()}
        userId={this.props.userId}
      />
    );
  };

  _renderGroup = (item: BaseActivityResponse) => {
    let args = {
      activityGroup: item,
      navigation: this.props.navigation,
      feedGroup: this._feedGroup(),
      userId: this.props.userId,
      styles: this.props.styles.activity,
    };
    return this.props.renderGroup(args);
  };

  render() {
    let styles = buildStylesheet('notificationFeed', this.props.styles);
    return (
      <FlatList
        ListHeaderComponent={this.props.children}
        style={mergeStyles('container', styles, this.props)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._refresh}
          />
        }
        data={this.state.groups}
        keyExtractor={(item) => item.id}
        renderItem={this._renderWrappedGroup}
        onEndReached={this.props.noPagination ? undefined : this._loadNextPage}
      />
    );
  }
}

type PureItemWrapperProps = {
  renderItem: (item: any) => any,
  item: any,
};

class PureItemWrapper extends React.PureComponent<PureItemWrapperProps> {
  render() {
    return this.props.renderItem(this.props.item);
  }
}

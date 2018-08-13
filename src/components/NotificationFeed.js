// @flow
import * as React from 'react';
import { ScrollView, FlatList, RefreshControl, StyleSheet } from 'react-native';

import { StreamContext } from '../Context';
import { mergeStyles } from '../utils';
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
  ...NavigationProps,
  ...ChildrenProps,
  ...StylesProps,
|};

export default function NotificationFeed(props: Props) {
  return (
    <StreamContext.Consumer>
      {(appCtx) => <FlatFeedInner {...props} {...appCtx} />}
    </StreamContext.Consumer>
  );
}

type PropsInner = {| ...Props, ...BaseAppCtx |};
type State = {
  groups: Array<Object>,
  refreshing: boolean,
};

class FlatFeedInner extends React.Component<PropsInner, State> {
  constructor(props: PropsInner) {
    super(props);
    this.state = {
      groups: [],
      refreshing: false,
    };
  }
  _feedGroup = () => {
    return this.props.feedGroup || 'notification';
  };

  _refresh = async () => {
    this.setState({ refreshing: true });

    let options: FeedRequestOptions = {
      withReactionCounts: true,
      withOwnReactions: true,
      ...this.props.options,
    };

    let response;
    let { doFeedRequest } = this.props;
    if (doFeedRequest) {
      response = await doFeedRequest(
        this.props.session,
        this._feedGroup(),
        this.props.userId,
        options,
      );
    } else {
      let feed: StreamFeed<{}, {}> = this.props.session.feed(
        this._feedGroup(),
        this.props.userId,
      );
      response = await feed.get(options);
    }

    this.setState({
      groups: response.results,
      refreshing: false,
    });
  };

  async componentDidMount() {
    await this._refresh();
  }

  _renderGroup = ({ item }: { item: BaseActivityResponse }) => {
    let args = {
      activityGroup: item,
      feedGroup: this._feedGroup(),
      userId: this.props.userId,
    };

    return this.props.renderGroup(args);
  };

  render() {
    return (
      <ScrollView
        style={mergeStyles('container', styles, this.props)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._refresh}
          />
        }
      >
        {this.props.children}
        <FlatList
          data={this.state.groups}
          keyExtractor={(item) => item.id}
          renderItem={this._renderGroup}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

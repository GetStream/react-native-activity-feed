// @flow
import * as React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import Activity from './Activity';
import NewActivitiesNotification from './NewActivitiesNotification';

import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';
import { smartRender } from '../utils';

import type {
  NavigationScreen,
  StyleSheetLike,
  BaseFeedCtx,
  BaseUserSession,
  Renderable,
} from '../types';
import type {
  FeedRequestOptions,
  FeedResponse,
  ActivityResponse,
} from 'getstream';

type Props = {|
  feedGroup: string,
  userId?: string,
  /** read options for the API client (eg. limit, ranking, ...) */
  options?: FeedRequestOptions,
  Activity: Renderable,
  /** the component to use to render new activities notification */
  Notifier: Renderable,
  /** if true, feed shows the Notifier component when new activities are added */
  notify: boolean,
  //** the element that renders the feed footer */
  Footer?: Renderable,
  //** the feed read hander (change only for advanced/complex use-cases) */
  doFeedRequest?: (
    client: BaseUserSession,
    feedGroup: string,
    userId?: string,
    options?: FeedRequestOptions,
  ) => Promise<FeedResponse<{}, {}>>,
  //** turns off pagination */
  noPagination?: boolean,
  analyticsLocation?: string,
  onRefresh?: () => mixed,
  children?: React.Node,
  styles?: StyleSheetLike,
  navigation?: NavigationScreen,
|};

/**
 * Renders a feed of activities, this component is a StreamApp consumer
 * and must always be a child of the <StreamApp> element
 */
export default class FlatFeed extends React.Component<Props> {
  static defaultProps = {
    styles: {},
    feedGroup: 'timeline',
    notify: false,
    Activity: Activity,
    Notifier: NewActivitiesNotification,
  };

  render() {
    return (
      <Feed
        feedGroup={this.props.feedGroup}
        userId={this.props.userId}
        options={this.props.options}
        notify={this.props.notify}
        doFeedRequest={this.props.doFeedRequest}
      >
        <FeedContext.Consumer>
          {(feedCtx) => {
            return <FlatFeedInner {...this.props} {...feedCtx} />;
          }}
        </FeedContext.Consumer>
      </Feed>
    );
  }
}

type PropsInner = {| ...Props, ...BaseFeedCtx |};
class FlatFeedInner extends React.Component<PropsInner> {
  listRef = React.createRef();
  _refresh = async () => {
    this._scrollToTop();
    await this.props.refresh(this.props.options);
    this._scrollToTop();
  };

  _scrollToTop() {
    let ref = this.listRef;
    if (ref && ref.current) {
      ref.current.scrollToOffset({ offset: 0 });
    }
  }
  async componentDidMount() {
    await this._refresh();
  }

  _renderWrappedActivity = ({ item }: { item: any }) => {
    return (
      <ImmutableItemWrapper
        renderItem={this._renderActivity}
        item={item}
        navigation={this.props.navigation}
        feedGroup={this.props.feedGroup}
        userId={this.props.userId}
      />
    );
  };

  _childProps = () => ({
    onToggleReaction: this.props.onToggleReaction,
    onAddReaction: this.props.onAddReaction,
    onRemoveReaction: this.props.onRemoveReaction,
    navigation: this.props.navigation,
    feedGroup: this.props.feedGroup,
    userId: this.props.userId,
  });

  _renderActivity = (item: ActivityResponse<Object, Object>) => {
    let args = {
      activity: item,
      // $FlowFixMe
      styles: this.props.styles.activity,
      ...this._childProps(),
    };

    return smartRender(this.props.Activity, { ...args });
  };

  render() {
    let styles = buildStylesheet('flatFeed', this.props.styles);
    let notifierProps = {
      adds: this.props.realtimeAdds,
      deletes: this.props.realtimeDeletes,
      onPress: this._refresh,
    };

    return (
      <React.Fragment>
        {smartRender(this.props.Notifier, notifierProps)}
        <FlatList
          ListHeaderComponent={this.props.children}
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.refresh}
            />
          }
          data={this.props.activityOrder.map((id) =>
            this.props.activities.get(id),
          )}
          keyExtractor={(item) => item.get('id')}
          renderItem={this._renderWrappedActivity}
          onEndReached={
            this.props.noPagination ? undefined : this.props.loadNextPage
          }
          ref={this.listRef}
        />
        {smartRender(this.props.Footer, this._childProps())}
      </React.Fragment>
    );
  }
}

type ImmutableItemWrapperProps = {
  renderItem: (item: any) => any,
  item: any,
};

class ImmutableItemWrapper extends React.PureComponent<
  ImmutableItemWrapperProps,
> {
  render() {
    return this.props.renderItem(this.props.item.toJS());
  }
}

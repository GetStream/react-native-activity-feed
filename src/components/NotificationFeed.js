// @flow
import * as React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';
import NewActivitiesNotification from './NewActivitiesNotification';
import { smartRender } from '../utils';

import type {
  NavigationScreen,
  StyleSheetLike,
  BaseActivityResponse,
  BaseFeedCtx,
  BaseUserSession,
  Renderable,
} from '../types';
import type { FeedRequestOptions, FeedResponse } from 'getstream';

type Props = {|
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  Group: Renderable,
  /** if true, feed shows the NewActivitiesNotification component when new activities are added */
  notify?: boolean,
  /** the component to use to render new activities notification */
  Notifier: Renderable,
  doFeedRequest?: (
    session: BaseUserSession,
    feedGroup: string,
    userId?: string,
    options?: FeedRequestOptions,
  ) => Promise<FeedResponse<{}, {}>>,
  analyticsLocation?: string,
  noPagination?: boolean,
  children?: React.Node,
  styles: StyleSheetLike,
  navigation?: NavigationScreen,
  /** Any props the react native FlatList accepts */
  flatListProps?: {},
|};

export default class NotificationFeed extends React.Component<Props> {
  static defaultProps = {
    feedGroup: 'notification',
    styles: {},
    Notifier: NewActivitiesNotification,
  };

  render() {
    return (
      <Feed
        feedGroup={this.props.feedGroup}
        userId={this.props.userId}
        options={makeDefaultOptions(this.props.options)}
        notify={this.props.notify}
        doFeedRequest={this.props.doFeedRequest}
      >
        <FeedContext.Consumer>
          {(feedCtx) => {
            return <NotificationFeedInner {...this.props} {...feedCtx} />;
          }}
        </FeedContext.Consumer>
      </Feed>
    );
  }
}

const makeDefaultOptions = (options) => {
  let copy = { ...options };
  if (copy.mark_seen === undefined) {
    copy.mark_seen = true;
  }
  return copy;
};

type PropsInner = {| ...Props, ...BaseFeedCtx |};
class NotificationFeedInner extends React.Component<PropsInner> {
  listRef = React.createRef();
  _refresh = async () => {
    await this.props.refresh(makeDefaultOptions(this.props.options));
    let ref = this.listRef;
    if (ref && ref.current) {
      ref.current.scrollToOffset({ offset: 0 });
    }
  };
  async componentDidMount() {
    await this._refresh();
  }

  _renderWrappedGroup = ({ item }: { item: BaseActivityResponse }) => {
    return (
      <ImmutableItemWrapper
        renderItem={this._renderGroup}
        item={item}
        navigation={this.props.navigation}
        feedGroup={this.props.feedGroup}
        userId={this.props.userId}
      />
    );
  };

  _renderGroup = (item: BaseActivityResponse) => {
    let args = {
      activityGroup: item,
      navigation: this.props.navigation,
      feedGroup: this.props.feedGroup,
      userId: this.props.userId,
      styles: this.props.styles.activity,
      onToggleReaction: this.props.onToggleReaction,
      onAddReaction: this.props.onAddReaction,
      onRemoveReaction: this.props.onRemoveReaction,
    };
    return smartRender(this.props.Group, args);
  };

  render() {
    let styles = buildStylesheet('notificationFeed', this.props.styles);
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
              onRefresh={this._refresh}
            />
          }
          data={this.props.activityOrder.map((id) =>
            this.props.activities.get(id),
          )}
          keyExtractor={(item) => item.get('id')}
          renderItem={this._renderWrappedGroup}
          onEndReached={
            this.props.noPagination ? undefined : this.props.loadNextPage
          }
          ref={this.listRef}
          {...this.props.flatListProps}
        />
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

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
  BaseReaction,
  BaseFeedCtx,
  BaseClient,
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
    client: BaseClient,
    feedGroup: string,
    userId?: string,
    options?: FeedRequestOptions,
  ) => Promise<FeedResponse<{}, {}>>,
  /** Override reaction add request */
  doReactionAddRequest?: (
    kind: string,
    activity: BaseActivityResponse,
    data?: {},
    options: {},
  ) => mixed,
  /** Override reaction delete request */
  doReactionDeleteRequest?: (id: string) => mixed,
  /** Override child reaction add request */
  doChildReactionAddRequest?: (
    kind: string,
    activity: BaseReaction,
    data?: {},
    options: {},
  ) => mixed,
  /** Override child reaction delete request */
  doChildReactionDeleteRequest?: (id: string) => mixed,
  analyticsLocation?: string,
  noPagination?: boolean,
  children?: React.Node,
  styles: StyleSheetLike,
  navigation?: NavigationScreen,
  /** Any props the react native FlatList accepts */
  flatListProps?: {},
  setListRef?: (ref: any) => any,
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
        doReactionAddRequest={this.props.doReactionAddRequest}
        doReactionDeleteRequest={this.props.doReactionDeleteRequest}
        doChildReactionAddRequest={this.props.doChildReactionAddRequest}
        doChildReactionDeleteRequest={this.props.doChildReactionDeleteRequest}
      >
        <FeedContext.Consumer>
          {(feedCtx) => <NotificationFeedInner {...this.props} {...feedCtx} />}
        </FeedContext.Consumer>
      </Feed>
    );
  }
}

const makeDefaultOptions = (options) => {
  const copy = { ...options };
  if (copy.mark_seen === undefined) {
    copy.mark_seen = true;
  }
  return copy;
};

type PropsInner = {| ...Props, ...BaseFeedCtx |};
class NotificationFeedInner extends React.Component<PropsInner> {
  _refresh = async () => {
    await this.props.refresh(makeDefaultOptions(this.props.options));
    // $FlowFixMe
    const ref = this.listRef;
    if (ref) {
      ref.scrollToOffset({ offset: 0 });
    }
  };
  async componentDidMount() {
    await this._refresh();
  }

  _renderWrappedGroup = ({ item }: { item: BaseActivityResponse }) => (
    <ImmutableItemWrapper
      renderItem={this._renderGroup}
      item={item}
      navigation={this.props.navigation}
      feedGroup={this.props.feedGroup}
      userId={this.props.userId}
    />
  );

  _childProps = () => ({
    onRemoveActivity: this.props.onRemoveActivity,
    onToggleReaction: this.props.onToggleReaction,
    onAddReaction: this.props.onAddReaction,
    onRemoveReaction: this.props.onRemoveReaction,
    onToggleChildReaction: this.props.onToggleChildReaction,
    onAddChildReaction: this.props.onAddChildReaction,
    onRemoveChildReaction: this.props.onRemoveChildReaction,
    onMarkAsRead: this.props.onMarkAsRead,
    onMarkAsSeen: this.props.onMarkAsSeen,
    navigation: this.props.navigation,
    feedGroup: this.props.feedGroup,
    userId: this.props.userId,
  });

  _renderGroup = (item: BaseActivityResponse) => {
    const args = {
      activityGroup: item,
      styles: this.props.styles.activity,
      ...this._childProps(),
    };
    return smartRender(this.props.Group, args);
  };

  render() {
    const styles = buildStylesheet('notificationFeed', this.props.styles);
    const notifierProps = {
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
          ref={(ref) => {
            this.props.setListRef === undefined
              ? null
              : this.props.setListRef(ref);
            // $FlowFixMe
            this.listRef = ref;
          }}
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

class ImmutableItemWrapper extends React.PureComponent<ImmutableItemWrapperProps> {
  render() {
    return this.props.renderItem(this.props.item.toJS());
  }
}

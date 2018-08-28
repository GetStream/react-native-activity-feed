// @flow
import * as React from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';
import NewActivitiesNotification from './NewActivitiesNotification';

import type {
  NavigationScreen,
  StyleSheetLike,
  BaseActivityResponse,
  BaseFeedCtx,
  BaseUserSession,
  ReactComponentFunction,
  ReactElementCreator,
} from '../types';
import type { FeedRequestOptions, FeedResponse } from 'getstream';

type Props = {|
  feedGroup: string,
  userId?: string,
  options?: FeedRequestOptions,
  renderGroup: ReactComponentFunction,
  /** if true, feed shows the NewActivitiesNotification component when new activities are added */
  notify?: boolean,
  /** the component to use to render new activities notification */
  NewActivitiesComponent?: ReactElementCreator,
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
|};

export default class NotificationFeed extends React.Component<Props> {
  static defaultProps = {
    feedGroup: 'notification',
    styles: {},
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
    return this.props.renderGroup(args);
  };

  getNewActivitiesComponent() {
    if (this.props.notify || this.props.NewActivitiesComponent) {
      return this.props.NewActivitiesComponent
        ? this.props.NewActivitiesComponent
        : NewActivitiesNotification;
    }
  }

  render() {
    let styles = buildStylesheet('notificationFeed', this.props.styles);
    let NewActivitiesComponent = this.getNewActivitiesComponent();
    if (NewActivitiesComponent) {
      NewActivitiesComponent = (
        <NewActivitiesComponent
          adds={this.props.realtimeAdds}
          deletes={this.props.realtimeDeletes}
          onPress={this._refresh}
        />
      );
    }

    return (
      <React.Fragment>
        {NewActivitiesComponent}
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

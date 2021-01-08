//
import * as React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';

import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';
import NewActivitiesNotification from './NewActivitiesNotification';
import { smartRender } from '../utils';

export default class NotificationFeed extends React.Component {
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

// We have duplicated FeedRequestOptionsPropTypeShape at multiple places in codebase
// We can't abstract it out since stylegudist doesn't work with imported types.
const FeedRequestOptionsPropTypeShape = {
  withReactionCounts: PropTypes.bool,
  withRecentReactions: PropTypes.bool,
  withOwnReactions: PropTypes.bool,
  reactions: PropTypes.shape({
    recent: PropTypes.bool,
    own: PropTypes.bool,
    counts: PropTypes.bool,
  }),
  limit: PropTypes.number,
  offset: PropTypes.number,
  id_lt: PropTypes.string,
  id_lte: PropTypes.string,
  id_gt: PropTypes.string,
  id_gte: PropTypes.string,
  ranking: PropTypes.string,
  mark_seen: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  mark_read: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  refresh: PropTypes.bool,
};

NotificationFeed.propTypes = {
  feedGroup: PropTypes.string,
  userId: PropTypes.string,
  options: PropTypes.shape(FeedRequestOptionsPropTypeShape),
  Group: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /** if true, feed shows the NewActivitiesNotification component when new activities are added */
  notify: PropTypes.bool,
  /** the component to use to render new activities notification */
  Notifier: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /**
   * @param {*} client
   * @param {*} feedGroup
   * @param {*} userId
   * @param {*} options
   */
  doFeedRequest: PropTypes.func,
  /** Override reaction add request */
  /**
   *
   * @param {*} kind
   * @param {*} activity
   * @param {*} data
   * @param {*} options
   */
  doReactionAddRequest: PropTypes.func,
  /**
   * Override reaction delete request
   * @param {string} id
   */
  doReactionDeleteRequest: PropTypes.func,
  /**
   * Override child reaction add request
   * @param {*} kind
   * @param {*} activity
   * @param {*} data
   * @param {*} options
   */
  doChildReactionAddRequest: PropTypes.func,
  /**
   * Override child reaction delete request
   * @param {string} id
   */
  doChildReactionDeleteRequest: PropTypes.func,
  analyticsLocation: PropTypes.string,
  noPagination: PropTypes.bool,
  styles: PropTypes.object,
  // Navigation props
  navigation: PropTypes.object,
  /** Any props the react native FlatList accepts */
  flatListProps: PropTypes.object,
  /**
   * @param {*} ref
   */
  setListRef: PropTypes.func,
};

const makeDefaultOptions = (options) => {
  const copy = { ...options };
  if (copy.mark_seen === undefined) {
    copy.mark_seen = true;
  }
  return copy;
};

class NotificationFeedInner extends React.Component {
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

  _renderWrappedGroup = ({ item }) => (
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

  _renderGroup = (item) => {
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

class ImmutableItemWrapper extends React.PureComponent {
  render() {
    return this.props.renderItem(this.props.item.toJS());
  }
}

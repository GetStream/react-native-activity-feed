//
import * as React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';

import Activity from './Activity';
import NewActivitiesNotification from './NewActivitiesNotification';
import { Feed, FeedContext } from '../Context';
import { buildStylesheet } from '../styles';
import { smartRender } from '../utils';

/**
 * Renders a feed of activities, this component is a StreamApp consumer
 * and must always be a child of the <StreamApp> element
 */
export default class FlatFeed extends React.Component {
  static defaultProps = {
    styles: {},
    feedGroup: 'timeline',
    notify: false,
    Activity,
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
        doReactionAddRequest={this.props.doReactionAddRequest}
        doReactionDeleteRequest={this.props.doReactionDeleteRequest}
        doChildReactionAddRequest={this.props.doChildReactionAddRequest}
        doChildReactionDeleteRequest={this.props.doChildReactionDeleteRequest}
        doReactionsFilterRequest={this.props.doReactionsFilterRequest}
      >
        <FeedContext.Consumer>
          {(feedCtx) => <FlatFeedInner {...this.props} {...feedCtx} />}
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

FlatFeed.propTypes = {
  feedGroup: PropTypes.string,
  userId: PropTypes.string,
  /** read options for the API client (eg. limit, ranking, ...) */
  options: PropTypes.shape(FeedRequestOptionsPropTypeShape),
  Activity: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /** the component to use to render new activities notification */
  Notifier: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /** if true, feed shows the Notifier component when new activities are added */
  notify: PropTypes.bool,
  //** the element that renders the feed footer */
  Footer: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /**
   * The feed read hander (change only for advanced/complex use-cases)
   *
   * @param {*} client   Base client
   * @param {*} feedGroup string
   * @param {*} userId string
   * @param {*} options feed request ptions
   */
  doFeedRequest: PropTypes.func,
  /**
   * Override reaction add request
   * @param {*} kind string
   * @param {*} activity object
   * @param {*} data object
   * @param {*} options object
   */
  doReactionAddRequest: PropTypes.func,
  /**
   * Override reaction delete request
   * @param {*} id string
   */
  doReactionDeleteRequest: PropTypes.func,
  /**
   * Override child reaction add request
   * @param {string} kind
   * @param {object} activity Reaction object
   * @param {object} data
   * @param {object} options
   */
  doChildReactionAddRequest: PropTypes.func,
  /**
   * Override child reaction delete request
   * @param {*} id
   */
  doChildReactionDeleteRequest: PropTypes.func,
  /**
   * Override reactions filter request
   * @param {*} options object
   * @returns Promise
   */
  doReactionsFilterRequest: PropTypes.func,
  //** turns off pagination */
  noPagination: PropTypes.bool,
  analyticsLocation: PropTypes.string,
  onRefresh: PropTypes.func,
  styles: PropTypes.object,
  /** Navigation props */
  navigation: PropTypes.object,
  /** Any props the react native FlatList accepts */
  flatListProps: PropTypes.object,
  /**
   * Using `setListRef` you can set your own reference to the FlatList that's being used inside the FlatFeed. This works as follows:
   * `setListRef={(ref) => this.yourRef = ref}`
   * One example where this might be needed is when you want to refresh the feed when something happens. Then you can run:
   * `this.yourRef.onRefresh(true)`
   *
   * @param {ref} ref
   */
  setListRef: PropTypes.func,
};

class FlatFeedInner extends React.Component {
  _refresh = async () => {
    this._scrollToTop();
    await this.props.refresh(this.props.options);
    this._scrollToTop();
  };

  _scrollToTop() {
    // $FlowFixMe
    const ref = this.listRef;
    if (ref) {
      ref.scrollToOffset({ offset: 0 });
    }
  }
  async componentDidMount() {
    await this._refresh();
  }

  _renderWrappedActivity = ({ item }) => (
    <ImmutableItemWrapper
      renderItem={this._renderActivity}
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
    navigation: this.props.navigation,
    feedGroup: this.props.feedGroup,
    userId: this.props.userId,
  });

  _renderActivity = (item) => {
    const args = {
      activity: item,
      // $FlowFixMe
      styles: this.props.styles.activity,
      ...this._childProps(),
    };

    return smartRender(this.props.Activity, { ...args });
  };

  render() {
    const styles = buildStylesheet('flatFeed', this.props.styles);
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
          refreshing={this.props.refreshing}
          onRefresh={this.props.refresh}
          data={this.props.activityOrder.map((id) =>
            this.props.activities.get(id),
          )}
          keyExtractor={(item) => item.get('id')}
          renderItem={this._renderWrappedActivity}
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
        {smartRender(this.props.Footer, this._childProps())}
      </React.Fragment>
    );
  }
}

class ImmutableItemWrapper extends React.PureComponent {
  render() {
    return this.props.renderItem(this.props.item.toJS());
  }
}

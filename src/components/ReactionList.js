//
import * as React from 'react';
import { FlatList } from 'react-native';
import { buildStylesheet } from '../styles';
import { FeedContext } from '../Context';

import { smartRender } from '../utils';
import immutable from 'immutable';
import LoadMoreButton from './LoadMoreButton';

/**
 * To use this component in a `FlatFeed` you have to provide the following
 * props to `FlatFeed`:
 * ```
 * options={{withOwnReactions: true}}
 * ```
 */
export default class ReactionList extends React.PureComponent {
  static defaultProps = {
    LoadMoreButton,
    infiniteScroll: false,
    noPagination: false,
    oldestToNewest: false,
    reverseOrder: false,
  };

  render() {
    return (
      <FeedContext.Consumer>
        {(appCtx) => <ReactionListInner {...this.props} {...appCtx} />}
      </FeedContext.Consumer>
    );
  }
}

class ReactionListInner extends React.Component {
  initReactions() {
    const {
      activityId,
      activities,
      reactionKind,
      getActivityPath,
      oldestToNewest,
    } = this.props;
    if (!oldestToNewest) {
      return;
    }

    const activityPath = this.props.activityPath || getActivityPath(activityId);
    const orderPrefix = 'oldest';
    const reactions_extra = activities.getIn([
      ...activityPath,
      orderPrefix + '_reactions_extra',
    ]);
    if (reactions_extra) {
      return;
    }
    return this.props.loadNextReactions(
      activityId,
      reactionKind,
      activityPath,
      oldestToNewest,
    );
  }

  componentDidMount() {
    this.initReactions();
  }

  componentDidUpdate() {
    this.initReactions();
  }

  render() {
    const {
      activityId,
      activities,
      reactionKind,
      getActivityPath,
      oldestToNewest,
      reverseOrder,
    } = this.props;
    const activityPath = this.props.activityPath || getActivityPath(activityId);
    let orderPrefix = 'latest';
    if (oldestToNewest) {
      orderPrefix = 'oldest';
    }

    const reactionsOfKind = activities.getIn(
      [...activityPath, orderPrefix + '_reactions', reactionKind],
      immutable.List(),
    );

    const reactions_extra = activities.getIn([
      ...activityPath,
      orderPrefix + '_reactions_extra',
    ]);
    let nextUrl = 'https://api.stream-io-api.com/';
    if (reactions_extra) {
      nextUrl = reactions_extra.getIn([reactionKind, 'next'], '');
    }

    const refreshing = activities.getIn(
      [
        ...activityPath,
        orderPrefix + '_reactions_extra',
        reactionKind,
        'refreshing',
      ],
      false,
    );

    const LoadMoreButton = this.props.LoadMoreButton;

    const styles = buildStylesheet('reactionList', this.props.styles);

    if (!reactionsOfKind.size) {
      return null;
    }
    const loadMoreButton =
      this.props.noPagination || !nextUrl || this.props.infiniteScroll
        ? null
        : smartRender(LoadMoreButton, {
            refreshing,
            styles,
            onPress: () =>
              this.props.loadNextReactions(
                activityId,
                reactionKind,
                activityPath,
                oldestToNewest,
              ),
          });
    // <LoadMoreButton
    //   refreshing={refreshing}
    //   styles={styles}
    //   onPress={() =>
    //     this.props.loadNextReactions(
    //       activityId,
    //       reactionKind,
    //       activityPath,
    //       oldestToNewest,
    //     )
    //   }
    // />
    return (
      <React.Fragment>
        {this.props.children}
        {reverseOrder && loadMoreButton}
        <FlatList
          listKey={reactionKind + '-' + activityId}
          style={styles.container}
          refreshing={refreshing}
          data={reactionsOfKind.toArray()}
          keyExtractor={(item) => item.get('id') + activityPath}
          renderItem={this._renderWrappedReaction}
          inverted={reverseOrder}
          onEndReached={
            this.props.noPagination || !this.props.infiniteScroll
              ? undefined
              : () =>
                  this.props.loadNextReactions(
                    activityId,
                    reactionKind,
                    activityPath,
                    oldestToNewest,
                  )
          }
          {...this.props.flatListProps}
        />
        {!reverseOrder && loadMoreButton}
      </React.Fragment>
    );
  }

  _renderReaction = (reaction) => {
    const { Reaction } = this.props;
    return smartRender(Reaction, { reaction });
  };

  _renderWrappedReaction = ({ item }) => (
    <ImmutableItemWrapper renderItem={this._renderReaction} item={item} />
  );
}

class ImmutableItemWrapper extends React.PureComponent {
  render() {
    return this.props.renderItem(this.props.item.toJS());
  }
}

// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { buildStylesheet } from '../styles';
import { FeedContext } from '../Context';
import type { Renderable, BaseFeedCtx, StyleSheetLike } from '../types';
import { smartRender } from '../utils';
import immutable from 'immutable';
import LoadMoreButton from './LoadMoreButton';

type Props = {|
  /** The ID of the activity for which these reactions are */
  activityId: string,
  /** The reaction kind that you want to display in this list, e.g `like` or
   * `comment` */
  reactionKind: string,
  /** The component that should render the reaction */
  Reaction: Renderable,
  /** Only needed for reposted activities where you want to show the comments
   * of the original activity, not of the repost */
  activityPath?: ?Array<string>,
  /** The component that should render the reaction */
  LoadMoreButton: Renderable,
  /** If the ReactionList should paginate when scrolling, by default it shows a
   * "Load more" button  */
  infiniteScroll: boolean,
  /** Any props the react native FlatList accepts */
  flatListProps?: {},
  /** Set to true when the ReactionList shouldn't paginate at all */
  noPagination: boolean,
  /** Show and load reactions starting with the oldest reaction first, instead
   * of the default where reactions are displayed and loaded most recent first.
   * */
  oldestToNewest: boolean,
  /** Reverse the order the reactions are displayed in. */
  reverseOrder: boolean,
  children?: React.Node,
  styles?: StyleSheetLike,
|};

/**
 * To use this component in a `FlatFeed` you have to provide the following
 * props to `FlatFeed`:
 * ```
 * options={{withOwnReactions: true}}
 * ```
 */
export default class ReactionList extends React.PureComponent<Props> {
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

type PropsInner = {| ...Props, ...BaseFeedCtx |};
class ReactionListInner extends React.Component<PropsInner> {
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

  _renderWrappedReaction = ({ item }: { item: any }) => (
    <ImmutableItemWrapper renderItem={this._renderReaction} item={item} />
  );
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

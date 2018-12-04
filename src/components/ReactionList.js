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
  /** The component that should render the reaction */
  LoadMoreButton: Renderable,
  // Paginator: Renderable,
  /** Only needed for reposted activities where you want to show the comments of the original activity, not of the repost */
  activityPath?: ?Array<string>,
  /** If the ReactionList should paginate when scrolling, by default it shows a "Load more" button  */
  infiniteScroll: boolean,
  /** Any props the react native FlatList accepts */
  flatListProps?: {},
  /** Set to true when the ReactionList shouldn't paginate at all */
  noPagination: boolean,
  children?: React.Node,
  styles?: StyleSheetLike,
|};

export default class ReactionList extends React.PureComponent<Props> {
  static defaultProps = {
    noPagination: false,
    infiniteScroll: false,
    LoadMoreButton,
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
  render() {
    const {
      activityId,
      activities,
      reactionKind,
      getActivityPath,
    } = this.props;
    const activityPath = this.props.activityPath || getActivityPath(activityId);

    const reactionsOfKind = activities.getIn(
      [...activityPath, 'latest_reactions', reactionKind],
      immutable.List(),
    );

    const nextUrl = activities.getIn(
      [...activityPath, 'latest_reactions_extra', reactionKind, 'next'],
      '',
    );

    const refreshing = activities.getIn(
      [...activityPath, 'latest_reactions_extra', reactionKind, 'refreshing'],
      false,
    );

    let styles = buildStylesheet('reactionList', this.props.styles);
    console.log(reactionsOfKind);

    if (!reactionsOfKind.size) {
      return null;
    }

    return (
      <React.Fragment>
        {this.props.children}
        <FlatList
          style={styles.container}
          refreshing={refreshing}
          data={reactionsOfKind.toArray()}
          keyExtractor={(item) => item.get('id')}
          listKey={reactionKind}
          renderItem={this._renderWrappedReaction}
          onEndReached={
            this.props.noPagination || !this.props.infiniteScroll
              ? undefined
              : () =>
                  this.props.loadNextReactions(
                    activityId,
                    reactionKind,
                    activityPath,
                  )
          }
          {...this.props.flatListProps}
        />
        {this.props.noPagination ||
        !nextUrl ||
        this.props.infiniteScroll ? null : (
          <LoadMoreButton
            refreshing={refreshing}
            styles={styles}
            onPress={() =>
              this.props.loadNextReactions(
                activityId,
                reactionKind,
                activityPath,
              )
            }
          />
        )}
      </React.Fragment>
    );
  }

  _renderReaction = (reaction) => {
    const { Reaction } = this.props;
    return smartRender(Reaction, { reaction });
  };

  _renderWrappedReaction = ({ item }: { item: any }) => {
    return (
      <ImmutableItemWrapper renderItem={this._renderReaction} item={item} />
    );
  };
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

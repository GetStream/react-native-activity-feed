// @flow
import React from 'react';
import { ReactionList, SectionHeader } from 'expo-activity-feed';

import RepostItem from './RepostItem';

export type Props = {|
  /** The ID of the activity for which these reposts are */
  activityId: string,
  /** Only needed for reposted activities where you want to show the reposts of the original activity, not of the repost */
  activityPath?: ?Array<string>,
|};

/**
 * RepostList uses ReactionList under the hood to render a list of reposts.
 *
 * @example ./examples/RepostList.md
 */
export default class ReposttList extends React.PureComponent<Props> {
  render() {
    const { activityId, activityPath } = this.props;
    return (
      <ReactionList
        activityId={activityId}
        reactionKind={'repost'}
        Reaction={(reaction) => <RepostItem repost={reaction} />}
        activityPath={activityPath}
      >
        <SectionHeader>Reposts</SectionHeader>
      </ReactionList>
    );
  }
}

//
import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import Avatar from './Avatar';
import ReactionList from './ReactionList';
import SectionHeader from './SectionHeader';
import { withTranslationContext } from '../Context';

/**
 * LikeList uses ReactionList under the hood to render a list of likes.
 *
 * @example ./examples/LikeList.md
 */
class LikeList extends React.PureComponent {
  static defaultProps = {
    reactionKind: 'like',
  };
  render() {
    const { activityId, activityPath, t } = this.props;
    return (
      <ReactionList
        activityId={activityId}
        reactionKind={this.props.reactionKind}
        activityPath={activityPath}
        styles={{
          container: { padding: 12, paddingLeft: 15, paddingRight: 15 },
        }}
        flatListProps={{ horizontal: true }}
        Reaction={({ reaction }) => (
          <TouchableOpacity style={{ marginRight: 10 }}>
            <Avatar
              source={reaction.user.data.profileImage}
              size={25}
              noShadow
            />
          </TouchableOpacity>
        )}
        noPagination
      >
        <SectionHeader>{t('Likes')}</SectionHeader>
      </ReactionList>
    );
  }
}

LikeList.propTypes = {
  /** The ID of the activity for which these comments are */
  activityId: PropTypes.string.isRequired,
  reactionKind: PropTypes.string.isRequired,
  /** Only needed for reposted activities where you want to show the likes of the original activity, not of the repost */
  activityPath: PropTypes.arrayOf(PropTypes.string),
};

export default withTranslationContext(LikeList);

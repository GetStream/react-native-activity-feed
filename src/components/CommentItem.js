// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { humanizeTimestamp, smartRender } from '../utils';
import Avatar from './Avatar';
import { buildStylesheet } from '../styles';

import type { Comment, StyleSheetLike, Renderable } from '../types';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';

type Props = {
  /** The comment that should be displayed */
  comment: Comment,
  /** Something that should be displayed in the Footer of the component, such
   * as a like button */
  Footer?: Renderable,
  /** Styling of the component */
  styles?: StyleSheetLike,
  /** Handle errors in the render method in a custom way, by default this
   * component logs the error in the console **/
  componentDidCatch?: (error: Error, info: {}, props: Props) => mixed,
} & Streami18Ctx;

/**
 * Renders a comment
 * @example ./examples/CommentItem.md
 */
class CommentItem extends React.Component<Props> {
  componentDidCatch(error: Error, info: {}) {
    if (this.props.componentDidCatch) {
      this.props.componentDidCatch(error, info, this.props);
    } else {
      console.error(error);
      console.error('The following comment caused the previous error');
      console.error(this.props.comment);
    }
  }

  render() {
    const { comment, tDateTimeParser } = this.props;
    const styles = buildStylesheet('commentItem', this.props.styles || {});
    return (
      <View style={styles.container}>
        <Avatar source={comment.user.data.profileImage} size={25} noShadow />
        <View style={styles.commentText}>
          <Text>
            <Text style={styles.commentAuthor}>{comment.user.data.name} </Text>
            <Text style={styles.commentContent}>{comment.data.text} </Text>
            <Text style={styles.commentTime}>
              {humanizeTimestamp(comment.created_at, tDateTimeParser)}
            </Text>
          </Text>
        </View>
        {smartRender(this.props.Footer)}
      </View>
    );
  }
}

CommentItem = withTranslationContext(CommentItem);
export default CommentItem;

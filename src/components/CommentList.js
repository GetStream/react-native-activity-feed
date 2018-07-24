// @flow
import React from 'react';
import { View } from 'react-native';

import CommentItem from './CommentItem';
import SectionHeader from './SectionHeader';

import type { Comment } from '~/types';

type Props = {
  comments: Array<Comment>,
};

export default class CommentList extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <SectionHeader>Comments</SectionHeader>

        <View>
          {this.props.comments.map((item) => {
            return <CommentItem key={item.id} comment={item} />;
          })}
        </View>
      </React.Fragment>
    );
  }
}

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { mergeStyles } from '../utils';

const CommentsContainer = ({
  data,
  renderComment,
  renderMoreLink,
  maxComments,
  ...props
}) => {
  return (
    <View style={mergeStyles('container', styles, props)}>
      {data.slice(0, maxComments).map(renderComment)}

      {data.length > 0 && data.length > maxComments ? renderMoreLink() : null}
    </View>
  );
};

export default CommentsContainer;

const styles = StyleSheet.create({});

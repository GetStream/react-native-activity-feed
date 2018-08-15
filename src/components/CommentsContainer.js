import React from 'react';
import { View } from 'react-native';

const CommentsContainer = ({
  data,
  renderComment,
  renderMoreLink,
  maxComments,
  ...props
}) => {
  return (
    <View>
      {data.slice(0, maxComments).map(renderComment)}
      {data.length > 0 && data.length > maxComments ? renderMoreLink() : null}
    </View>
  );
};

export default CommentsContainer;

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import PostControl from './PostControl';

const PostControlBar = ({ data }) => {
  let list = Object.keys(data).map((item, index) => {
    return (
      <PostControl
        key={index}
        type={item}
        icon={data[item][data[item].style]}
        num={data[item].value}
      />
    );
  });

  return <View style={styles.container}>{list}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100 + '%',
  },
});

export default PostControlBar;

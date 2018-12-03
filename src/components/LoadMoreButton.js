//@flow
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { StyleSheetLike } from '../types';
import { buildStylesheet } from '../styles';

type Props = {|
  onPress: () => mixed,
  refreshing: boolean,
  children: React.Node,
  styles?: StyleSheetLike,
|};

export default class LoadMoreButton extends React.Component<Props> {
  static defaultProps = {
    children: 'Load more',
  };

  render() {
    let { children, refreshing, onPress } = this.props;

    const styles = buildStylesheet('loadMoreButton', this.props.styles);
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={refreshing}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </TouchableOpacity>
    );
  }
}

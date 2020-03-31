//@flow
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { StyleSheetLike } from '../types';
import { buildStylesheet } from '../styles';
import { withTranslationContext } from '../Context';
import type { Streami18Ctx } from '../Context';

type Props = {|
  onPress: () => mixed,
  refreshing: boolean,
  children: React.Node,
  styles?: StyleSheetLike,
|} & Streami18Ctx;

class LoadMoreButton extends React.Component<Props> {
  static defaultProps = {
    children: 'Load more',
  };

  render() {
    const { children, refreshing, onPress, t } = this.props;

    const styles = buildStylesheet('loadMoreButton', this.props.styles);
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={refreshing}
      >
        <Text style={styles.buttonText}>{children || t('Load more')}</Text>
      </TouchableOpacity>
    );
  }
}

export default withTranslationContext(LoadMoreButton);

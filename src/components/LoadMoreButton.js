//
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { buildStylesheet } from '../styles';
import { withTranslationContext } from '../Context';

class LoadMoreButton extends React.Component {
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

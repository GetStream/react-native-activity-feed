//
import * as React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

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

LoadMoreButton.propTypes = {
  onPress: PropTypes.func,
  refreshing: PropTypes.bool,
  styles: PropTypes.object,
};

export default withTranslationContext(LoadMoreButton);

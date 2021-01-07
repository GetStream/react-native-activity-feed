//
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { buildStylesheet } from '../styles';

import { withTranslationContext } from '../Context';

/**
 * Renders a toggle button to follow another user's feed
 * @example ./examples/FollowButton.md
 */
class FollowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { followed: this.props.followed || false };
  }

  static defaultProps = {
    followed: false,
  };

  render() {
    const { clicked, t } = this.props;
    const styles = buildStylesheet('followButton', this.props.styles);

    return (
      <TouchableOpacity onClick={clicked}>
        <View
          colors={
            this.state.followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF']
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {this.state.followed ? t('Following') : t('Follow')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTranslationContext(FollowButton);

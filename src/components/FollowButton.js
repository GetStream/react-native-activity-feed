// @flow
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';
import type { Streami18Ctx } from '../Context';
import { withTranslationContext } from '../Context';

export type Props = {|
  /** callback function used on click */
  clicked?: () => mixed,
  /** initial follow state */
  followed?: boolean,
  styles?: StyleSheetLike,
|} & Streami18Ctx;

export type State = {
  followed: boolean,
};

/**
 * Renders a toggle button to follow another user's feed
 * @example ./examples/FollowButton.md
 */
class FollowButton extends React.Component<Props, State> {
  constructor(props: Props) {
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

FollowButton = withTranslationContext(FollowButton);
export default FollowButton;

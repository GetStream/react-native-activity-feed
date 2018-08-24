// @flow
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { buildStylesheet } from '../styles';
import type { StyleSheetLike } from '../types';

export type Props = {|
  /** callback function used on click */
  clicked?: () => void,
  /** initial follow state */
  followed: boolean,
  styles?: StyleSheetLike,
|};

export type State = {
  followed: boolean,
};

/**
 * Renders a toggle button to follow another user's feed
 * @example ./examples/FollowButton.md
 */
export default class FollowButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { followed: this.props.followed };
  }

  render() {
    let { clicked } = this.props;
    let styles = buildStylesheet('followButton', this.props.styles);

    return (
      <TouchableOpacity onClick={clicked}>
        <View
          colors={
            this.state.followed ? ['#ccc', '#ccc'] : ['#008DFF', '#0079FF']
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {this.state.followed ? 'Following' : 'Follow'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

// @flow
import React from 'react';
import { View, TextInput } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Avatar from './Avatar';

import type { StyleSheetLike } from '../types';
import type { Props as AvatarProps } from './Avatar';
import { buildStylesheet } from '../styles';

type Props = {|
  onSubmit: (string) => mixed,
  height?: number,
  avatarProps?: AvatarProps,
  noAvatar?: boolean,
  styles?: StyleSheetLike,
|};

type State = {|
  text: string,
|};

export default class CommentBox extends React.Component<Props, State> {
  static defaultProps = {
    styles: {},
  };
  state = {
    text: '',
  };

  render() {
    let styles = buildStylesheet('commentBox', this.props.styles);

    return (
      <React.Fragment>
        <View style={{ height: this.props.height }} />

        <KeyboardAccessory>
          <View style={styles.container}>
            {this.props.noAvatar || (
              <Avatar
                size={48}
                // $FlowFixMe
                styles={this.props.styles.avatar}
                {...this.props.avatarProps}
              />
            )}
            <TextInput
              value={this.state.text}
              style={styles.textInput}
              placeholder="Your comment..."
              underlineColorAndroid="transparent"
              returnKeyType="send"
              onChangeText={(text) => this.setState({ text })}
              onSubmitEditing={async (event) => {
                this.setState({ text: '' });
                this.props.onSubmit(event.nativeEvent.text);
              }}
            />
          </View>
        </KeyboardAccessory>
      </React.Fragment>
    );
  }
}

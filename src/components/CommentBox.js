//
import React from 'react';
import { View, TextInput } from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

import Avatar from './Avatar';

import { buildStylesheet } from '../styles';
import { withTranslationContext } from '../Context';

/**
 * Comment box with keyboard control, avatar and text input
 * All props are fulfilled automatically if used as a child element
 * of an activity.
 */
class CommentBox extends React.Component {
  static defaultProps = {
    styles: {},
    height: 80,
    verticalOffset: 0,
    noKeyboardAccessory: false,
  };

  state = {
    text: '',
  };

  postComment(event) {
    if (this.props.onSubmit !== undefined) {
      this.props.onSubmit(event.nativeEvent.text);
    } else {
      this.props.onAddReaction('comment', this.props.activity, {
        text: event.nativeEvent.text,
      });
    }
  }

  render() {
    const { noKeyboardAccessory, textInputProps, t } = this.props;

    const styles = buildStylesheet('commentBox', this.props.styles);
    const input = (
      <View style={styles.container}>
        {this.props.noAvatar || (
          <Avatar
            size={48}
            styles={styles.avatar}
            {...this.props.avatarProps}
          />
        )}
        <TextInput
          value={this.state.text}
          style={styles.textInput}
          underlineColorAndroid='transparent'
          onChangeText={(text) => this.setState({ text })}
          onSubmitEditing={(event) => {
            this.setState({ text: '' });
            this.postComment(event);
          }}
          placeholder={t('Start Typing...')}
          returnKeyType='send'
          {...textInputProps}
        />
      </View>
    );
    if (noKeyboardAccessory) {
      return input;
    }

    return (
      <React.Fragment>
        <View style={{ height: this.props.height }} />
        <KeyboardAccessory verticalOffset={this.props.verticalOffset}>
          {input}
        </KeyboardAccessory>
      </React.Fragment>
    );
  }
}

export default withTranslationContext(CommentBox);

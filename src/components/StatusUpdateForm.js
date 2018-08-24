import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Keyboard,
} from 'react-native';
import { StreamContext } from '../Context';
import OgBlock from './OgBlock';
import { pickImage } from '../native';

import { buildStylesheet } from '../styles';
import _ from 'lodash';
import Symbol from 'es6-symbol';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const ImageState = Object.freeze({
  NO_IMAGE: Symbol('no_image'),
  UPLOADING: Symbol('uploading'),
  UPLOADED: Symbol('uploaded'),
  UPLOAD_FAILED: Symbol('upload_failed'),
});

const urlRegex = /(https?:\/\/[^\s]+)/gi;

export default class StatusUpdateForm extends React.Component {
  static defaultProps = {
    feedGroup: 'user',
    activity_verb: 'post',
    styles: {
      ogBlock: {
        wrapper: {
          padding: 15,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#eee',
          borderTopWidth: 1,
        },
        textStyle: { fontSize: 14 },
      },
    },
    options: {
      limit: 10,
    },
  };

  render() {
    return (
      <StreamContext.Consumer>
        {(appCtx) => {
          if (this.props.screen) {
            return (
              <View style={{ flex: 1 }}>
                <StatusUpdateFormInner {...this.props} {...appCtx} />
              </View>
            );
          } else {
            return (
              <React.Fragment>
                <KeyboardAccessory>
                  <StatusUpdateFormInner {...this.props} {...appCtx} />
                </KeyboardAccessory>
              </React.Fragment>
            );
          }
        }}
      </StreamContext.Consumer>
    );
  }
}

class StatusUpdateFormInner extends React.Component {
  constructor(props) {
    super(props);
    this.props.feedUserId = this.props.feedUserId || props.session.userId;
    this._handleOgDebounced = _.debounce(this.handleOG, 250);
  }

  state = {
    image: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
    textInput: null,
    clearInput: false,
    orientation: 'portrait',
    focused: false,
    urls: [],
    dismissedUrls: [],
  };

  _pickImage = async () => {
    let result = await pickImage();
    if (result.cancelled) {
      return;
    }

    this.setState({
      image: result.uri,
      imageState: ImageState.UPLOADING,
    });

    let response;
    try {
      response = await this.props.session.images.upload(result.uri);
    } catch (e) {
      console.log(e);
      this.setState({
        imageState: ImageState.UPLOAD_FAILED,
      });
      throw e;
    }

    this.setState({
      imageState: ImageState.UPLOADED,
      image_url: response.file,
    });
  };

  _removeImage = () => {
    this.setState({
      imageState: ImageState.NO_IMAGE,
      image_url: null,
      image: null,
    });
  };

  componentDidMount() {
    const { width, height } = Dimensions.get('window');
    this.setState({
      orientation: width > height ? 'landscape' : 'portrait',
    });
  }

  buildActivity() {
    let attachments = {};

    if (this.state.og && Object.keys(this.state.og).length > 0) {
      attachments.og = this.state.og;
    }

    if (this.state.image_url) {
      attachments.images = [this.state.image_url];
    }

    let activity = {
      actor: this.props.session.user,
      verb: this.props.activity_verb,
      object: this.state.textInput,
    };

    if (Object.keys(attachments).length > 0) {
      activity.attachments = attachments;
    }

    this.props.session
      .feed(this.props.feedGroup, this.props.feedUserId)
      .addActivity(activity)
      .catch((err) => {
        console.log(err);
      });
  }

  handleOG(text) {
    if (this.state.ogScraping) {
      return;
    }
    const urls = text.match(urlRegex);

    if (!urls) {
      this.setState({
        og: null,
        ogLink: null,
      });
      return;
    }

    urls.forEach((url) => {
      if (
        url !== this.state.ogLink &&
        !(this.state.dismissedUrls.indexOf(url) > -1) &&
        !this.state.og &&
        urls.indexOf(url) > -1
      ) {
        this.setState({
          ogScraping: true,
          ogLink: url,
          og: url === this.state.ogLink ? this.state.og : null,
        });
        this.props.session
          .og(url)
          .then((resp) => {
            const oldStateUrls = this.state.urls;
            this.setState(
              {
                og: Object.keys(resp).length > 0 ? { ...resp, url: url } : null, // Added url manually from the entered URL
                ogScraping: false,
                urls: [...oldStateUrls, url],
              },
              () => text.replace(url, ''),
            );
          })
          .catch((err) => {
            console.log(err);
            this.setState({
              ogScraping: false,
              og: null,
            });
          });
      }
    });
  }

  _onPressDismiss = (url) => {
    const oldDismissedUrls = this.state.dismissedUrls;
    this.setState(
      {
        dismissedUrls: [...oldDismissedUrls, url],
        ogScraping: false,
        ogLink: null,
        og: null,
      },
      () => {
        console.log('dismissedUrls: ', this.state.dismissedUrls);
      },
    );
  };

  onSubmitForm = () => {
    this.buildActivity();
    Keyboard.dismiss();
    this.setState({
      image: null,
      imageState: ImageState.NO_IMAGE,
      og: null,
      ogScraping: false,
      ogLink: null,
      textInput: null,
      focused: false,
      urls: [],
      dismissedUrls: [],
      clearInput: true,
    });
  };

  render() {
    let styles = buildStylesheet('statusUpdateForm', this.props.styles);
    Dimensions.addEventListener('change', (dimensions) => {
      this.setState({
        orientation:
          dimensions.window.width > dimensions.window.height
            ? 'landscape'
            : 'portrait',
      });
    });
    return (
      <View style={this.props.screen ? { flex: 1 } : {}}>
        <View
          style={[
            styles.container,
            this.state.focused ? styles.containerFocused : {},
            this.state.og ? styles.containerFocusedOg : {},
            this.props.screen ? { flex: 1 } : {},
          ]}
        >
          {this.state.og && (
            <OgBlock
              onPressDismiss={this._onPressDismiss}
              og={this.state.og}
              styles={this.props.styles.ogBlock}
            />
          )}

          <View style={styles.newPostContainer}>
            <View style={[styles.textInput]}>
              <TextInput
                ref={this.textInput}
                style={this.props.screen ? { flex: 1 } : {}}
                multiline
                onChangeText={(text) => {
                  this.setState({ textInput: text, clearInput: false });
                  this._handleOgDebounced(text);
                }}
                value={!this.state.clearInput ? this.state.textInput : null}
                autocorrect={false}
                placeholder="Share something..."
                underlineColorAndroid="transparent"
                onBlur={() => this.setState({ focused: false })}
                onFocus={() => this.setState({ focused: true })}
              />
            </View>

            <View style={styles.actionPanel}>
              <View style={styles.imageContainer}>
                {this.state.image ? (
                  <React.Fragment>
                    <Image
                      source={{ uri: this.state.image }}
                      style={
                        this.state.imageState === ImageState.UPLOADING
                          ? styles.image_loading
                          : styles.image
                      }
                    />
                    <View style={styles.imageOverlay}>
                      {this.state.imageState === ImageState.UPLOADING ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <TouchableOpacity onPress={this._removeImage}>
                          <Image
                            source={require('../images/icons/close-white.png')}
                            style={[{ width: 24, height: 24 }]}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </React.Fragment>
                ) : (
                  <TouchableOpacity
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                  >
                    <Image
                      source={require('../images/icons/gallery.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                title="Pick an image from camera roll"
                onPress={this.onSubmitForm}
              >
                <Image
                  source={require('../images/icons/send.png')}
                  style={styles.submitImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this.props.screen ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

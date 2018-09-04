// @flow
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { StreamApp } from '../Context';
import UrlPreview from './UrlPreview';
import { pickImage } from '../native';

import { buildStylesheet } from '../styles';
import _ from 'lodash';
import Symbol from 'es6-symbol';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import type {
  BaseAppCtx,
  CustomActivityArgData,
  StyleSheetLike,
  OgData,
} from '../types';

const ImageState = Object.freeze({
  NO_IMAGE: Symbol('no_image'),
  UPLOADING: Symbol('uploading'),
  UPLOADED: Symbol('uploaded'),
  UPLOAD_FAILED: Symbol('upload_failed'),
});

const urlRegex = /(https?:\/\/[^\s]+)/gi;

type Props = {|
  feedGroup: string,
  userId?: string,
  activityVerb: string,
  screen: boolean,
  styles: StyleSheetLike,
  height: number,
  enableAndroidKeyboardHandling: boolean,
|};

type State = {|
  image: ?string,
  imageUrl: ?string,
  imageState: typeof ImageState,
  og: ?OgData,
  ogScraping: boolean,
  ogLink: ?string,
  textFromInput: string,
  clearInput: boolean,
  focused: boolean,
  urls: Array<string>,
  dismissedUrls: Array<string>,
|};

export default class StatusUpdateForm extends React.Component<Props> {
  static defaultProps = {
    feedGroup: 'user',
    activityVerb: 'post',
    screen: false,
    height: 80,
    styles: {
      urlPreview: {
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
    enableAndroidKeyboardHandling: false,
  };

  render() {
    return (
      <StreamApp.Consumer>
        {(appCtx) => {
          if (this.props.screen) {
            return (
              <View style={{ flex: 1 }}>
                <StatusUpdateFormInner {...this.props} {...appCtx} />
              </View>
            );
          } else {
            if (
              Platform.OS === 'ios' ||
              this.props.enableAndroidKeyboardHandling
            ) {
              return (
                <React.Fragment>
                  <View style={this.props.height} />
                  <KeyboardAccessory>
                    <StatusUpdateFormInner {...this.props} {...appCtx} />
                  </KeyboardAccessory>
                </React.Fragment>
              );
            } else {
              return <StatusUpdateFormInner {...this.props} {...appCtx} />;
            }
          }
        }}
      </StreamApp.Consumer>
    );
  }
}

type PropsInner = {| ...Props, ...BaseAppCtx |};
class StatusUpdateFormInner extends React.Component<PropsInner, State> {
  _handleOgDebounced: (string) => mixed;

  textInputRef = React.createRef();

  constructor(props) {
    super(props);
    this._handleOgDebounced = _.debounce(this.handleOG, 250);
  }

  state = {
    image: null,
    imageUrl: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
    textFromInput: '',
    clearInput: false,
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
      console.warn(e);
      this.setState({
        imageState: ImageState.UPLOAD_FAILED,
        image: null,
      });
      alert(
        'Something went wrong when uploading your image. Is your internet working? If it is, the image is probably too big.',
      );
      return;
    }

    this.setState({
      imageState: ImageState.UPLOADED,
      imageUrl: response.file,
    });
  };

  _removeImage = () => {
    this.setState({
      imageState: ImageState.NO_IMAGE,
      imageUrl: null,
      image: null,
    });
  };

  _text = () => {
    return this.state.textFromInput.trim();
  };

  _object = () => {
    if (this.state.imageUrl) {
      return this.state.imageUrl;
    }
    return this._text();
  };

  _canSubmit = () => {
    return Boolean(this._object());
  };

  async addActivity() {
    let activity: CustomActivityArgData = {
      actor: this.props.session.user,
      verb: this.props.activityVerb,
      object: this._object(),
    };

    let attachments = {};

    if (this.state.og && Object.keys(this.state.og).length > 0) {
      attachments.og = this.state.og;
    }

    if (this.state.imageUrl) {
      attachments.images = [this.state.imageUrl];
      activity.text = this._text();
    }

    if (Object.keys(attachments).length > 0) {
      activity.attachments = attachments;
    }

    await this.props.session
      .feed(this.props.feedGroup, this.props.userId)
      .addActivity(activity);
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
    this.setState({
      dismissedUrls: [...oldDismissedUrls, url],
      ogScraping: false,
      ogLink: null,
      og: null,
    });
  };

  onSubmitForm = async () => {
    await this.addActivity();
    Keyboard.dismiss();
    this.setState({
      image: null,
      imageUrl: null,
      imageState: ImageState.NO_IMAGE,
      og: null,
      ogScraping: false,
      ogLink: null,
      textFromInput: '',
      focused: false,
      urls: [],
      dismissedUrls: [],
    });
  };

  render() {
    let styles = buildStylesheet('statusUpdateForm', this.props.styles);
    return (
      <View style={[this.props.screen ? { flex: 1 } : {}]}>
        <View
          style={[
            styles.container,
            this.props.height ? { height: this.props.height } : { height: 80 },
            this.state.focused ? styles.containerFocused : {},
            this.state.og ? styles.containerFocusedOg : {},
            this.props.screen ? { flex: 1 } : {},
          ]}
        >
          {this.state.og && (
            <UrlPreview
              onPressDismiss={this._onPressDismiss}
              og={this.state.og}
              styles={
                // $FlowFixMe
                this.props.styles.urlPreview
              }
            />
          )}

          <View style={styles.newPostContainer}>
            <View style={[styles.textInput]}>
              <TextInput
                ref={this.textInputRef}
                style={this.props.screen ? { flex: 1 } : {}}
                multiline
                onChangeText={(text) => {
                  this.setState({ textFromInput: text });
                  this._handleOgDebounced(text);
                }}
                value={this.state.textFromInput}
                autocorrect={false}
                placeholder="Share something..."
                underlineColorAndroid="transparent"
                onBlur={() => this.setState({ focused: false })}
                onFocus={() => this.setState({ focused: true })}
              />
            </View>

            <View
              style={[
                styles.actionPanel,
                this.state.focused ? {} : styles.actionPanelBlur,
              ]}
            >
              <View
                style={[
                  styles.imageContainer,
                  this.state.focused ? {} : styles.imageContainerBlur,
                ]}
              >
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
                disabled={!this._canSubmit()}
              >
                <Image
                  source={
                    this._canSubmit()
                      ? require('../images/icons/send.png')
                      : require('../images/icons/send-disabled.png')
                  }
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

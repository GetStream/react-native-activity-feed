import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import Avatar from './Avatar';
import OgBlock from './OgBlock';
import { pickImage } from '../native';
import { buildStylesheet } from '../styles';
import _ from 'lodash';
import Symbol from 'es6-symbol';

const ImageState = Object.freeze({
  NO_IMAGE: Symbol('no_image'),
  UPLOADING: Symbol('uploading'),
  UPLOADED: Symbol('uploaded'),
  UPLOAD_FAILED: Symbol('upload_failed'),
});

const urlRegex = /(https?:\/\/[^\s]+)/gi;

export default class StatusUpdateForm extends React.Component {
  constructor(props) {
    super(props);
    this.props.feedUserId = this.props.feedUserId || props.session.userId;
    this._handleOgDebounced = _.debounce(this.handleOG, 250);
    this.TextInput = React.createRef();
  }

  static defaultProps = {
    activity_verb: 'post',
    feedGroup: 'timeline',
    styles: {
      ogBlock: {
        wrapper: {
          padding: 15,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: '#eee',
          borderTopWidth: 1,
        },
        textStyle: { fontSize: 12 },
      },
    },
  };

  state = {
    image: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
    textInput: null,
    orientation: 'portrait',
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
    this.TextInput.current.focus();

    const { width, height } = Dimensions.get('window');
    this.setState({
      orientation: width > height ? 'landscape' : 'portrait',
    });

    this.props.registerSubmit(async () => {
      this.buildActivity();
    });
  }

  componentWillUnmount() {
    this.TextInput.current.blur();
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
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.newPostContainer}>
          {this.state.orientation === 'portrait' && (
            <Avatar
              source={this.props.session.user.data.profileImage}
              size={48}
            />
          )}
          <View
            style={[
              styles.textInput,
              this.state.orientation === 'portrait'
                ? styles.textInputPortrait
                : styles.textInputPortrait,
            ]}
          >
            <TextInput
              multiline
              onChangeText={(text) => {
                this.setState({ textInput: text });
                this._handleOgDebounced(text);
              }}
              ref={this.TextInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View>
          <KeyboardAccessory backgroundColor="#fff">
            {this.state.og && this.state.orientation === 'portrait' ? (
              <OgBlock
                onPressDismiss={this._onPressDismiss}
                og={this.state.og}
                styles={this.props.styles.ogBlock}
              />
            ) : null}
            <View style={styles.accessory}>
              {this.state.image ? (
                <View style={styles.imageContainer}>
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
                          style={{ width: 24, height: 24 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
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
              {this.state.og && this.state.orientation === 'landscape' ? (
                <OgBlock
                  onPressDismiss={this._onPressDismiss}
                  og={this.state.og}
                  styles={{
                    wrapper: {
                      padding: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                      marginTop: -15,
                      marginBottom: -15,
                      marginLeft: 15,
                      borderTopColor: 'transparent',
                      borderTopWidth: 1,
                      flex: 1,
                    },
                    textStyle: { fontSize: 12 },
                  }}
                />
              ) : null}
            </View>
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
    );
  }
}

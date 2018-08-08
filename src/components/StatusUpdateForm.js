import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { Avatar, OgBlock } from 'react-native-activity-feed';
import _ from 'lodash';

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
    this.onChangeTextDelayed = _.debounce(this.handleOG, 250);
    this.TextInput = React.createRef();
  }

  static defaultProps = {
    activity_verb: 'post',
  };

  state = {
    image: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.cancelled) {
      return;
    }

    this.setState({
      image: result.uri,
      imageState: ImageState.UPLOADING,
    });

    let response = await this.props.session.images.upload(result.uri);
    console.log(response);

    this.setState({
      imageState: ImageState.UPLOADED,
      image_url: response.file,
    });
  };

  componentDidMount() {
    this.TextInput.current.focus();
    this.props.registerSubmit(async () => {
      this.buildActivity();
    });
  }

  componentWillUnmount() {
    this.TextInput.current.blur();
  }

  buildActivity() {
    let attachments = {
      images: this.state.image_url ? [this.state.image_url] : [],
      og: this.state.og ? this.state.og : {},
    };
    const activity = {
      actor: this.props.session.user,
      verb: this.props.activity_verb,
      object: this.props.TextInput,
      attachments,
    };
    console.log(activity);
    return activity;
  }

  handleOG(text) {
    if (this.state.ogScraping) {
      return;
    }
    console.log('changed!');
    const urls = text.match(urlRegex);
    if (urls && urls.length > 0) {
      const url = urls[0];
      this.setState({
        ogScraping: true,
        ogLink: url,
        og: url == this.state.ogLink ? this.state.ogLink : null,
      });
      this.props.session
        .og(url)
        .then((resp) => {
          console.log(resp);
          this.setState({
            og: resp,
            ogScraping: false,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            ogScraping: false,
            og: null,
          });
        });
    } else {
      this.setState({ og: null });
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.newPostContainer}>
          <Avatar source="https://placehold.it/100x100" size={48} />
          <View style={styles.textInput}>
            <TextInput
              multiline
              onChangeText={(text) => this.onChangeTextDelayed(text)}
              ref={this.TextInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        {this.state.og ? <OgBlock og={this.state.og} /> : null}

        <View>
          <KeyboardAccessory backgroundColor="#fff">
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
                  <TouchableOpacity>
                    <Image
                      source={require('../images/icons/close-white.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <View style={styles.accessory}>
              <TouchableOpacity
                title="Pick an image from camera roll"
                onPress={this._pickImage}
              >
                <Image
                  source={require('../images/icons/gallery.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  newPostContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    flex: 1,
  },
  textInput: {
    flex: 1,
    marginTop: 10,
    marginLeft: 15,
  },
  accessory: {
    borderTopColor: '#DADFE3',
    backgroundColor: '#f6f6f6',
    borderTopWidth: 1,
    width: 100 + '%',
    padding: 15,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    margin: 15,
  },
  imageOverlay: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: 100,
    height: 100,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  image: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  image_loading: {
    position: 'absolute',
    width: 100,
    height: 100,
    opacity: 0.5,
  },
});

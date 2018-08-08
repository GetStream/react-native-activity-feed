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
import Symbol from 'es6-symbol';
import { ScrollView } from '../../node_modules/react-native-gesture-handler';

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
  };

  state = {
    image: null,
    imageState: ImageState.NO_IMAGE,
    og: null,
    ogScraping: false,
    ogLink: null,
    textInput: null,
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    if (result.cancelled) {
      return;
    }

    console.log(result);

    this.setState({
      image: result.uri,
      imageState: ImageState.UPLOADING,
    });

    console.log(this.props.session);
    console.log(this.props.session.images);
    console.log(this.props.session.images.upload);

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
    // TODO: do we have to deregister the submit cb from navigation?
  }

  buildActivity() {
    let attachments = {
      images: this.state.image_url ? [this.state.image_url] : [],
      og: this.state.og ? this.state.og : {},
    };
    const activity = {
      actor: this.props.session.user,
      verb: this.props.activity_verb,
      object: this.state.textInput,
      attachments,
    };
    console.log(
      `adding actvity to feed ${this.props.feedGroup}:${this.props.feedUserId}`,
    );
    console.log(activity);

    this.props.session
      .feed(this.props.feedGroup, this.props.feedUserId)
      .addActivity(activity)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleOG(text) {
    if (this.state.ogScraping) {
      return;
    }
    console.log(`changed into ${text}`);
    const urls = text.match(urlRegex);

    if (!urls) {
      this.setState({
        og: null,
        ogLink: null,
      });
      return;
    }

    if (urls[0] !== this.state.ogLink) {
      const url = urls[0];
      console.log(`retrieving ${url} from OG API`);
      this.setState({
        ogScraping: true,
        ogLink: url,
        og: url === this.state.ogLink ? this.state.og : null,
      });
      this.props.session
        .og(url)
        .then((resp) => {
          console.log(resp);
          this.setState({
            og: Object.keys(resp).length > 0 ? resp : null,
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
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>

        <View style={styles.newPostContainer}>
          <Avatar source="https://placehold.it/100x100" size={48} />
          <ScrollView style={styles.textInput}>
            <TextInput
              multiline
              onChangeText={(text) => {
                this.setState({
                  textInput: text,
                });
                this._handleOgDebounced(text);
              }}
              ref={this.TextInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </ScrollView>
        </View>



        <View>
          <KeyboardAccessory backgroundColor="#fff">
            <View styles={{flexDirection: 'row'}}>


              <View>
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
              </View>
              <View>
                {this.state.og ? <OgBlock
                  styles={{ wrapper: { padding: 15, flex: 1 } }}
                  og={this.state.og}
                  removeOgBlock={() => {
                    this.setState({
                      og: null,
                    })
                  }} />: null}
              </View>
            </View>

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
    width: 50,
    height: 50,
    borderRadius: 4,
    margin: 15,
  },
  imageOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  image: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  image_loading: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 4,
    opacity: 0.5,
  },
});

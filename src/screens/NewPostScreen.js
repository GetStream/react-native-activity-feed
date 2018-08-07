import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { StreamContext } from '../Context';
import Avatar from '../components/Avatar';

const ImageState = Object.freeze({
    NO_IMAGE:      Symbol("no_image"),
    UPLOADING:     Symbol("uploading"),
    UPLOADED:      Symbol("uploaded"),
    UPLOAD_FAILED: Symbol("upload_failed")
});

class NewPostForm  extends React.Component {
  constructor(props) {
    super(props);
    this.TextInput = React.createRef();
  }

  static defaultProps = {
      activity_verb: 'post',
  }

  state = {
    image: null,
    image_state: ImageState.NO_IMAGE
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.cancelled) {
      return
    }

    this.setState({
      image: result.uri,
      image_state: ImageState.UPLOADING,
    });

    response = await this.props.session.images.upload(result.uri);

    this.setState({
      image_state: ImageState.UPLOADED,
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
      images: this.image_url ? [this.image_url] : [],
    };
    const activity = {
      actor: this.props.session.user,
      verb: this.props.activity_verb,
      object: this.props.TextInput,
      attachments
    };
    console.log(activity);
    return buildActivity;
  }

  handleOG(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
  }

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.newPostContainer}>
          <Avatar source="https://placehold.it/100x100" size={48} />
          <View style={styles.textInput}>
            <TextInput
              multiline
              onChangeText={(text) => this.handleOG(text) }
              ref={this.TextInput}
              placeholder="Share something..."
              underlineColorAndroid="transparent"
            />
          </View>
        </View>

        <View>
          <KeyboardAccessory backgroundColor="#fff">
            {this.state.image ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.state.image }}
                  style={this.state.image_state === ImageState.UPLOADING ? styles.image_loading : styles.image}
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

class NewPostScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'NEW POST',
    headerLeft: (
      <TouchableOpacity
        style={{ paddingLeft: 15 }}
        onPress={() => navigation.goBack()}
      >
        <Image
          style={{ width: 24, height: 24 }}
          source={require('../images/icons/close.png')}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity
        style={{ paddingRight: 15 }}
        onPress={navigation.getParam('submitFunc')}
      >
        <Text style={{ color: '#007AFF', fontSize: 17 }}>Send</Text>
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  render() {
   return (
      <StreamContext.Consumer>
        {(appCtx) => <NewPostForm
            {...this.props} {...appCtx}
            registerSubmit={(submitFunc) => {
              this.props.navigation.setParams({ submitFunc });
            }}
          />
        }
      </StreamContext.Consumer>
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

export default NewPostScreen;

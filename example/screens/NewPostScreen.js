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

import Avatar from '../components/Avatar';

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
        onPress={() => {
          console.log('saving...');
          setTimeout(() => {
            console.log('saved.');
            navigation.navigate('Home');
          }, 1000);
        }}
      >
        <Text style={{ color: '#007AFF', fontSize: 17 }}>Send</Text>
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  constructor(props) {
    super(props);
    this.TextInput = React.createRef();
  }

  state = {
    image: null,
  };

  _pickImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  componentDidMount() {
    this.TextInput.current.focus();
  }

  componentWillUnmount() {
    this.TextInput.current.blur();
  }

  render() {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <View style={styles.newPostContainer}>
          <Avatar source="https://placehold.it/100x100" size={48} />
          <View style={styles.textInput}>
            <TextInput
              multiline
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
                  style={styles.image}
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
});

export default NewPostScreen;

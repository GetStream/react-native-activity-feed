import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import Avatar from '../../components/Avatar';

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
          source={require('../../images/icons/close.png')}
        />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity style={{ paddingRight: 15 }}>
        <Text style={{ color: '#007AFF', fontSize: 17 }}>Send</Text>
      </TouchableOpacity>
    ),
    headerTitleStyle: {
      fontWeight: '500',
      fontSize: 13,
    },
  });

  state = {
    image: null,
  };

  _pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  componentDidMount() {
    this.refs.TextInput.focus();
  }

  componentWillUnmount() {
    this.refs.TextInput.blur();
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.screenContainer}>
        <View style={styles.newPostContainer}>
          <Avatar source="https://placehold.it/100x100" size={48} />
          <View style={styles.textInput}>
            <TextInput
              multiline
              ref="TextInput"
              placeholder="Share something..."
            />
          </View>
        </View>

        {this.state.image ? (
          <View>
            <Image
              source={{ uri: this.state.image }}
              style={{ width: 100, height: 100, margin: 15 }}
            />
          </View>
        ) : null}

        <View style={styles.accessory}>
          <TouchableOpacity
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          >
            <Image
              source={require('../../images/icons/gallery.png')}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  newPostContainer: {
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
    borderTopWidth: 1,
    width: 100 + '%',
    height: 65,
    padding: 15,
  },
});

export default NewPostScreen;

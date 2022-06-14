import { registerNativeHandlers } from 'react-native-activity-feed-core';
import ImagePicker from 'react-native-image-crop-picker';

import { Platform } from 'react-native';

registerNativeHandlers({
  pickImage: async ({ compressImageQuality }) => {
    try {
      const image = await ImagePicker.openPicker({
        compressImageQuality,
        forceJpg: true,
        includeBase64: Platform.OS === 'ios',
        mediaType: 'photo',
        writeTempFile: false,
      });

      return {
        cancelled: false,
        uri:
          Platform.OS === 'ios'
            ? image.sourceURL || `data:${image.mime};base64,${image.data}`
            : image.path,
      };
    } catch (err) {
      return {
        cancelled: true,
      };
    }
  },
});

export * from 'react-native-activity-feed-core';

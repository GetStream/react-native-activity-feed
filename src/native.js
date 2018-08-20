// @flow

export let pickImage = () => {
  throw Error('Native handler was not registered');
};

export const registerNativeHandlers = (handlers: {
  pickImage: typeof pickImage,
}) => {
  if (handlers.pickImage) {
    pickImage = handlers.pickImage;
  }
};

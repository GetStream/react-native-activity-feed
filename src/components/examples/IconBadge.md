```js
const Image = require('react-native').Image;
const NotificationIcon = require('./resources/notifications.png');

<StreamApp
    apiKey="5rqsbgqvqphs"
    appId={40273}
    userId="user-one"
    token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlci1vbmUifQ.4_Ad0u46UZW_-icaAJwowzcryxtVW3uZMzadX3pyeAg">
    <IconBadge
        showNumber
        mainElement={
            <Image
                source={NotificationIcon}
                style={{ width: 25, height: 25 }}

            />
    } />
</StreamApp>
```
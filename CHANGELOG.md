# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0 - 2021-04-09

- Close faye connection, when StreamApp component is unmounted [b0c480a](https://github.com/GetStream/react-native-activity-feed/commit/b0c480ad3b73a39b86edbb2049024cbe33d8f473)
- Fixed prop types for `deletes` prop on `NewActivitiesNotification` [7060571](https://github.com/GetStream/react-native-activity-feed/commit/706057192c2ea36835e27b07e722b35e7a3d2ba8)
- Fixed theming logic for nested styles [b5e5080](https://github.com/GetStream/react-native-activity-feed/commit/b5e508063dfa0722eac97f71a8c205f3f5f1090f)

## 1.0.3 - 2021-03-05

**Fixes**

- Ignore email address from generating og preview
- sanitize the urls before using Linking module from react-native

[#172](https://github.com/GetStream/react-native-activity-feed/pull/172)

## 1.0.2 - 2021-01-29

**Fixes**

Image upload issues on android

- issue https://github.com/GetStream/react-native-activity-feed/issues/170
- commit [7d7e2ba](https://github.com/GetStream/react-native-activity-feed/commit/7d7e2bab957f4c4fd1b76284f333a0105c5486b6)

## 1.0.1 - 2021-01-11

- Added support for Expo 40 and react-native 0.63
- Removed [flow types](https://flow.org/) and added traditional [`PropTypes`](https://reactjs.org/docs/typechecking-with-proptypes.html)
- Upgrade to `getstream@7.1.0`
- Cleanup around examples

  Removed following existing examples:

  - example
  - examples/one
  - native-example

  Added new examples:

  - examples/expo (Expo 40)
  - examples/native (RN 0.63.x)

- Replace `react-native-image-picker` with [`react-native-image-crop-picker`](https://github.com/ivpusic/react-native-image-crop-picker) to allow compression.

- Fixed pending issues:

  - https://github.com/GetStream/react-native-activity-feed/issues/156
  - https://github.com/GetStream/react-native-activity-feed/issues/154
  - https://github.com/GetStream/react-native-activity-feed/issues/152
  - https://github.com/GetStream/react-native-activity-feed/issues/126
  - https://github.com/GetStream/react-native-activity-feed/issues/99
  - https://github.com/GetStream/react-native-activity-feed/issues/160
  - https://github.com/GetStream/react-native-activity-feed/issues/165

- Added `compressImageQuality` prop on `StatusUpdateForm` component, which can be used to compress the images before uploading to CDN.

## 1.0.0 - 2021-01-11

- BAD RELEASE, PLEASE USE v1.0.1

## 0.9.1 - 2020-03-31

- Fixing the build, by adding translation json files to distributed package [issue](https://github.com/GetStream/react-native-activity-feed/issues/123) [commit](https://github.com/GetStream/react-native-activity-feed/commit/e1526703bd52ad35b3a948b6e6c7e2466bee2588)

## 0.9.0 - 2020-03-31

- Adding i18n support. Please read the docs here: https://getstream.github.io/react-native-activity-feed/#internationalisation-i18n

## 0.8.19 - 2020-02-27

- Adding style customization support for text of Activity component - [97130d8](https://github.com/GetStream/react-native-activity-feed/commit/97130d8fa7584ac53fefbe93c818a1587634f49f)

## 0.8.18 - 2020-01-08

- Fixing `ref` variables in FlatFeed and NotificationFeed

## 0.8.17 - 2019-09-19

### Fixed

- Fixed an issue with reactions on reactions creating duplicates in `latest_children`

## 0.8.16 - 2019-09-13

### Added

- Added two props to the Activity component to handle onPress events on hashtags and mentions:
  - `onPressHashtag={(hashtagText, activity) => console.log(hashtagText, activity)}`
  - `onPressMention={(mentionText, activity) => console.log(mentionText, activity)}`

## 0.8.8 - 2019-02-05

### Added

- Support marking notification groups as read and seen through the
  `onMarkAsSeen` and `onMarkAsRead` handlers.

### Fixed

- Calling `onRemoveActivity` on a notification feed now updates the state
  correctly.

## 0.8.7 - 2019-02-05

### Fixes

- Always display "Unknown" as the user which was a regression in 0.8.6

## 0.8.3 - 2019-01-08

### Fixes

- Uploading images with the `StatusUpdateForm` now works on iOS with
  `react-native-activity-feed` again. This was a regression in 0.8.2

## 0.8.2 - 2019-01-07

### Fixes

- Uploading images with the `StatusUpdateForm` now works on Android with
  `react-native-activity-feed`.

## 0.8.1 - 2018-12-21

### Additions

- Add basic support for 2-way pagination

## 0.8.0 - 2018-12-18

### Breaking Changes

- `LikesList` is renamed to `LikeList`

## 0.7.0 - 2018-12-14

### Breaking Changes

- `onToggleReaction` and `onAddReaction` arguments have changed.

```js
// old
onAddReaction(kind, activity, { data, targetFeeds, trackAnalytics });
// new
onAddReaction(kind, activity, data, { targetFeeds, trackAnalytics });
```

- `session` is replaced with `client` everywhere
- Update `getstream` library to v4.0.7, if you it directly check out it's
  [CHANGELOG](https://github.com/GetStream/stream-js/blob/master/CHANGELOG.md#400---2018-12-03)
  for info on its breaking changes there.

### Added

- Support for liking of comments. See SinglePostScreen in the `example`
  directory for an example of this.

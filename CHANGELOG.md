# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

Nothing yet

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

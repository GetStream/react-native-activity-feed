# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

Nothing yet

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

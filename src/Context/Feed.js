//

import * as React from 'react';
import { Platform } from 'react-native';

import immutable from 'immutable';
import URL from 'url-parse';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';

import { generateRandomId } from '../utils';
import isPlainObject from 'lodash/isPlainObject';

import { StreamApp } from './StreamApp';

import { sleep } from '../utils';

export const FeedContext = React.createContext({});

// type FR = FeedResponse<Object, Object>;

export class FeedManager {
  props;
  state = {
    activityOrder: [],
    activities: immutable.Map(),
    activityIdToPath: {},
    activityIdToPaths: {},
    reactionIdToPaths: {},
    reactionActivities: {},
    lastResponse: null,
    lastReverseResponse: null,
    refreshing: false,
    realtimeAdds: [],
    realtimeDeletes: [],
    subscription: null,
    unread: 0,
    unseen: 0,
    numSubscribers: 0,
    reactionsBeingToggled: {},
    childReactionsBeingToggled: {},
  };
  registeredCallbacks;

  constructor(props) {
    this.props = props;
    const initialOptions = this.getOptions();
    this.registeredCallbacks = [];
    let previousUrl = '';
    if (initialOptions.id_gte) {
      previousUrl = `?id_lt=${initialOptions.id_gte}`;
    } else if (initialOptions.id_gt) {
      previousUrl = `?id_lte=${initialOptions.id_gt}`;
    } else if (initialOptions.id_lte) {
      previousUrl = `?id_gt=${initialOptions.id_lte}`;
    } else if (initialOptions.id_lt) {
      previousUrl = `?id_gte=${initialOptions.id_lt}`;
    }
    this.state.lastReverseResponse = { next: previousUrl };
  }

  register(callback) {
    this.registeredCallbacks.push(callback);
    this.subscribe();
  }
  unregister(callback) {
    this.registeredCallbacks.splice(this.registeredCallbacks.indexOf(callback));
    this.unsubscribe();
  }

  triggerUpdate() {
    for (const callback of this.registeredCallbacks) {
      callback();
    }
  }

  setState = (changed) => {
    if (typeof changed === 'function') {
      changed = changed(this.state);
    }
    this.state = { ...this.state, ...changed };
    this.triggerUpdate();
  };

  trackAnalytics = (label, activity, track) => {
    const analyticsClient = this.props.analyticsClient;

    if (!track) {
      return;
    }
    if (!analyticsClient) {
      console.warn(
        'trackAnalytics was enabled, but analytics client was not initialized. ' +
          'Please set the analyticsToken prop on StreamApp',
      );
      return;
    }

    const feed = this.props.client.feed(
      this.props.feedGroup,
      this.props.userId,
    );

    analyticsClient.trackEngagement({
      label,
      feed_id: feed.id,
      content: {
        foreign_id: activity.foreign_id,
      },
      location: this.props.analyticsLocation,
    });
  };

  getActivityPath = (activity, ...rest) => {
    let activityId;
    if (typeof activity === 'string') {
      activityId = activity;
    } else {
      activityId = activity.id;
    }

    const activityPath = this.state.activityIdToPath[activityId];
    if (activityPath === undefined) {
      return [activityId, ...rest];
    }
    return [...activityPath, ...rest];
  };

  getActivityPaths = (activity) => {
    let activityId;
    if (typeof activity === 'string') {
      activityId = activity;
    } else {
      activityId = activity.id;
    }

    return this.state.activityIdToPaths[activityId];
  };

  getReactionPaths = (reaction) => {
    let reactionId;
    if (typeof reaction === 'string') {
      reactionId = reaction;
    } else {
      reactionId = reaction.id;
    }

    return this.state.reactionIdToPaths[reactionId];
  };

  onAddReaction = async (kind, activity, data, options = {}) => {
    let reaction;
    try {
      if (this.props.doReactionAddRequest) {
        reaction = await this.props.doReactionAddRequest(
          kind,
          activity,
          data,
          options,
        );
      } else {
        reaction = await this.props.client.reactions.add(
          kind,
          activity,
          data,
          options,
        );
      }
    } catch (e) {
      this.props.errorHandler(e, 'add-reaction', {
        kind,
        activity,
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    this.trackAnalytics(kind, activity, options.trackAnalytics);
    const enrichedReaction = immutable.fromJS({
      ...reaction,
      user: this.props.user.full,
    });

    this.setState((prevState) => {
      let { activities } = prevState;
      const { reactionIdToPaths } = prevState;
      for (const path of this.getActivityPaths(activity)) {
        this.removeFoundReactionIdPaths(
          activities.getIn(path).toJS(),
          reactionIdToPaths,
          path,
        );

        activities = activities
          .updateIn([...path, 'reaction_counts', kind], (v = 0) => v + 1)
          .updateIn([...path, 'own_reactions', kind], (v = immutable.List()) =>
            v.unshift(enrichedReaction),
          )
          .updateIn(
            [...path, 'latest_reactions', kind],
            (v = immutable.List()) => v.unshift(enrichedReaction),
          );

        this.addFoundReactionIdPaths(
          activities.getIn(path).toJS(),
          reactionIdToPaths,
          path,
        );
      }

      return { activities, reactionIdToPaths };
    });
  };

  onRemoveReaction = async (kind, activity, id, options = {}) => {
    try {
      if (this.props.doReactionDeleteRequest) {
        await this.props.doReactionDeleteRequest(id);
      } else {
        await this.props.client.reactions.delete(id);
      }
    } catch (e) {
      this.props.errorHandler(e, 'delete-reaction', {
        kind,
        activity,
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    this.trackAnalytics('un' + kind, activity, options.trackAnalytics);
    if (this.state.reactionActivities[id]) {
      this._removeActivityFromState(this.state.reactionActivities[id]);
    }

    return this.setState((prevState) => {
      let { activities } = prevState;
      const { reactionIdToPaths } = prevState;
      for (const path of this.getActivityPaths(activity)) {
        this.removeFoundReactionIdPaths(
          activities.getIn(path).toJS(),
          reactionIdToPaths,
          path,
        );

        activities = activities
          .updateIn([...path, 'reaction_counts', kind], (v = 0) => v - 1)
          .updateIn([...path, 'own_reactions', kind], (v = immutable.List()) =>
            v.remove(v.findIndex((r) => r.get('id') === id)),
          )
          .updateIn(
            [...path, 'latest_reactions', kind],
            (v = immutable.List()) =>
              v.remove(v.findIndex((r) => r.get('id') === id)),
          );

        this.addFoundReactionIdPaths(
          activities.getIn(path).toJS(),
          reactionIdToPaths,
          path,
        );
      }

      return { activities, reactionIdToPaths };
    });
  };

  onToggleReaction = async (kind, activity, data, options = {}) => {
    const togglingReactions = this.state.reactionsBeingToggled[kind] || {};
    if (togglingReactions[activity.id]) {
      return;
    }
    togglingReactions[activity.id] = true;
    this.state.reactionsBeingToggled[kind] = togglingReactions;

    const currentReactions = this.state.activities.getIn(
      [...this.getActivityPaths(activity)[0], 'own_reactions', kind],
      immutable.List(),
    );

    const last = currentReactions.last();
    if (last) {
      await this.onRemoveReaction(kind, activity, last.get('id'), options);
    } else {
      await this.onAddReaction(kind, activity, data, options);
    }
    delete togglingReactions[activity.id];
  };

  onAddChildReaction = async (kind, reaction, data, options = {}) => {
    let childReaction;
    try {
      if (this.props.doChildReactionAddRequest) {
        childReaction = await this.props.doChildReactionAddRequest(
          kind,
          reaction,
          data,
          options,
        );
      } else {
        childReaction = await this.props.client.reactions.addChild(
          kind,
          reaction,
          data,
          options,
        );
      }
    } catch (e) {
      this.props.errorHandler(e, 'add-child-reaction', {
        kind,
        reaction,
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }

    // this.trackAnalytics(kind, reaction, options.trackAnalytics);
    const enrichedReaction = immutable.fromJS({
      ...childReaction,
      user: this.props.user.full,
    });

    this.setState((prevState) => {
      let { activities } = prevState;
      for (const path of this.getReactionPaths(reaction)) {
        activities = activities
          .updateIn([...path, 'children_counts', kind], (v = 0) => v + 1)
          .updateIn([...path, 'own_children', kind], (v = immutable.List()) =>
            v.unshift(enrichedReaction),
          )
          .updateIn(
            [...path, 'latest_children', kind],
            (v = immutable.List()) => v.unshift(enrichedReaction),
          );
      }

      return { activities };
    });
  };

  onRemoveChildReaction = async (
    kind,
    reaction,
    id,
    /* eslint-disable-next-line no-unused-vars */
    options = {},
  ) => {
    try {
      if (this.props.doChildReactionDeleteRequest) {
        await this.props.doChildReactionDeleteRequest(id);
      } else {
        await this.props.client.reactions.delete(id);
      }
    } catch (e) {
      this.props.errorHandler(e, 'delete-reaction', {
        kind,
        reaction,
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    // this.trackAnalytics('un' + kind, reaction, options.trackAnalytics);
    if (this.state.reactionActivities[id]) {
      this._removeActivityFromState(this.state.reactionActivities[id]);
    }

    return this.setState((prevState) => {
      let { activities } = prevState;
      for (const path of this.getReactionPaths(reaction)) {
        activities = activities
          .updateIn([...path, 'children_counts', kind], (v = 0) => v - 1)
          .updateIn([...path, 'own_children', kind], (v = immutable.List()) =>
            v.remove(v.findIndex((r) => r.get('id') === id)),
          )
          .updateIn(
            [...path, 'latest_children', kind],
            (v = immutable.List()) =>
              v.remove(v.findIndex((r) => r.get('id') === id)),
          );
      }

      return { activities };
    });
  };

  onToggleChildReaction = async (kind, reaction, data, options = {}) => {
    const togglingReactions = this.state.childReactionsBeingToggled[kind] || {};
    if (togglingReactions[reaction.id]) {
      return;
    }
    togglingReactions[reaction.id] = true;
    this.state.childReactionsBeingToggled[kind] = togglingReactions;

    const currentReactions = this.state.activities.getIn(
      [...this.getReactionPaths(reaction)[0], 'own_children', kind],
      immutable.List(),
    );

    const last = currentReactions.last();
    if (last) {
      await this.onRemoveChildReaction(kind, reaction, last.get('id'), options);
    } else {
      await this.onAddChildReaction(kind, reaction, data, options);
    }
    delete togglingReactions[reaction.id];
  };

  _removeActivityFromState = (activityId) =>
    this.setState(
      ({
        activities,
        activityOrder,
        activityIdToPath,
        activityIdToPaths,
        reactionIdToPaths,
      }) => {
        const path = this.getActivityPath(activityId);
        let outerId = activityId;
        if (path.length > 1) {
          // It's an aggregated group we should update the paths of everything in
          // the list
          const groupArrayPath = path.slice(0, -1);
          activityIdToPath = this.removeFoundActivityIdPath(
            activities.getIn(groupArrayPath).toJS(),
            activityIdToPath,
            groupArrayPath,
          );
          activityIdToPaths = this.removeFoundActivityIdPaths(
            activities.getIn(groupArrayPath).toJS(),
            activityIdToPaths,
            groupArrayPath,
          );
          reactionIdToPaths = this.removeFoundReactionIdPaths(
            activities.getIn(groupArrayPath).toJS(),
            reactionIdToPaths,
            groupArrayPath,
          );
        }

        activities = activities.removeIn(path);
        if (path.length > 1) {
          const groupArrayPath = path.slice(0, -1);
          if (activities.getIn(groupArrayPath).size === 0) {
            outerId = path[0]; //
          } else {
            outerId = null;
          }
          activityIdToPath = this.addFoundActivityIdPath(
            activities.getIn(groupArrayPath).toJS(),
            activityIdToPath,
            groupArrayPath,
          );
          activityIdToPaths = this.addFoundActivityIdPaths(
            activities.getIn(groupArrayPath).toJS(),
            activityIdToPaths,
            groupArrayPath,
          );
          reactionIdToPaths = this.addFoundReactionIdPaths(
            activities.getIn(groupArrayPath).toJS(),
            reactionIdToPaths,
            groupArrayPath,
          );
        }
        if (outerId != null) {
          activityOrder = activityOrder.filter((id) => id !== outerId);
        }
        return {
          activities,
          activityOrder,
          activityIdToPaths,
          reactionIdToPaths,
          activityIdToPath,
        };
      },
    );

  onRemoveActivity = async (activityId) => {
    try {
      await this.feed().removeActivity(activityId);
    } catch (e) {
      this.props.errorHandler(e, 'delete-activity', {
        activityId: this.props.feedGroup,
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    return this._removeActivityFromState(activityId);
  };

  onMarkAsRead = (group) => this._onMarkAs('read', group);

  onMarkAsSeen = (group) => this._onMarkAs('seen', group);

  _onMarkAs = async (type, group) => {
    let groupArray;
    let markArg = group;
    if (group === true) {
      groupArray = this.state.activityOrder;
    } else if (Array.isArray(group)) {
      groupArray = group.map((g) => g.id);
      markArg = groupArray;
    } else {
      markArg = group.id;
      groupArray = [group.id];
    }
    try {
      await this.doFeedRequest({
        limit: 1,
        id_lte: this.state.activityOrder[0],
        ['mark_' + type]: markArg,
      });
    } catch (e) {
      this.props.errorHandler(e, 'get-notification-counts', {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
    }
    this.setState((prevState) => {
      const counterKey = 'un' + type;
      let activities = prevState.activities;
      let counter = prevState[counterKey];
      for (const groupId of groupArray) {
        const markerPath = [groupId, 'is_' + type];
        if (activities.getIn(markerPath) !== false) {
          continue;
        }
        activities = activities.setIn(markerPath, true);
        counter--;
      }
      return { activities, [counterKey]: counter };
    });
  };

  getOptions = (extraOptions = {}) => {
    const propOpts = { ...this.props.options };
    const { id_gt, id_gte, id_lt, id_lte, offset } = extraOptions;
    if (id_gt || id_gte || id_lt || id_lte || offset != null) {
      delete propOpts.id_gt;
      delete propOpts.id_gte;
      delete propOpts.id_lt;
      delete propOpts.id_lte;
      delete propOpts.offset;
      delete propOpts.refresh;
    }

    return {
      withReactionCounts: true,
      withOwnReactions: true,
      limit: 10,
      ...propOpts,
      ...extraOptions,
    };
  };

  doFeedRequest = async (options) => {
    const requestWasSentAt = Date.now();
    let response;

    if (this.props.doFeedRequest) {
      response = await this.props.doFeedRequest(
        this.props.client,
        this.props.feedGroup,
        this.props.userId,
        options,
      );
    } else {
      response = await this.feed().get(options);
    }
    if (Platform.OS === 'ios') {
      // Workaround for this issue: https://github.com/facebook/react-native/issues/5839
      const requestTime = Date.now() - requestWasSentAt;
      const MINIMUM_TIME_BETWEEN_REFRESHING_PROP_UPDATES = 350;
      const waitTime =
        MINIMUM_TIME_BETWEEN_REFRESHING_PROP_UPDATES - requestTime;
      if (waitTime > 0) {
        await sleep(waitTime);
      }
    }
    return response;
  };

  feed = () => this.props.client.feed(this.props.feedGroup, this.props.userId);

  responseToActivityMap = (response) =>
    immutable.fromJS(
      response.results.reduce((map, a) => {
        map[a.id] = a;
        return map;
      }, {}),
    );

  responseToActivityIdToPath = (response) => {
    if (
      response.results.length === 0 ||
      response.results[0].activities === undefined
    ) {
      return {};
    }
    const aggregatedResponse = response;

    const map = {};
    for (const group of aggregatedResponse.results) {
      group.activities.forEach((act, i) => {
        map[act.id] = [group.id, 'activities', i];
      });
    }
    return map;
  };

  responseToActivityIdToPaths = (response, previous = {}) => {
    const map = previous;
    const currentPath = [];
    function addFoundActivities(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundActivities(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.actor && obj.verb && obj.object) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          map[obj.id].push([...currentPath]);
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundActivities(obj[k]);
          currentPath.pop();
        }
      }
    }

    for (const a of response.results) {
      currentPath.push(a.id);
      addFoundActivities(a);
      currentPath.pop();
    }
    return map;
  };

  feedResponseToReactionIdToPaths = (response, previous = {}) => {
    const map = previous;
    const currentPath = [];
    function addFoundReactions(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundReactions(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.kind && obj.data) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          map[obj.id].push([...currentPath]);
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundReactions(obj[k]);
          currentPath.pop();
        }
      }
    }

    for (const a of response.results) {
      currentPath.push(a.id);
      addFoundReactions(a);
      currentPath.pop();
    }
    return map;
  };

  reactionResponseToReactionIdToPaths = (
    response,
    previous,
    basePath,
    oldLength,
  ) => {
    const map = previous;
    const currentPath = [...basePath];
    function addFoundReactions(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundReactions(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.kind && obj.data) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          map[obj.id].push([...currentPath]);
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundReactions(obj[k]);
          currentPath.pop();
        }
      }
    }

    for (const a of response.results) {
      currentPath.push(oldLength);
      addFoundReactions(a);
      currentPath.pop();
      oldLength++;
    }
    return map;
  };

  removeFoundReactionIdPaths = (data, previous, basePath) => {
    const map = previous;
    const currentPath = [...basePath];
    function removeFoundReactions(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          removeFoundReactions(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.kind && obj.data) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          remove(map[obj.id], (path) => isEqual(path, currentPath));
        }
        for (const k in obj) {
          currentPath.push(k);
          removeFoundReactions(obj[k]);
          currentPath.pop();
        }
      }
    }

    removeFoundReactions(data);
    return map;
  };

  removeFoundActivityIdPaths = (data, previous, basePath) => {
    const map = previous;
    const currentPath = [...basePath];
    function addFoundActivities(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundActivities(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.actor && obj.verb && obj.object) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          remove(map[obj.id], (path) => isEqual(path, currentPath));
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundActivities(obj[k]);
          currentPath.pop();
        }
      }
    }

    addFoundActivities(data);
    return map;
  };

  removeFoundActivityIdPath = (data, previous, basePath) => {
    const map = previous;
    const currentPath = [...basePath];
    data.forEach((obj, i) => {
      currentPath.push(i);
      if (isEqual(map[obj.id], currentPath)) {
        delete map[obj.id];
      }
      currentPath.pop();
    });
    return map;
  };

  addFoundReactionIdPaths = (data, previous, basePath) => {
    const map = previous;
    const currentPath = [...basePath];
    function addFoundReactions(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundReactions(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.kind && obj.data) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          map[obj.id].push([...currentPath]);
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundReactions(obj[k]);
          currentPath.pop();
        }
      }
    }

    addFoundReactions(data);
    return map;
  };

  addFoundActivityIdPaths = (data, previous, basePath) => {
    const map = previous;
    const currentPath = [...basePath];
    function addFoundActivities(obj) {
      if (Array.isArray(obj)) {
        obj.forEach((v, i) => {
          currentPath.push(i);
          addFoundActivities(v);
          currentPath.pop();
        });
      } else if (isPlainObject(obj)) {
        if (obj.id && obj.actor && obj.verb && obj.object) {
          if (!map[obj.id]) {
            map[obj.id] = [];
          }
          map[obj.id].push([...currentPath]);
        }
        for (const k in obj) {
          currentPath.push(k);
          addFoundActivities(obj[k]);
          currentPath.pop();
        }
      }
    }
    addFoundActivities(data);
    return map;
  };

  addFoundActivityIdPath = (data, previous, basePath) => {
    const map = previous;
    data.forEach((obj, i) => {
      map[obj.id] = [...basePath, i];
    });
    return map;
  };

  responseToReactionActivities = (response) => {
    if (response.results.length === 0) {
      return {};
    }
    const map = {};
    function setReactionActivities(activities) {
      for (const a of activities) {
        if (a.reaction && a.reaction.id) {
          map[a.reaction.id] = a.id;
        }
      }
    }

    if (response.results[0].activities === undefined) {
      setReactionActivities(response.results);
    } else {
      const aggregatedResponse = response;

      for (const group of aggregatedResponse.results) {
        setReactionActivities(group.activities);
      }
    }
    return map;
  };

  unseenUnreadFromResponse(response) {
    let unseen = 0;
    let unread = 0;
    if (typeof response.unseen === 'number') {
      unseen = response.unseen;
    }
    if (typeof response.unread === 'number') {
      unread = response.unread;
    }
    return { unseen, unread };
  }

  refresh = async (extraOptions) => {
    const options = this.getOptions(extraOptions);

    await this.setState({ refreshing: true });
    let response;
    try {
      response = await this.doFeedRequest(options);
    } catch (e) {
      this.setState({ refreshing: false });
      this.props.errorHandler(e, 'get-feed', {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }

    const newState = {
      activityOrder: response.results.map((a) => a.id),
      activities: this.responseToActivityMap(response),
      activityIdToPath: this.responseToActivityIdToPath(response),
      activityIdToPaths: this.responseToActivityIdToPaths(response),
      reactionIdToPaths: this.feedResponseToReactionIdToPaths(response),
      reactionActivities: this.responseToReactionActivities(response),
      refreshing: false,
      lastResponse: response,
      realtimeAdds: [],
      realtimeDeletes: [],
      ...this.unseenUnreadFromResponse(response),
    };

    if (options.mark_seen === true) {
      newState.unseen = 0;
    }
    if (options.mark_read === true) {
      newState.unread = 0;
    }

    return this.setState(newState);
  };

  subscribe = async () => {
    if (this.props.notify) {
      const feed = this.feed();
      await this.setState((prevState) => {
        if (prevState.subscription) {
          return {};
        }
        const subscription = feed.subscribe((data) => {
          this.setState((prevState) => {
            const numActivityDiff = data.new.length - data.deleted.length;
            return {
              realtimeAdds: prevState.realtimeAdds.concat(data.new),
              realtimeDeletes: prevState.realtimeDeletes.concat(data.deleted),
              unread: prevState.unread + numActivityDiff,
              unseen: prevState.unseen + numActivityDiff,
            };
          });
        });

        subscription.then(
          () => {
            console.log(
              `now listening to changes in realtime for ${this.feed().id}`,
            );
          },
          (err) => {
            console.error(err);
          },
        );
        return { subscription };
      });
    }
  };

  unsubscribe = async () => {
    const { subscription } = this.state;
    if (!subscription) {
      return;
    }
    await subscription;
    if (this.registeredCallbacks.length === 0) {
      try {
        await subscription.cancel();
        console.log(
          `stopped listening to changes in realtime for ${this.feed().id}`,
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  hasNextPage = () => {
    const lastResponse = this.state.lastResponse;
    return Boolean(lastResponse && lastResponse.next);
  };

  hasReverseNextPage = () => {
    const { lastReverseResponse } = this.state;
    return Boolean(lastReverseResponse && lastReverseResponse.next);
  };

  loadNextPage = async () => {
    const lastResponse = this.state.lastResponse;
    if (!lastResponse || !lastResponse.next) {
      return;
    }
    let cancel = false;
    await this.setState((prevState) => {
      if (prevState.refreshing) {
        cancel = true;
        return {};
      }
      return { refreshing: true };
    });

    if (cancel) {
      return;
    }

    const nextURL = new URL(lastResponse.next, true);
    const options = this.getOptions(nextURL.query);

    let response;
    try {
      response = await this.doFeedRequest(options);
    } catch (e) {
      this.setState({ refreshing: false });
      this.props.errorHandler(e, 'get-feed-next-page', {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    return this.setState((prevState) => {
      const activities = prevState.activities.merge(
        this.responseToActivityMap(response),
      );
      const activityIdToPath = {
        ...prevState.activityIdToPath,
        ...this.responseToActivityIdToPath(response),
      };
      return {
        activityOrder: prevState.activityOrder.concat(
          response.results.map((a) => a.id),
        ),
        activities,
        activityIdToPath,
        activityIdToPaths: this.responseToActivityIdToPaths(
          response,
          prevState.activityIdToPaths,
        ),
        reactionIdToPaths: this.feedResponseToReactionIdToPaths(
          response,
          prevState.reactionIdToPaths,
        ),
        reactionActivities: {
          ...prevState.reactionActivities,
          ...this.responseToReactionActivities(response),
        },
        refreshing: false,
        lastResponse: response,
      };
    });
  };

  loadReverseNextPage = async () => {
    const { lastReverseResponse } = this.state;
    if (!lastReverseResponse || !lastReverseResponse.next) {
      return;
    }
    let cancel = false;
    await this.setState((prevState) => {
      if (prevState.refreshing) {
        cancel = true;
        return {};
      }
      return { refreshing: true };
    });

    if (cancel) {
      return;
    }

    const nextURL = new URL(lastReverseResponse.next, true);
    const options = this.getOptions(nextURL.query);

    let response;
    try {
      response = await this.doFeedRequest(options);
    } catch (e) {
      this.setState({ refreshing: false });
      this.props.errorHandler(e, 'get-feed-next-page', {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    return this.setState((prevState) => {
      const activities = prevState.activities.merge(
        this.responseToActivityMap(response),
      );
      const activityIdToPath = {
        ...prevState.activityIdToPath,
        ...this.responseToActivityIdToPath(response),
      };
      return {
        activityOrder: response.results
          .map((a) => a.id)
          .concat(prevState.activityOrder),
        activities,
        activityIdToPath,
        activityIdToPaths: this.responseToActivityIdToPaths(
          response,
          prevState.activityIdToPaths,
        ),
        reactionIdToPaths: this.feedResponseToReactionIdToPaths(
          response,
          prevState.reactionIdToPaths,
        ),
        reactionActivities: {
          ...prevState.reactionActivities,
          ...this.responseToReactionActivities(response),
        },
        refreshing: false,
        lastReverseResponse: response,
      };
    });
  };

  loadNextReactions = async (
    activityId,
    kind,
    activityPath,
    oldestToNewest,
  ) => {
    let options = {
      activity_id: activityId,
      kind,
    };

    let orderPrefix = 'latest';
    if (oldestToNewest) {
      orderPrefix = 'oldest';
    }

    if (!activityPath) {
      activityPath = this.getActivityPath(activityId);
    }
    const latestReactionsPath = [
      ...activityPath,
      orderPrefix + '_reactions',
      kind,
    ];
    const nextUrlPath = [
      ...activityPath,
      orderPrefix + '_reactions_extra',
      kind,
      'next',
    ];
    const refreshingPath = [
      ...activityPath,
      orderPrefix + '_reactions_extra',
      kind,
      'refreshing',
    ];

    const reactions_extra = this.state.activities.getIn([
      ...activityPath,
      orderPrefix + '_reactions_extra',
    ]);
    let nextUrl = 'https://api.stream-io-api.com/';
    if (reactions_extra) {
      nextUrl = reactions_extra.getIn([kind, 'next'], '');
    } else if (oldestToNewest) {
      // If it's the first request and oldest to newest make sure
      // order is reversed by this trick with a non existant id.
      options.id_gt = 'non-existant-' + generateRandomId();
    }

    const refreshing = this.state.activities.getIn(refreshingPath, false);

    if (!nextUrl || refreshing) {
      return;
    }

    this.setState((prevState) => ({
      activities: prevState.activities.setIn(refreshingPath, true),
    }));

    options = {
      ...URL(nextUrl, true).query,
      ...options,
    };

    let response;
    try {
      if (this.props.doReactionsFilterRequest) {
        response = await this.props.doReactionsFilterRequest(options);
      } else {
        response = await this.props.client.reactions.filter(options);
      }
    } catch (e) {
      this.setState({ refreshing: false });
      this.props.errorHandler(e, 'get-reactions-next-page', {
        options,
      });
      return;
    }
    this.setState((prevState) => ({
      activities: prevState.activities
        .setIn(refreshingPath, false)
        .setIn(nextUrlPath, response.next)
        .updateIn(latestReactionsPath, (v = immutable.List()) =>
          v.concat(immutable.fromJS(response.results)),
        ),
      reactionIdToPaths: this.reactionResponseToReactionIdToPaths(
        response,
        prevState.reactionIdToPaths,
        latestReactionsPath,
        prevState.activities.getIn(latestReactionsPath, immutable.List()).toJS()
          .length,
      ),
    }));
  };

  refreshUnreadUnseen = async () => {
    let response;
    try {
      response = await this.doFeedRequest({ limit: 0 });
    } catch (e) {
      this.props.errorHandler(e, 'get-notification-counts', {
        feedGroup: this.props.feedGroup,
        userId: this.props.userId,
      });
      return;
    }
    return this.setState(this.unseenUnreadFromResponse(response));
  };
}

export class Feed extends React.Component {
  // Used to avoid unmount-remount behaviour, which causes
  // unsubscribe-subscribe behaviour.
  _appCtxWrapperFunc = (appCtx) => <FeedInner {...this.props} {...appCtx} />;

  render() {
    return <StreamApp.Consumer>{this._appCtxWrapperFunc}</StreamApp.Consumer>;
  }
}

class FeedInner extends React.Component {
  constructor(props) {
    super(props);

    this.manager =
      props.sharedFeedManagers[this.getFeedId()] ??
      new FeedManager(cloneDeep(props));

    this.boundForceUpdate = this.forceUpdate.bind(this);
  }

  componentDidMount() {
    return this.manager.register(this.boundForceUpdate);
  }

  componentDidUpdate(prevProps) {
    const clientDifferent = this.props.client !== prevProps.client;
    const doFeedRequestDifferent =
      this.props.doFeedRequest !== prevProps.doFeedRequest;
    const feedDifferent =
      this.getFeedId() !==
      this.getFeedId(prevProps.feedGroup, prevProps.userId);

    const notifyDifferent = this.props.notify !== prevProps.notify;
    const optionsDifferent = !isEqual(this.props.options, prevProps.options);

    if (optionsDifferent) {
      this.manager.props.options = this.props.options;
    }

    if (notifyDifferent) {
      this.manager.props.notify = this.props.notify;
    }

    if (optionsDifferent || notifyDifferent) {
      this.manager.refresh();
    }

    if (clientDifferent || feedDifferent || doFeedRequestDifferent) {
      // TODO: Implement
    }
  }

  componentWillUnmount() {
    return this.manager.unregister(this.boundForceUpdate);
  }

  getFeedId(feedGroup = this.props.feedGroup, userId = this.props.userId) {
    const { client } = this.props;

    return client.feed(feedGroup, userId).id;
  }

  getCtx = () => {
    const manager = this.manager;
    const state = manager.state;
    return {
      getActivityPath: manager.getActivityPath,
      onToggleReaction: manager.onToggleReaction,
      onAddReaction: manager.onAddReaction,
      onRemoveReaction: manager.onRemoveReaction,
      onToggleChildReaction: manager.onToggleChildReaction,
      onAddChildReaction: manager.onAddChildReaction,
      onRemoveChildReaction: manager.onRemoveChildReaction,
      onRemoveActivity: manager.onRemoveActivity,
      onMarkAsRead: manager.onMarkAsRead,
      onMarkAsSeen: manager.onMarkAsSeen,
      hasDoneRequest: state.lastResponse !== null,
      refresh: manager.refresh,
      refreshUnreadUnseen: manager.refreshUnreadUnseen,
      loadNextReactions: manager.loadNextReactions,
      loadNextPage: manager.loadNextPage,
      hasNextPage: manager.hasNextPage(),
      loadReverseNextPage: manager.loadReverseNextPage,
      hasReverseNextPage: manager.hasReverseNextPage(),
      feedGroup: this.props.feedGroup,
      userId: this.props.userId,
      activityOrder: state.activityOrder,
      activities: state.activities,
      realtimeAdds: state.realtimeAdds,
      realtimeDeletes: state.realtimeDeletes,
      refreshing: state.refreshing,
      unread: state.unread,
      unseen: state.unseen,
    };
  };

  render() {
    return (
      <FeedContext.Provider value={this.getCtx()}>
        {this.props.children}
      </FeedContext.Provider>
    );
  }
}

import * as React from 'react';
import { connect } from 'getstream';
import PropTypes from 'prop-types';

import StreamAnalytics from 'stream-analytics';

import Dayjs from 'dayjs';
import { FeedManager } from './Feed';

import { handleError } from '../errors';
import { Streami18n } from '../Streami18n';

export const StreamContext = React.createContext({
  changedUserData: () => {},
  sharedFeedManagers: {},
});

/**
 * Manages the connection with Stream. Any components that should talk to
 * Stream should be a child of this component.
 */
export class StreamApp extends React.Component {
  static defaultProps = {
    sharedFeeds: [
      {
        feedGroup: 'notification',
        notify: true,
        options: { mark_seen: true },
      },
    ],
    defaultUserData: { name: 'Unknown' },
    errorHandler: handleError,
  };

  static Consumer = function StreamAppConsumer(props) {
    return (
      <StreamContext.Consumer>
        {(appCtx) => {
          if (!props.children || !props.children.length) {
            return null;
          }
          if (!appCtx.client || !appCtx.user) {
            throw new Error(
              'This component should be a child of a StreamApp component',
            );
          }
          const Child = props.children;
          return Child(appCtx);
        }}
      </StreamContext.Consumer>
    );
  };

  constructor(props) {
    super(props);
    const client = connect(
      this.props.apiKey,
      this.props.token,
      this.props.appId,
      this.props.options || {},
    );

    let analyticsClient;

    this.state = {
      client,
      user: client.currentUser,
      userData: client.currentUser.data,
      changedUserData: () => {
        this.setState({ userData: this.state.user.data });
      },
      analyticsClient,
      sharedFeedManagers: {},
      errorHandler: this.props.errorHandler,
    };
    if (this.props.analyticsToken) {
      analyticsClient = new StreamAnalytics({
        apiKey: this.props.apiKey,
        token: this.props.analyticsToken,
      });
      analyticsClient.setUser(client.userId);
    }
    for (const feedProps of this.props.sharedFeeds) {
      const manager = new FeedManager({
        ...feedProps,
        client: this.state.client,
        user: this.state.user,
        userData: this.state.userData,
        changedUserData: this.state.changedUserData,
        analyticsClient: this.state.analyticsClient,
        sharedFeedManagers: this.state.sharedFeedManagers,
        errorHandler: this.state.errorHandler,
      });
      this.state.sharedFeedManagers[manager.feed().id] = manager;
    }
  }

  componentDidUpdate(prevProps) {
    const appIdDifferent = this.props.appId !== prevProps.appId;
    if (appIdDifferent) {
      //TODO: Implement
    }
  }

  getUserInfo = async () => {
    try {
      await this.state.user.getOrCreate(this.props.defaultUserData);
    } catch (e) {
      this.props.errorHandler(e, 'get-user-info', {
        userId: this.state.user.id,
      });
      return;
    }
    this.state.changedUserData();
  };

  async componentDidMount() {
    this.getUserInfo();
    const { i18nInstance } = this.props;
    let streami18n;

    if (i18nInstance && i18nInstance instanceof Streami18n) {
      streami18n = i18nInstance;
    } else {
      streami18n = new Streami18n({ language: 'en' });
    }

    streami18n.registerSetLanguageCallback((t) => {
      this.setState({ t });
    });

    const { t, tDateTimeParser } = await streami18n.getTranslators();
    this.setState({ t, tDateTimeParser });
  }

  componentWillUnmount() {
    const client = this.state.client;
    if (client && client.fayeClient) {
      client.fayeClient.disconnect();
    }
  }

  render() {
    if (!this.state.t) return null;

    const { t, tDateTimeParser, ...streamContextValue } = this.state;

    return (
      <StreamContext.Provider value={{ ...streamContextValue }}>
        <TranslationContext.Provider
          value={{
            t,
            tDateTimeParser,
          }}
        >
          {this.props.children}
        </TranslationContext.Provider>
      </StreamContext.Provider>
    );
  }
}

export const TranslationContext = React.createContext({
  t: (msg) => msg,
  tDateTimeParser: (input) => Dayjs(input),
});

export function withTranslationContext(OriginalComponent) {
  const ContextAwareComponent = function ContextComponent(props) {
    return (
      <TranslationContext.Consumer>
        {(translationContext) =>
          OriginalComponent && (
            <OriginalComponent {...translationContext} {...props} />
          )
        }
      </TranslationContext.Consumer>
    );
  };
  ContextAwareComponent.displayName =
    OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = ContextAwareComponent.displayName.replace(
    'Base',
    '',
  );

  return ContextAwareComponent;
}

export const TranslationContextPropTypes = {
  /**
   * Translator function
   * @ref https://getstream.github.io/react-native-activity-feed/#internationalisation-i18n
   */
  t: PropTypes.func,
  /**
   * Date time parser for date stamps.
   * @ref https://getstream.github.io/react-native-activity-feed/#internationalisation-i18n
   */
  tDateTimeParser: PropTypes.func,
};

import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  notificationsettings: 'Notification Settings',
  notificationsettingsDescription:
    'Here you can pick and choose what types of notifications to send and through what types of services.',
});

interface SettingsRoute {
  text: string;
  route: string;
  regex: RegExp;
}

const settingsRoutes: SettingsRoute[] = [
  {
    text: 'Email',
    route: '/settings/notifications/email',
    regex: /^\/settings\/notifications\/email/,
  },
  {
    text: 'Discord',
    route: '/settings/notifications/discord',
    regex: /^\/settings\/notifications\/discord/,
  },
];

const SettingsNotifications: React.FC = ({ children }) => {
  const router = useRouter();
  const intl = useIntl();

  const activeLinkColor = 'bg-gray-700';

  const inactiveLinkColor = '';

  const SettingsLink: React.FC<{
    route: string;
    regex: RegExp;
    isMobile?: boolean;
  }> = ({ children, route, regex, isMobile = false }) => {
    if (isMobile) {
      return <option value={route}>{children}</option>;
    }

    return (
      <Link href={route}>
        <a
          className={`whitespace-nowrap ml-8 first:ml-0 px-3 py-2 font-medium text-sm rounded-md ${
            !!router.pathname.match(regex) ? activeLinkColor : inactiveLinkColor
          }`}
          aria-current="page"
        >
          {children}
        </a>
      </Link>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg leading-6 font-medium text-gray-200">
          {intl.formatMessage(messages.notificationsettings)}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          {intl.formatMessage(messages.notificationsettingsDescription)}
        </p>
      </div>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            onChange={(e) => {
              router.push(e.target.value);
            }}
            onBlur={(e) => {
              router.push(e.target.value);
            }}
            defaultValue={
              settingsRoutes.find(
                (route) => !!router.pathname.match(route.regex)
              )?.route
            }
            aria-label="Selected tab"
            className="bg-gray-800 text-white mt-1 rounded-md form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-700 focus:outline-none focus:ring-blue focus:border-blue-300 sm:text-sm sm:leading-5 transition ease-in-out duration-150"
          >
            {settingsRoutes.map((route, index) => (
              <SettingsLink
                route={route.route}
                regex={route.regex}
                isMobile
                key={`mobile-settings-link-${index}`}
              >
                {route.text}
              </SettingsLink>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {settingsRoutes.map((route, index) => (
              <SettingsLink
                route={route.route}
                regex={route.regex}
                key={`standard-settings-link-${index}`}
              >
                {route.text}
              </SettingsLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="mt-10">{children}</div>
    </>
  );
};

export default SettingsNotifications;

/* eslint-disable mobx/missing-observer */

import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  isPushSupported,
  isSubscribed,
  subscribeOneSignal,
} from '@/services/onesignal';

export const NotificationController = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  const onSubscribe = async () => {
    await subscribeOneSignal();
    setPushPermission(Notification.permission);
  };

  const renderContent = () => {
    if (!isPushSupported()) {
      return (
        <p className="px-4">
          Push notifications are not supported by your browser.
        </p>
      );
    }

    if (pushPermission === 'denied') {
      return (
        <p className="px-4">
          Notifications are blocked for this site. Please enable them in your
          browser settings if you want to receive reminders.
        </p>
      );
    }

    if (pushPermission === 'granted' && isSubscribed()) {
      return children;
    }

    return (
      <Button onClick={onSubscribe} className="self-start">
        Subscribe to notifications
      </Button>
    );
  };

  return <>{renderContent()}</>;
};

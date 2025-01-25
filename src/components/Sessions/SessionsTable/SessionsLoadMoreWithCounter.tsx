import { observer } from 'mobx-react-lite';

import { Button } from '@/components/ui/button';
import { lamp } from '@/store/lamp';
import { sessions } from '@/store/sessions';

type SessionsLoadMoreWithCounterProps = {
  dataLength: number;
};

export const SessionsLoadMoreWithCounter = observer(
  function SessionsLoadMoreWithCounter({
    dataLength,
  }: SessionsLoadMoreWithCounterProps) {
    const { sessionsCount } = lamp;
    const { isFetching } = sessions;

    return (
      <div className="flex flex-col gap-4 justify-between items-center mt-2">
        <span className="text-sm font-medium text-muted-foreground">
          Showing {dataLength} of {sessionsCount}
        </span>
        {!isFetching && dataLength < sessionsCount && (
          <Button
            variant={'outline'}
            onClick={() => sessions.getSessions('more')}
          >
            Load more
          </Button>
        )}
      </div>
    );
  }
);

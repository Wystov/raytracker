import { User } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { NotificationsSubscribe } from '@/components/NotificationsSubscribe';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOutUser } from '@/services/firebase/auth';
import { user } from '@/store/user';

export const Account = observer(function Account() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'ghost'} size={'icon-lg'}>
          <User />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account</SheetTitle>
        </SheetHeader>
        <SheetDescription />
        <div className="flex flex-col items-start gap-2 py-4">
          <div>User: {user.data?.profile.displayName}</div>
        </div>
        <NotificationsSubscribe />
        <SheetFooter className="items-start">
          <Button variant={'outline'} onClick={signOutUser}>
            Sign out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

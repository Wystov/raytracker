import { User } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { signOutUser } from '@/services/firebase/auth';
import { user } from '@/store/user';

import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

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
        <div className="flex flex-col items-start gap-2 py-4">
          <div>User: {user.data?.profile.displayName}</div>
        </div>
        <SheetFooter className="items-start">
          <Button variant={'outline'} onClick={() => signOutUser()}>
            Sign out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

import { LogIn } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { signInWithGoogle } from '@/services/firebase/auth';
import { user } from '@/store/user';

import { Account } from './account';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export const Header = observer(function Header() {
  const { isLoading, data } = user;

  const showLoginBtn = !isLoading && !data?.profile;
  const showAccountBtn = !isLoading && data?.profile;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center w-full max-w-96 m-auto p-2">
        <a href="/" className="font-extrabold tracking-wider text-xl">
          <span className="text-primary">Ray</span>Tracker
        </a>
        <div className="flex gap-1">
          {showLoginBtn && (
            <Button
              variant={'ghost'}
              size={'icon-lg'}
              onClick={signInWithGoogle}
            >
              <LogIn />
            </Button>
          )}
          {showAccountBtn && <Account />}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
});

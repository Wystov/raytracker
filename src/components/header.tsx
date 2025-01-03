import { LogIn } from 'lucide-react';

import { signInWithGoogle } from '@/services/firebase/auth';
import { user } from '@/store/user';

import { Account } from './account';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

/* eslint-disable mobx/missing-observer */
export const Header = () => {
  const showLoginBtn = user.initialized && !user.data?.profile;
  const showAccountBtn = user.initialized && user.data?.profile;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center w-full max-w-96 m-auto p-2">
        <a href="/" className="font-black">
          RT
        </a>
        <div className="flex">
          {showLoginBtn && (
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => signInWithGoogle()}
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
};

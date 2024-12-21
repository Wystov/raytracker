import { observer } from 'mobx-react-lite';

import { Button } from '@/components/ui/button';
import { signInWithGoogle, signOutUser } from '@/services/firebase/auth';
import { user } from '@/store/user';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

export const Login = observer(function Login() {
  return (
    <Card className="w-full mb-2">
      {user.profile ? (
        <>
          <CardHeader>
            <CardTitle>Welcome, {user.profile.displayName}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => {
                signOutUser();
              }}
            >
              Sign Out
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Sign in to use service</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => signInWithGoogle()}>Sign In</Button>
          </CardContent>
        </>
      )}
    </Card>
  );
});

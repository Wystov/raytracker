import { Button } from '@/components/ui/button';
import { signInWithGoogle, signOutUser } from '@/services/firebase/auth';
import { user } from '@/store/user';
import { observer } from 'mobx-react-lite';

export const Login = observer(function Login() {
  return (
    <div>
      {user.profile ? (
        <>
          <p>Welcome, {user.profile.displayName}</p>
          <Button
            onClick={() => {
              signOutUser();
            }}
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={() => signInWithGoogle()}>Sign In</Button>
      )}
    </div>
  );
});

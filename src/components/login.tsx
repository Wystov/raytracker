import { observer } from 'mobx-react-lite';

import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/services/firebase/auth';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const Login = observer(function Login() {
  return (
    <Card className="w-full mb-2">
      <CardHeader>
        <CardTitle>Sign in to track your lamp time</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signInWithGoogle()}>Sign In</Button>
      </CardContent>
    </Card>
  );
});

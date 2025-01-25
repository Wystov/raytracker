/* eslint-disable mobx/missing-observer */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
import { signInWithGoogle } from '@/services/firebase/auth';

export const Login = () => {
  return (
    <Card className="w-full mb-2">
      <CardHeader>
        <CardTitle>Sign in to track your lamp time</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={signInWithGoogle} variant={'outline'}>
          <GoogleIcon /> Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
};

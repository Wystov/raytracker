import { observer } from 'mobx-react-lite';

import { LampInfo } from '@/components/Lamp/lamp-info';
import { LampDrawer } from '@/components/Lamp/LampDrawer/lamp-drawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer } from '@/components/ui/drawer';
import { lamp } from '@/store/lamp';

export const Lamp = observer(function Lamp() {
  return (
    <Card className="w-full mb-2">
      <CardHeader className="pb-3">
        <CardTitle>Device</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {lamp.exists ? (
          <LampInfo />
        ) : (
          <Drawer>
            <LampDrawer type="add" />
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
});

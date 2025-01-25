import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { ChevronDown, CircleHelp } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { ActionsDropdown } from '@/components/actions/ActionsDropdown';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toHumanReadableTime } from '@/lib/human-readable-time';
import { lamp } from '@/store/lamp';

export const LampInfo = observer(function LampInfo() {
  return (
    <Collapsible className="flex flex-col gap-2 -mb-6">
      <div className="flex justify-between w-full">
        <div className="flex items-center">
          {lamp.name}: {toHumanReadableTime(lamp.time)}
        </div>
        <div className="mr-2">
          <ActionsDropdown type="lamp" id=""></ActionsDropdown>
        </div>
      </div>
      <CollapsibleContent className="space-y-4">
        <Separator className="mt-2 mb-2" />
        <div className="flex gap-2">
          <p>
            Bulb: {toHumanReadableTime(lamp.bulbTime)} / {lamp.bulbLifetime}h
          </p>
          <Popover>
            <PopoverTrigger>
              <CircleHelp />
            </PopoverTrigger>
            <PopoverContent>
              <p>
                Over time, the amount of UV light emitted by the bulb decreases,
                which may impact the effectiveness of your lamp. For example,
                one of the most popular bulbs, Philips PL/S 9W, experiences a UV
                depreciation of 20% at 1000 hours, as stated by the
                manufacturer.
              </p>
              <p>You can change this value in lamp edit</p>
            </PopoverContent>
          </Popover>
        </div>
        <Progress value={lamp.bulbProgress} />
      </CollapsibleContent>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="self-center hover:bg-transparent hover:opacity-50 transition-all transform-gpu data-[state=closed]:rotate-0 data-[state=open]:rotate-180"
        >
          <ChevronDown className="w-20" />
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  );
});

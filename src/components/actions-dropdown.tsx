/* eslint-disable mobx/missing-observer */
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ActionsDropdownProps {
  children: ReactNode[];
}

export const ActionsDropdown = ({ children }: ActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        sideOffset={-6}
        className="flex gap-2 min-w-fit p-3"
      >
        {children &&
          Array.isArray(children) &&
          children.map((item: ReactNode, i) => (
            <DropdownMenuItem className="p-0" key={i}>
              {item}
            </DropdownMenuItem>
          ))}
        <DropdownMenuArrow className="fill-muted -translate-y-[1px]" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/* eslint-disable mobx/missing-observer */
import { SessionDrawer } from './session-drawer.tsx';
import { SessionsList } from './sessons-list.tsx';

export const Sessions = () => {
  return (
    <>
      <SessionDrawer type="add" />
      <SessionsList />
    </>
  );
};

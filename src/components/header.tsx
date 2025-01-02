/* eslint-disable mobx/missing-observer */
export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between w-full max-w-96 m-auto p-2">
        <div>RT</div>
        <div>avatar</div>
      </div>
    </header>
  );
};

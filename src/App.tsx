import { Button } from './components/ui/button';

export const App = () => {
  return (
    <>
      <Button
        onClick={() => {
          alert('click');
        }}
      >
        Button
      </Button>
    </>
  );
};

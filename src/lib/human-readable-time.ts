export const toHumanReadableTime = (seconds: number) => {
  if (seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const formattedHours = hours > 0 ? `${hours}h` : '';
  const formattedMinutes = minutes > 0 ? `${minutes}min` : '';
  const formattedSeconds = seconds > 0 ? `${seconds}s` : '';

  return [formattedHours, formattedMinutes, formattedSeconds]
    .filter(Boolean)
    .join(' ');
};

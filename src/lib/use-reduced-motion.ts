import {useSyncExternalStore} from 'react';

let preference: MediaQueryList | undefined;
const getPreference = () => (preference ??= window.matchMedia('(prefers-reduced-motion: reduce)'));
const subscribe = (onChange: () => void) => {
  const query = getPreference();
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getSnapshot = () => getPreference().matches;
const getServerSnapshot = () => false;

/** Keep React and imperative preview effects in sync with live OS preference changes. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

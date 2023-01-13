import { Unsubscribe } from 'firebase/firestore';
import { useEffect } from 'react';

export const useSubscription = (
  subscription: () => Unsubscribe | undefined,
  { enable }: { enable: unknown } = { enable: false }
) => {
  useEffect(() => {
    if (!enable) return;

    const unsub = subscription();

    return () => unsub?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enable]);
};

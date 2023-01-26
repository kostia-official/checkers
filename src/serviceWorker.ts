import { router } from '@src/router';

export const listenForMessages = () => {
  window.navigator?.serviceWorker?.addEventListener('message', (event) => {
    if (event.data.url) {
      router.navigate(event.data.url, { replace: true });
    }
  });
};

import { writable } from 'svelte/store';

function createSnackbarStore() {
  const { subscribe, update } = writable({
    message: '',
    type: 'info',
    duration: 5000,
    show: false
  });

  return {
    subscribe,
    show: (message, type = 'info', duration = 5000) => {
      update(store => ({
        message,
        type,
        duration,
        show: true
      }));
    },
    close: () => {
      update(store => ({ ...store, show: false }));
    }
  };
}

export const snackbarStore = createSnackbarStore();

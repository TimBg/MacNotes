import { reactive } from 'vue';

export function useModalState() {
  const state = reactive({
    showModal: false,
    noteToDelete: null as INote | null  
  });

  function show(note: INote) {
    state.showModal = true;
    state.noteToDelete = note;
  }

  function hide() {
    state.showModal = false;
    state.noteToDelete = null;
  }

  return {
    state,
    show,
    hide
  };
}
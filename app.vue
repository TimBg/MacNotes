<template>
  <div class="app-container">
    <SideBar 
      :notes="notes" 
      :showDeleteModal="showDeleteModal"
    />
    
    <div class="main-content">
      <div class="main-header">
        <img
          :class="isEditing ? 'markdown-btn' : 'edit-btn'"
          @click="toggleEditRender"
          :src="(isEditing ? markdownIconUrl : editIconUrl)"
        />

        <SearchBar />
      </div>

      <div class="note" v-if="selectedNoteId">
        <div class="note-time-container">
          <div class="note-time">
            {{ getLastModified() }}
          </div>
        </div>

        <NoteEditor 
          ref="noteEditorRef" 
          :isEditing="isEditing" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  import SideBar from './components/SideBar.vue';
  import SearchBar from './components/SearchBar.vue';
  import NoteEditor from './components/NoteEditor.vue';
  import { INote, useNotesStore } from './store/notes';
  import { toStandardDateTime } from './utils/date'
  import { markdownIconUrl, editIconUrl } from './consts/urls';

  const notesStore = useNotesStore();

  const notes = computed(() => notesStore.notes);
  const selectedNoteId = computed(() => notesStore.selectedNoteId);

  const noteEditorRef = ref(null); 
  let isEditing = ref(false);

  watch(selectedNoteId, (newId, oldId) => {
    if (newId !== oldId) {
      isEditing.value = false;
      
      if(noteEditorRef.value) {
        // @ts-ignore
        noteEditorRef.value.renderCurrentNote();
      }
    }
  });


  const showDeleteModal = (note: INote): void => {
    const userConfirmation = window.confirm('Are you sure you want to delete this note?');
    if (userConfirmation) {
      notesStore.deleteNote(note.id);
    }
  }

  const toggleEditRender = (): void => {
    isEditing.value = !isEditing.value;
     // @ts-ignore
    noteEditorRef.value.toggleEditMode();
  };

  const getLastModified = (): string => {
    if(!notes.value.length) return '';

    const index = notes.value.findIndex((note: INote) => note.id === selectedNoteId.value);
    const selectedNote = notes.value[index];

    if(!selectedNote) return '';
    
    const lastModified = new Date(selectedNote.lastModified);

    return toStandardDateTime(lastModified);
  }

  onMounted(() => {
    notesStore.initSelectedNoteId();
  });
</script>

<style>
  @import './assets/css/main.css';

  .app-container {
    display: flex;
    height: 100vh;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    flex: 4;
    height: 100%; 
    padding: 3px 25px;
    box-sizing: border-box;
  }

  .main-header {
    min-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .note-time-container {
    width: 100%;
    min-height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .note-time {
    min-width: 250px;
    min-height: 20px;
    color: #979797;
  }

  .note {
    height: calc(100% - 78px);
  }

  .markdown-btn {
    width: 24px;
    height: 15px;
    cursor: pointer;
  }

  .edit-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
</style>
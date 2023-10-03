<template>
  <div class="sidebar">
    <div class="buttons">
      <img class="add-btn" 
        @click="addNewNote" 
        src="~/assets/images/add.png" 
      />
      
      <img 
        class="remove-btn" 
        @click="deleteSelectedNote" 
        src="~/assets/images/remove.png"
      />
    </div>
    
    <div class="content">
      <ul>
        <li 
          v-for="note in displayedNotes" 
          :key="note.id" 
          :class="{ 'selected': note.selected }" 
          @click="selectNote(note)"
        >
          <div class="note-header">
            <span class="title">{{ note.title }}</span>
          </div>

          <div class="note-footer">
            <span class="time">{{ convertToHHMM(note.lastModified) }}</span>
            <span class="description">{{ note.description }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  import { useNotesStore, NotesStoreType, INote } from '../store/notes'; 
  import { convertToHHMM } from '../utils/date'

  const notesStore: NotesStoreType = useNotesStore();

  const displayedNotes = computed(() => notesStore.displayedNotes);
  const notes = computed(() => notesStore.notes);

  const props = defineProps({
    showDeleteModal: Function,
  });

  const deleteSelectedNote = (): void => {
    const index: number = notes.value.findIndex((note: INote) => note.selected);
    if (index !== -1 && props.showDeleteModal) {
      props.showDeleteModal(notes.value[index]);
    }
  }

  const addNewNote = (): void => {
    notesStore.addNote();
  }

  const selectNote = (note: INote): void => {
    notesStore.selectNote(note);
  }
</script>

<style scoped>
  img {
    cursor: pointer;
  }

  .add-btn {
    width: 17px;
    height: 17px;
    margin: 0 30px;
  }

  .remove-btn {
    width: 23px;
    height: 23px;
  }

  .sidebar {
    width: calc(100% / 5);
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #C8C8C8;
  }

  .buttons {
    min-height: 50px;
    display: flex;
    align-items: center;
  }

  .content {
    overflow-y: auto;
    border-right: 0;
  }

  .content::-webkit-scrollbar {
    width: 0 !important;
  }

  .selected {
    background-color: #fbe59b;
  }

  ul {
    width: 100%;
  }

  li {
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: 70px;
    width: calc(100% - 20px);
    margin: 0 10px;
    cursor: pointer;
    border-radius: 4px; 
    padding: 8px 10px;
  }

  .time, .title, .description {
    margin: 0 5px;
  }

  .note-header {
    margin-bottom: 6px;
  }

  .note-header .title, .note-footer .description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;   
  }

  .title, .time {
    font-weight: 600;
  }

  .description {
    color: #979797;
  }
</style>

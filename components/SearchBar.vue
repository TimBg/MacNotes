<template>
  <div class="search-bar">
    <input 
      v-model="searchQuery" 
      placeholder="Search" 
      @input="searchNotes" 
    />
  </div>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useNotesStore, NotesStoreType, INote } from '../store/notes'; 

  const notesStore: NotesStoreType = useNotesStore();
  
  const searchQuery: Ref<string> = ref('');
  
  const searchNotes = (): void => {
    notesStore.filterNotes(searchQuery.value);
  }
</script>
  
<style scoped>
  .search-bar {
    margin: 10px 0;
  }
  
  input {
    padding: 5px;
    min-width: 220px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #e1e1e1;
  }

  input:focus {
    outline: 1px solid gray;
  }
</style>
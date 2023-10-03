<template>
  <div class="note-editor">
    <textarea 
      v-if="isEditMode" 
      v-model="unrenderedNoteContent" 
      @input="updateNote"
    ></textarea>
    
    <div 
      class="rendered-markdown" 
      v-else v-html="renderedMarkdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, withDefaults, onMounted, Ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import markdownStyle from 'markdown-it-style';

  import { useNotesStore, NotesStoreType } from '~/store/notes';
  import { getTextAttributes } from '~/utils/text'

  const md = new MarkdownIt();
  
  md.use(markdownStyle, {
    'h1': 'font-size:32px;color:black',
    'h2': 'font-size:24px;color:black',
    'h3': 'font-size:20px;color:black',
    'h4': 'font-size:18px;color:black',
    'h5': 'font-size:16px;color:black',
    'h6': 'font-size:14px;color:black',
    'p': 'font-size:16px;color:black',
    'ul': 'list-style-type:disc',
    'ol': 'list-style-type:decimal',
    'li': 'font-size:16px;color:black',
    'blockquote': 'border-left:6px solid #e0e0e0;padding-left:40px;margin-top: 15px;font-style:italic;',
    'div': 'margin-bottom: 5px'
  });

  const notesStore: NotesStoreType = useNotesStore();

  const props = defineProps({
    isEditing: {
      type: Boolean,
      default: true
    }
  });

  const isEditMode: Ref<boolean> = ref(props.isEditing); 
  const renderedMarkdown: Ref<string> = ref('');

  const renderCurrentNote = (): void => {
    if (notesStore.currentNote) {
      renderedMarkdown.value = md.render(notesStore.currentNote.content);
    }
  };

  watch(() => props.isEditing, (isEditingNewVal: boolean) => {
    isEditMode.value = isEditingNewVal;
    if (!isEditMode.value && notesStore.currentNote) {
      renderedMarkdown.value = md.render(notesStore.currentNote.content);
    }
  });

  watch(() => notesStore.currentNote, () => {
    if (!isEditMode.value) {
      renderCurrentNote();
    }
  });

  onMounted(() => {
    if (notesStore.currentNote && !isEditMode.value) {
      renderedMarkdown.value = md.render(notesStore.currentNote.content);
    }
  });

  const updateCurrentNote = (title: string, description: string, text: string): void => {
    notesStore.currentNote.title = title.substring(0, 30);
    notesStore.currentNote.description = description;
    notesStore.currentNote.content = text;
    notesStore.currentNote.lastModified = new Date();
    notesStore.updateNote(notesStore.currentNote);
  }

  const unrenderedNoteContent = computed({
    get: () => notesStore.currentNote ? notesStore.currentNote.content : '',
    set: (text: string) => {

      if (notesStore.currentNote) {
        const { title, description } = getTextAttributes(text);

        updateCurrentNote(title, description, text);
        
        if (!isEditMode.value) {
          renderedMarkdown.value = md.render(unrenderedNoteContent.value);
        }
      }
    }
  });

  const toggleEditMode = (): void => {
    isEditMode.value = !isEditMode.value;
    if (!isEditMode.value && notesStore.currentNote) {
      renderedMarkdown.value = md.render(notesStore.currentNote.content);
    }
  };

  defineExpose({ toggleEditMode, renderCurrentNote });
</script>

<style scoped>
  .note-editor {
    height: 100%;
  }

  textarea {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
    resize: none; 
  }

  .rendered-markdown {
    width: 100%;
    height: 100%;
    border: none;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
  }
</style>
<template>
  <div class="note-editor">
    <textarea 
      v-if="isEditMode" 
      v-model="unrenderedNoteContent" 
    ></textarea>
    
    <div 
      class="rendered-markdown" 
      v-else v-html="renderedMarkdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import MarkdownIt from 'markdown-it';
  import markdownStyle from 'markdown-it-style';

  import { ref, computed, watch, onMounted, Ref } from 'vue';
  import { useNotesStore, NotesStoreType } from '~/store/notes';
  import { getTextAttributes } from '~/utils/text'

  const md = new MarkdownIt({
    breaks: true,   
  });
  
  md.use(markdownStyle, {
    'h1': 'font-size:32px;color:black;margin-bottom: 7px',
    'h2': 'font-size:24px;color:black;margin-bottom: 7px',
    'h3': 'font-size:20px;color:black;margin-bottom: 7px',
    'h4': 'font-size:18px;color:black;margin-bottom: 7px',
    'h5': 'font-size:16px;color:black;margin-bottom: 7px',
    'h6': 'font-size:14px;color:black;margin-bottom: 7px',
    'p': 'font-size:16px;color:black;margin-bottom: 7px',
    'ul': 'margin-bottom: 7px; margin-left: 15px',
    'ol': 'list-style-type:decimal;margin-bottom: 7px;margin-left: 15px',
    'li': 'font-size:16px;color:black;margin-bottom: 7px',
    'blockquote': 'border-left:6px solid #e0e0e0;padding-left:40px;margin-top: 15px;font-style:italic;margin-bottom: 7px',
    'div': 'margin-bottom: 7px'
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
    if(!notesStore.currentNote) return;

    notesStore.currentNote.title = title;
    notesStore.currentNote.description = description;
    notesStore.currentNote.content = text;
    notesStore.currentNote.lastModified = +new Date();
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
    overflow: hidden;
  }
</style>
import { defineStore } from 'pinia';
import db from '~/services/indexedDBAPI';

export interface INote {
  id: string;
  title: string;
  description: string;
  lastModified: number;
  content: string;
  selected?: boolean;
}

interface NotesState {
  displayedNotes: INote[],
  notes: INote[];
  selectedNoteId: string | null;
  searchQuery: string;
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    displayedNotes: [],
    notes: [],
    selectedNoteId: null,
    searchQuery: '',
  }),
  getters: {
    currentNote: (state: NotesState): INote | null => {
      if (!state.selectedNoteId) return null;
      return state.notes.find((note) => note.id === state.selectedNoteId) || null;
    },
  },
  actions: {
    filterNotes(query: string): void {
      this.searchQuery = query;
      this.displayedNotes = this.notes.filter((note: INote) => note.content.includes(query));
    },
    async setNotes(): Promise<void> {
      this.notes = (await db.getAllNotes()).sort((a, b) => b.lastModified - a.lastModified);
      this.displayedNotes = [...this.notes];
    },
    async addNote(): Promise<void> {
      const newNote: INote = {
        id: String(Date.now()),
        title: 'New Note',
        description: 'No additional text',
        lastModified: Date.now(),
        content: ''
      };
  
      await this.selectNote(newNote);
      this.notes.unshift(newNote);
      await db.addNote(newNote);
      this.filterNotes(this.searchQuery);
    },
    async deleteNote(noteIdToDelete: string): Promise<void> {
      const index: number = this.notes.findIndex((note: INote) => note.id === noteIdToDelete);
      if (index !== -1) {
        this.notes.splice(index, 1);

        if (this.selectedNoteId === noteIdToDelete) {
          await this.selectNote(null);
        }
      }

      await db.deleteNote(noteIdToDelete);
      this.filterNotes(this.searchQuery);
    },
    async selectNote(note: INote | null): Promise<void> {
      this.notes.forEach(async (note: INote) => {
        note.selected = false;
        await db.updateNote(note.id, note);
      });
  
      if(note) {
        note.selected = true; 
        this.selectedNoteId = note.id;
        await db.updateNote(note.id, note);
      } else {
        this.selectedNoteId = null;
      }

      this.filterNotes(this.searchQuery);
    },
    async updateNote(updatedNote: INote): Promise<void> {
      const index: number = this.notes.findIndex((note: INote) => note.id === updatedNote.id);
      if (index !== -1) {
        this.notes[index] = updatedNote;
        await db.updateNote(updatedNote.id, updatedNote);
        this.filterNotes(this.searchQuery);
      }
    },
    async initNotes(): Promise<void> {
      await this.setNotes();
    },
    async initSelectedNoteId(): Promise<void> {
      await this.initNotes();

      const selectedNote: INote | undefined = this.notes.find((note : INote) => note.selected);
      if (selectedNote) {
        this.selectedNoteId = selectedNote.id;
      }
    }
  },
});

export type NotesStoreType = ReturnType<typeof useNotesStore>;
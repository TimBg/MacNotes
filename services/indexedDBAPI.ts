import Dexie from "dexie";
import { INote } from "~/store/notes";

class NotesDatabase extends Dexie {
  notes: Dexie.Table<INote, string>;
  
  constructor() {
    super("NotesDatabase");
  
    this.version(1).stores({
      notes: 'id'
    });
  
    this.notes = this.table("notes");
  }
  
  async addNote(note: INote): Promise<string> {
    return this.notes.add(note);
  }
  
  async deleteNote(id: string): Promise<void> {
    return this.notes.delete(id);
  }
  
  async updateNote(id: string, changes: Partial<INote>): Promise<number> {
    return this.notes.update(id, changes);
  }
  
  async getAllNotes(): Promise<INote[]> {
    return this.notes.toArray();
  }
}
  
const db = new NotesDatabase();

export default db;
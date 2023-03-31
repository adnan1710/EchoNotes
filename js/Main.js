import DisplayNotes from "./DisplayNotes.js";
import Methods from "./Methods.js";

export default class MainApp {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new DisplayNotes(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = Methods.getAllNotes();

        this._setNotes(notes);

        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "",
                    body: ""
                };

                Methods.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                Methods.saveNote({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                Methods.deleteNote(noteId);
                this._refreshNotes();
            },
        };
    }
}
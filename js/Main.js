import DisplayNotes from "./DisplayNotes.js";
import Methods from "./Methods.js";
import SpeechInput from "./Speech.js";

export default class MainApp {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new DisplayNotes(root, this.notes_methods());

        this.refresh();
        this.setup_sidebar();
        this.setup_speech();

    }
    setup_speech() {
        const Speech = new SpeechInput();
    }

    setup_sidebar() {

        const sidebarBtn = document.getElementById("sidebarBtn");
        const sideBar = document.querySelector(".sidebar");
        function openNav() {
            sideBar.classList.add("sidebar_visible");
        }
        function closeNav() {
            sideBar.classList.remove("sidebar_visible");
        }
        sidebarBtn.addEventListener("click", () => {
            // console.log("Clicked");
            if (sideBar.classList.contains("sidebar_visible")) {
                closeNav();
            } else {
                openNav();
            }
        });
    }

    refresh() {
        const notes = Methods.load_notes();

        this.set_notes(notes);

        if (notes.length > 0) {
            this.set_active_note(notes[0]);
        }
    }

    set_notes(notes) {
        this.notes = notes;
        this.view.update_note_sidebar_list(notes);
        this.view.update_preview_visibility(notes.length > 0);
    }

    set_active_note(note) {
        this.activeNote = note;
        this.view.ret_active_note(note);
    }

    notes_methods() {
        return {
            note_selection: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this.set_active_note(selectedNote);
            },
            note_addition: () => {
                const newNote = {
                    title: "",
                    body: ""
                };

                Methods.note_save(newNote);
                this.refresh();
            },
            note_edit: (title, body) => {
                Methods.note_save({
                    id: this.activeNote.id,
                    title,
                    body
                });

                this.refresh();
            },
            note_delete: noteId => {
                Methods.note_delete(noteId);
                this.refresh();
            },
        };
    }
}
export default class Methods {

    static load_notes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        return notes.sort((a, b) => {
            return new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1;
        });
    }

    static note_save(noteToSave) {
        const notes = Methods.load_notes();
        const existing = notes.find(note => note.id == noteToSave.id);

        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.timestamp = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.timestamp = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static note_delete(id) {
        const notes = Methods.load_notes();
        const present_notes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp-notes", JSON.stringify(present_notes));
    }
}
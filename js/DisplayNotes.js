export default class DisplayNotes {
    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="sidebar">
                <div class="your__notes">Your Notes</div>
                <div class="notes_list"></div>
            </div>
            <div class="preview">
                <input class="note_title" type="text" placeholder="Note Title...">
                <textarea class="note_body" placeholder="Take Note..."></textarea>
                <p class="speech_instructions">Ready</p>
                <div class="action_buttons">
                <button class="speech-start" type="button">Speak</button>
                <button class="speech-stop" type="button">Stop</button>
                <button class="btnAdd" type="button">New Note</button>
                </div>
            </div>
        `;

        const addBtn = this.root.querySelector(".btnAdd");
        const note_title = this.root.querySelector(".note_title");
        const note_body = this.root.querySelector(".note_body");

        addBtn.addEventListener("click", () => {
            this.onNoteAdd();
            // console.log("ADD");
        });

        [note_title, note_body].forEach(inputField => {

            inputField.addEventListener("blur", () => {

                const updatedTitle = note_title.value.trim();
                const updatedBody = note_body.value.trim();
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 30;

        return `
            <div class="list_item" data-note-id="${id}">
                <div class="small_title">
                    ${title}
                    <div class="delBtn">
                        <img class="delico" src="image/del_icon.png" alt="🗑️">
                    </div>
                </div>
                <div class="small_body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="timestamp">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes_list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".list_item").forEach(noteListItem => {

            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });
        });

        notesListContainer.querySelectorAll(".delBtn").forEach(deleteBtn => {

            deleteBtn.addEventListener("click", event => {

                event.stopPropagation(); // Prevent the click event from bubbling up
                const doDelete = confirm("Are you sure you want to delete this note?");

                if (doDelete) {
                    const noteId = event.target.closest(".list_item").dataset.noteId;
                    this.onNoteDelete(noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".note_title").value = note.title;
        this.root.querySelector(".note_body").value = note.body;

        this.root.querySelectorAll(".list_item").forEach(noteListItem => {
            noteListItem.classList.remove("list_item--selected");
        });

        this.root.querySelector(`.list_item[data-note-id="${note.id}"]`).classList.add("list_item--selected");
    }

}
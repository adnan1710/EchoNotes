export default class DisplayNotes {
    constructor(root, { note_selection, note_addition, note_edit, note_delete } = {}) {
        this.root = root;
        this.note_selection = note_selection;
        this.note_addition = note_addition;
        this.note_edit = note_edit;
        this.note_delete = note_delete;
        this.root.innerHTML = `
            <div class="sidebar glass">
                <div class="your__notes">My Notes</div>
                <div class="sidebar_empty_msg">
                    <h1>Your notes will appear here.</h1>
                </div>
                <div class="notes_list"></div>
            </div>
            <div class="preview glass">
                <input class="note_title" type="text" placeholder="Note Title...">
                <textarea class="note_body" placeholder="Take Note..."></textarea>

                <div class="empty_msg">
                    <h1>No notes to display. Click the button below to create a new note.</h1>
                </div>

                
                <div class="footer">
                    <div class="speech_instructions">Ready</div>
                    <div class="action_buttons">
                        <button class="speech-start" type="button"><img src="image/mic-icon.png"></button>
                        <button class="speech-stop" type="button"><img src="image/mute-icon.png"></button>
                        <button class="btnAdd" type="button"><img src="image/plus-icon.png"></button>
                    </div>
                </div>
            </div>
        `;

        const addBtn = this.root.querySelector(".btnAdd");
        const note_title = this.root.querySelector(".note_title");
        const note_body = this.root.querySelector(".note_body");

        addBtn.addEventListener("click", () => {
            this.note_addition();
            // console.log("ADD");
        });

        [note_title, note_body].forEach(inputField => {

            inputField.addEventListener("blur", () => {

                const timestamp_title = note_title.value.trim();
                const timestamp_body = note_body.value.trim();
                this.note_edit(timestamp_title, timestamp_body);
            });
        });

        this.update_preview_visibility(false);

    }

    create_list_item(id, title, body, timestamp) {
        const MAX_SIDEBAR_BODY_LENGTH = 30;
        return `
            <div class="list_item" data-note-id="${id}">

                <div class="small_title">
                    ${title}
                    <div class="delBtn">
                        <img class="delico" src="image/del_icon.png" alt="🗑️">
                    </div>
                </div>
                <div class="small_body">
                    ${body.substring(0, MAX_SIDEBAR_BODY_LENGTH)}
                    ${body.length > MAX_SIDEBAR_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="timestamp">
                    ${timestamp.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    update_note_sidebar_list(notes) {
        const list_container = this.root.querySelector(".notes_list");

        // Empty list
        list_container.innerHTML = "";

        for (const note of notes) {
            const html = this.create_list_item(note.id, note.title, note.body, new Date(note.timestamp));

            list_container.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        list_container.querySelectorAll(".list_item").forEach(list_item => {

            list_item.addEventListener("click", () => {
                this.note_selection(list_item.dataset.noteId);
            });
        });

        list_container.querySelectorAll(".delBtn").forEach(deleteBtn => {

            deleteBtn.addEventListener("click", event => {

                event.stopPropagation(); // Prevent the click event from bubbling up
                const flag = confirm("Are you sure you want to delete this note?");

                if (flag) {
                    const noteId = event.target.closest(".list_item").dataset.noteId;
                    this.note_delete(noteId);
                }
            });
        });
    }

    ret_active_note(note) {
        this.root.querySelector(".note_title").value = note.title;
        this.root.querySelector(".note_body").value = note.body;

        this.root.querySelectorAll(".list_item").forEach(list_item => {
            list_item.classList.remove("list_item--selected");
        });

        this.root.querySelector(`.list_item[data-note-id="${note.id}"]`).classList.add("list_item--selected");
    }

    update_preview_visibility(visible) {
        this.root.querySelector(".note_title").style.display = visible ? "block" : "none";
        this.root.querySelector(".note_body").style.display = visible ? "block" : "none";
        this.root.querySelector(".empty_msg").style.display = visible ? "none" : "block";
        this.root.querySelector(".sidebar_empty_msg").style.display = visible ? "none" : "block";
        // this.root.querySelector(".preview").style.display = visible ? "inline" : "block";

    }

}
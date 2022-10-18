$(document).ready(function () {
  $(".sidebar-btn").click(function () {
    $(".sidebar").toggleClass("collapse");
  });
});

/* DRAG & DROP */
const dragArea = document.querySelector("#notes");
new Sortable(dragArea, {
  animation: 350
});

class Keep {
  constructor() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
      this.title = '';
      this.text = '';
      this.id = '';

      this.$empty = document.querySelector("#empty");
      this.$form = document.querySelector("#form");
      this.$notes = document.querySelector("#notes");
      this.$noteTitle = document.querySelector("#note-title");
      this.$noteText = document.querySelector("#note-text");
      this.$formButtons = document.querySelector("#form-buttons");
      this.$formCloseButton = document.querySelector("#form-close-button");
      this.$popup = document.querySelector(".popup");
      this.$popupTitle = document.querySelector(".popup-title");
      this.$popupText = document.querySelector(".popup-text");
      this.$popupCloseButton = document.querySelector('.popup-close-button');
      this.$colorTooltip = document.querySelector('#color-tooltip');

      this.render();
      this.addEventListeners();
  }

  addEventListeners() {
      document.body.addEventListener("click", event => {
          this.handleFormClick(event);
          this.selectNote(event);
          this.openpopup(event);
          this.deleteNote(event);
      });

      this.$form.addEventListener("submit", event => {
          event.preventDefault();
          const title = this.$noteTitle.value;
          const text = this.$noteText.value;
          const hasNote = title || text;
          if (hasNote) {
              this.addNote({ title, text });
          }
      });

      this.$formCloseButton.addEventListener("click", event => {
          event.stopPropagation();
          this.closeForm();
      });
      this.$popupCloseButton.addEventListener('click', event => {
          this.closepopup(event);
      })
  }

  handleFormClick(event) {
      const isFormClicked = this.$form.contains(event.target);
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;

      if (isFormClicked) {
          this.openForm();
      } else if (hasNote) {
          this.addNote({ title, text });
      } else {
          this.closeForm();
      }
  }

  openForm() {
      this.$form.classList.add("form-open");
      this.$noteTitle.style.display = "block";
      this.$formButtons.style.display = "block";
  }

  closeForm() {
      this.$form.classList.remove("form-open");
      this.$noteTitle.style.display = "none";
      this.$formButtons.style.display = "none";
      this.$noteTitle.value = "";
      this.$noteText.value = "";
  }

  openpopup(event) {
      if (event.target.matches('.toolbar-delete')) return;
      if (event.target.closest('.note')) {
          this.$popup.classList.toggle('open-popup');
          this.$popupTitle.value = this.title;
          this.$popupText.value = this.text;
      }
  }

  closepopup(event) {
      this.editNote();
      this.$popup.classList.toggle('open-popup');
  }

  addNote({ title, text }) {
      const newNote = {
          title,
          text,
          color: "white",
          id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
      };
      this.notes = [...this.notes, newNote];
      this.render();
      //window.location.reload();
      this.closeForm();
  }

  editNote() {
      const title = this.$popupTitle.value;
      const text = this.$popupText.value;
      this.notes = this.notes.map(note =>
          note.id === Number(this.id) ? { ...note, title, text } : note
      );
      
      this.render();
      //window.location.reload();
  }
  selectNote(event) {
      const $selectedNote = event.target.closest('.note');
      if (!$selectedNote) return;
      const [$noteTitle, $noteText] = $selectedNote.children;
      this.title = $noteTitle.innerText;
      this.text = $noteText.innerText;
      this.id = $selectedNote.dataset.id;
  }

  deleteNote(event) {
      event.stopPropagation();
      if (!event.target.matches('.toolbar-delete')) return;
      const id = event.target.dataset.id;
      this.notes = this.notes.filter(note => note.id !== Number(id));
      
      this.render();
      //window.location.reload();
  }

  render() {
      this.saveNotes();
      this.displayNotes();
  }

  saveNotes() {
      //local storage
      localStorage.setItem('notes', JSON.stringify(this.notes))
  }

  displayNotes() {
      const hasNotes = this.notes.length > 0;
      this.$empty.style.display = hasNotes ? 'none' : 'flex';

      this.$notes.innerHTML = this.notes.map(note => `
  <div style="background: ${note.color};" class="note" data-id="${note.id}">
    <div class="${note.title && 'note-title'}">${note.title}</div>
    <div class="note-text">${note.text}</div>
    <div class="toolbar-container">
      <div class="toolbar">
        <em class="toolbar-delete fas fa-trash-alt" data-id=${note.id}></em>
      </div>
    </div>
  </div>
`).join("");// to get rid of the commas between our arrays
 
  }
}

let object = new Keep();

function Reload(){
  window.location.reload();
}
function darkMode() {
  let element = document.body;
  element.classList.toggle("dark-mode");
}

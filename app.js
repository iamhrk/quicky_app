// Note Class to instantiate an object whenever a new note is added
class Note {
  constructor(title,desc) {
    this.title=title;
    this.desc=desc;
  }
}

//UI class to handle UI tasks

class UI {

    static displayNotes(){

      const notes = Store.getNotes();
      notes.forEach((note) => UI.addNoteToList(note));

    };
    static addNoteToList(note){

      const list = document.querySelector('#note-list');

      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${note.title}</td>
        <td>${note.desc}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X<a></td>
      `;
      list.appendChild(row);
    }

    static deleteList(el){
      if(el.classList.contains('delete')){
          UI.showAlert("Note removed!",'danger');
          el.parentElement.parentElement.remove();

      }
    }

    static showAlert(message,className){
      const div = document.createElement('div');
      div.className=`alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#note-form');
      container.insertBefore(div,form);
      setTimeout(()=> document.querySelector('.alert').remove(),2500);

    }

    static clearFields(){
      document.querySelector('#title').value="";
      document.querySelector('#description').value="";
    }

}
//Store Class : to store submitted notes
class Store{
  static getNotes(){
    let notes;
    if(localStorage.getItem('notes')== null){
      notes = [];
    }
    else{
      notes = JSON.parse(localStorage.getItem('notes'));
    }
    return notes;

  }
  static addNote(note){
    const notes = Store.getNotes();
    notes.push(note);
    localStorage.setItem('notes',JSON.stringify(notes));

  }
  static removeNote(title){
    const notes = Store.getNotes();
    notes.forEach((note,index) =>{
      if(note.title == title){
        notes.splice(index,1);
      }

    });
    localStorage.setItem('notes',JSON.stringify(notes));
  }
}



//Event : display notes
document.addEventListener('DOMContentLoaded',UI.displayNotes);
//Event : add a note

document.querySelector("#note-form").addEventListener('submit',(e) => {
  //prevent actual submit
  //e.preventDefault();

  //Get form values
  const title = document.querySelector('#title').value;
  const desc = document.querySelector('#description').value;
   //instantiate Note Class object
   if(title === '' && desc === '')
   {
     UI.showAlert("Please enter some content!",'danger');
   }
   else if(title === '' && desc !== '')
   {
     UI.showAlert("Please give some title!",'danger');
   }
   else{
     //show successs message
     UI.showAlert("Note added!",'success');

  const note = new Note(title,desc);
  UI.addNoteToList(note);

//add note to store
Store.addNote(note);
  //clear fields
  UI.clearFields();
}
});

//Even : delete a note
document.querySelector('#note-list').addEventListener('click',(e) => {
  UI.deleteList(e.target);
  Store.removeNote(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
})

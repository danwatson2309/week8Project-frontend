import React from "react";
import Note from "../Note/index";

function NoteList({ notes, deleteLi }) {
  return (
    <ul>
      {notes.map((item, index) => {
        console.log(index);
        return <Note idx={index} text={item} deleteLi={deleteLi} />;
      })}
    </ul>
  );
}

export default NoteList;
import "./App.css";
import React, { useEffect, useState } from "react";
import Form from "../Form/index";
import NoteList from "../NoteList/index";
import Agenda from "../Agenda/index";

function App() {
  const [notes, setNotes] = useState([]);
  const [notesQuery, setNotesQuery] = useState({
    start: null,
    end: null,
    priority: null,
    category: null,
    onAgenda: null,
  });
  const [agenda, setAgenda] = useState([]);
  const [agendaQuery, setAgendaQuery] = useState({
    start: null,
    end: null,
    priority: null,
    category: null,
    onAgenda: true,
  });
  const [stateChange, setStateChange] = useState(false);

  // Build API query string for GET method
  function buildQuery(queryObject) {
    let query = "?";
    for (const key in queryObject) {
      if (queryObject[key]) {
        query += `${key}=${queryObject[key]}&`;
      }
    }
    return query.slice(0, -1);
  }

  // Map received API data into a format suitable for React components
  function mapApiData(dataArray) {
    for (let i = 0; i < dataArray.length; i++) {
      dataArray[i].dateTime = dataArray[i]["date"];
      delete dataArray[i].date;
      dataArray[i].onAgenda = dataArray[i]["on_agenda"];
      delete dataArray[i].on_agenda;
    }
    return dataArray;
  }

  // Build agenda list
  function buildAgenda(mappedData) {
    const agendaList = [];
    for (let i = 0; i < mappedData.length; i++) {
      if (mappedData[i].onAgenda === true) {
        agendaList.push(mappedData[i]);
      }
    }
    return agendaList;
  }

  // Get all data from API and set states for Notes list and Agenda list
  async function getNotesList() {
    const res = await fetch(
      "http://localhost:5000/notes" + buildQuery(notesQuery)
    );
    const dataArray = await res.json();
    const mappedData = mapApiData(dataArray.data.rows);
    setNotes(mappedData);
  }

  // Get all data from API and set states for Notes list and Agenda list
  async function getAgendaList() {
    const res = await fetch(
      "http://localhost:5000/notes" + buildQuery(agendaQuery)
    );
    const dataArray = await res.json();
    const mappedData = mapApiData(dataArray.data.rows);
    setAgenda(mappedData);
  }

  // Triggered everytime state changes
  useEffect(() => {
    getNotesList();
    getAgendaList();
  }, [stateChange]);

  // Post form data to API
  async function addLi(formEntry) {
    delete formEntry.dateTime;
    formEntry.userId = "student";
    const postData = await fetch("http://localhost:5000/notes", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEntry),
    });
    const result = await postData.json;
    setStateChange(!stateChange);
  }

  // Delete by ID from API
  async function deleteLi(id) {
    const res = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "delete",
    });
    const deletedId = await res.json();
    setStateChange(!stateChange);
  }

  // Set onAgenda to true for note by ID
  async function addToAgenda(id) {
    const res = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onAgenda: true }),
    });
    const addedId = await res.json();
    setStateChange(!stateChange);
  }

  // Set onAgenda to false for note by ID
  async function deleteFromAgenda(id) {
    const res = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onAgenda: false }),
    });
    const removedId = await res.json();
    setStateChange(!stateChange);
  }

  // Create React components
  return (
    <div id="main">
      <Form addLi={addLi} addToAgenda={addToAgenda} />

      <div id="noteAgenda">
        <NoteList notes={notes} deleteLi={deleteLi} addToAgenda={addToAgenda} />
        <Agenda agenda={agenda} deleteFromAgenda={deleteFromAgenda} />
      </div>
    </div>
  );
}

export default App;

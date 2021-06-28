import {useState } from "react";
import Word from './Word';
function App() {
  const [entry, setEntry] = useState({});
  const [word, setWord] = useState("");
  console.log(entry);
  function getData (e)  {
    e.preventDefault();
    console.log("click");
    if (document.getElementById("word").value === "") return;
    setWord(document.getElementById("word").value);
    fetch(`http://localhost:9000/search?word=${document.getElementById("word").value}`)
      .then(resp => resp.json())
      .then(data => {
        setEntry(data);
      })
  }
  return (
    <>
    <header>
      <h1>Dictionary</h1>
    </header>
    <div>
      <form onSubmit={e => getData(e)}>
      <label>Word <input
        type="text"
        id="word"
      
      />
        <button
          type="button"
          onClick={e => {getData(e)}}
        >Submit</button>
      </label>
      </form>
      <div>
        {entry.hasOwnProperty("about") ? (
          <Word
            word={word}
            etymology={entry["about"]["etymology"]}
            phoneticSpelling={entry["about"]["phonetic spelling"]}
            senses={entry}
            pronunciation={entry["about"]["pronunciations"]}
          />) : ""}
      </div>
    </div>
  </>
  )
}

export default App;

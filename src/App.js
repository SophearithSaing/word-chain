import { useState, useRef, useEffect } from 'react';
import './App.scss';
import db from './firebase';
import data from './data/words.json';

const words = data.words;

function App() {
  const inputRef = useRef();
  const [lastChar, setLastChar] = useState('');
  const [str, setStr] = useState('');
  const [strList, setStrList] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ref = db.ref('strings/room-1');

    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStrList(data.list);
        const lastWord = data.list[data.list.length - 1];
        setLastChar(lastWord[lastWord.length - 1]);
      } else {
        setStrList([]);
      }
    });

    return () => ref.off();
  }, []);

  function focus() {
    inputRef.current.focus();
  }

  function changeHandler(event) {
    setError(null);
    setStr(event.target.value);
  }

  function enterWordHandler(event) {
    if (event.key === 'Enter') {
      const word = (lastChar + str).toLowerCase();
      if (words.includes(word) && !usedWords.includes(word)) {
        setStrList([...strList, str.toLowerCase()]);
        setUsedWords([...usedWords, word]);
        setLastChar(str[str.length - 1]);
        setStr('');
        fetch(`${process.env.REACT_APP_DB_URL}/strings/room-1.json`, {
          method: 'PATCH',
          body: JSON.stringify({
            list: [...strList, str.toLowerCase()],
          }),
        });
      } else if (!words.includes(word)) {
        console.log(word);
        setError('Enter a valid word!');
      } else if (usedWords.includes(word)) {
        setError(`${word} was already used!`);
      }
    }
  }

  function resetHandler() {
    setLastChar('');
    fetch(`${process.env.REACT_APP_DB_URL}/strings/room-1.json`, {
      method: 'PATCH',
      body: JSON.stringify({
        list: [],
      }),
    });
  }

  function formatStr(str, index) {
    return (
      <p key={index} className="word__item">
        {str.slice(0, -1)}
        <span className="word__item--last-char">{str[str.length - 1]}</span>
      </p>
    );
  }

  return (
    <div className="app">
      <h1>Word Chain</h1>
      {strList.length === 0 && <p className="message">Enter a word to start</p>}
      <div className="word__list">
        {strList.map((str, index) => formatStr(str, index))}
        <input
          type="text"
          autoFocus
          spellCheck="false"
          ref={inputRef}
          value={str}
          onBlur={focus}
          onKeyUp={enterWordHandler}
          onChange={changeHandler}
        />
      </div>

      {error && <p className="message">{error}</p>}
      {strList.length > 0 && (
        <button className="reset-button" onClick={resetHandler}>
          Reset Game
        </button>
      )}
    </div>
  );
}

export default App;

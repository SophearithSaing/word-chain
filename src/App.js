import { useState } from 'react';
import { useRef } from 'react';
import './App.scss';
import data from './data/words.json';

const words = data.words;

function App() {
  const inputRef = useRef();
  const [lastChar, setLastChar] = useState('');
  const [str, setStr] = useState('');
  const [strList, setStrList] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [error, setError] = useState(null);

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
      } else if (!words.includes(word)) {
        setError('Enter a valid word!');
      } else if (usedWords.includes(word)) {
        setError(`${word} was already used!`)
      }
    }
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
        <p className="word__current">{str}</p>
      </div>
      <input
        type="text"
        autoFocus
        ref={inputRef}
        value={str}
        onBlur={focus}
        onKeyUp={enterWordHandler}
        onChange={changeHandler}
      />
      {error && <p className="message">{ error }</p>}
    </div>
  );
}

export default App;

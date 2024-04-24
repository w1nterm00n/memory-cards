import { useState, useEffect } from 'react'
import Card from './components/Card.jsx'
import './styles/App.css'
import { v4 as uuidv4 } from 'uuid';

function App() {

  let cardsId = ["p6yH8VmGqxo", "rQsYZnCRU00", "y6PeMgIa2Xo",  "I0oIKBfQT-w",
   "foeTT7H7SuA", "Px2Y-sio6-c", "j2E2EZgfsAI", 
   "0IvREuozC5c", "b079C-_tUbM"]
  const [cards, setCards] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  //функция, которая берет id, и возвращает объект карточки
  async function fetchCard (id) {
          const response = await fetch(`https://api.unsplash.com/photos/${id}?client_id=mWGiQ2-Vj2yNxv5Pzst9P_yOrkzz8fV0_Fltd6u7jpY`);
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          const data = await response.json();
          return {
              caption: data.alt_description,
              img: data.urls.small,
          };
  };

  let loadCards = async function () {
    let newCards = await Promise.all(cardsId.map(id => fetchCard(id)));
    newCards = makeArrayOfCards(newCards);
    setCards(newCards);
  };


  let makeArrayOfCards = function (array) {
    let newArray = [];
    array = array.flatMap(item => [item, item]);
    array.forEach(element => {
      let newElement = { ...element }; // Создаем копию объекта
      newElement["key"] = uuidv4();
      newArray.push(newElement);
    });
    newArray = shuffleArray(newArray);
    return newArray;
  }

  function shuffleArray(array) {
    let newArray = [...array];
    // Функция для рандомного перемешивания
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  useEffect(() => {
    loadCards();
  }, [])


  return (
    <>
      <header>
        <h1>Something</h1>
        <div className='scoreBoard'>
          <p>Current Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </header>

      <div className='cardsContainer'>
        {cards.map((card) => (
          <Card className="flexItem" key={card.key} image={card.img} caption={card.caption}/>
        ))}
      </div>
    </>
  )
};

export default App
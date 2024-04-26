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
  const [guessedCards, setGuessedCards] = useState([]);

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
              id: id,
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

  //Переворачивание двух карт
  //openedCards - эта переменная нужна чтобы проверять, сколько карт сейчас перевернуто
  const [openedCards, setOpenedCards] = useState([]);

  let cardFlip = function (id, setIsReversed) {
    for (let i=0; i<openedCards.length; i++){
      if (openedCards[i].id === id) {
        openedCards[0].setIsReversed(false);  //чтобы нельзя было открывать и закрывать одну карточку
        return;
      }
    }
    if (openedCards.length > 1) {
        let newCard = { id, setIsReversed };
        newCard.setIsReversed(true); //чтобы нельзя было открывать третью карточку
      return;
    }
    setOpenedCards(prevCards => [...prevCards, { id, setIsReversed }]);
  }
  
  useEffect(() => {
    if (openedCards.length === 2) {
      const [firstCard, secondCard] = openedCards;
            setTimeout(() => {
              setCurrentScore(currentScore + 1);
              firstCard.setIsReversed(true);
              secondCard.setIsReversed(true);
              let isSame = findSameCards(firstCard.id, secondCard.id);
              if (isSame) {
                setGuessedCards(prevCards => [...prevCards, firstCard, secondCard]);
                hideCard(firstCard.id);
                hideCard(secondCard.id);
              }
              setOpenedCards([]);
          }, 1000);
    }
  }, [openedCards])

  let findSameCards = function (key1, key2) {
    let card1, card2;
    for (let i=0; i<cards.length; i++){
      if (cards[i].key === key1) {
        card1 = cards[i]
      } else if (cards[i].key === key2) {
        card2 = cards[i]
      }
    }
    if (card1.id === card2.id) {
      return (true);
    }
    return(false);
  }
//Переворачивание двух карт

  let hideCard = function(id) {
  const card = document.getElementById(id);
  card.style = "opacity: 0";
}

  function restart () {
    document.getElementById("gameOver").style = "display: none";
    setGuessedCards([]);
    setCurrentScore(0);
    loadCards();
  };

useEffect(() => {
  if ((guessedCards.length === cards.length) && (cards.length != 0)) {
    document.getElementById("gameOver").style = "display: flex";
    if (currentScore < bestScore) setBestScore(currentScore);
  }
}, [guessedCards])

  return (
    <>
      <header>
        <h1>Memory Cards</h1>
        <button className='restartBtn' onClick={restart}>Restart</button>
        <div className='scoreBoard'>
          <p>Current Score: {currentScore}</p>
          <p>Best Score: {bestScore}</p>
        </div>
      </header>

      <div id='gameOver'>
        <p>Game over</p>
      </div>

      <div className='cardsContainer'>
        {cards.map((card) => (
          <Card className="flexItem" key={card.key} id={card.key} image={card.img} caption={card.caption} cardFlip={cardFlip}/>
        ))}
      </div>
    </>
  )
};

export default App
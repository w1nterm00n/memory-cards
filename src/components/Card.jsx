import { useState } from "react";
import '../styles/Card.css'

function Card ({id, image, caption, cardFlip}) {
    const [isReversed, setIsReversed] = useState(true);

    const handleClick = () => {
        setIsReversed(!isReversed);
        cardFlip(id, setIsReversed);   //передаёт, какая карта открылась
    };
    return (
        <div className={isReversed ? "card reversed" : "card"} onClick={handleClick} id={id}>
            <div className="imageWrapper" style={{ backgroundImage: `url(${image})`, 
            backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
            </div>
            
            <div className="captionWrapper">
                <p className="caption">{caption}</p>
            </div>
        </div>
    )
}

export default Card;
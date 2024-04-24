import { useState } from "react";
import '../styles/Card.css'

function Card ({image, caption}) {
    const [isReversed, setIsReversed] = useState(false);

    const handleClick = () => {
        setIsReversed(!isReversed);
    };
    return (
        <div className={isReversed ? "card reversed" : "card"} onClick={handleClick}>
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
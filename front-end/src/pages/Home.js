import React, { useEffect, useState } from 'react';

import { CardDeck } from 'react-bootstrap';

import LanguageCard from '../components/LanguageCard';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  
  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:3001/languages')
      .then((response) => response.json())
      .then((languages) => {
        setIsLoading(false);
        setLanguages(languages);
      });
  }, []);

  return (
    <div>
      <h1>Escolha sua linguagem favorita:</h1>

      {isLoading ? <p>Carregando</p>
        : ( 
          <CardDeck>
            {languages.map(({_id, name, image, votes}, index) => (
              <LanguageCard
                key={_id}
                index={index}
                id={_id}
                name={name} 
                image={image}
                votes={votes} />
            ))}
          </CardDeck>
      )}
    </div>
  );
}

export default Home;

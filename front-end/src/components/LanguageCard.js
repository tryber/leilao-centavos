import React, { useState, useEffect } from 'react';

import { Card, Button } from 'react-bootstrap';

import socket from '../utils/socketClient';

function LanguageCard({ index, id, name, image, votes }) {
  const [currentVotes, setCurrentVotes] = useState(votes);

  const handleClick = (e) => {
    socket.emit('increaseVotes', { id });
  }

  useEffect(() => {
    socket.on('refreshCurrentVotes', (language) => {
      if (language._id === id) setCurrentVotes(language.votes);
    })
  }, [id]);

  return (
    <Card>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title><span data-testid={`current-name-${index}`}>{name}</span></Card.Title>
        <Card.Text>
          Votos: <span data-testid={`current-votes-${index}`}>{currentVotes}</span>  
        </Card.Text>
        <Button onClick={handleClick} data-testid={`vote-tech-${index}`}>Votar</Button>
      </Card.Body>
    </Card>
  );
}

export default LanguageCard;

import React from "react";
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';

export class GenreView extends React.Component {
  render() {
    const { genre } = this.props;

    return (
      <Card style={{ width: '16rem' }}>
        <Card.Body>
          <Card.Title>{genre.Name}</Card.Title>
          <Card.Text>{genre.Description}</Card.Text>
          <Link to={'/'}>
            <Button variant="primary" type="button">
            Back
            </Button>
          </Link>
          
        </Card.Body>
      </Card>
    );
  }
}

GenreView.propTypes = {
  genre: PropTypes.shape ({
    Name: PropTypes.string
  }).isRequired
}
  

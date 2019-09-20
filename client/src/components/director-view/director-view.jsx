import React from "react";
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';

export class DirectorView extends React.Component {
  render() {
    const { director } = this.props;

    return (
      <Card style={{ width: '16rem' }}>
        <Card.Body>
          <Card.Title>{director.Name}</Card.Title>
          <Card.Text>{director.Bio}</Card.Text>
          <Card.Text>{director.Birth}</Card.Text>
          <Card.Text>{director.Death}</Card.Text>
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

DirectorView.propTypes = {
  director: PropTypes.shape ({
    Name: PropTypes.string,
    Bio: PropTypes.string
  }).isRequired
}
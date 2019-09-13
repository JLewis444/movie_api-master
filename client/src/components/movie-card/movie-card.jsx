import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import './movie-card.scss';

export class MovieCard extends React.Component {
    render() {
        //this is given to the <MovieCard/> component by the outer world which, in this case, is `MainView`, as `MainView` is what is connected to your database via the movies endpoint
        const { movie, onClick } = this.props;

        return (
             <Card style={{ width: '16rem'}}>
               <Card.Img variant="top" src={movie.ImagePath} />
               <Card.Body>
                   <Card.Title>{movie.Title}</Card.Title>
                   <Card.Text>{movie.Description}</Card.Text>
                   <Link to={`/movies/${movie._id}`}>
                       <Button variant="primary">More Info</Button>
                   </Link>
               </Card.Body>  
             </Card>
        );
    }
}


MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string
        }).isRequired,
    
};
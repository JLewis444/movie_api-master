import React from "react";
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import  Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashAlt } from '@fortawesome/free-solid-svg-icons'



export class MovieCard extends React.Component {
  render() {
    const { movie} = this.props;
    // console.log(this.props);
    return (
       <Card style={{ width: '16rem' }} className="mb-3 mr-2">
         <Card.Img variant="top" src={movie.ImagePath} />
         <Card.Body>
           <Card.Title>{movie.Title}</Card.Title>
           <Card.Text>{movie.Description}</Card.Text>
            <a href={`client/movies/${movie._id}`} className="btn btn-primary">Details</a>
            <Button variant="danger" onClick={() => addToFavourites(movie._id)}>
             <FontAwesomeIcon icon={faHeart} />
           </Button>
           <Button variant="warning" onClick={() => deleteFavouriteMovie(movie._id)}>
               <FontAwesomeIcon icon={faTrashAlt} />
             </Button>


           </Card.Body>
       </Card>



    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape ({
    Title: PropTypes.string
  }).isRequired,
 // onClick: PropTypes.func.isRequired
}

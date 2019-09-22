// import React from 'react';
// import PropTypes from 'prop-types';

// export class MovieView extends React.Component {

//   constructor() {
//     super();
//     this.state = {};
//   }
//   render() {
//     const { movie, onClick } = this.props;
//     if (!movie) return null;
//     return (
//        <div className="movie-view">
//         <div className="movie-title">
//           <div className="label">Title:</div>
//           <div className="value">{movie.Title}</div>
//         </div>
//         <div className="movie-description">
//           <div className="label">Description:</div>
//           <div className="value">{movie.Description}</div>
//         </div>
//         <img className="movie-poster" alt='' src={movie.ImagePath} />
//         <div className="movie-genre">
//           <div className="label">Genre:</div>
//           <div className="value">{movie.Genre.Name}</div>
//           </div>
//         <div className="movie-director">
//           <div className="label">Director:</div>
//           <div className="value">{movie.Director.Name}</div>
//           </div>
//        <button onClick={() => onClick()}className="return-button">To movie list</button>
//        </div>
//     );
//   }
// }

// MovieView.propTypes = {
//     movie: PropTypes.shape({
//       Title: PropTypes.string,
//       Description: PropTypes.string,
//       ImagePath: PropTypes.string,
//       Genre: PropTypes.shape({
//         Name: PropTypes.string
//       }),
//       Director: PropTypes.shape({
//         Name: PropTypes.string
//       })
//     }).isRequired,
//     onClick: PropTypes.func.isRequired
// };

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import './movie-view.scss';

function MovieView(props) {
  const { movies, movieId } = props;

  if (!movies || !movies.length) return null;

  const movie = movies.find(m => m._id === movieId);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post(`https://lewis-myflix.herokuapp.com/users/${localStorage.getItem('user')}/FavoriteMovies/${movie._id}`, {
      Username: localStorage.getItem('user')
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(response => {
      console.log(response);
      alert('Movie has been added to your Favorite List!');
    })
    .catch(event => {
      console.log('error adding movie to list');
      alert('Oops... Something went wrong!');
    });
  };

  return(
    <div className="movie-view">
      <div className="movie-title">
        <div className="label">Title</div>
        <h1>{movie.Title}</h1>
      </div>
      <img className="movie-poster" src={movie.ImagePath} alt="movie cover" />
      <div className="movie-description">
        <div className="label">Description</div>
        <div className="value">{movie.Description}</div>
      </div>
      <div className="movie-genre">
        <div className="label">Genre</div>
        <div className="value">{movie.Genre.Name}</div>
      </div>
      <div className="movie-director">
        <div className="label">Director</div>
        <div className="value">{movie.Director.Name}</div>
      </div>
      <Link to={'/'}>
        <Button className="view-btn" variant="primary" type="button">
        BACK
        </Button>
      </Link>
      <Link to={`/genres/${movie.Genre.Name}`}>
        <Button className="view-btn" variant="primary" type="button">
        GENRE
        </Button>
      </Link>
      <Link to={`/directors/${movie.Director.Name}`}>
        <Button className="view-btn" variant="primary" type="button">
        DIRECTOR
        </Button>
      </Link>
      <Button className="view-btn" variant="primary" type="button" onClick={event => handleSubmit(event)}>
      LIKE
      </Button>
    </div>//movie-view
  );//return
}
export default connect(({movies}) => ({movies}))(MovieView);

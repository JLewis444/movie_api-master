import React from 'react';

import MovieCard from '../movie-card/movie-card';

function MovieList (props) {
    console.log(props);
  return (
      <div>
      { (props.movies.length > 0) ? props.movies.map(m => <MovieCard key={m._id} movie={m}/> ) : "no movies yet" }
      {/* { movies.map(m => <MovieCard key={m._id} movie={m}/>) } */}
      
      </div>
      
    )
}


export default MovieList;
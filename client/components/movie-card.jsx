import React from 'react';

export class MovieCard extends React.Component {
    render() {
        //this is given to the <MovieCard/> component by the outer world which, in this case, is `MainView`, as `MainView` is what is connected to your database via the movies endpoint
        const { movie, onClick } = this.props;

        return (
            <div onClick={() => onClick(movie)} className="movie-card">{movie.Title}</div>
        );
    }
}
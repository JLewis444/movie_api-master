import React from 'react';

import Button from 'react-bootstrap/Button';

import './movie-view.scss';

export class MovieView extends React.Component {
    constructor() {
        super();

        this.state = {};
    }

    render() {
        const { movie } = this.props;

        if (!movie) return null;

        return (
            <div className="movie-view">
             <div className="movie-title">
                 <div className="label">Title</div>
                 <div className="value">{movie.Title}</div>
            </div>
            <div className="movie-description">
                <div className="label">Description</div>
                <div className="value">{movie.Description}</div>
            </div>
            <img className="movie-poster" src={movie.ImagePath} />
            <div className="movie-genre">
                <div className="label">Genre</div>
                <div className="value">{movie.Genre.Name}</div>
            <Link to={`/directors/${movie.Genre.Name}`}>
                <Button variant="link">Genre</Button>
            </Link>    
            </div>
            <div className="movie-director">
                <div className="label">Director</div>
                <div className="value">{movie.Director.Name}</div>
            <Link to={`/directors/${movie.Director.Name}`}>
                <Button variant="link">Director</Button>
            </Link> 
            </div> 
              <Button className="view-btn" variant="primary" type="button" onClick={() => window.open('/', '_self')} >Back</Button>
              
           </div>
        );
    }
}
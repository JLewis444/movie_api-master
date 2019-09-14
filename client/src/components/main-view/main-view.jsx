import React from 'react';
import axios from 'axios';

//import { Link } from 'react-router-dom';

import './main-view.scss';


import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';




export class MainView extends React.Component {
    
    constructor() {
        super();

        this.state = {
            movies: [],
            selectedMovie: null,
            user: null
        };
    }
   // componentDidMount() {
    //    axios.get('https://lewis-myflix.herokuapp.com/movies')
   //     .then(response => {
            // Assign the result to the state
   //         this.setState({
   //             movies: response.data
   //         });
   //     })
   //     .catch(function (error) {
   //         console.log(error);
   //     });
   // }

    onMovieClick(movie) {
        this.setState({
            selectedMovie: movie
        });
    }

    onLoggedIn(authData) {
        console.log(authData);
        this.setState({
            user: authData.user.Username
        });

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getMovies(authData.token);
    }

    getMovies(token) {
        axios.get('https://lewis-myflix.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
            //Assign the result to the state
            this.setState({
                movies: response.data
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    

    render() {
       //  If the state is not initialized, this will throw on runtime before the data is initially loaded 
        const { movies, selectedMovie, user } =  this.state;

        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

        // Before the movies have been loaded 
        if (!movies) return <div className="main-view"/>;

        return (
            <div className="main-view">
              { selectedMovie
                 ? <MovieView movie={selectedMovie}/>
                :  movies.map(movie => (
                 <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)}/>
                )) }
                
            </div>
        );
    }
}
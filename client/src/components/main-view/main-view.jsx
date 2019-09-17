import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route } from "react-router-dom";

import './main-view.scss';


import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import DirectorView from '../director-view/director-view';
import GenreView from '../genre-view/genre-view';
import MovieList from '../movie-list/movie-list';




export class MainView extends React.Component {
    
    constructor() {
        super();

        this.state = {
            movies: [],
            user: null
        };
    }
    
    getMovies(token) {
        axios.get('https://lewis-myflix.herokuapp.com/movies', {
            headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
            this.setState(response.data);
            localStorage.setItem('movies',(response.data));
            })
        .catch(function (error) {
            console.log(error);
        });
    }

    // get user
  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://lewis-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      this.props.setLoggedInUser(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

    componentDidMount() {
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getMovies(accessToken);
        }
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

      //register new user
  onSignedIn(user) {
    this.setState({
      user: user
    });
  }


  //logut function for LogOut button
  logOut() {
    //clears storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movies');

        //resets user state to render again
        this.setState({
            user: null
    });

        //make sure login screen appears after logging out
        window.open('/', '_self');
    }
      

    render() {
       //  If the state is not initialized, this will throw on runtime before the data is initially loaded 
        const { movies, user } =  this.state;

       


        // Before the movies have been loaded 
        if (!movies) return <div className="main-view"/>;

        return (
            <Router>
                <div className="main-view">
                
               <Route exact path="/" render={() =>  (!user) ? (<LoginView onLoggedIn={user => this.onLoggedIn(user)} /> ):
                        (<MovieList movies={localStorage.getItem('movies')}/> )
                    }/>
                    
                    {/* <Route exact path="/" render={() => {  */}
                      {/* if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;  
                      movies.map(m => <MovieCard key={m._id} movie={m}/>)
                    } */}
                    {/* }/> */}
                    <Route path="/register" render={() => <RegistrationView />} />
                    <Route path="/movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>
                    <Route exact path="/genres/:name" render={({ match }) => <GenreView genreName={match.params.name}/>}/>
                    <Route exact path="/directors/:name" render={({ match }) => <DirectorView directorName={match.params.name}/>}/>
                    <Route exact path="/register" render={() => <RegistrationView onSignedIn={user => this.onSignedIn(user)} />} />
                    <Route exact path="/profile" render={() => <ProfileView />}/>

                </div>
            </Router>
        );
                
           
      
    }
}

export default MainView;
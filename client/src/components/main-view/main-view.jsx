import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { BrowserRouter as Router, Route} from "react-router-dom";

import { setMovies, setLoggedInUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieView } from '../movie-view/movie-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import { ProfileView } from '../profile-view/profile-view';

import './main-view.scss';

export class MainView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      user: null,
      collapsed: true
    };

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  componentDidMount() {
    /* set `user` state and call `getMovies` if localStorage contains `token` item */
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
      this.getUser(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://lewis-myflix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      this.props.setMovies(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://lewis-myflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
        this.props.setLoggedInUser(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

   toggleNavbar() {
     this.setState({
      collapsed: !this.state.collapsed
   });
 }

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });
    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }
  
  
  onSignedIn(user) {
    this.setState({
      user: user
    });
  }

  loginComponent(){
    this.setState({
      register: false
    })
  }

  logOut() {
    //clears storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movies');
    //resets user state to render again
    this.setState({
      user: null
    });
    window.open('/', '_self');
  }

  render() {
    
    let { movies, user } = this.state;
    console.log(movies);
    console.log(user);
    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)}/>

    if (!movies) return <div className="main-view"/>;

    return (
      <Router>
      <header>
        <h1 className="appName">myFlix</h1>
      </header>
      <div className="main-view">
        {user &&
          <div className="navbar">
            <Link to={'/profile'}>
              <button>My Profile</button>
            </Link>
            <button onClick={() => this.logOut()}>Logout</button>
          </div>
        }

        <Route exact path="/" render={() => {
          if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
          return <MoviesList />;
          }}
        />

        <Route exact path="/movies/:id" render={({ match }) => <MovieView movieId={match.params.id}/>}/>

        <Route exact path="/genres/:name" render={({ match }) => <GenreView genreName={match.params.name}/>}/>

        <Route exact path="/directors/:name" render={({ match }) => <DirectorView directorName={match.params.name}/>}/>

        <Route exact path="/register" render={() => <RegistrationView onSignedIn={user => this.onSignedIn(user)} />} />

        <Route exact path="/profile" render={() => <ProfileView />}/>
      </div>
    </Router>
    );
  }
} 



export default connect(null, { setMovies, setLoggedInUser } )(MainView);
import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route} from "react-router-dom";
import { Row,Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

import { setMovies, setLoggedInUser } from '../../actions/actions';

import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { GenreView } from '../genre-view/genre-view';
import { DirectorView } from '../director-view/director-view';
import ProfileView from '../profile-view/profile-view';

import './main-view.scss';

class MainView extends React.Component {

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
        this.props.setUser(response.data)

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
    // this.props.setLoggedInUser(authData.user);
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
    })
  }

  render() {
    let { movies } = this.props;
    let { user } = this.state;
    // console.log(movies);
    // console.log(user);

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)}/>

    if (!movies) return <div className="main-view"/>;

    return (
      <Router basename="/client">
          <div>
            <Navbar color="info" light>
            <NavbarBrand href="#" className="menu">myFlix</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="menu-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar>
                <NavItem>
                 <NavLink href="/" onClick={() => this.logOut()}>Log out</NavLink>
                </NavItem>
                <NavItem>
                <NavLink href={`client/users/${user}`}>{user}</NavLink>
                  {/* <NavLink href="/users/:username">{user}</NavLink>  */}
                </NavItem>
              </Nav>
            </Collapse>
            </Navbar>
          </div>
          <div className="main-view">
           {/* <Route exact path="/" render={() => movies.map(m => <MovieCard key={m._id} movie={m}/>)}/> */}

             <Route exact path="/" render={() => {
              if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
              return <Row>{movies.map(m => <MovieCard key={m._id} movie={m}/>)}</Row>
              }
            }/>
            <Route path="client/register" render={() => <RegistrationView />} />

          <Route path="client/Movies/:movieId" render={({match}) => <MovieView movie={movies.find(m => m._id === match.params.movieId)}/>}/>

          <Route path="client/genres/:name" render={({ match }) => {
              if (!movies) return <div className="main-view"/>;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre}/>}
            } />
            <Route path="client/directors/:name" render={({ match }) => {
              if (!movies) return <div className="main-view"/>;
              return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director}/>}
            } />
            <Route exact path="client/users/:username" render={() => <ProfileView />}/>
            </div>
        </Router>
    );
  }
}

let mapStateToProps = state => {
  return {
      movies: state.movies,
      user: state.user
    }
}

let mapDispatchToProps = (dispatch) => {
  return {
    setMovies: (movies) => dispatch(setMovies(movies)),
    setUser: (user) => dispatch(setLoggedInUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps )(MainView);

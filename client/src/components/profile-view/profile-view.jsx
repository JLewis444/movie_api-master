import React from "react";
import axios from 'axios';
import {Button, Form }from 'react-bootstrap';

import { Link } from "react-router-dom";

import './profile-view.scss';

class ProfileView extends React.Component {

    constructor() {
        super();

        this.state = {
          username: null,
          password: null,
          email: null,
          birthday: null,
          userData: null,
          favoriteMovies: [],
          usernameForm: null,
          passwordForm: null,
          emailForm: null,
          birthdayForm: null
        };
      }

    componentDidMount() {
    //authentication
        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.getUser(accessToken);
        }
    }

      //get user
    getUser(token) {
        let username = localStorage.getItem('user');
        axios.get(`https://lewis-myflix.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}`}
        })
        .then(response => {
        this.setState({
            userData: response.data,
            username: response.data.Username,
            password: response.data.Password,
            email: response.data.Email,
            birthday: response.data.Birthday,
            favoriteMovies: response.data.FavoriteMovies
        });
        })
        .catch(function (error) {
        console.log(error);
        });
    }

    //delete user
  deleteUser(event) {
    event.preventDefault();
    axios.delete(`https://lewis-myflix.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
    })
    .then(response => {
      alert('Your Account has been deleted!');
      //clears storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      //opens login view
      window.open('/', '_self');
    })
    .catch(event => {
      alert('failed to delete user');
    });
  }


    //update user data
    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state.username);
        axios.put(`https://lewis-myflix.herokuapp.com/users/${localStorage.getItem('user')}`, {
        Username: this.state.usernameForm,
        Password: this.state.passwordForm,
        EMail: this.state.emailForm,
        Birthday: this.state.birthdayForm
        }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(response => {
        console.log(response);
        alert('Your data has been updated!');
        //update localStorage
        localStorage.setItem('user', this.state.usernameForm);
        // call getUser() to dusplay changed userdata after submission
        this.getUser(localStorage.getItem('token'));
        // reset form after submitting data
        document.getElementsByClassName('changeDataForm')[0].reset();
        })
        .catch(event => {
        console.log('error updating the userdata');
        alert('Ooooops... Something went wrong!');
        });
    };

    // delete movie from list
    deleteMovie(event, favoriteMovie) {
        event.preventDefault();
        console.log(favoriteMovie);
        axios.delete(`https://lewis-myflix.herokuapp.com/users/${localStorage.getItem('user')}/movies/${favoriteMovie}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
        .then(response => {
        // update state with current movie data
        this.getUser(localStorage.getItem('token'));
        })
        .catch(event => {
        alert('Oops... something went wrong...');
        });
    }

    //handle the changes
  handleChange(event) {
    this.setState( {[event.target.name]: event.target.value} )
  }


      //toggle CHangeData form
    toggleForm() {
        let form = document.getElementsByClassName('changeDataForm')[0];
        let toggleButton = document.getElementById('toggleButton');
        form.classList.toggle('show-form');
        if (form.classList.contains('show-form')) {
        toggleButton.innerHTML= 'CHANGE DATA &uarr;';
        } else {
        toggleButton.innerHTML = 'CHANGE DATA &darr;';
        }
    }

    render() {
        const {userData, username, email, birthday, favoriteMovies} = this.state;

        if (!userData) return null;

        return (
            <div className="profile-view">
                <h1>Profile Data</h1>
                <div className="username">
                <div className="label">Name</div>
                <div className="value">{username}</div>
                </div>
                <div className="password">
                <div className="label">Password</div>
                <div className="value">***********</div>
                </div>
                <div className="birthday">
                <div className="label">Birthday</div>
                {/*<div className="value">{birthday.substr(-24, 10)}</div> */}
                </div>
                <div className="email">
                <div className="label">EMail</div>
                <div className="value">{email}</div>
                </div>

                <div className="favoriteMovies">
                <div className="label">Favorite Movies</div>
                
                {(favoriteMovies.length > 0)? (<div>
                  {favoriteMovies.map(movie => <li key={movie._id}>{movie.Title}</li> )}</div>) : (<i>Nothing to show</i>)
                }
                </div>

                <Link to={'/'}>
                <Button className="view-btn" variant="primary" type="button">
                BACK
                </Button>
                </Link>
                <Button className="view-btn" variant="primary" type="button" onClick={(event) => this.deleteUser(event)}>
                DELETE
                </Button>
                <Button id="toggleButton" className="view-btn" variant="primary" type="button" onClick={() => this.toggleForm()}>
                CHANGE DATA &darr;
                </Button>

                <Form className="changeDataForm">
                <h2>Update Data</h2>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label >Your Username</Form.Label>
                    <Form.Control type="text" name="usernameForm" onChange={event => this.handleChange(event)} placeholder="Enter Username" />
                    <Form.Text className="text-muted">
                    Type your username here.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="passwordForm" onChange={event => this.handleChange(event)} placeholder="Password" />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="emailForm" onChange={event => this.handleChange(event)} placeholder="example@ema.il" />
                </Form.Group>

                <Form.Group controlId="formBasicBirthday">
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control type="text" name="birthdayForm" onChange={event => this.handleChange(event)} placeholder="01.01.2000" />
                </Form.Group>

                <Button variant="primary" type="button" onClick={event => this.handleSubmit(event)} >
                CHANGE!
                </Button>
                </Form>
            </div>

        );
    }
}



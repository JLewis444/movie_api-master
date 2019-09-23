import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import './registration-view.scss';


export function RegistrationView(props) {
    const [username, setUsername ] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      axios.post('https://lewis-myflix.herokuapp.com/users', {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/', '_self');
      })
      .catch(e => {
        console.log('error registering the user')
      });
    };
  
    return (
      <div className="registration-view">
      <Form className="registration-form">
        <h2>Sign In!</h2>
        <Form.Group controlId="formBasicUsername">
          <Form.Label >Your Username</Form.Label>
          <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Username" />
        </Form.Group>
  
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Your Password</Form.Label>
          <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        </Form.Group>
  
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Your Email</Form.Label>
          <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" />
        </Form.Group>
  
        <Form.Group controlId="formBasicBirthday">
          <Form.Label>Your Birthday</Form.Label>
          <Form.Control type="text" value={birthday} onChange={e => setBirthday(e.target.value)} placeholder="DD.MM.YYYY" />
        </Form.Group>
        <Button variant="dark" type="button" className="btn-lg btn-dark btn-block" onClick={handleSubmit}>
        Register
        </Button>
        <br></br>
        <p>
        Already a Member?
        </p>
        <Link to={'/'}>
          <Button variant="primary" type="button"  className="btn-lg btn-light btn-block">
          Back
          </Button>
        </Link>
      </Form>
      </div>
    );
  }

  RegistrationView.propTypes = {
    loginComponent: PropTypes.func
  }

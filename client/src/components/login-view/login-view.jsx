import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import { Link } from 'react-router-dom';

import './login-view.scss';

export function LoginView(props) {
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://lewis-myflix.herokuapp.com/login', {
      Username: username,
      Password: password
    })
    .then(response => {
      const data = response.data;
      props.onLoggedIn(data);
    })
    .catch(event => {
      if (event.response){
        console.log(event.response.data);
      }
      console.log(event);
      alert('no such user: ' + username);
    });
  };

  return (
    <Form className="login-form">
      <h2 className="text-center">Login</h2>
      <FormGroup>
        <Label>Username</Label>
        <Input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </FormGroup>
      <Button className="btn-lg btn-dark btn-block" type="button" onClick={handleSubmit}>Submit</Button><br></br>
       {/* <Link to={'/register'}>
            <Button variant="link" className="btn-lg btn-light btn-block">Register</Button>
      </Link>  */}
    </Form>
  );
}

LoginView.propTypes = {
  onLoggedIn : PropTypes.func.isRequired
}
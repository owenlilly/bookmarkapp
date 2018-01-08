import React, { Component } from 'react';
import validator from 'validator';
import RxHttp from '../../http/RxHttpClient';

const rxHttp = new RxHttp();

export default class Login extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      email: '',
      password: '',
      error: ''
    }
  }

  onChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  onAlertClosed = (e) => {
    e.preventDefault();
    this.setState({ error: '' });
  }

  login = (e) => {
    e.preventDefault();

    const { email, password } = this.state;

    const error = this.validate(email, password);
    if(error){
      this.setState({ error });
      return;
    } else {
      this.setState({ error: '' });
    }

    rxHttp.get('/api/login', {
      auth: {
        username: email,
        password: password
      }
    }).map(r => r.data).subscribe(r => {
      window.location = '/';
    }, err => {
      this.setState({ error: err.response.data.error });
    });
  }

  validate = (email, password ) => {
    if(email === ''){
      return 'Email cannot be empty';
    }

    if(!validator.isEmail(email)){
      return 'Invalid email address';
    }

    if(password === '' || password.trim().length < 8){
      return 'Password must be at least 8 characters';
    }

    return undefined;
  }

  render(){
    const { email, password, error } = this.state;
    return (
      <form>
        { error === '' ? null :
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            { error }
            <button type="button" onClick={this.onAlertClosed} className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div> }
        <div className="form-group">
          <input type="email" onChange={this.onChange} className="form-control" name="email" value={email} placeholder="Email" />
        </div>
        <div className="form-group">
          <input type="password" onChange={this.onChange} className="form-control" name="password" value={password} placeholder="Password" />
        </div>
        <button type="submit" onClick={this.login} className="btn btn-success btn-block">Login</button>
      </form>
    );
  }
}
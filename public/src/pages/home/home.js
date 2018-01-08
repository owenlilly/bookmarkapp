import React, { Component } from 'react';
import RxHttp from '../../http/RxHttpClient';

const client = new RxHttp();
export default class Home extends Component {

  constructor(props){
    super(props);

    this.state = {
      bookmarks: [],
      title: '',
      description: '',
      link: ''
    }
  }

  componentDidMount(){
    this.updateBookmarks();
  }

  updateBookmarks = () => {
    client.get('/api/bookmarks').map(r => r.data).subscribe(bookmarks => {
      this.setState({ bookmarks });
    }, console.log);
  }

  resetForm = () => {
    this.setState({
      title: '',
      link: '',
      description: ''
    });
  }

  deleteBookmark = (id) => {
    client.delete('/api/bookmarks/'+id).subscribe(r => {
      this.updateBookmarks();
    }, console.log);
  }

  saveBookmark = (e) => {
    e.preventDefault();

    const { title, link, description } = this.state;
    const bookmark = { title, link, description };

    client.post('/api/bookmarks', bookmark).subscribe(b => {
      this.resetForm();
      this.updateBookmarks();
    }, console.log);
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  logout = (e) => {
    e.preventDefault();
    
    client.get('/api/logout').subscribe(r => {
      window.location = '/login';
    }, console.log);
  }

  render(){
    const { bookmarks, title, link, description } = this.state;
    return (
      <div>
        <a onClick={this.logout} href="#">logout</a>
        <form>
          <input type="text" placeholder="Title" onChange={this.onChange} name="title" value={title} />
          <input type="text" placeholder="Link" onChange={this.onChange} name="link" value={link} />
          <input type="text" placeholder="Description" onChange={this.onChange} name="description" value={description} />
          <button onClick={this.saveBookmark}>Save</button>
        </form>
        <h1>Boobmarks</h1>
        <ul>
          {
            bookmarks.map((b, i) => (
              <li key={i}>{b.title}: {b.link} <span style={{display: 'inline-block'}} onClick={() => this.deleteBookmark(b._id)}>X</span></li>
            ))
          }
        </ul>
      </div>
    );
  }
};
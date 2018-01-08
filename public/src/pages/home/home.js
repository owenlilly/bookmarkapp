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
        <div className="row">
          <a onClick={this.logout} href="#">logout</a>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h2>Bookmarks</h2>
            <table className="table table-sm table-hover">
              <thead className="thead-light">
                <tr>
                  <th>Title</th>
                  <th>Link</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  bookmarks.map((b, i) => (
                    <tr key={i}>
                      <td>{b.title}</td>
                      <td><a href={b.link}>{b.link}</a></td> 
                      <td>{b.description}</td>
                      <td style={{color: '#aa0000'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="oi oi-trash" onClick={() => this.deleteBookmark(b._id)}></span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <h2>New Bookmark</h2>
            <form>
              <div className="form-group">
                <input className="form-control" type="text" placeholder="Title" onChange={this.onChange} name="title" value={title} />
              </div>
              <div className="form-group">
                <input className="form-control" type="text" placeholder="Link" onChange={this.onChange} name="link" value={link} />
              </div>
              <div className="form-group">
                <input className="form-control" type="text" placeholder="Description" onChange={this.onChange} name="description" value={description} />
              </div>
              <div className="form-group">
                <button className="btn btn-success btn-block" onClick={this.saveBookmark}>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};
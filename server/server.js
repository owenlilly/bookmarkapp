require('dotenv').config();
import path from 'path';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import AccountController from './api/AccountController';
import UserRepository from './repositories/UserRepository';
import UserService from './services/UserService';
import BookmarkApiController from './api/BookmarkApiController';

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });
mongoose.Promise = global.Promise;

const app = express();

const PORT = process.env.PORT || 3500;
const SECRET = process.env.SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const staticPath = path.join(__dirname, '..', 'public');

const authErrorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'UnauthorizedError') {
    if (!req.headers['authorization'] || req.headers['authorization'] === '') {
      res.status(401).json({error: 'No authorization token found'});
    } else {
      res.status(401).json({error: 'Invalid authorization token'});
    }
  }
};

app.use(bodyParser.json());
app.use(morgan(':method :url :status - :response-time ms'));
app.use(express.static(staticPath));
app.use(authErrorHandler);
app.use(cookieParser());
app.use(expressJwt({ 
  secret: SECRET,
  credentialsRequired: false,
  getToken: function(req){
    if(req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      let token;
      if (parts.length == 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          if (this.credentialsRequired) {
            throw new expressJwt.UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' });
          }
        }
      } else {
        throw new expressJwt.UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' });
      }

      return token;
    } else if(req.cookies && req.cookies.sessToken) {
      return req.cookies.sessToken;
    }
  }
}));

app.set('view engine', 'pug');
app.set('views', './server/views');

app.get('/', (req, res) => {
  if(!req.user){
    res.redirect('/login');
    return;
  }

  res.render('home/index', { pageTitle: 'Home' });
});

app.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/');
    return;
  }

  res.render('home/login', { pageTitle: 'Login' });
});


// api controllers
AccountController(app, SECRET);
BookmarkApiController(app);

new UserService().register({email: ADMIN_EMAIL, password: ADMIN_PASSWORD}).subscribe(u => {
  console.log('default user registered!');
}, err => {});

// catch all API handler
app.all('/api/*', (req, res) => {
  res.status(404).json({error: 'Endpoint not found'});
});

app.listen(PORT, () => console.log('listening on port', PORT));

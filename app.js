const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtAuth = require('express-jwt');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/furniture', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB schema for users
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport middleware for OAuth2
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://example.com/oauth2/auth',
    tokenURL: 'https://example.com/oauth2/token',
    clientID: 'your-client-id',
    clientSecret: 'your-client-secret',
    callbackURL: 'http://localhost:3000/auth/callback',
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ oauthId: profile.id }, function(err, user) {
      return done(err, user);
    });
  }
));

// JWT authentication middleware
const jwtSecret = 'your-secret-key';
const authenticate = jwtAuth({ secret: jwtSecret, algorithms: ['HS256'] });

// Open route
app.get('/api/open', (req, res) => {
  res.json({ message: 'This is an open route' });
});

// Protected route
app.get('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Register new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username: username,
    password: hashedPassword,
  });

  newUser.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Error registering user' });
    } else {
      res.status(201).json({ message: 'User registered successfully' });
    }
  });
});

// Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign({ sub: user._id }, jwtSecret, { expiresIn: '1h' });

  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

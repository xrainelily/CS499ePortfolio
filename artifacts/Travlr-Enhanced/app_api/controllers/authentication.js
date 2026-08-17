const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  // Registration requires a name, email address, and password.
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: '',
    });

    user.setPassword(req.body.password);
    await user.save();

    const token = user.generateJWT();

    // Match the same response shape returned by the login endpoint.
    return res.status(201).json({ token });
  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(400).json({
      message: 'Unable to register user.',
    });
  }
};

const login = (req, res) => {
  // Login only requires an email address and password.
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'All fields required' });
  }

  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return res.status(500).json({
        message: 'Authentication could not be completed.',
      });
    }

    if (!user) {
      return res.status(401).json(
        info || { message: 'Invalid email or password.' }
      );
    }

    const token = user.generateJWT();
    return res.status(200).json({ token });
  })(req, res);
};

module.exports = {
  register,
  login,
};

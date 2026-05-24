const axios = require('axios');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post(process.env.AUTH_SERVICE + '/graphql', {
      query: `mutation { login(input: { email: "${email}", password: "${password}" }) { token user { id username role } } }`
    });
    if (response.data.errors) {
      return res.status(400).json({ message: response.data.errors[0].message });
    }
    const { token, user } = response.data.data.login;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const response = await axios.post(process.env.AUTH_SERVICE + '/graphql', {
      query: `mutation { register(input: { username: "${username}", email: "${email}", password: "${password}", role: ${role || 'OPERATOR'} }) { token user { id username role } } }`
    });
    if (response.data.errors) {
      return res.status(400).json({ message: response.data.errors[0].message });
    }
    const { token, user } = response.data.data.register;
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ user });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const validate = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const response = await axios.post(
      process.env.AUTH_SERVICE + '/graphql',
      { query: `query { me { id username role } }` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.data.errors) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.json(response.data.data.me);
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const response = await axios.post(process.env.AUTH_SERVICE + '/graphql', {
      query: `mutation { logout }`
    }, { headers: { Authorization: `Bearer ${token}` } });
    if (response.data.errors) {
      return res.status(400).json({ message: response.data.errors[0].message });
    }
    res.json({ message: 'Logged out successfully' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { login, register, validate, logout };
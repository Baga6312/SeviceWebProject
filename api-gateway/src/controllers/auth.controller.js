const axios = require('axios');
require('dotenv').config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post(process.env.AUTH_SERVICE + '/graphql', {
      query: `mutation { login(input: { email: "${email}", password: "${password}" }) { token user { id username role } } }`
    });
    res.json(response.data.data.login);
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
    res.json(response.data.data.register);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

const validate = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const response = await axios.post(
      process.env.AUTH_SERVICE + '/graphql',
      { query: `query { me { id username role } }` },
      { headers: { Authorization: token } }
    );
    res.json(response.data.data.me);
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { login, register, validate };
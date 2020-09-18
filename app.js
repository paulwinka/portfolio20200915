require('dotenv').config();
const path = require('path');
const express = require('express');
const debug = require('debug')('app:startup');
const app = express();
const hbs = require('express-handlebars');
app.engine('handlebars', hbs());
app.engine(
  'handlebars',
  hbs({
    helpers: { eq: (a, b) => a == b },
  })
);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('home', { title: 'ABOUT ME: Paul Winka', active: 'home' });
});
app.get('/projects', (req, res) => {
  res.render('projects', { title: 'My crazy projects!', active: 'projects' });
});
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Me By Email', active: 'contact' });
});

app.post('/contact', (req, res) => {
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  debug(`email = ${email}`);
  debug(`subject = ${subject}`);
  debug(`message = ${message}`);
  const data = { title: 'Contact Me By Email', isValid: true, email, subject, message };
  if (!email) {
    data.isValid = false;
    data.emailError = 'email address not provided';
  }
  if (!subject) {
    data.isValid = false;
    data.subjectError = 'subject not provided';
  }
  if (!message) {
    data.isValid = false;
    data.messageError = 'message not provided';
  }
  data.result = data.isValid ? 'Message Sent!' : 'Please fix the errors above!';
  res.render('contact', data);
});

app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist/js'));
app.use('/bootswatch', express.static('node_modules/bootswatch/dist'));
app.use('/popper', express.static('node_modules/@popperjs/core/dist/umd'));
app.use('/', express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => debug(`server started on port ${PORT}.`));
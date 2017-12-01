import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import {orange500, blue500} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const styles = {
  card: {
    backgroundColor: '#555',
    color: '#fff',
    textAlign: 'center',
    width: '350px',
    margin: '0 auto',
    borderRadius: '25px'
  },
  inputStyle: {
    color: '#fff'
  },
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: blue500
  },
  floatingLabelStyle: {
    color: blue500
  },
  floatingLabelFocusStyle: {
    color: blue500
  }
}


const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user
}) => (
  <Card className="container" style={styles.card}>
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
          style={styles.inputStyle}
          hintStyle={styles.errorStyle}
          errorStyle={styles.errorStyle}
          underlineStyle={styles.underlineStyle}
          underlineFocusStyle={styles.underlineStyle}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
          style={styles.inputStyle}
          hintStyle={styles.errorStyle}
          errorStyle={styles.errorStyle}
          underlineStyle={styles.underlineStyle}
          underlineFocusStyle={styles.underlineStyle}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Log in" primary />
      </div>

      <CardText style={styles.card}>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
    </form>
  </Card>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
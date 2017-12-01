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
  input: {
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

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card style={styles.card} className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
          value={user.name}
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
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
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
          hintStyle={styles.errorStyle}
          errorStyle={styles.errorStyle}
          underlineStyle={styles.underlineStyle}
          underlineFocusStyle={styles.underlineStyle}
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Create New Account" primary />
      </div>

      <CardText style={styles.card}>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
    </form>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
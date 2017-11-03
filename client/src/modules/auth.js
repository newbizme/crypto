class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') !== null;
    } else {
      return false;
    }
    
    //return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    // destroy session on client
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // destroy session on server
    const axios = require('axios');
    axios.get('/auth/v1/logout')
        .then((response) => {
          console.log(response.data);
    });
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

  static getUser() {
    return localStorage.getItem('user');
  }

}

export default Auth;
// @ts-check

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './theme/my.css';

// Function to register a new user
async function registerUser(user) {
  try {
    const response = await fetch('/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log('User registered:', responseData);
    } else {
      const errorData = await response.json();
      console.error('Registration error:', errorData);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'secretpassword',
};

// Call the registerUser function with the new user data
registerUser(newUser);

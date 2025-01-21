import React from 'react';

const HomePage = ({ user }) => {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      {user ? <p>Logged in as: {user.name}</p> : <p>Please log in or register.</p>}
    </div>
  );
};

export default HomePage;

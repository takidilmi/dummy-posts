import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className="w-screen text-[32px] text-balance text-center h-screen flex flex-col justify-center items-center">
      <h1>404 - Not Found!</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className='text-blue-500' to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;

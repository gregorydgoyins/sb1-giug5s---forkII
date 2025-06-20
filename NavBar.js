
// Example React NavBar patch
import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li><Link to="/learn">Learn</Link></li>
        <li><Link to="/news">News</Link></li>
      </ul>
    </nav>
  );
}

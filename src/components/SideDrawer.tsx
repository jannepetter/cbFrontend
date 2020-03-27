import React from 'react';
import '../css/sideDrawer.css';
import { Link } from 'react-router-dom';

interface Props {
  sideDrawerOpen;
  me;
}

const SideDrawer: React.FC<Props> = props => {
  let cname = props.sideDrawerOpen ? 'sidedrawer open' : 'sidedrawer';

  const loggedin = {
    display: props.me.data.me ? '' : 'none'
  };
  /* const loggedout = {
        display: props.me.data.me  ? 'none' : ''
    } */

  return (
    <nav className={cname}>
      <ul>
        <li style={loggedin}>
          <Link to="/myRecipes">myRecipes </Link>
        </li>
        <li style={loggedin}>
          <Link to="/NewRecipe">NewRecipe </Link>
        </li>
        <li>
          <a href="/">something</a>
        </li>
        <li>
          <a href="/">another</a>
        </li>
      </ul>
    </nav>
  );
};
export default SideDrawer;

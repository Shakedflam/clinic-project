import { NavLink } from 'react-router-dom'   // NavLink changes url
// change and style the url when clicking on the link
function Nav() {
  // style if the link is the active route
  function linkStyle(isActive) {
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      textDecoration: isActive ? 'underline' : 'none',
    }
  }

  return (
    <nav style={{ display: 'flex', gap: '12px' }}>
      <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}> {/* goes to="/" (home page) when clicked and changes url to /. isActive checks if the link is the active route */}
        בית
      </NavLink>

      <NavLink to="/clinic" style={({ isActive }) => linkStyle(isActive)}>
        על הקליניקה
      </NavLink>

      <NavLink to="/roni" style={({ isActive }) => linkStyle(isActive)}>
        על רוני
      </NavLink>

      <NavLink to="/appointments" style = {({isActive}) => linkStyle(isActive)}>
      תורים
      </NavLink>

    </nav>
  )
}

export default Nav
import { Link } from "react-router-dom";

const Navbar = () => {
  const navStyle = {
    background: "#333",
    padding: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.2rem",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>
        Crear Producto
      </Link>
      <Link to="/products" style={linkStyle}>
        Ver Productos
      </Link>
    </nav>
  );
};

export default Navbar;

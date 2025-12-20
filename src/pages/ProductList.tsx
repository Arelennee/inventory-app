import { useState, useEffect } from "react";
import { getProducts, getFullImageUrl } from "../api/products";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getProducts(searchQuery);
        setProducts(response.data);
      } catch (err) {
        setError("Error al cargar los productos.");
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Lista de Productos</h2>
      <input
        type="text"
        placeholder="Buscar productos por nombre..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "1.5rem",
          fontSize: "1rem",
        }}
      />

      {loading && <p>Cargando productos...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && products.length === 0 && !error && (
        <p>No se encontraron productos.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            <img
              src={getFullImageUrl(product.imagen_url)}
              alt={product.nombre}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                marginBottom: "10px",
                borderRadius: "3px",
              }}
            />
            <h3 style={{ fontSize: "1.1rem", margin: "0 0 5px 0" }}>
              {product.nombre}
            </h3>
            {/* Puedes agregar más detalles aquí, como el precio si estuviera disponible */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

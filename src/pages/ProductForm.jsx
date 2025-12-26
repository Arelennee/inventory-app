import { useState } from "react";
import { createProduct } from "../api/products.js";

const ProductForm = () => {
  const [nombre, setNombre] = useState("");
  const [imagenFile, setImagenFile] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !imagenFile) {
      setError("El nombre y la imagen son obligatorios.");
      return;
    }

    setError("");
    setMensaje("");
    setIsLoading(true);

    try {
      const response = await createProduct(nombre, imagenFile);
      setMensaje(response.message || "Producto creado con éxito.");
      // Limpiar formulario
      setNombre("");
      setImagenFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Ocurrió un error al crear el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Crear Nuevo Producto</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div>
          <label htmlFor="nombre">Nombre del Producto</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Laptop"
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="imagen">Imagen del Producto</label>
          <input
            id="imagen"
            type="file"
            onChange={handleFileChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "10px", cursor: "pointer" }}
        >
          {isLoading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
      {mensaje && (
        <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
};

export default ProductForm;

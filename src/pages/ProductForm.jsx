import { useState } from "react";
import { createProduct } from "../api/products.js";

const ProductForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
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
      const response = await createProduct(nombre, imagenFile, descripcion);
      setMensaje(response.message || "Producto creado con éxito.");
      setNombre("");
      setDescripcion("");
      setImagenFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || "Ocurrió un error al crear el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h2 className="font-black text-2xl p-3">Crear Nuevo Producto</h2>
      <form
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-1">
          <label htmlFor="nombre" className="font-bold text-xl pointer-events-none">Nombre del Producto:</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="p-2.5 rounded-md hover:bg-zinc-200 animated duration-150"
            placeholder="Ej: Laptop"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="descripcion" className="font-bold text-xl pointer-events-none">Descripcion del Producto:</label>
          <textarea
            id="descripcion"
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="p-2.5 rounded-md hover:bg-zinc-200 animated duration-150"
            placeholder="Ej: Producto #0000 para modelo xx"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label htmlFor="imagen" className="font-bold text-xl pointer-events-none">Imagen del Producto:</label>
          <input
            id="imagen"
            type="file"
            onChange={handleFileChange}
            className="p-2.5 rounded-md mb-4 hover:bg-zinc-200 animated duration-150"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="block p-2.5 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 duration-150"
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

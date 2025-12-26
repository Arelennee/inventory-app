import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getFullImageUrl,
  deleteProduct,
} from "../api/products.js";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import EditProductModal from "../components/EditProductModal.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
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
  }, [searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsConfirmDeleteModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsConfirmDeleteModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const onConfirmDelete = async () => {
    if (selectedProduct) {
      setLoading(true); // Set loading for the delete operation
      try {
        await deleteProduct(selectedProduct.id);
        await fetchProducts(); // Refresh the list after deletion
        handleCloseModals();
      } catch (err) {
        setError(err.message || "Error al eliminar el producto.");
        console.error("Error deleting product:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onEditSuccess = async () => {
    await fetchProducts(); // Refresh the list after successful edit
    handleCloseModals();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Lista de Productos
      </h2>
      <input
        type="text"
        placeholder="Buscar productos por nombre..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-6"
      />

      {loading && (
        <p className="text-center text-indigo-600 text-lg">
          Cargando productos...
        </p>
      )}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}
      {!loading && products.length === 0 && !error && (
        <p className="text-center text-gray-500 text-lg">
          No se encontraron productos.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <img
              src={getFullImageUrl(product.imagen_url)}
              alt={product.nombre}
              className="w-full h-48 object-cover border-b border-gray-200"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
                {product.nombre}
              </h3>
              <div className="flex justify-between items-center gap-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="flex-1 py-2 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <>
          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={handleCloseModals}
            onConfirm={onConfirmDelete}
            productName={selectedProduct.nombre}
          />
          <EditProductModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            product={selectedProduct}
            onSuccess={onEditSuccess}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;

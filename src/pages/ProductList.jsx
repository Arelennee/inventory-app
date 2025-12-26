import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getFullImageUrl,
  deleteProduct,
} from "../api/products.js";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.jsx";
import EditProductModal from "../components/EditProductModal.jsx";
import ProductViewModal from "@/components/ProductViewModal.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

const handleViewClick = (product) => {
  setSelectedProduct(product);
  setIsViewModalOpen(true);
};

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
      setLoading(true);
      try {
        await deleteProduct(selectedProduct.id);
        await fetchProducts();
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
    await fetchProducts();
    handleCloseModals();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
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
        <p className="text-center text-indigo-600 text-lg">Cargando productos...</p>
      )}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}
      {!loading && products.length === 0 && !error && (
        <p className="text-center text-gray-500 text-lg">No se encontraron productos.</p>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
          >
            <img
              src={getFullImageUrl(product.imagen_url)}
              alt={product.nombre}
              onClick={() => handleViewClick(product)}
              className="w-full h-64 object-cover border-b border-gray-200"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-gray-800 truncate mb-1">
                {product.nombre}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                {product.descripcion && product.descripcion.length > 40
                  ? `${product.descripcion.substring(0, 40)}...`
                  : product.descripcion || "Sin descripción"}
              </p>

              <div className="mt-auto flex justify-between items-center gap-3">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 text-sm font-medium shadow-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(product)}
                  className="flex-1 py-2.5 px-4 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition duration-150 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modales fuera del grid pero dentro del contenedor principal */}
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
          <ProductViewModal 
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            product={selectedProduct}
/>
        </>
      )}
    </div>
  );
};

export default ProductList;
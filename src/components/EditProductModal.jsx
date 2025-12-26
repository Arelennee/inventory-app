import { useState, useEffect } from 'react';
import { updateProduct, getFullImageUrl } from '../api/products';

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // 1. Nuevo estado para descripción
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      setName(product.nombre || '');
      setDescription(product.descripcion || ''); // 2. Inicializar descripción
      setNewImageFile(null);
      setPreviewImageUrl(null);
      setLoading(false);
      setError('');
    }
  }, [isOpen, product]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setPreviewImageUrl(URL.createObjectURL(file));
    } else {
      setNewImageFile(null);
      setPreviewImageUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del producto no puede estar vacío.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 3. Pasamos 'description' como tercer argumento
      await updateProduct(product.id, name, description, newImageFile);
      onSuccess(); 
      onClose(); 
    } catch (err) {
      setError(err.message || 'Error al actualizar el producto.');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentImageUrl = product ? getFullImageUrl(product.imagen_url) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Editar Producto</h3>
        {error && <p className="text-red-500 mb-4 font-medium">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
              Nombre del Producto
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* 4. Nuevo Campo Descripción */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional)
            </label>
            <textarea
              id="edit-description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Añade una descripción detallada..."
              disabled={loading}
            />
          </div>

          {/* Visualización Imagen Actual */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen Actual</label>
            {product && product.imagen_url ? (
              <img
                src={currentImageUrl}
                alt={product.nombre}
                className="mt-2 h-20 w-20 object-cover rounded-md border border-gray-200"
              />
            ) : (
              <p className="text-sm text-gray-500 italic">Sin imagen configurada.</p>
            )}
          </div>

          {/* Selector de Nueva Imagen */}
          <div>
            <label htmlFor="new-image" className="block text-sm font-medium text-gray-700">
              Nueva Imagen (opcional)
            </label>
            <input
              id="new-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              disabled={loading}
            />
            {previewImageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-gray-400">Vista previa:</p>
                <img src={previewImageUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md border-2 border-indigo-200" />
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md transition-all active:scale-95 disabled:bg-indigo-400"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
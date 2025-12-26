import { getFullImageUrl } from "../api/products.js";

const ProductViewModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    // Backdrop oscuro (90% de opacidad) para centrar la atención
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      {/* Contenedor principal del Modal */}
      <div 
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Evita que el modal se cierre al hacer click dentro
      >
        {/* Botón de cerrar para móvil y escritorio */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Lado Izquierdo: La Imagen (Sección más grande) */}
        <div className="md:w-2/3 bg-gray-50 flex items-center justify-center p-2">
          <img 
            src={getFullImageUrl(product.imagen_url)} 
            alt={product.nombre}
            className="max-w-full max-h-[40vh] md:max-h-[85vh] object-contain"
          />
        </div>

        {/* Lado Derecho: Información detallada */}
        <div className="md:w-1/3 p-8 flex flex-col bg-white">
          <div className="flex-grow">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">Detalles del Producto</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4 leading-tight">
              {product.nombre}
            </h2>
            
            <div className="w-12 h-1 bg-indigo-500 mb-6"></div>
            
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Descripción</h4>
            <p className="text-gray-700 text-lg leading-relaxed overflow-y-auto max-h-[30vh] pr-2 custom-scrollbar">
              {product.descripcion || "Este producto no cuenta con una descripción detallada en este momento."}
            </p>
          </div>

          {/* Footer del Modal */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">ID Único</p>
              <p className="text-sm font-mono text-gray-600">#{product.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
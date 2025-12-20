const API_URL = `${import.meta.env.VITE_API_URL}/api/productos`;
const IMAGE_BASE_URL = `${import.meta.env.VITE_API_URL}/uploads`;

export const getProducts = async (query = "") => {
  try {
    const response = await fetch(`${API_URL}?q=${query}`);
    if (!response.ok) throw new Error("Error al obtener productos");
    return await response.json();
  } catch (e) {
    console.error("Service error http(get): ", e);
    throw e;
  }
};

export const createProduct = async (nombre, imagenFile) => {
  try {
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("imagen", imagenFile);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error al crear el producto");
    return await response.json();
  } catch (err) {
    console.error("Service error (post): ", err);
    throw err;
  }
};

export const updateProduct = async (id, nombre, imagenFile) => {
  try {
    const formData = new FormData();
    if (nombre) formData.append("nombre", nombre);
    if (imagenFile) formData.append("imagen", imagenFile);

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error("Error al actualizar el producto");
    return await response.json();
  } catch (e) {
    console.error("Service error (PUT", e);
    throw e;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el producto");
    return await response.json();
  } catch (e) {
    console.error("Service error (DELETE): ", e);
    throw e;
  }
};

export const getFullImageUrl = (imageName) => `${IMAGE_BASE_URL}/${imageName}`;

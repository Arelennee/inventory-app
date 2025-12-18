import { error } from "console";
import db from "../config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProduct = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim().length === 0) {
      if (req.file) await fs.unlink(req.file.path);
      return res
        .status(400)
        .json({ message: "El nombre del producto es obligatorio" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "La imagen de producto es obligatoria" });
    }
    const imagenUrl = req.file.filename;

    const query = "INSERT INTO productos (nombre, imagen_url) VALUES (?, ?)";

    try {
      const [result] = await db.query(query, [nombre.trim(), imagenUrl]);
      res.status(201).json({
        message: "Producto creado con exito",
        producto: { id: result.insertId, nombre, imagenUrl },
      });
    } catch (dbError) {
      await fs.unlink(req.file.path);
      throw dbError;
    }
  } catch (e) {
    console.error("Error detallado: ", e);
    res.status(500).json({ message: "Error interno del server" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT imagen_url FROM productos WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const nombreImagen = rows[0].imagen_url;
    const rutaImagen = path.join(__dirname, "../uploads/", nombreImagen);

    try {
      await fs.unlink(rutaImagen);
    } catch (e) {
      console.error("No se pudo eliminar el archivo solicitado", e);
    }

    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ message: "Producto y archivo eliminado correctamente" });
  } catch (e) {
    console.error("error al eliminar el producto", e);
    res.status(500).json({ message: "Error interno del server al eliminar" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    const [rows] = await db.query(
      "SELECT imagen_url FROM productos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const imagenAnterior = rows[0].imagen_url;
    let nuevaImagenUrl = imagenAnterior;

    if (req.file) {
      nuevaImagenUrl = req.file.filename;

      const rutaImagenVieja = path.join(
        __dirname,
        "../uplodas/",
        imagenAnterior
      );
      try {
        await fs.unlink(rutaImagenVieja);
      } catch (e) {
        console.error("Error al borrar la imagen anterior: ", e);
      }
    }
    const nombreFinal =
      nombre && nombre.trim().length > 0 ? nombre.trim() : null;

    const query =
      "UPDATE productos SET nombre = IFNULL(?, nombre), imagen_url = ? WHERE id = ?";
    await db.query(query, [nombreFinal, nuevaImagenUrl, id]);
    res.json({
      message: "Producto actualizado con exito",
      producto: {
        id,
        nombre: nombreFinal || "sin cambios",
        imagenUrl: nuevaImagenUrl,
      },
    });
  } catch (e) {
    console.error("Error al actualizar producto:", error);
    if (req.file) await fs.unlink(req.file.path);
    res
      .status(500)
      .json({ message: "Error interno al actualizar el producto" });
  }
};
export const getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let query = "SELECT id, nombre, imagen_url FROM productos";
    let params = [];

    if (q && q.trim() !== "") {
      query += " WHERE LOWER(nombre) LIKE LOWER(?)";
      params.push(`%${q.trim()}%`);
    }

    query += " ORDER BY id DESC";

    const [rows] = await db.query(query, params);

    res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (e) {
    console.error("Error en el controlador: ", e);
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: e.message,
    });
  }
};

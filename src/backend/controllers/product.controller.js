import db from "../config/db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let query = "SELECT id, nombre, imagen_url, descripcion FROM productos";
    let params = [];

    if (q && q.trim()) {
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
    console.error("Error in controller: ", e);
    res.status(500).json({
      success: false,
      message: "Error getting products",
      error: e.message,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(rows[0]);
  } catch (e) {
    console.error("Error getting product by id: ", e);
  }
};
export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !nombre.trim()) {
      if (req.file) await fs.unlink(req.file.path);
      return res
        .status(400)
        .json({ message: "Product name is required" });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Product image is required" });
    }

    const imagenUrl = req.file.filename;
    const query = "INSERT INTO productos (nombre, imagen_url, descripcion) VALUES (?, ?, ?)";

    try {
      const [result] = await db.query(query, [nombre.trim(), imagenUrl, descripcion.trim()]);
      res.status(201).json({
        message: "Product created successfully",
        producto: { id: result.insertId, nombre, imagenUrl },
      });
    } catch (dbError) {
      await fs.unlink(req.file.path);
      throw dbError;
    }
  } catch (e) {
    console.error("Detailed error: ", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body; // 1. Extraemos descripcion

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        message: "Product name cannot be empty",
      });
    }

    const [rows] = await db.query(
      "SELECT imagen_url FROM productos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(404).json({ message: "Product not found" });
    }

    const imagenAnterior = rows[0].imagen_url;
    let nuevaImagenUrl = imagenAnterior;

    if (req.file) {
      nuevaImagenUrl = req.file.filename;
      const rutaImagenVieja = path.join(
        __dirname,
        "../uploads/",
        imagenAnterior
      );
      try {
        await fs.unlink(rutaImagenVieja);
      } catch (e) {
        console.error("Error deleting old image: ", e);
      }
    }

    const nombreFinal = nombre.trim();
    const descripcionFinal = descripcion ? descripcion.trim() : null; // 2. Limpiamos descripción si existe

    const query =
      "UPDATE productos SET nombre = ?, descripcion = ?, imagen_url = ? WHERE id = ?";
    
    await db.query(query, [nombreFinal, descripcionFinal, nuevaImagenUrl, id]);

    res.json({
      message: "Product updated successfully",
      producto: {
        id,
        nombre: nombreFinal,
        descripcion: descripcionFinal, // 4. Devolvemos el nuevo campo
        imagenUrl: nuevaImagenUrl,
      },
    });
  } catch (e) {
    console.error("Error updating product:", e);
    if (req.file) await fs.unlink(req.file.path);
    res
      .status(500)
      .json({ message: "Internal server error updating product" });
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
      return res.status(404).json({ message: "Product not found" });
    }

    const nombreImagen = rows[0].imagen_url;
    const rutaImagen = path.join(__dirname, "../uploads/", nombreImagen);

    try {
      await fs.unlink(rutaImagen);
    } catch (e) {
      console.error("Could not delete the requested file", e);
    }

    await db.query("DELETE FROM productos WHERE id = ?", [id]);
    res.json({ message: "Product and file deleted successfully" });
  } catch (e) {
    console.error("Error deleting product", e);
    res
      .status(500)
      .json({ message: "Internal server error during deletion" });
  }
};
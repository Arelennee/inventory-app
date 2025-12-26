USE sistema_inventario;

CREATE TABLE IF NOT EXISTS productos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    imagen_url VARCHAR(255) NOT NULL);
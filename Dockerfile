# Usar una imagen base oficial de Node.js v24, optimizada para tamaño (alpine)
FROM node:24-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package.json package-lock.json ./

# Instalar las dependencias del proyecto
# Usamos 'npm ci' para instalaciones limpias y reproducibles basadas en el package-lock.json
RUN npm ci

# Copiar todo el código fuente del proyecto al directorio de trabajo del contenedor
COPY . .

# Exponer el puerto que utilizará el servidor de backend (asumo que es el 3001)
EXPOSE 4000

# Definir el comando por defecto que se ejecutará al iniciar el contenedor
# Esto iniciará tu servidor de Node.js
CMD ["npm", "run", "devi"]

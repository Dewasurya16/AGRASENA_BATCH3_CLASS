# Gunakan image resmi Node.js LTS berbasis Alpine yang ringan
FROM node:20-alpine

# Set direktori kerja
WORKDIR /app

# Salin package.json & lockfile
COPY package*.json ./

# Install dependencies (gunakan npm install --omit=dev untuk image ramping)
RUN npm install --omit=dev

# Salin seluruh file kode sumber bot
COPY . .

# Buat folder auth session
RUN mkdir -p auth_info_baileys

# Port server HTTP API
EXPOSE 5000

# Perintah menjalankan bot
CMD ["npm", "start"]

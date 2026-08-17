FROM nikolaik/python-nodejs:python3.11-nodejs20

WORKDIR /app

# Copy file package untuk backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install yt-dlp secara global
RUN pip install yt-dlp

# Copy sisa kode
COPY . .

# Jalankan server dari folder backend
CMD ["node", "backend/server.js"]

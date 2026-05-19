# Deploy con Docker

## 1. Build del frontend (en tu PC)

```bash
# Parado en DelRey/
cd Ecommerce-DelRey
npm run build

# Copiar al backend
cd ../Ecommerce-DelRey-backend
if (Test-Path public) { Remove-Item -Recurse -Force public }
New-Item -ItemType Directory -Path public
Copy-Item -Recurse ../Ecommerce-DelRey/dist/ecommerce/browser/* ./public/
```

O directamente:
```bash
cd Ecommerce-DelRey-backend
npm run build:front
```

## 2. Deploy

### Opción A: Docker local
```bash
# Parado en Ecommerce-DelRey-backend/
docker compose up -d --build
docker exec delrey_backend node scripts/seed-admin.js
# Abrir http://localhost:3000
```

### Opción B: Railway (recomendado)
1. Subí esta carpeta (`Ecommerce-DelRey-backend`) a su repo de GitHub
2. Asegurate de incluir la carpeta `public/` (el frontend compilado)
3. En Railway, conectá el repo, elegí "Docker Compose"
4. Agregá las variables de entorno (Cloudinary, JWT_SECRET)
5. Railway levanta PostgreSQL + backend automáticamente

## 3. Variables de entorno (producción)

```env
CLOUDINARY_CLOUD_NAME=tu_cloud
CLOUDINARY_API_KEY=tu_key
CLOUDINARY_API_SECRET=tu_secret
JWT_SECRET=nuevo_secret_seguro
```

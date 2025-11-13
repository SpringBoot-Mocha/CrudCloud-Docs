
## 5) `docs/05-frontend/dockerfile.md`

```md
---
sidebar_position: 2
title: Dockerfile (Frontend)
---

# Dockerfile (Frontend)

```dockerfile
# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# API base configurable en build
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Serve estático con nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Opcional: custom nginx.conf para SPA
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


docker build -t crudcloud-frontend --build-arg VITE_API_BASE_URL=https://api.name-team.crudzaso.com/api .
docker run -d --name crudcloud-frontend -p 3000:80 crudcloud-frontend

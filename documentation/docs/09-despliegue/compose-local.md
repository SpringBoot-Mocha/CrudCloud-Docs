---
sidebar_position: 1
title: docker-compose (local)
---

```yaml
version: "3.8"
services:
  backend:
    image: crudcloud-backend:latest
    ports: ["8080:8080"]
    environment:
      SPRING_PROFILES_ACTIVE: "prod"
      DB_URL: "jdbc:postgresql://host.docker.internal:5432/crudcloud"
      DB_USER: "postgres"
      DB_PASS: "postgres"
      JWT_SECRET: "changeme"
  frontend:
    image: crudcloud-frontend:latest
    ports: ["3000:80"]
    environment:
      - VITE_API_BASE_URL=https://api.localhost/api

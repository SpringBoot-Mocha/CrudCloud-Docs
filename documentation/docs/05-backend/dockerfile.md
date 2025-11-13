---
sidebar_position: 2
title: Dockerfile (Backend)
---

# Dockerfile (Backend)

```dockerfile
# Etapa 1: build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests package

# Etapa 2: runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Variables (inyectadas en runtime)
ENV JAVA_TOOL_OPTIONS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

docker build -t crudcloud-backend .
docker run -d --name crudcloud-backend \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/crudcloud \
  -e DB_USER=postgres -e DB_PASS=postgres \
  -e JWT_SECRET=changeme \
  crudcloud-backend

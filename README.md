# The MMT backend



docker-compose.yml template for development: 

```
services:
  strapi:
    container_name: strapi
    image: strapi/strapi
    environment:
      - DATABASE_CLIENT=postgres
      - DATABASE_HOST=db
      - DATABASE_PORT=5432
      - DATABASE_NAME=strapi
      - DATABASE_USERNAME=strapi
      - DATABASE_PASSWORD=strapi
    ports:
      - 1337:1337
    volumes:
      - ./MMT-strapi:/srv/app
    depends_on:
      - db

  db:
    container_name: postgres
    image: postgres
    restart: always
    volumes:
      - ./db:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
      POSTGRES_DB: strapi
```
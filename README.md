<p align="center">
  Backend para HealthyDev
</p>

## Descripción

 Api Rest para aplicación web HealthyDev.

## Requerimientos

NodeJs
Docker
PostgreSQL
Cuenta en Cloudinary www.cloudinary.com

## Instalación

```bash
$ npm install
```

## Iniciando la API

```bash

# inicialización de docker
$ docker-compose up --build

# development
$ npm run start

# watch mode (nodemon)
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Configuracion

```bash

# información de la base de datos

TYPEORM_HOST=db
TYPEORM_CONNECTION=postgres
TYPEORM_USERNAME= {{username de la db}}
TYPEORM_PASSWORD= {{password de la db}}
TYPEORM_DATABASE= {{nombre de la db}}
TYPEORM_PORT= {{puerto de la db}}
TYPEORM_SYNCHRONIZE=false
TYPEORM_MIGRATIONS_RUN=true
TYPEORM_ENTITIES=src/**/*.entity.ts
TYPEORM_MIGRATIONS=src/migrations/*.ts
TYPEORM_MIGRATIONS_DIR=src/migrations
TYPEORM_LOGGING=true
TYPEORM_LOGGER='file'

# Las siguientes 3 variables se consiguen con la cuenta de cloudinary

CLOUDINARY_USER=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Las siguientes 2 variables son necesarias para el modulo de autentificacion

JWT_SECRET_KEY={{Texto de seguridad para desencriptar el token}}
JWT_EXPIRES={{Tiempo que dura el token}}

```

## Documentación

[Link a la documentación](docs/Documentation.md)

## Support

Contacta con la comunidad FrontEnd Cafe. https://twitter.com/FrontEndCafe

## License

  [MIT licensed](LICENSE).

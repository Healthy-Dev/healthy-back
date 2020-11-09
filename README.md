<h1 align="center"> Backend para HealthyDev 💪</h1>

Api Rest para aplicación web HealthyDev.

## Requerimientos 📋

NodeJs
Docker
PostgreSQL
Cuenta en Cloudinary www.cloudinary.com

## Instalación ⚙️

```bash
$ npm install
```

## Iniciando la API 🚀

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

### Configuración 🔧

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

# Variables para el social login

FACEBOOK_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_BACKEND_URL= {{API_URL}} /v1/auth/facebook/

GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_BACKEND_URL= {{API_URL}} /v1/auth/google/

SOCIAL_AUTH_CLIENT_URL= {{FrontEnd url para redirigir el social login}}

# Las siguientes variables son necesarias para el envio de emails usando OAuth2 (verificación email y olvide contraseña)

EMAIL_AUTH_TYPE=
EMAIL_SERVICE=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_ALIAS=
EMAIL_USERNAME=
EMAIL_CLIENT_ID=
EMAIL_CLIENT_SECRET=
EMAIL_REFRESH_TOKEN=
EMAIL_ACCESS_TOKEN=
EMAIL_TOKEN_EXPIRES=

# Las siguientes variables son necesarias para los destinos de los links del email (verificación email con posibilidad de eliminar cuenta si no fue creada por el titular y olvide contraseña)

CLIENT_URL_VERIFICATION=
CLIENT_URL_RESET_PASSWORD=
CLIENT_URL_DELETE_USER=

# Las siguientes variables son necesarias la creación de tokens encriptados de verificación email y olvide contraseña

TOKENS_BIT_LENGTH =
TOKENS_ALGORITHM =
TOKENS_EXPIRES =

```

## Test 🛠️

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```

## Documentación 📖

[Link a la documentación](docs/Documentation.md)

## Soporte ✉️

Contacta con la comunidad FrontEnd Cafe. https://twitter.com/FrontEndCafe

## Licencia 📄

[MIT licensed](LICENSE).

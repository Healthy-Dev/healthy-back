## HealthyDev Backend Documentación

### GET “{{URL}}/v1/cards”

Muestra por defecto las últimas 15 cards creadas.

**Parámetros:**

    Enviados por URL

    - offset: número desde que registro el get trae las cards, (Opcional, por defecto 0 )

    - limit: límite de cantidad de cards que trae el endpoint (Opcional, por defecto 15)

    - creatorId: id de usuario creador de la card (Opcional)

    - categoryId: id de la categoría de la card (Opcional)

    - search: texto para buscar cards que contenga en title o description la cadena enviada (Opcional)

        Nota: Considerando paginación o infinite scroll, definimos de cuantos registros queremos solicitar (limit por defecto 15) y tenemos un número de página (page), entonces el offset =  page * limit, si se inicia desde nroPagina = 0.

**Respuesta:**

Array de objetos, donde cada objeto devuelve:

```bash
{
    id: id de la card,
    title: título de la card,
    photo: url de la imagen subida
}
```

**Ejemplo:**

```bash
fetch(
      “https://healthydev.herokuapp.com/v1/cards?offset=2&limit=50&search=TEST”,
      {
        method: “GET”,
      },
)
.then(“// Manejo de Respuesta”);
```

### GET “{{URL}}/v1/cards/:id”

Muestra la card específica que se busca de acuerdo el id pasado como parámetro.

**Parámetros:**

    Enviado por URL

    - id: id de la card que se necesita mostrar (Obligatorio), reemplaza a “:id”

**Respuesta:**

```bash
{
    card: {
        id: id de la card,
        title: título de la card,
        description: descripción de la card,
        photo: url de la imagen subida,
        externalUrl: url de una web externa a la api y a la app,
        category: categoría de la card,
        createdAt: fecha hora de creación,
        updatedAt: fecha hora de modificación,
        creator: {
            id: id de usuario creador,
            name: nombre de usuario creador,
            profilePhoto: url de la foto de perfil del creador
        },
        category: {
            id: id de la categoría,
            name: nombre de la categoría,
        },
        likedBy: [
            {
                userId: 4,
                userName: test15
            },
            {
                userId: 6,
                userName: test10
            }
        ],
        likesCount: 2
    }
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/1”,
    {
        method: “GET”,
    },
)
.then(“// Manejo de Respuesta”);
```

### POST “{{URL}}/v1/cards”

Crea una card.

**Body:**

```bash
{
    title: título de la card a crear (Obligatorio),
    description: descripción de la card a crear (Obligatorio),
    photo: imagen en string-base64 (Opcional, si no es subida ninguna imagen se   mostrará una imagen placeholder precargada),
    externalUrl: url de web externa a la app y a la api (Opcional)
    categoryId: id de la categoría de la card (Obligatorio)
}
```

**Respuesta:**

```bash
{
    id: id de la card creada
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards”,
    {
        method: “POST”,
        headers:{
                “Content-Type“: “aplication/json“,
                “Authorization“: “Bearer {{userToken}}“
        },
        body: JSON.stringify(
            {
                “title“: “Comida Healthy”,
                “description”: “Recetas para cocinar sano en época de cuarentena”,
                “photo”: “ // imagen subida desde la app, en string-base64 “,
                “externalUrl”: “ https://www.youtube.com/watch?v=7J8PYSgi8N8 ”,
                “categoryId”: 1
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

### PUT “{{URL}}/v1/cards/:id”

Modifica una card.

**Body:**

```bash
{
    title: título de la card a crear (Opcional),
    description: descripción de la card a crear (Opcional),
    photo: imagen en string-base64 (Opcional),
    externalUrl: url de web externa a la app y a la api (Opcional)
    categoryId: id de la categoría de la card (Opcional)
}
```

**Respuesta:**

```bash
{
    id: id de la card,
    title: título de la card,
    description: descripción de la card,
    photo: url de la imagen subida,
    externalUrl: url de una web externa a la api y a la app,
    createdAt: fecha hora de creación,
    updatedAt: fecha hora de modificación,
    creator: {
        id: id de usuario creador,
        name: nombre de usuario creador,
        profilePhoto: url de la foto de perfil del creador
    }
    category: {
        id: id de la categoría,
        name: nombre de la categoría,
    }
    likesCount: cantidad de likes de la card

}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/1”,
    {
        method: PUT,
        headers:{
                “Content-Type“: “aplication/json“,
                “Authorization“: “Bearer {{userToken}}“
        },
        body: JSON.stringify(
            {
                “title“: “Comida Healthy”,
                “description”: “Recetas para cocinar sano en época de cuarentena”,
                “photo”: “http://res.cloudinary.com/du7xgj6ms/image/upload/v1599004796/placeholder.jpg”,
                “externalUrl”: “https://www.youtube.com/watch?v=7J8PYSgi8N8”,
                “categoryId”: 1
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

### DELETE “{{URL}}/v1/cards/:id”

Elimina una card.

**Parámetros:**

    Enviado por URL

    - id: id de la card que se necesita eliminar (Obligatorio), reemplaza a “:id”

**Respuesta:**

```bash
{
    message: “La Card con el id: 100 fue eliminada con éxito.“
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/100”,
    {
        method: DELETE,
        headers:{
            “Content-Type“: “aplication/json“,
            “Authorization“: “Bearer {{userToken}}“
        },
    },
)
.then(“// Manejo de Respuesta”);
```

### POST “{{URL}}/v1/cards/:id/like”

Agrega un like.

**Parámetros:**

    Enviado por URL

    - id: id de la card que se necesita mostrar (Obligatorio), reemplaza a “:id”

**Respuesta:**

```bash
{
    message: ¡Me gusta!
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/1/like”,
    {
        method: POST,
        headers:{
            “Content-Type“: “aplication/json“,
            “Authorization“: “Bearer {{userToken}}“
        },
    },
)
.then(“// Manejo de Respuesta”);
```

### DELETE “{{URL}}/v1/cards/:id/like”

Elimina un like.

**Parámetros:**

    Enviado por URL

    - id: id de la card que se necesita mostrar (Obligatorio), reemplaza a “:id”

**Respuesta:**

```bash
{
    message: “¡No me gusta más!“
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/1/like”,
    {
        method: DELETE,
        headers:{
            “Content-Type“: “aplication/json“,
            “Authorization“: “Bearer {{userToken}}“
        },
    },
)
.then(“// Manejo de Respuesta”);
```

### GET “{{URL}}/v1/cards/categories”

Muestra las categorías de las cards

**Respuesta:**

```bash
[
    {
        id: 1,
        name: categoria1
    },
    {
        id: 2,
        name: categoria2
    }
]

```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/cards/categories”,
    {
        method: “GET”,
    },
)
.then(“// Manejo de Respuesta”);
```

### POST “{{URL}}/v1/auth/signup”

Registra un nuevo usuario

**Body:**

```bash
{
    username: nombre de usuario (Obligatorio - 4 a 20 caracteres - sin espacios ni “@”),
    email: email asociado a cuenta (Obligatorio - formato de email válido),
    password: contraseña (Obligatorio - al menos una mayúscula, una minúscula y un número, sin espacios -  8 a 250 caracteres),
}
```

**Respuesta:**

```bash
{
    accessToken: jwtToken (payload username)
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/auth/signup”,
    {
        method: “POST”,
        headers:{
                “Content-Type“: “application/json“
        },
        body: JSON.stringify(
            {
                “username“: “juani24”,
                “email”: “juanperez@gmail.com”,
                “password”: “ SuperPass21“
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

### POST “{{URL}}/v1/auth/signin”

Loguearse usuario registrado, puede hacerlo por el username o email.

**Body:**

```bash
{
    usernameOrEmail: nombre de usuario o email asociado a cuenta (Obligatorio - 4 a 100 caracteres)
    password: contraseña (Obligatorio - al menos una mayúscula, una minúscula y un número, sin espacios - 8 a 250 caracteres),
}
```

**Respuesta:**

```bash
{
    accessToken: jwtToken (payload username)
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/auth/sigin”,
    {
        method: “POST”,
        headers:{
                “Content-Type“: “application/json“
        },
        body: JSON.stringify(
            {
                “usernameOrEmail“: “juani24”,
                “password”: “ SuperPass21“
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

### GET “{{URL}}/v1/users/me”

Muestra los datos del usuario actual

**Respuesta:**

```bash
{
    "id": id de usuario,
    "email": email de usuario,
    "username": username usuario,
    "name": nombre real del usuario,
    "profilePhoto": foto de perfil usuario,
    "twitter": cuenta de twitter,
    "instagram": cuenta de instagram,
    "status": estado de la cuenta,
    "role": rol de usuario
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/users/me”,
    {
        method: GET,
        headers:{
                “Content-Type“: “application/json“,
                “Authorization“: “Bearer {{userToken}}“,
        },
    },
)
.then(“// Manejo de Respuesta”);
```

### PUT “{{URL}}/v1/users/me”

Modificación datos usuario

**Body:**

```bash
{
    name: nombre real (Opcional),
    profilePhoto: foto de perfil - imagen en string-base64 (Opcional),
    twitter: cuenta de twitter (Opcional),
    instagram: cuenta de instagram (Opcional)
}
```

**Respuesta:**

```bash
{
    message: “Usuario modificado con exito”
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/users/me”,
    {
        method: “PUT”,
        headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {{userToken}}',
        },
        body: JSON.stringify(
            {
                “name”: “ Juan Lopez“
                “profilePhoto”:  imagen en string-base64
                “twitter”: “@juan”
                “instagram”: “@juan”
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

### GET “{{URL}}/v1/users/:id”

Devuelve el user con el id pasado como parámetro.

**Parámetros:**

id: id del user que se necesita mostrar (Obligatorio), se pasa en la url, reemplaza a “:id”

**Respuesta:**

Objeto del user:

```bash
{
    "id": id,
    "name": Test Healthy,
    "profilePhoto": "http://res.cloudinary.com/du7xgj6ms/image/upload/v1599004796/placeholder.jpg"
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/users/1”,
    {
        method: “GET”,
    },
)
.then(“// Manejo de Respuesta”);
```

### POST “{{URL}}/v1/auth/new-password”

Cambiar contraseña de usuario actual

**Body:**

```bash
{
    password: contraseña (Obligatorio - al menos una mayúscula, una minúscula y un número, sin espacios - 8 a 250 caracteres),
}
```

**Respuesta:**

```bash
{
    message: “Contraseña Cambiada con éxito.”
}
```

**Ejemplo:**

```bash
fetch(
    “https://healthydev.herokuapp.com/v1/auth/new-password”,
    {
        method: “POST”,
        headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {{userToken}}',
        },
        body: JSON.stringify(
            {
            “password”: “ SuperPass21“
            }
        )
    },
)
.then(“// Manejo de Respuesta”);
```

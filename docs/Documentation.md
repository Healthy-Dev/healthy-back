## HealthyDev Backend Documentación

### GET “{{URL}}/v1/cards”

Muestra por defecto las últimas 15 cards creadas.

- **Parámetros:**

    Enviados por URL
    
    - offset: número desde que registro el get trae las cards, (Opcional, por defecto 0 )

    - limit: límite de cantidad de cards que trae el endpoint (Opcional, por defecto 15)

    - search: texto para buscar cards que contenga en title o description la cadena enviada (Opcional)

        Nota: Considerando paginación o infinite scroll, definimos de cuantos registros queremos solicitar (limit por defecto 15) y tenemos un número de página (page), entonces el offset =  page * limit, si se inicia desde nroPagina = 0.

- **Respuesta:**

    - Array de objetos, donde cada objeto devuelve:

    ```bash
    {
        id: id de la card,
        title: título de la card,
        photo: url de la imagen subida
    }
    ```

- **Ejemplo:**

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

- **Parámetros:**

    Enviado por URL
    
    - id: id de la card que se necesita mostrar (Obligatorio), reemplaza a “:id”

- **Respuesta:**

    - Objeto de la card:

    ```bash
    {
        id: id de la card,
        title: título de la card,
        description: descripción de la card,
        photo: url de la imagen subida,
        externalUrl: url de una web externa a la api y a la app
    }
    ```
    
- **Ejemplo:**

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

- **Parámetros:**

    Enviado por cuerpo
    
    - Objeto para la creación de la card
    
        ```bash
        {
            title: título de la card a crear (Obligatorio),
            description: descripción de la card a crear (Obligatorio),
            photo: imagen en string-base64 (Opcional, si no es subida ninguna imagen se mostrará una imagen por defecto),
            externalUrl: url de web externa a la app y a la api (Opcional)
        }
        ```

- **Respuesta:**

    ```bash
    {
        id: id de la card creada
    }
    ```

- **Ejemplo:**

    ```bash
    fetch(
          “https://healthydev.herokuapp.com/v1/cards”,
          {
            method: “POST”,
            headers:{
                “Content-Type“: “aplication/json“
            },
            body: JSON.stringify(
            {
                “title“: “Comida Healthy”,
                “description”: “Recetas para cocinar sano en época de cuarentena”,
                “photo”: “ // imagen subida desde la app, en string-base64 “,
                “externalUrl”: “ https://www.youtube.com/watch?v=7J8PYSgi8N8 ” 
            }
            ) 
          },
    )
    .then(“// Manejo de Respuesta”);
    ```

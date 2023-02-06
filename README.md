<p align="center">
  <a href="https://expressjs.com/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" width="200" alt="Express JS Logo" /></a>
</p>


# CHAT - JCO

1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Crear Imagen y contenedores del proyecto en Docker:
  - Produccion:
      ```
        docker compose up
      ```
  - Desarrollo:
      ```
        docker compose -f docker-compose-dev.yml up
      ```

6. Levantar: ```npm run start:dev```


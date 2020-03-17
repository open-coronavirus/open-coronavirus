# Open Coronavirus

## Qué es Open Coronavirus

Es una iniciativa open source para la colaboración ciudadana y la ayuda a luchar contra el virus COVID-19.

Desarrollada por un grupo de ciudadanos e ingenieros informáticos bajo licencia open source MIT.

La APP imita el modelo creado en otros países como South Korea que mediante tecnología y test médicos han conseguido controlar la pandemia.

La aplicación permite:

- *Identificación del ciudadano mediante QR*.

- *Colaboración ciudadana* y autodeclaración de responsabilidad indicando cuando sales de casa y para qué. Así cuando vuelves a tu domicilio.

- *Tracking de tu posición* para colaborar y ayudar a las autoridades a detectar dónde pueden estar los focos de contagio.

- Autocuestionario para *descongestión del 112 o 061* o número de asistencia para el COVID-19.  Mediante un cuestionario permite determinar si necesita llamar o no a un número de emergencia.

Debe servir también para tener datos directamente del seguimiento de pacientes que han sido enviados a casa con síntomas leves pero con indicaciones de seguimiento por si empeoran.

## Pantallas

![Presentación](screenshots/screen1.png?raw=true "Presentación")
![Registro](screenshots/screen2.png?raw=true "Registro")
![Pantalla principal](screenshots/screen3.png?raw=true "Pantalla principal")
![Test](screenshots/screen4.png?raw=true "Test")
![Menú](screenshots/screen5.png?raw=true "Menú")
![Permiso salir](screenshots/screen6.png?raw=true "Permiso salir")
![Salir](screenshots/screen7.png?raw=true "Salir")
![Información](screenshots/screen8.png?raw=true "Información")

## Roadmap y características en el futuro

Sería interesante poder solicitar el test del COVID-19 a partir del mismo cuestionario de preguntas y tener los resultados en 24hrs directamente en la APP.

Identificación del ciudadano si está verde (desinfectado) / amarillo (cuarentena 7 días) / rojo (infectado o cuarentena 14 días) para permitir una movilididad controlada de los ciudadanos en un futuro y evitar contagios/brotes

![Identificación del ciudadano](screenshots/identificacion-ciudadanos.png?raw=true "Identificación del ciudadano")

## Por qué hemos hecho Open Coronavirus

Dada la urgencia de la situación actual toda ayuda es poco. Por eso hemos diseñado y programado el core básico de una App 100% funcional que pueda dar respuesta a algunas necesidades del ciudadano durante el periodo de cuarentena.

El diseño es suficientemente flexible para que añadir o modificar funcionalidades sea fácil y rápido, que es lo que ahora necesitamos.

Esta aplicación pretende ser de ayuda a los ciudadanos y poder hacer frente a la pandemia.

Sé responsable. Entre todos, ¡venceremos al virus!
\#yomequedoencasa

## Estructura del Proyecto

El proyecto está dividido de la siguiente forma:

- `server` - Servidor NODE (Loopback)
- `app` - Código de la App (Ionic)

La app compila tanto para android como para iOS.

### El servidor

Para ejecutar el servidor necesitas una base de datos mongoDB y ajustar la configuración de .env.dev o .env.production según.

Luego tendrás que descargar todas las dependencias usando:

```
cd server
npm install
```

Finalmente para ejecutar el servidor usa:

```
npm start
```

### La App

La App está hecha con el framework ionic. Tendrás que instalar el cliente usando:

```
npm install -g @ionic/cli
```

También tendrás que descargar todas las dependencias usando:

```
cd app
npm install
```

Luego para ejecutarlo usa:

```
ionic serve
```

Esto permite ejecutar la app en un browser. 

## Licencia

[Licencia MIT](license.md)

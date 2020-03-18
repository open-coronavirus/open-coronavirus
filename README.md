# Open Coronavirus

## Qué es Open Coronavirus

Es una APP para Android e iOS en forma de iniciativa de código abierto para la colaboración ciudadana y la ayuda a luchar contra el virus COVID-19.

Desarrollada por un grupo de ciudadanos e ingenieros informáticos bajo licencia open source MIT.

La APP imita el modelo creado en otros países como Corea del Sur que mediante tecnología y test médicos han conseguido controlar la pandemia.

La aplicación permite:

- **Identificación del ciudadano mediante QR**.

- **Colaboración ciudadana** y autodeclaración de responsabilidad indicando cuando sales de casa y para qué. Así cuando vuelves a tu domicilio.

- **Tracking de tu posición** para colaborar y ayudar a las autoridades a detectar dónde pueden estar los focos de contagio.

- Autocuestionario para **descongestión del 112 o 061** o número de asistencia para el COVID-19.  Mediante un cuestionario permite determinar si necesita llamar o no a un número de emergencia.

Debe servir también para tener datos directamente del seguimiento de pacientes que han sido enviados a casa con síntomas leves pero con indicaciones de seguimiento por si empeoran.

## Pantallas

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen1.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen2.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen3.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen4.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen5.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen6.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen7.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen8.png" width="250">

<img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/open-coronavirus.gif" width="250">

## Hoja de ruta y características en el futuro

1. Cuando hayan test Dx poder **solicitar el test del COVID-19** a partir del mismo cuestionario de preguntas y tener los resultados en 24hrs directamente en la APP.

2. Identificación del ciudadano si está verde (desinfectado) / amarillo (cuarentena 7 días) / rojo (infectado o cuarentena 14 días) para **permitir una movilididad controlada de los ciudadanos** en un futuro y evitar contagios/brotes

![Identificación del ciudadano](screenshots/identificacion-ciudadanos.png?raw=true "Identificación del ciudadano")

## Estructura del Proyecto

El proyecto está dividido de la siguiente forma:

- `server` - Servidor NODE (Loopback)
- `app` - Código de la App (Ionic)

La app compila tanto para Android como para iOS.

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

## Por qué hemos hecho Open Coronavirus

No pretendemos publicar esta APP, puesto que ha de ser el Ministerio u organismo pertinente quien lo haga. Nos consta [que el gobierno está impulsado un desarrollo como éste](https://elpais.com/tecnologia/2020-03-16/el-gobierno-impulsa-una-aplicacion-inspirada-en-el-exito-de-corea-del-sur-para-combatir-el-coronavirus.html) pero dado que la velocidad es clave, ponemos este código a disposición de los organismos relevantes por si les fuera de utilidad.

Dada la urgencia de la situación actual toda ayuda es poco. Por eso hemos diseñado y programado el core básico de una App 100% funcional que pueda dar respuesta a algunas necesidades del ciudadano durante el periodo de cuarentena.

El diseño es suficientemente flexible para que añadir o modificar funcionalidades sea fácil y rápido, que es lo que ahora necesitamos.

Esta aplicación pretende ser de ayuda a los ciudadanos y poder hacer frente a la pandemia.

Sé responsable. Entre todos, ¡venceremos al virus!
\#yomequedoencasa


## Propósito de la APP

Ayudar a luchar contra el virus COVID-19.
Poder servir de ayuda al Ministerio u organismo pertinente con la pandemia.
La APP sólo tiene sentido con la coordinación de estos estamentos.

La APP debe permitir la geolocalizacion y monitorización de los pacientes con sospecha o infectados, no debe ser algo voluntario. Una APP de uso obligatorio integrado con los sistemas centrales sanitarios, por ejemplo: Abucasis.

La APP serviría de identificación para los ciudadanos mediante QR.

Es una posterior fase, conforme se consiga aumentar el suministro de **test Dx** a mayor numero de población se podría realizar una estrategia racional para poder levantar cuarentena según la identificación sin el riesgo de volver a generar otro brote de la pandemia.

Dichos test podrían ser solicitados desde la propia APP así como ver los resultados una vez entregados agilizando el sistema sanitario.


## Documentación

A nivel de documentación podemos observar cómo las aplicaciones han ayudado a otros países a hacer frente a la pandemia.
Recogemos enlaces y documentación de interés como base de la necesidad de contar con una aplicación con estas características/funcionalidades.

### Corea del Sur
Es conocida la estrategia de Corea del Sur a luchar contra el COVID-19 y su gran éxito en la gestión de la pandemia.
Siendo uno de los paises con más contagios con un índice de mortandad de **0,6%**.

El Ministerio de Sanidad de Corea ha creado un registro en internet en el que cada persona con síntomas introduce su información personal y procede a recibir una cita para ser examinado. Han realizado más de **230.000 test Dx (20.000 / día)** mediante un una especie de "drive through" especializado donde el ciudadano en menos de 10 minutos va al lugar en concreto y realiza el test.

Las nuevas tecnologías también están desempeñando un papel clave en la gestión de la epidemia. 

Mediante una APP se identifican a los ciudadanos que responden a un cuestionario diario sobre si hay o no síntomas; si los hay, se remite al usuario al sistema de atención telefónica que gestiona para el test. Descongestionando así el sistema sanitario.

Se envían a estas aplicaciones notificaciones diarias cuando se ha detectado un caso en su zona y enlaza a información detallada sobre los últimos lugares por los que pasó el contagiado. Esto no se hace para que la gente evite ir a esos sitios (que enseguida son desinfectados) sino para que aquellos que los hayan visitado estén más alerta por si detectan síntomas.

Otra “app” simplemente alerta a funcionarios públicos cuando alguien que está en cuarentena por posible contagio sale de la zona de aislamiento.

Noticias al respecto:
- https://www.bbc.com/mundo/noticias-internacional-51836302
- https://elpais.com/tecnologia/2020-03-13/corea-del-sur-contra-el-coronavirus-tecnologia.html
- https://www.lavanguardia.com/vida/20200316/474191370262/coronavirus-corea-del-sur-metodo.html
- https://www.libremercado.com/2020-03-13/el-milagro-de-corea-del-sur-la-estrategia-con-la-que-esta-acorralando-al-coronavirus-1276653794/
- https://gacetamedica.com/profesion/coronavirus-la-app-con-la-que-corea-del-sur-esta-consiguiendo-frenar-la-curva/


### Israel
En Israel se están poniendo medidas de control mediante tecnología para vigilar el movimiento de los infectados e incluso están visitando casa por casa para controlar la pandemia.

Identificación y geolocalización.

Noticias al respecto:
- https://elpais.com/sociedad/2020-03-17/israel-recurre-al-espionaje-para-vigilar-los-movimientos-de-los-infectados-por-coronavirus.html

### Alemania
En Alemania están consiguiendo también una tasa de mortalidad menor gracias a la preventiva y control con los test DX

Noticias al respecto:
- https://www.abc.es/sociedad/abci-coronavirus-alemania-menos-mortalidad-202003171252_noticia.html


### Italia
En Italia han habilitado la autodeclaración para salir del domicilio aceptando y firmando que cumples con la normativa.
Desde la web del gobierno italiano solicitas un el documento de autodeclaración
https://www.interno.gov.it/it

El documento en cuestión: 
https://www.interno.gov.it/sites/default/files/allegati/modulo_autodichiarazione_10.3.2020.pdf

El poder hacerlo de forma digital, desde el móvil y sin papel agilizaría mucho la situación.
La identificación vuelve a ser primordial.

Noticias al respecto:
- https://www.levante-emv.com/comunitat-valenciana/2020/03/14/salvoconducto-italiano-salir-casa/1989573.html
- https://www.cope.es/actualidad/internacional/noticias/asi-documento-que-los-italianos-ven-obligados-llevar-para-moverse-ante-crisis-del-coronavirus-20200312_644977
- https://www.infobae.com/america/mundo/2020/03/09/italia-intenta-aislar-los-focos-del-coronavirus-con-controles-arrestos-y-multas/
- https://www.larazon.es/internacional/20200313/rtyph6dtmvhitf7scd6lb4okhe.html


### España
Además de todas las medidas anunciadas también se requiere de la identificación en situaciones para la vida diaria.

En la frontera y otros controles se está solicitando la identificación a ciudadanos.

Asimismo las Cámaras de Comercio y Federaciones de Empresarios están promoviendo el certificado acreditativo laboral que demuestra la relación empresa-trabajador para simplificar el diálogo con las autoridades en caso de ser parado a pesar que en el Real decreto 463/2020 no especifica la obligatoriedad del mismo.

La identificación vuelve a ser primordial.

Noticias al respecto:
- https://www.iberley.es/formularios/certificado-acreditativo-individual-necesidad-desplazamiento-personal-motivos-laborales-94195
- https://www.adegi.es/adegi/coronavirus-modelo-certificado-circulacion-losas-trabajadoreas-por-vias-uso-publico/#
- https://www.elcomercio.es/sociedad/trabajadores-deberan-presentar-20200316001223-ntvo.html?ref=https%3A%2F%2Fwww.google.com%2F
- https://www.lne.es/sociedad/2020/03/16/trabajadores-autonomos-tendran-certificado/2612788.html




## Datos personales

La APP no está publicada y una de las cosas que habría que hacer antes de publicarla es adecuarla a la regulación de tratamiento de datos personales.

## Cómo colaborar

PRs bienvenidos.

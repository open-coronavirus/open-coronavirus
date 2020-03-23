<img src="https://github.com/open-coronavirus/open-coronavirus/blob/master/screenshots/logo-opencoronavirus.png?raw=true" width="350" />


# ¿Qué es Open Coronavirus?

La disponibilidad de una vacuna eficaz pueda demorarse de manera indefinida hasta
posiblemente 18 meses, lo que obliga a medidas de cuarentena -a día de hoy de carácter
general a toda la población. A su vez, las autoridades sanitarias están contemplando que
se pueda realizar test diagnósticos a nivel poblacional pudiendo llevar a cabo un control
epidemiológico adecuado.

El proyecto **Open Coronavirus** ofrece, para dicho intervalo de tiempo, una solución digital
de **monitorización, diagnóstico y contención de los contagios de SARS-CoV-2** que
permite aplicar de manera controlada las medidas de cuarentena en los focos o puntos
calientes, minimizando así la cuarentena general de la población, reduciendo la
sobrecarga de los sistemas sanitarios y facilitando al mismo tiempo la reanudación
progresiva de la actividad cotidiana en el menor tiempo posible.

El sistema contará con 3 aplicativos:

- **App Ciudadano**. Aplicación mobile para la colaboración ciudadana y control de la propagación del
SARS-CoV-2.

    Desde la aplicación **se solicitará un test diagnóstico y ver los resultados del mismo.**
Se almacenará todo movimiento del ciudadano para controlar posibles contagios y
cercar el ámbito de acción del SARS-CoV-2 desde las autoridades sanitarias.

    Servirá como **identificación del ciudadano mediante códigos QR.**

- **Software de control datos** donde las autoridades sanitarias y de control
epidemiológico podrán consultar y detectar los movimientos del SARS-CoV-2.

    Desde el software se podrán ver los focos de contagio, el cumplimiento de la
cuarentena obligatorio para contagiados o posibles contagiados.

- **App Autoridades.** Aplicación mobile para que las autoridades pertinentes puedan leer los QR de
identificación del ciudadano en los entornos que se decidan así como monitorizar
su movilidad.

| ![Apps Open Coronavirus](https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/wiki-apps.jpg) | 
|:--:| 
| *Ejemplo de las 3 aplicaciones para distintos tipos de usuarios* |


> **Importante** Un equipo de expertos en investigación médica y bioética de la **Universidad de Oxford** explica la necesidad de tener una app de estas características:
http://www.ox.ac.uk/news/2020-03-17-infectious-disease-experts-provide-evidence-coronavirus-mobile-app-instant-contact



Para más información puedes consultar la [wiki del proyecto](https://github.com/open-coronavirus/open-coronavirus/wiki):

* [01. Descripción funcional](https://github.com/open-coronavirus/open-coronavirus/wiki/01.-Descripci%C3%B3n-funcional-de-procesos)
  * [01.01. Test diagnóstico SARS CoV 2](https://github.com/open-coronavirus/open-coronavirus/wiki/01.01.-Test-diagn%C3%B3stico-SARS-CoV-2)
  * [01.02. Resultados tests diagnósticos](https://github.com/open-coronavirus/open-coronavirus/wiki/01.02.-Resultados-tests-diagn%C3%B3sticos)
  * [01.03. Control del SARS CoV 2](https://github.com/open-coronavirus/open-coronavirus/wiki/01.03.-Control-del-SARS-CoV-2)
  * [01.04. Control de la cuarentena](https://github.com/open-coronavirus/open-coronavirus/wiki/01.04.-Control-de-la-cuarentena)
* [02. Consideraciones legales](https://github.com/open-coronavirus/open-coronavirus/wiki/02.-Consideraciones-legales)
* [03. App Ciudadanos](https://github.com/open-coronavirus/open-coronavirus/wiki/03.-App-Ciudadanos)
* [04. Software central de datos](https://github.com/open-coronavirus/open-coronavirus/wiki/04.-Software-central-de-datos)
* [05. App Autoridades](https://github.com/open-coronavirus/open-coronavirus/wiki/05.-App-Autoridades)

* [06. Idiomas](https://github.com/open-coronavirus/open-coronavirus/wiki/06.-Idiomas)


| ![Ejemplo funcionando de la APP del ciudadano](https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/open-coronavirus.gif) | 
|:--:| 
| *Ejemplo funcionando de la APP del ciudadano* |


## ¿Por qué hemos hecho Open Coronavirus?

**No pretendemos publicar esta APP**, puesto que ha de ser el Ministerio u organismo pertinente quien lo haga. Nos consta [que el gobierno está impulsado un desarrollo como éste](https://elpais.com/tecnologia/2020-03-16/el-gobierno-impulsa-una-aplicacion-inspirada-en-el-exito-de-corea-del-sur-para-combatir-el-coronavirus.html) pero dado que la velocidad es clave, ponemos este código a disposición de los organismos relevantes por si les fuera de utilidad.

Dada la urgencia de la situación actual toda ayuda es poco. Por eso hemos diseñado y programado el core básico de un proyecto cons apps 100% funcional que pueda dar respuesta a algunas necesidades del ciudadano durante el periodo de cuarentena.

El diseño es suficientemente flexible para que añadir o modificar funcionalidades sea fácil y rápido, que es lo que ahora necesitamos.

Esta aplicación pretende ser de ayuda a los ciudadanos y poder hacer frente a la pandemia.

Sé responsable. Entre todos, ¡venceremos al virus!
\#yomequedoencasa


## Consideraciones legales

**El proyecto no está publicado** y una de las cosas que habría que hacer antes de publicarla es adecuarla a la regulación de tratamiento de datos personales.

**El proyecto se ofrece a cualquier Ministerio de Sanidad, administración estatal o autonómica competente** para su puesta en marcha. Se harán cargo de la difusión de la app y del tratamiento de los datos que se obtengan, el uso de la app sería de acuerdo a la Ley RGPD.

Los datos que se recaben deberán gestionarse de conformidad con la ley en cuanto a la medidas de seguridad de su almacenamiento, plazo máximo de custodia y almacenamiento, e información al usuario de sus derechos (especialmente de finalidad y revocación del consentimiento).

Así mismo, pese a que esta app solicita al usuario su consentimiento, también el RGPD contiene excepciones a la necesidad de recabar el consentimiento previo al tratamiento de datos, en el caso de epidemia o de protección de la salud de las personas en base al interés general, que es la situación en la que nos encontramos. El escenario en el que se centra este informe es el de que las autoridades sanitarias autonómicas adoptan medidas extraordinarias para la protección de la salud pública, pues es la única legitimada para adoptar este tipo de medidas.


> **Según la AEPD** Para cumplir las decisiones sobre la pandemia de coronavirus que adopten las autoridades competentes, en particular las sanitarias, la normativa de protección de datos no debería utilizarse para obstaculizar o limitar la efectividad de las medidas que adopten dichas autoridades, en la lucha contra la pandemia.
> La normativa de protección de datos permite adoptar las medidas que sean necesarias para salvaguardar los intereses vitales de las personas físicas, el interés público esencial en el ámbito de la salud, la realización de diagnósticos médicos, o el cumplimiento de obligaciones legales en el ámbito laboral, incluido el tratamiento de datos de salud sin necesidad de contar con el consentimiento explícito el afectado.
> En todo caso, el tratamiento de estos datos debe observar los principios establecidos en el RGPD, en particular los de minimización, limitación de la finalidad y minimización de la conservación.


## Estructura del Proyecto

El proyecto está dividido de la siguiente forma:

- `server` - Servidor NODE (Loopback)
- `app-citizen` - Código de la App Ciudadanos (Ionic)
- `dashboard` - Código del dashboard web donde hacer el análisis de datos (Angular) _(próximamente)_ 
- `app-police` - Código de la App Autoridades (Ionic)

La app compila tanto para Android como para iOS.

### El servidor

Para ejecutar el servidor necesitas una base de datos mongoDB y ajustar la configuración de .env.dev o .env.production según.

Luego tendrás que descargar todas las dependencias usando

```
cd server
npm install
```

Finalmente para ejecutar el servidor usa

```
npm start
```

### La App Ciudadano

La App está hecha con el framework ionic. Tendrás que instalar el cliente usando

```
npm install -g @ionic/cli
```

También tendrás que descargar todas las dependencias usando

```
cd app
npm install
```

Luego para ejecutarlo usa

```
ionic serve
```

Esto permite ejecutar la app en un browser. 


## Pantallas de la App del ciudadano (elemento principal del proyecto)


| | | |  
|:--:|:--:| :--:|  
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen1.png" alt="Pantalla 1" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen2.png" alt="Pantalla 2" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen3.png" alt="Pantalla 3" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen4.png" alt="Pantalla 4" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen5.png" alt="Pantalla 5" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen6.png" alt="Pantalla 6" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen7.png" alt="Pantalla 7" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen8.png" alt="Pantalla 8" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen-9.jpg" alt="Pantalla 9" width="250"/>
| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen-10.jpg" alt="Pantalla 10" width="250"/>


## Licencia

[Licencia MIT](license.md)


## Cómo colaborar

PRs bienvenidos.

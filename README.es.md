<img src="https://github.com/open-coronavirus/open-coronavirus/blob/master/screenshots/logo-opencoronavirus.png?raw=true" width="600" />



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

El sistema contará con varios aplicativos:

- **App Ciudadano**. Aplicación mobile para la colaboración ciudadana y control de la propagación del
SARS-CoV-2.

    Desde la aplicación **se solicitará un test diagnóstico y ver los resultados del mismo.** Servirá como identificación del ciudadano **mediante códigos QR** que determinará este estado.

    Se almacenará en el dispositivo de cada ciudadano (sistema descentralizado) con **quién has estado cerca de forma anónima** a partir de la información obtenida por **Bluetooth Low Energy**.

    De esta forma controlar posibles contagios y cercar el ámbito de acción del SARS-CoV-2 desde las autoridades sanitarias.

    La APP está pensada como **INCENTIVO** (te informa, etc.) no como una obligación.

- **Software de control datos (próximamente)** donde las autoridades sanitarias y de control
epidemiológico podrán consultar y detectar posibles contagios del SARS-CoV-2.

- **App Autoridades (beta).** Aplicación mobile para que las autoridades pertinentes puedan leer los QR de
identificación del ciudadano en los entornos que se decidan así como monitorizar
su movilidad.

   _Aplicación secundaria, no imprescindible para el control de la propagación del SARS-CoV-2._ 


- **App Sanitarios (beta).** Aplicación mobile para que los sanitarios puedan introducir los resultados de los tests diagnósticos.

   _Aplicación secundaria, no imprescindible para el control de la propagación del SARS-CoV-2._


> **Importante** Un equipo de expertos en investigación médica y bioética de la **Universidad de Oxford** explica la necesidad de tener una app de estas características:
http://www.ox.ac.uk/news/2020-03-17-infectious-disease-experts-provide-evidence-coronavirus-mobile-app-instant-contact


Web oficial: [https://opencoronavirus.app/](https://opencoronavirus.app/)

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




## ¿Por qué hemos hecho Open Coronavirus?

**No pretendemos publicar esta APP**, puesto que ha de ser el Ministerio u organismo pertinente quien lo haga. Nos consta [que el gobierno está impulsado un desarrollo como éste](https://elpais.com/tecnologia/2020-03-16/el-gobierno-impulsa-una-aplicacion-inspirada-en-el-exito-de-corea-del-sur-para-combatir-el-coronavirus.html) pero dado que la velocidad es clave, ponemos este código a disposición de los organismos relevantes por si les fuera de utilidad.

Dada la urgencia de la situación actual toda ayuda es poco. Por eso hemos diseñado y programado el core básico de un proyecto con apps 100% funcional que pueda dar respuesta a algunas necesidades del ciudadano durante el periodo de cuarentena.

El diseño es suficientemente flexible para que añadir o modificar funcionalidades sea fácil y rápido, que es lo que ahora necesitamos.

Esta aplicación pretende ser de ayuda a los ciudadanos y poder hacer frente a la pandemia.

Sé responsable. Entre todos, ¡venceremos al virus!
\#yomequedoencasa

## ¿Cómo funciona el sistema de seguimiento de contagios basado en Bluetooth Low Energy?

La APP utiliza la tecnología **Bluetooth Low Energy** mediante la cual se hace seguimiento de posibles contagios de COVID-19.

Cada ciudadano tiene la aplicación instalada y con el bluetooth conectado.

El funcionamiento del sistema **Bluetooth LE** es el siguiente:

1. Cuando **dos personas estén cerca físicamente**, sus teléfonos intercambiarán unos **códigos identificadores anónimos** mediante Bluetooth LE.

   Cada móvil guarda en su memoria del teléfono estos cruces entre ciudadanos.

   El nivel de cercanía se calcula a partir de la intensidad de la señal de bluetooth.

    También se almacena el tiempo en el que has estado cerca de ese dispositivo para conocer la exposición al COVID-19 en caso de que el ciudadano padeciera la enfermedad.

    **El almacenamiento de esta información es por tiempo limitado** protegiendo aún más la privacidad del ciudadano.
    Ese tiempo es configurable en la herramienta pero **se recomienda entre 14 y 37 días** ya que es el tiempo en el que un portador diagnosticado podría haber infectado a otro individuo de COVID-19.

2. **En el caso de que una persona dé positivo por COVID-19**, la aplicación actualizará su estado QR a rojo y analizará con quién ha estado cerca.

   La persona puede decidir si **autoriza a notificar de forma anónima** a las personas con las que has estado cerca.

   El sistema subirá al servidor de forma anónima (en caso de ser autorizado) su clave y será enviada a las demás personas.

3. La app del **resto de personas descarga constantemente las claves autorizadas** que han dado positivo de COVID-19 para comprobar si han estado expuestos al virus. Este proceso se hace de **forma anónima en su mismo móvil**.

   La evaluación del riesgo se realiza según el tiempo y cercanía de exposición al COVID-19 según la recomendación europea.

   El servidor **sólo guarda claves anónimas** que han dado positivo de COVID-19 **sin ninguna relación** con las personas que han dado positivo de COVID-19.

   El servidor permite guardar los cambios de estado de una persona que se encuentra en riesgo alto.

   El **servidor nunca sabe nada**: ni la ubicación de las personas ni con quien han estado cerca.
   
  
> Para ello es fundamental que el sistema sanitario oficial de la administración o gobierno esté correctamente integrado con la aplicación. Permite la **optimización de a quién se le debe hacer test diagnóstico y control de la pandemia.**

| ![Bluetooth LE flow](https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/bluetooth-description-1-es.png) | 
|:--:| 
| *Sistema de seguimiento de contagios basado en Bluetooth Low Energy* |
| ![Bluetooth LE flow](https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/bluetooth-description-2c-es.png) | 


---

El pasado **10 de Abril de 2020 Apple y Google** hicieron [oficial un acuerdo](https://www.apple.com/newsroom/2020/04/apple-and-google-partner-on-covid-19-contact-tracing-technology/) para implementar de forma nativa a nivel del sistema operativo una tecnología de traceo de contacto mediante Bluetooth Low Energy.

Conceptualmente es similar a la estrategia utilizada en _Open Coronavirus_.

> En cuanto la API SDK esté funcionando trabajaremos para conectar nuestro sistema de bluetooth al nativo para tener un resultado incluso más óptimo.

## Consideraciones legales

**El proyecto no está publicado** y una de las cosas que habría que hacer antes de publicarla es adecuarla a la regulación de tratamiento de datos personales.

**El proyecto se ofrece a cualquier Ministerio de Sanidad, administración estatal o autonómica competente** para su puesta en marcha. Se harán cargo de la difusión de la app y del tratamiento de los datos que se obtengan, el uso de la app sería de acuerdo a la Ley RGPD.

Los datos que se recaben deberán gestionarse de conformidad con la ley en cuanto a las medidas de seguridad de su almacenamiento, plazo máximo de custodia y almacenamiento, e información al usuario de sus derechos (especialmente de finalidad y revocación del consentimiento).

Así mismo, pese a que esta app solicita al usuario su consentimiento, también el RGPD contiene excepciones a la necesidad de recabar el consentimiento previo al tratamiento de datos, en el caso de epidemia o de protección de la salud de las personas en base al interés general, que es la situación en la que nos encontramos. El escenario en el que se centra este informe es el de que las autoridades sanitarias autonómicas adoptan medidas extraordinarias para la protección de la salud pública, pues es la única legitimada para adoptar este tipo de medidas.


> El proyecto sigue las **recomendaciones de la Comisión Europea** # [Mobile applications to support contact tracing in the EU’s fight against COVID-19
Common EU Toolbox for Member States](https://ec.europa.eu/health/sites/health/files/ehealth/docs/covid-19_apps_en.pdf). Puedes ver un resumen en el pundo de la wiki que tratamos sobre: [02.-Consideraciones-legales](https://github.com/open-coronavirus/open-coronavirus/wiki/02.-Consideraciones-legales).

> **Según la AEPD** Para cumplir las decisiones sobre la pandemia de coronavirus que adopten las autoridades competentes, en particular las sanitarias, la normativa de protección de datos no debería utilizarse para obstaculizar o limitar la efectividad de las medidas que adopten dichas autoridades, en la lucha contra la pandemia.
> La normativa de protección de datos permite adoptar las medidas que sean necesarias para salvaguardar los intereses vitales de las personas físicas, el interés público esencial en el ámbito de la salud, la realización de diagnósticos médicos, o el cumplimiento de obligaciones legales en el ámbito laboral, incluido el tratamiento de datos de salud sin necesidad de contar con el consentimiento explícito el afectado.
> En todo caso, el tratamiento de estos datos debe observar los principios establecidos en el RGPD, en particular los de minimización, limitación de la finalidad y minimización de la conservación.



## Estrategia de mitigación de riesgos para maximizar la privacidad y la utilidad de los datos
Open Coronavirus se está diseñando de acuerdo con los siguientes principios:
- **Cumplimiento de los derechos de privacidad del usuario:** Creemos que nadie debería estar obligado a compartir su información personal. Por un lado, los no contagiados (es decir, aquellos que resultaron negativos) no están obligados a compartir información personal con un tercero. Por otro lado, a los diagnosticados con el SARS-CoV-2 se les pedirá que compartan información, sólo con el consentimiento previo del usuario y de manera descentralizada, encriptada y temporal para ayudar a implementar el módulo de rastreo de riesgo geoespacial, incluidas las alertas del usuario, que son necesarias para mantener una vigilancia efectiva.

- **El almacenamiento por tiempo limitado de los desplazamientos utilizados protege aún más la privacidad de los diagnósticos portadores del virus SARS-CoV-2.** En este sentido, primero sólo se debe almacenar información confidencial anónima y agregada. Además, la cantidad de tiempo adecuada para el almacenamiento de datos debe ser igual y no exceder el tiempo durante el cual un portador diagnosticado podría haber infectado a otro individuo, que para Covid-19 es entre 14 y 37 días.
- **Uso de una red distribuida** en lugar de un servidor central
- **Uso de un enfoque de código abierto** para crear una aplicación que fomente la confianza en las capacidades de protección de la privacidad de la aplicación, ya que los expertos y los medios independientes pueden acceder y evaluar el código fuente.

Los principios descritos anteriormente, aunque son técnicamente compatibles con las regulaciones actuales de privacidad de datos, están inspirados en Apps Gone Rogue: <a href="https://arxiv.org/pdf/2003.08567.pdf" target="_blank">Mantener la privacidad personal en una epidemia </a>




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

Luego para ejecutarlo usa (utiliza el parámetro de configuración para forzar la versión en español)

```
ionic serve --configuration=es
```

Esto permite ejecutar la app en un navegador. 

Para probar la aplicación en un dispositivo real como un iPhone o un teléfono Android, ejecuta el siguiente comando:

```
ionic capacitor run ios --livereload --external --host=<server-ip>
```

Simplemente determina la IP de red del host donde ionic está ejecutando el servidor http y reemplázalo en el parámetro --host.


## Pantallas de la App del ciudadano (elemento principal del proyecto)


| | | |  
|:--:|:--:| :--:|  
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen1-es-3.jpg" alt="Pantalla 1" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen2-es-3.jpg" alt="Pantalla 2" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen3-es-3.jpg" alt="Pantalla 3" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen4-es-3.jpg" alt="Pantalla 4" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen5-es-3.jpg" alt="Pantalla 5" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen6-es-3.jpg" alt="Pantalla 6" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen7-es-3.jpg" alt="Pantalla 7" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen8-es-3.jpg" alt="Pantalla 8" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen9-es-3.jpg" alt="Pantalla 9" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen10-es-3.jpg" alt="Pantalla 10" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen11-es-3.jpg" alt="Pantalla 11" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen12-es-3.jpg" alt="Pantalla 12" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen13-es-3.jpg" alt="Pantalla 13" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen14-es-3.jpg" alt="Pantalla 14" width="250"/>| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen15-es-3.jpg" alt="Pantalla 15" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen16-es-3.jpg" alt="Pantalla 16" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen17-es-3.jpg" alt="Pantalla 17" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen18-es-3.jpg" alt="Pantalla 18" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen19-es-3.jpg" alt="Pantalla 19" width="250"/> | <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen20-es-3.jpg" alt="Pantalla 20" width="250"/>| <img src="https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/screen21-es-3.jpg" alt="Pantalla 21" width="250"/>
| <img src="https://raw.githubusercontent.com/aparraga/open-coronavirus/master/screenshots/screen22-es-3.jpg" alt="Pantalla 22" width="250"/> ||

## Más información

- Conferencia: **Open Coronavirus. Digital Solution for monitoring, diagnosing and containing SARS-COV-2 infection** por Aurelia Bustos en el 1º Congreso Anban de Inteligencia Artificial y Big Data contra el COVID-19
    https://www.youtube.com/watch?v=qLDpcljJRyM&feature=youtu.b
    
- Transparencias oficiales: https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/info/Open-Coronavirus-es.pdf


## Licencia

[Licencia MIT](license.md)


## Agradecimientos especiales

> Agradecimiento especial a **Trayma Traducciones** por las traducciones al inglés

> Agradecimiento especial a **Alex Nogues** por las traducciones al inglés de la wiki

> Agradecimiento especial a **Marc Mauri** por las traducciones al catalán

> Agradecimiento especial a **Yaiza Berenguer** por las traducciones al francés

> Agradecimiento especial a **Laura Gea** por las traducciones al italiano

> Agradecimiento especial a **Ma. Amparo Aymerich** por las traducciones al alemán


## Cómo colaborar

PRs bienvenidos.

Espacio de Slack: [slack://opencoronavirus.slack.com](slack://opencoronavirus.slack.com)

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

El sistema contará con 3 aplicativos:

- **App Ciudadano**. Aplicación mobile para la colaboración ciudadana y control de la propagación del
SARS-CoV-2.

    Desde la aplicación **se solicitará un test diagnóstico y ver los resultados del mismo.** Servirá como identificación del ciudadano **mediante códigos QR** que determinará este estado.

    Se almacenará en el dispositivo de cada ciudadano los **cruces con otros ciudadanos de forma anónima** a partir de la información obtenida por **Bluetooth Low Energy**.

    De esta forma controlar posibles contagios y cercar el ámbito de acción del SARS-CoV-2 desde las autoridades sanitarias.

    La APP está pensada como **INCENTIVO** (te informa, etc.) no como una obligación.

- **Software de control datos (próximamente)** donde las autoridades sanitarias y de control
epidemiológico podrán consultar y detectar posibles contagios del SARS-CoV-2.

- **App Autoridades.** Aplicación mobile para que las autoridades pertinentes puedan leer los QR de
identificación del ciudadano en los entornos que se decidan así como monitorizar
su movilidad.

| | 
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

1. Cuando **dos ciudadanos estén cerca físicamente**, sus teléfonos intercambiarán unos **códigos identificadores anónimos** mediante Bluetooth LE.
Cada móvil guarda en su memoria del teléfono estos cruces entre ciudadanos.

    El nivel de cercanía se calcula a partir de la intensidad de la señal de bluetooth.
También se almacena el tiempo en el que has estado cerca de ese dispositivo para conocer la exposición al COVID-19 en caso de que el ciudadano padeciera la enfermedad.

    **El almacenamiento de esta información es por tiempo limitado** protegiendo aún más la privacidad del ciudadano.
    Ese tiempo es configurable en la herramienta pero **se recomienda entre 14 y 37 días** ya que es el tiempo en el que un portador diagnosticado podría haber infectado a otro individuo de COVID-19.

2. **En el caso de que un ciudadano dé positivo por COVID-19**, la aplicación actualizará su estado QR a rojo y analizará los posibles cruces de cercanía con otros ciudadanos.

    El sistema **subirá al servidor estos cruces de ciudadanos en los cuales se haya podido producir un posible contagio** y a estos ciudadanos les notificará vía push para que sean conscientes del riesgo y/o vuelvan ha realizarse un test diagnóstico.

> Para ello es fundamental que el sistema sanitario oficial de la administración o gobierno esté correctamente integrado con la aplicación.

| ![Bluetooth LE flow](https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/screenshots/bluetooth-description-1-es.png) | 
|:--:| 
| *Sistema de seguimiento de contagios basado en Bluetooth Low Energy* |

---

El pasado **10 de Abril de 2020 Apple y Google** hicieron [oficial un acuerdo](https://www.apple.com/newsroom/2020/04/apple-and-google-partner-on-covid-19-contact-tracing-technology/) para implementar de forma nativa a nivel del sistema operativo una tecnología de traceo de contacto mediante Bluetooth Low Energy.

Conceptualmente es similar a la estrategia utilizada en _Open Coronavirus_.

> En cuanto la API SDK esté funcionando trabajaremos para conectar nuestro sistema de bluetooth al nativo para tener un resultado incluso más óptimo.

## Consideraciones legales

### Protección de datos

**El proyecto no está implementado** pero su elaboración se lleva a cabo teniendo en cuenta desde el inicio la privacidd: pivacidd desde el diseño y por defecto, como exige el [artículo 25 del RGPD](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679#025), aseguradno pese a ser un proyecto altruista la participación de un Delegado de Protección de Datos como experto que asesora y supervisa las decisiones técnicas desde un punto de vista legal. Eso facilitará posteriormente la puesta en producción con plenas garantías.

Será **responsable del tratamiento** de los datos personales respecto de cada instancia de este proyecto, la Administración Pública que lo ponga en marcha.

La **finalidad del tratamiento** es facilitar la colaboración entre ciudadanos y equipos de trazabilidad de la infección de COVID19. El tratamiento es legítimo la tener como finalidades la protección de intereses vitales del interesado y de otras personas, así como por realizarse para el cumplimiento de una misión realizada en interés público y en el ejercicio de poderes públicos conferidos al responsable del tratamiento, [letras d) y e) del ordinal 1 del artículo 6 RGPD](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679#006);

**minimización de datos** El único dato tratado es la identificación aleatoria y cambiante respecto del dispositivo del usuario. Se cumple con ello el principio de minimización de datos del [artículo 5.1.c del RGPD](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX%3A32016R0679#005).

**Obtención de datos:** Los datos son obtenidos a través del dispositivo bluetooth del móvil del usuario, desde el momento en que instala la aplicación. El usuario podrá impedir la cesión de dichos datos mediente la desinstalación de la aplicación.

**Almacenamiento de datos:** Los datos se almacenan cifrados en los dispositivos de los usuarios. En cada dispositivo se almacena con la clave de cifrado de la autoridad, de tal manera que los usuarios que reciben los datos de otros no tienen acceso a los mismos. Tampoco tiene acceso la autoridad, en tanto ǎrece de acceso físico a los dispotivos de los usuarios. Adicionalmente, y dado que cada usuario va cambiando aleatoriamente su identificador en el tiempo, no es posible identificar a un usuario con la lectura de dichos datos.

**Medidas de seguridad:** Además del **cifrado** de datos, el contenido de éstos no revela la identidad de ningún usuario, gracias al continuo cambio de su identificador. Con ello se permite la **disociación de los datos en origen**, de tal manera que es necesario el dispositivo móvil del interesado para acreditar ser la persona referida por cada uno de los identificadores. No hay manera de conocer la identidad de la persona sin dicho identificador. Se ha tenido en cuenta que la recepción de los datos de nuevos contagiados y, por consiguiente, de sus listas de contactos, se haga con get mejor que con push (para evitar el uso de plataformas de empresas de minería de datos, que pueden además monitorizar las reaccciones frente a determinadas informaciones), y en cualquier caso impidiendo que los operadores conozcan los identificadores de ningún usuario, ni si quiera después de revelarlos a las Autoridades en caso de resultar contagiado. El tratamiento, realizado en ls teléfonos de lo usuarios es auditable al ser código abierto, y se implementan redes distriuidas, no dependiendo de ningún nodo central. 

**Cesiones de datos:** Los únicos datos que se tienen del usuario son los identificadores que su móvil ha generado. Estos se almacenan en los dispositivos de los otros usuarios que hayan estado suficientemente cerca y por el tiempo necesario para ser considerado como una situación de riesgo de contagio. Los otros no tienen acceso a dichos datos, al estar cifrados para la autoridad. Esos datos pdr´an ser revelados exclusivamente al responsable de tratamiento, que los divulgará a los efectos de que la aplicación instalada en el móvil del titular pueda conocer su situación de riesgo (aparecen listados los códigos usados por ella) y, a partir de ahí, iniciar las acciones recomendadas para verificar o descartar el posible contagio.

En la implementación futura deberá tenerse en cuenta las siguientes cuestiones, que garanticen, en un entorno altamente controlado por grandes empresas que hacen uso intenso de la minería de datos y del perfilado de usuarios, que sólo el titular tenga acceso a la información:
- Distribución de la App: puede colocarse en los _stores_ de las distintas plataformas, pero también ser distribuída directamente desde la web de la Administración u otros repositorios alternativos.
- Que los servicios de distribución de las listas de situaciones de riesgo se realice por canales seguros, dsde servidores controlados por elresponsable del tratamiento, y sin hacer uso de medios de tracking o estadística que supongan cesiones de datos a terceros, salvo cuando éstos sean exclusivamente  

#### Derechos de los usuarios en lo relativo a la protección de sus datos de carácter personal:

El RGPD otorga al titular los derechos de acceso, rectificación, supresión, limitación, oposición y portabilidad. Dado que los datos identifican al titular sólo mientras conserve la instalación de la aplicación en su dispositivo, para su sjercicio basta con eliminar la misma. El usuario puede exportar la lista de sus identificadores en texto separado por comas, lo que le posibilita importarlos en otra aplicación de análogas funcionalidades.

No obstante puede ponerse en contacto con el Delegado de Protección de Datos de la aplicación en desarrolo en el correo luis.fajardo@fajardolopez.com (puede cifrar el ensaje con GPG/PGP. Id de clave: 5EDEC427 Huella digital: 234C BC21 B774 8D39 833B 9CB2 77EC 086F 5EDE C42).Esta cláusula deberá adaptarse en caso de puesta en producción, para sustituirla o añadir la del DPD del responsable del tratamiento.

También puede acudir directamente ante ante la Autoridad de Protección de Datos de su país [[Europa](https://edpb.europa.eu/about-edpb/board/members_es) - [Iberoamérica](https://www.redipd.org/es)].

### Reutilización del softare
**El proyecto se ofrece a cualquier Administración Pública** para su puesta en marcha. Se harán cargo de la difusión de la app y del tratamiento de los datos que se obtengan al menos con las garantías de privacidar referidas en este documento, y en todo caso de acuerdo al RGPD, aún si no resultare de aplicación.

Los datos que se recaben deberán gestionarse de conformidad con la ley en cuanto a las medidas de seguridad de su almacenamiento, plazo máximo de custodia y almacenamiento, e información al usuario de sus derechos (especialmente de finalidad y revocación del consentimiento).

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
    
- Transparencias oficiales: https://raw.githubusercontent.com/open-coronavirus/open-coronavirus/master/info/Open-Coronavirus.pdf


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

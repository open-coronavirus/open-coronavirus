# Estructura de BBDD

## ​Tabla PATIENTS
Tabla donde se almacenan los registros de los pacientes / ciudadanos que utilizan la APP.

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| id |  string | Identificador del usuario|
| firstName |    string   |   Nombre del usuario |
| lastName | string |   Apellidos del usuario |
| documentNumber | string |   Documento identificativo del usuario |
| healthInsuranceCardNumber | string |   Tarjeta sanitaria del usuario |
| birthdate | date |   Fecha de nacimiento |
| gender | numeric |   Género del usuario |
| street | string |   Dirección del domicilio |
| apartment | string |   Número de la dirección del domicilio |
| postalCode | string |   Código postal de la dirección del domicilio |
| email | string |   Email del usuario |
| status | numeric |   Estado del paciente: POSITIVO, NEGATIVO, CUARENTENA, INMUNE |
| statusDate | date |   Fecha de actualización del estado del usuario |
| phone | string |   Teléfono del usuario |
| serviceAdvertisementUUID | string |   No se utiliza en versión actual descentralizada |
| appId | string |   No se utiliza en versión actual descentralizada |
| created | date |   Fecha de creación del registro |
| updated | date |   Fecha de actualización del registro |
| autoshare | boolean |   Confirmación del usuario a compartir su código anónimo con el resto de los usuarios en caso de dar positivo de COVID-19 |

## Tabla INFECTED_KEYS
Tabla donde se almacenan los códigos de los usuarios que han dado positivo de COVID-19
y han autorizado compartir con el resto de usuarios su código anónimo.

Como se puede apreciar no existe ninguna relación con la tabla PATIENTS con lo que no se
almacena una relación de la clave de encriptación anónima con el usuario que la ha
generado.

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| id |  string | Identificador del registro|
| key |  string | Clave de encriptación única y anónima del usuario que ha dado positivo en COVID-19|
| keyDate |  date | Fecha y hora de generación de la clave en el móvil local. Fecha y hora de generación de la clave en el móvil local.|
| created |  date | Fecha de creación del registro|

## Tabla INFECTION_EXPOSURE
Tabla donde se almacenan las exposiciones que ha tenido un usuario con pacientes que
han dado positivo con COVID-19.

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| id |  string | Identificador del registro|
| patientID |  string | Paciente que ha estado a expuesto|
| rssi |  numeric | Nivel de cercanía de la señal RSSI del Bluetooth para el cálculo de distancia entre dispositivos|
| timestampFrom |  numeric | Representa la fecha de inicio y hora de la exposición|
| timestampTo |  numeric | Representa la fecha de fin y hora de la exposición|
| anonymizedInfectedUUID |  string | Identificador único que anonimiza al paciente con el que ha estado expuesto para conocer si varias exposiciones pertenecen al mismo paciente. En ningún momento se conoce qué paciente real ha estado expuesto. No lo conoce ni el sistema.|
| created | date | Fecha de creación del registro|

## Tabla INSTALLATION
Tabla donde se almacenan las instalaciones de las apps

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| id |  string | Identificador del registro|
| deviceId |  string | Identificador que representa el móvil único|
| pushRegistrationId |  string | Identificador le da el servidor de PUSH a cada instalación para luego poder enviarle mensajes PUSH|
| patientId |  string | Paciente al que corresponde al móvil|
| created |  date | Fecha de creación del registro|

## Tabla TEST_QUESTIONS

Tabla donde de almacenna los cuestionarios auto-evaluación y de seguimiento de la salud

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| id |  string | Identificador del registro|
| questionId |  string | Identificador que representa a cada pregunta|
| title |  string | Título de la página donde aparece cada pregunta|
| subtitle |  string | Subtítulo, como explicación asociada a la pregunta. Ver abajo el ejemplo|
| multicheck |  boolean | Si el usuario puede marcar mas de una respuesta o no|
| target |  string | A donde dirigir al usuario cuando responde la pregunta. Normalmente corresponde con el identificador de otra pregunta. Si asociado a una posible respuesta hay un atributo target, este tiene preferencia sobre el valor de este campo.|
| question |  string | El texto de la pregunta en sí|
| children |  object | Las posibles respuestas así como las acciones asociadas a marcar cada respuesta|

La estructura del objeto children es la siguiente:

| campo   |      tipo de dato      |  descripción |
|----------|-------------|-------------------------|
| option |  string | El texto asociado a la respuesta|
| value | numeric | El score asociado a cada respuesta que servirá para luego para evaluar en base a la suma de los scores de todas las respuestas|
| target |  string | A donde dirigir al usuario cuando responde la pregunta. Normalmente corresponde con el identificador de otra pregunta|

Un ejemplo de pregunta sería así:

```
  {
    "id": "5e75112f7c36a55f5c6efe3a",
    "questionId": "question0",
    "title": "Autotest",
    "subtitle": "<p><ul><li>Dificultad severa para respirar (por ejemplo, sensación de asfixia, hablar en palabras entrecortadas, falta de aire en reposo o con mínimos movimientos)</li><li>Dolor severo en el pecho al respirar</li><li>Confusión (por ejemplo, inseguro de dónde se encuentra) o ha sufrido pérdida del conocimiento</li><li>Fiebre > 38º durante más de 1 día</li></ul></p>",
    "multicheck": false,
    "question": "¿Tiene alguno de los siguientes síntomas?",
    "children": [
      {
        "option": "SI",
        "value": 100,
        "target": "testresult"
      },
      {
        "option": "NO",
        "target": "question1_1"
      }
    ]
  }
```

Hay un cuestionario completo en el fichero test-questions.json


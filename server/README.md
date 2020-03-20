# coronavirus-server

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

Example of questionnaire (TestQuestion table):

```

/* 1 */
{
    "_id" : ObjectId("5e75112f7c36a55f5c6efe3a"),
    "questionId" : "question0",
    "title" : "¿Cómo te encuentras?",
    "subtitle" : "<p>Ante cualquier síntoma coronavirus, es habitual que se genere incertidumbre, inquietud e intranquilidad.</p><p><strong>¿Porqué no voy a urgencias y que me vea un médico?</strong> Para <strong>evitar el colapso</strong> de los medios que tenemos para luchar con el virus. <strong>Estás más seguro en casa</strong>, salvo que alguien capacitado te indique ir a ver un médico.</p>",
    "multicheck" : false,
    "children" : [ 
        {
            "option" : "Tengo síntomas y me preocupa que pueda ser coronavirus",
            "target" : "question1_1"
        }, 
        {
            "option" : "Estoy aislado y confinado en casa",
            "target" : "question2_1"
        }, 
        {
            "option" : "He dado positivo por coronavirus",
            "target" : "question3_1"
        }, 
        {
            "option" : "Me dijeron los médicos que mis síntomas no eran graves pero que requieren seguimiento",
            "target" : "question1_3"
        }, 
        {
            "option" : "Tengo dudas sobre temas relacionados con el coronavirus",
            "target" : "https://coronavirus.epidemixs.org/#/opening"
        }
    ]
}

/* 2 */
{
    "_id" : ObjectId("5e7512767c36a55f5c6efeff"),
    "questionId" : "question1_1",
    "title" : "¿Has viajado?",
    "question" : "En los últimos 14 días, ¿has estado en alguno de los siguientes lugares?",
    "subtitle" : "<p><ul><li><strong>España</strong>: Madrid, Rioja, País Vasco, Cataluña o Valencia. Municipios de la Bastida, Vitoria-Gasteiz (País Vasco), Igualada (Cataluña) o Miranda de Ebro (Castilla y León)</li><li><strong>Italia</strong></li><li><strong>Francia</strong>: departamentos de Haut-Rhin (Grabd Est) y L'Oise (Hauts-de-France)</li><li><strong>Alemania</strong>: departamento de Heinsberg (Renania del Norte-Westfalia)</li><li><strong>China</strong> incluyendo Hong Kong y Macao</li><li><strong>Corea del Sur</strong></li><li><strong>Japón</strong></li><li><strong>Singapur</strong></li><li><strong>Irán</strong></li></ul></p>",
    "multicheck" : false,
    "target" : "question1_2",
    "children" : [ 
        {
            "option" : "Sí",
            "value" : 100
        }, 
        {
            "option" : "No",
            "value" : 0
        }
    ]
}

/* 3 */
{
    "_id" : ObjectId("5e75129a7c36a55f5c6eff1c"),
    "questionId" : "question1_2",
    "title" : "¿Contacto con alguien?",
    "question" : "¿Has tenido contacto estrecho con alguna persona que sea: caso de estudio o confirmado de coronavirus (Covid-19) o que haya estado en uno de los lugares citados anteriormente?",
    "subtitle" : "<p>Estar en contacto estrecho con una persona que haya sido caso de estudio o cofirmado de coronavirus SARS-CoV-2 significa:<ul><li>Vivir en el mismo hogar</li><li>Tener contacto cara a cara, como por ejemplo una conversación de más de un minuto</li><li>Si ha tosido cerca tuyo</li><li>Estar a menos de 2 metros de la persona durante más de 15 minutos</li><li>Estar en contacto con sus secreciones: mucosidad, saliva, excrementos, orina, sangre, vómitos, etc...</li></ul>",
    "multicheck" : false,
    "target" : "question1_3",
    "children" : [ 
        {
            "option" : "Sí",
            "value" : 100
        }, 
        {
            "option" : "No lo sé",
            "value" : 0
        }, 
        {
            "option" : "No",
            "value" : 0
        }
    ]
}

/* 4 */
{
    "_id" : ObjectId("5e751ca87c36a55f5c6f023d"),
    "questionId" : "question1_3",
    "title" : "Sintomas",
    "question" : "¿Qué síntomas tienes? Marca el mas pronunciado",
    "multicheck" : true,
    "target" : "question1_4",
    "children" : [ 
        {
            "option" : "Fiebre más 37º",
            "value" : 3
        }, 
        {
            "option" : "Fiebre menos de 37º",
            "value" : 0
        }, 
        {
            "option" : "Tos seca",
            "value" : 2
        }, 
        {
            "option" : "Tos expulsiva",
            "value" : 1
        }, 
        {
            "option" : "Dificultad para respirar",
            "value" : 3
        }, 
        {
            "option" : "Dolor de pecho",
            "value" : 1
        }, 
        {
            "option" : "Dolor de garganta",
            "value" : 1
        }, 
        {
            "option" : "Dolor muscular",
            "value" : 1
        }, 
        {
            "option" : "Congestión y secreción nasal",
            "value" : 1
        }, 
        {
            "option" : "Cansancio",
            "value" : 1
        }, 
        {
            "option" : "Malestar general",
            "value" : 1
        }, 
        {
            "option" : "Ninguno de los anteriores",
            "value" : -30
        }
    ]
}

/* 5 */
{
    "_id" : ObjectId("5e751cdf7c36a55f5c6f0252"),
    "questionId" : "question1_4",
    "title" : "Tiempo",
    "question" : "¿Hace cuánto tienes los síntomas?",
    "multicheck" : false,
    "target" : "question1_5",
    "children" : [ 
        {
            "option" : "Hoy",
            "value" : 0
        }, 
        {
            "option" : "1 día",
            "value" : 1
        }, 
        {
            "option" : "2 días",
            "value" : 2
        }, 
        {
            "option" : "3 días o más",
            "value" : 3
        }
    ]
}

/* 6 */
{
    "_id" : ObjectId("5e751cf97c36a55f5c6f0262"),
    "questionId" : "question1_5",
    "title" : "Intensidad",
    "question" : "¿Qué intensidad de dolor tienes?",
    "multicheck" : false,
    "target" : "testresult",
    "children" : [ 
        {
            "option" : "Bajo - medio",
            "value" : 0
        }, 
        {
            "option" : "Alto y además fiebre de menos de 37 grados",
            "value" : 0
        }, 
        {
            "option" : "Alto y además fiebre de más de 37 grados",
            "value" : 10
        }
    ]
}

/* 7 */
{
    "_id" : ObjectId("5e751d1a7c36a55f5c6f026c"),
    "questionId" : "question2_1",
    "title" : "Estoy aislado",
    "question" : "Estoy aislado/confinado en casa y:",
    "multicheck" : false,
    "children" : [ 
        {
            "option" : "¿Qué tengo que hacer durante el aislamiento?",
            "target" : "isolation_place_recommendations"
        }, 
        {
            "option" : "Aún no se han puesto en contacto conmigo",
            "target" : "wait_to_be_contacted_and_contact_phones"
        }, 
        {
            "option" : "Me tomaron las muestras y aún no me han dado los resultados",
            "target" : "wait_to_results_and_contact_phones"
        }, 
        {
            "option" : "Ha empeorado mi clínica desde que estoy en casa confinado",
            "target" : "recommendations_and_contact_phones"
        }
    ]
}

/* 8 */
{
    "_id" : ObjectId("5e751d447c36a55f5c6f027f"),
    "questionId" : "question3_1",
    "title" : "Positivo en coronavirus",
    "question" : "He dado positivo por coronavirus y:",
    "subtitle" : "",
    "multicheck" : false,
    "children" : [ 
        {
            "option" : "¿Qué tengo que hacer durante el aislamiento?",
            "target" : "isolation_place_recommendations"
        }, 
        {
            "option" : "Ha empeorado mi clínica desde que estoy en casa confinado",
            "target" : "recommendations_and_contact_phones"
        }
    ]
}

/* 9 */
{
    "_id" : ObjectId("5e751d757c36a55f5c6f0292"),
    "questionId" : "recommendations_and_contact_phones",
    "title" : "Teléfono de contacto",
    "subtitle" : "<p>Si durante el confinamiento en casa se encuentra en cualquiera de la siguientes situaciones, llame al teléfono de contacto habilitado en tu Comunidad</p><p><ul><li>Presento dificultad respiratoria marcada</li><li>La fiebre permanece por encima de 39º y los antitérmicos que estoy tomando (paracetamol y similares) no están consiguiendo disminuirla</li><li>Cualquier signo de gravedad de otra índole (alteración de la consciencia…)</li></ul></p><h1>Teléfonos de contacto</h1><h2>Andalucía</h2><p>La Consejería de Salud de Jesús Aguirre ha habilitado un teléfono especial para consultas, denominado Salud Responde y que es el <a href=\"tel:955545060\"><strong>955 54 50 60</strong></a>.</p><h2>Aragón</h2><p>El Gobierno aragonés ha habilitado el número <a href=\"tel:976696382\"><strong>976 696 382</strong></a> para dudas y solicitudes de información<br>Mantiene el teléfono <a href=\"tel:061\"><strong>061</strong></a> para gente que cumpla los criterios comentados en esta página.</p><h2>Canarias</h2><p>El teléfono para consultas generales en las Islas Canarias, donde cientos de personas han permanecido en cuarentena en un hotel de Adeje, es el <a href=\"tel:900112061\"><strong>900 112 061</strong></a>.</p><h2>Cantabria</h2><p>La consejería de Sanidad ha habilitado el número <a href=\"tel:900612112\"><strong>900 612 112</strong></a> para atender a aquellas personas que en Cantabria creen que pueden tener el coronavirus.<br>Se limita la llamada al <a href=\"tel:112\"><strong>112</strong></a> y <a href=\"tel:061\"><strong>061</strong></a> sólo si es imprescindible.</p><h2>Castilla la Mancha</h2><p>l departmento de Jesús Fernández ha habilitado el <a href=\"tel:900122112\"><strong>900 122 112</strong></a> para el coronavirus.</p><h2>Castilla León</h2><p>Al igual que el resto de comunidades, reitera el llamamiento ante una posible sospecha de infección a no acudir a centros médicos ni hospitales, permanecer en casa y llamar al <a href=\"tel:900222000\"><strong>900 222 000</strong></a>. </p><h2>Cataluña</h2><p>Cataluña también opta por un número telefónico habitual para atender las consultas sobre esta patología: el <a href=\"tel:061\"><strong>061</strong></a>.<br>Debido al desbordamiento sufrido por la avalancha de llamadas la Generalitat ha habilitado un test online para descartar casos: Test online</p><h2>Comunidad de Madrid</h2><p>La Consejería de Sanidad de Enrique Ruiz Escudero ha habilitado el <a href=\"tel:900102112\"><strong>900 102 112</strong></a> para derivar las llamadas de posibles casos a la Mesa de Coordinación del SUMMA <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Comunidad Foral de Navarra</h2><p>Centralizan en el <a href=\"tel:112\"><strong>112</strong></a> las consultas sobre posibles casos al tener síntomas y haber venido de las zonas afectadas (o haber tenido un contacto estrecho con casos positivos) mientras que el teléfono de consejo sanitario es el <a href=\"tel:948290290\"><strong>948 290 290</strong></a>.</p><h2>Comunidad Valenciana</h2><p>El <a href=\"tel:900300555\"><strong>900 300 555</strong></a> es el número para que cualquier persona de la Comunidad Valenciana con síntomas pueda ponerse en contacto con los servicios sanitarios.</p><h2>Extremadura</h2><p>En caso de que algún extremeño presente síntomas o quiera resolver alguna cuestión, deberá llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Galicia</h2><p>En Galicia los usuarios que presenten síntomas deberán llamar al <a href=\"tel:061\"><strong>061</strong></a> y, en el caso de buscar información general, el <a href=\"tel:900400116\"><strong>900 400 116</strong></a>.</p><h2>Islas Baleares</h2><p>En las Islas Baleares se canalizarán todas las consultas a través del <a href=\"tel:061\"><strong>061</strong></a>.</p><h2>La Rioja</h2><p>En La Rioja está disponible el teléfono <a href=\"tel:941298333\"><strong>941 298 333</strong></a>, que se suma al <a href=\"tel:112\"><strong>112</strong></a>, para que los usuarios puedan hacer las consultas que necesiten.</p><h2>Región de Murcia</h2><p>Salud habilita el teléfono de información del coronavirus <a href=\"tel:900121212\"><strong>900 121 212</strong></a>, aunque también se puede llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>País Vasco</h2><p>Osakidetza ha abierto la línea telefónica del <a href=\"tel:900203050\"><strong>900 203 050</strong></a> para “consejos sanitarios” sobre coronavirus. </p><h2>Principado de Asturias</h2><p>Asturias mantendrá el número de emergencias, el <a href=\"tel:112\"><strong>112</strong></a>, como medio de comunicación.</p>",
    "multicheck" : false,
    "showExitButton" : true,
    "children" : []
}

/* 10 */
{
    "_id" : ObjectId("5e751d9a7c36a55f5c6f029e"),
    "questionId" : "wait_to_be_contacted_and_contact_phones",
    "title" : "Contacto",
    "subtitle" : "<p>Tras la indicación de quedarse en casa, el primer contacto puede tardar de <strong>12 a 24 horas</strong>. Si han pasado más de 24 horas y aún no se han puesto en contacto con usted, llame al teléfono de contacto habilitado en tu Comunidad</p><h1>Teléfonos de contacto</h1><h2>Andalucía</h2><p>La Consejería de Salud de Jesús Aguirre ha habilitado un teléfono especial para consultas, denominado Salud Responde y que es el <a href=\"tel:955545060\"><strong>955 54 50 60</strong></a>.</p><h2>Aragón</h2><p>El Gobierno aragonés ha habilitado el número <a href=\"tel:976696382\"><strong>976 696 382</strong></a> para dudas y solicitudes de información<br>Mantiene el teléfono <a href=\"tel:061\"><strong>061</strong></a> para gente que cumpla los criterios comentados en esta página.</p><h2>Canarias</h2><p>El teléfono para consultas generales en las Islas Canarias, donde cientos de personas han permanecido en cuarentena en un hotel de Adeje, es el <a href=\"tel:900112061\"><strong>900 112 061</strong></a>.</p><h2>Cantabria</h2><p>La consejería de Sanidad ha habilitado el número <a href=\"tel:900612112\"><strong>900 612 112</strong></a> para atender a aquellas personas que en Cantabria creen que pueden tener el coronavirus.<br>Se limita la llamada al <a href=\"tel:112\"><strong>112</strong></a> y <a href=\"tel:061\"><strong>061</strong></a> sólo si es imprescindible.</p><h2>Castilla la Mancha</h2><p>l departmento de Jesús Fernández ha habilitado el <a href=\"tel:900122112\"><strong>900 122 112</strong></a> para el coronavirus.</p><h2>Castilla León</h2><p>Al igual que el resto de comunidades, reitera el llamamiento ante una posible sospecha de infección a no acudir a centros médicos ni hospitales, permanecer en casa y llamar al <a href=\"tel:900222000\"><strong>900 222 000</strong></a>. </p><h2>Cataluña</h2><p>Cataluña también opta por un número telefónico habitual para atender las consultas sobre esta patología: el <a href=\"tel:061\"><strong>061</strong></a>.<br>Debido al desbordamiento sufrido por la avalancha de llamadas la Generalitat ha habilitado un test online para descartar casos: Test online</p><h2>Comunidad de Madrid</h2><p>La Consejería de Sanidad de Enrique Ruiz Escudero ha habilitado el <a href=\"tel:900102112\"><strong>900 102 112</strong></a> para derivar las llamadas de posibles casos a la Mesa de Coordinación del SUMMA <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Comunidad Foral de Navarra</h2><p>Centralizan en el <a href=\"tel:112\"><strong>112</strong></a> las consultas sobre posibles casos al tener síntomas y haber venido de las zonas afectadas (o haber tenido un contacto estrecho con casos positivos) mientras que el teléfono de consejo sanitario es el <a href=\"tel:948290290\"><strong>948 290 290</strong></a>.</p><h2>Comunidad Valenciana</h2><p>El <a href=\"tel:900300555\"><strong>900 300 555</strong></a> es el número para que cualquier persona de la Comunidad Valenciana con síntomas pueda ponerse en contacto con los servicios sanitarios.</p><h2>Extremadura</h2><p>En caso de que algún extremeño presente síntomas o quiera resolver alguna cuestión, deberá llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Galicia</h2><p>En Galicia los usuarios que presenten síntomas deberán llamar al <a href=\"tel:061\"><strong>061</strong></a> y, en el caso de buscar información general, el <a href=\"tel:900400116\"><strong>900 400 116</strong></a>.</p><h2>Islas Baleares</h2><p>En las Islas Baleares se canalizarán todas las consultas a través del <a href=\"tel:061\"><strong>061</strong></a>.</p><h2>La Rioja</h2><p>En La Rioja está disponible el teléfono <a href=\"tel:941298333\"><strong>941 298 333</strong></a>, que se suma al <a href=\"tel:112\"><strong>112</strong></a>, para que los usuarios puedan hacer las consultas que necesiten.</p><h2>Región de Murcia</h2><p>Salud habilita el teléfono de información del coronavirus <a href=\"tel:900121212\"><strong>900 121 212</strong></a>, aunque también se puede llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>País Vasco</h2><p>Osakidetza ha abierto la línea telefónica del <a href=\"tel:900203050\"><strong>900 203 050</strong></a> para “consejos sanitarios” sobre coronavirus. </p><h2>Principado de Asturias</h2><p>Asturias mantendrá el número de emergencias, el <a href=\"tel:112\"><strong>112</strong></a>, como medio de comunicación.</p>",
    "multicheck" : false,
    "showExitButton" : true,
    "children" : []
}

/* 11 */
{
    "_id" : ObjectId("5e751dfa7c36a55f5c6f02c1"),
    "questionId" : "wait_to_results_and_contact_phones",
    "title" : "Contacto",
    "subtitle" : "<p>Los resultados de las muestras pueden tardar en ser comunicados al paciente de <strong>12 a 24 horas</strong>. Si han pasado más de 24 horas y aún no se han puesto en contacto con usted, llame al teléfono de contacto habilitado en tu Comunidad</p><h1>Teléfonos de contacto</h1><h2>Andalucía</h2><p>La Consejería de Salud de Jesús Aguirre ha habilitado un teléfono especial para consultas, denominado Salud Responde y que es el <a href=\"tel:955545060\"><strong>955 54 50 60</strong></a>.</p><h2>Aragón</h2><p>El Gobierno aragonés ha habilitado el número <a href=\"tel:976696382\"><strong>976 696 382</strong></a> para dudas y solicitudes de información<br>Mantiene el teléfono <a href=\"tel:061\"><strong>061</strong></a> para gente que cumpla los criterios comentados en esta página.</p><h2>Canarias</h2><p>El teléfono para consultas generales en las Islas Canarias, donde cientos de personas han permanecido en cuarentena en un hotel de Adeje, es el <a href=\"tel:900112061\"><strong>900 112 061</strong></a>.</p><h2>Cantabria</h2><p>La consejería de Sanidad ha habilitado el número <a href=\"tel:900612112\"><strong>900 612 112</strong></a> para atender a aquellas personas que en Cantabria creen que pueden tener el coronavirus.<br>Se limita la llamada al <a href=\"tel:112\"><strong>112</strong></a> y <a href=\"tel:061\"><strong>061</strong></a> sólo si es imprescindible.</p><h2>Castilla la Mancha</h2><p>l departmento de Jesús Fernández ha habilitado el <a href=\"tel:900122112\"><strong>900 122 112</strong></a> para el coronavirus.</p><h2>Castilla León</h2><p>Al igual que el resto de comunidades, reitera el llamamiento ante una posible sospecha de infección a no acudir a centros médicos ni hospitales, permanecer en casa y llamar al <a href=\"tel:900222000\"><strong>900 222 000</strong></a>. </p><h2>Cataluña</h2><p>Cataluña también opta por un número telefónico habitual para atender las consultas sobre esta patología: el <a href=\"tel:061\"><strong>061</strong></a>.<br>Debido al desbordamiento sufrido por la avalancha de llamadas la Generalitat ha habilitado un test online para descartar casos: Test online</p><h2>Comunidad de Madrid</h2><p>La Consejería de Sanidad de Enrique Ruiz Escudero ha habilitado el <a href=\"tel:900102112\"><strong>900 102 112</strong></a> para derivar las llamadas de posibles casos a la Mesa de Coordinación del SUMMA <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Comunidad Foral de Navarra</h2><p>Centralizan en el <a href=\"tel:112\"><strong>112</strong></a> las consultas sobre posibles casos al tener síntomas y haber venido de las zonas afectadas (o haber tenido un contacto estrecho con casos positivos) mientras que el teléfono de consejo sanitario es el <a href=\"tel:948290290\"><strong>948 290 290</strong></a>.</p><h2>Comunidad Valenciana</h2><p>El <a href=\"tel:900300555\"><strong>900 300 555</strong></a> es el número para que cualquier persona de la Comunidad Valenciana con síntomas pueda ponerse en contacto con los servicios sanitarios.</p><h2>Extremadura</h2><p>En caso de que algún extremeño presente síntomas o quiera resolver alguna cuestión, deberá llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>Galicia</h2><p>En Galicia los usuarios que presenten síntomas deberán llamar al <a href=\"tel:061\"><strong>061</strong></a> y, en el caso de buscar información general, el <a href=\"tel:900400116\"><strong>900 400 116</strong></a>.</p><h2>Islas Baleares</h2><p>En las Islas Baleares se canalizarán todas las consultas a través del <a href=\"tel:061\"><strong>061</strong></a>.</p><h2>La Rioja</h2><p>En La Rioja está disponible el teléfono <a href=\"tel:941298333\"><strong>941 298 333</strong></a>, que se suma al <a href=\"tel:112\"><strong>112</strong></a>, para que los usuarios puedan hacer las consultas que necesiten.</p><h2>Región de Murcia</h2><p>Salud habilita el teléfono de información del coronavirus <a href=\"tel:900121212\"><strong>900 121 212</strong></a>, aunque también se puede llamar al <a href=\"tel:112\"><strong>112</strong></a>.</p><h2>País Vasco</h2><p>Osakidetza ha abierto la línea telefónica del <a href=\"tel:900203050\"><strong>900 203 050</strong></a> para “consejos sanitarios” sobre coronavirus. </p><h2>Principado de Asturias</h2><p>Asturias mantendrá el número de emergencias, el <a href=\"tel:112\"><strong>112</strong></a>, como medio de comunicación.</p>",
    "multicheck" : false,
    "showExitButton" : true,
    "children" : []
}

/* 12 */
{
    "_id" : ObjectId("5e751e207c36a55f5c6f02d0"),
    "questionId" : "isolation_place_recommendations",
    "title" : "Lugar de aislamiento",
    "question" : "Características del lugar de aislamiento (si es posible)",
    "subtitle" : "<p>La vivienda debe disponer de una estancia con buena ventilación y que pueda ser dedicada de forma específica para el aislamiento del caso, con posibilidad de designar un baño para uso exclusivo del paciente.</p><p>La persona aislada debe disponer de teléfono para garantizar la comunicación permanente con el personal sanitario hasta la resolución de los síntomas.</p><p>El paciente no debe convivir con personas con condiciones de salud que supongan una vulnerabilidad: personas de edad avanzada, diversidad funcional, enfermedades crónicas, inmunodeprimidas, embarazadas... Tanto el paciente como sus convivientes deben ser capaces de comprender y aplicar de forma correcta y consistente las medidas básicas de higiene, prevención y control de la infección.</p><p>El paciente deberá permanecer preferiblemente en una estancia o habitación de uso individual o, en caso de que esto no sea posible, en un lugar en el que se pueda garantizar una distancia mínima de 2 metros con el resto de los convivientes. La puerta de la habitación deberá permanecer cerrada. En caso de que sea imprescindible ir a las zonas comunes del domicilio deberá utilizar mascarilla quirúrgica y realizar higiene de manos al salir de la habitación. Se mantendrán bien ventiladas las zonas comunes.</p><p>La estancia o habitación deberá tener una ventilación adecuada directa a la calle. No deben existir corrientes forzadas de aire provenientes de sistemas de calor o refrigeración.</p><p>Deberá disponer de un baño para uso exclusivo del paciente, o en su defecto, deberá ser limpiado con lejía doméstica tras cada uso que haga el paciente.</p><p>Sería importante que pudiese disponer de un intercomunicador (como los utilizados para la vigilancia de los bebés) para comunicarse con los familiares, sin necesidad de salir de la habitación. También se puede hacer a través del móvil.</p><p>En el interior de la estancia o habitación deberá colocarse un cubo de basura con tapa de apertura de pedal y en su interior una bolsa de plástico que cierre herméticamente para los residuos.</p><p>Se recomienda disponer utensilios de aseo de uso individual y de productos para la higiene de manos como jabón o solución hidroalcohólica.</p><p>Las toallas deberán cambiarse periódicamente siempre que se encuentren húmedas.</p><p>La persona enferma deberá seguir en todo momento las medidas de higiene respiratoria: cubrirse la boca y la nariz al toser o estornudar con pañuelos desechables o el codo flexionado, y lavarse las manos inmediatamente después.</p><p>La persona enferma no deberá recibir visitas durante el periodo de aislamiento.</p>",
    "multicheck" : false,
    "showExitButton" : true,
    "children" : []
}

/* 13 */
{
    "_id" : ObjectId("5e751e427c36a55f5c6f02dd"),
    "questionId" : "result_ok",
    "title" : "No hay urgencia",
    "question" : "De momento no parece que tenga el coronavirus",
    "subtitle" : "<p>Por el momento no te preocupes, pero no salgas de casa excepto por necesidad:</p><h1>parece que NO tienes el coronavirus - Covid-19</h1><p>Aunque no hayas estado en ninguna zona con evidencia de transmisión comunitaria ni hayas estado en contacto con ningún caso sospechoso o confirmado, <strong>si presentaras algún síntoma, llama a tu centro de atención primaria (CAP) para su valoración</strong>: recuerda evitar desplazarte al mismo salvo indicación contraria.</p><p>Sigue siempre los siguientes <strong>consejos de prevención</strong>:<ul><li><strong>Lávate las manos frecuentemente</strong> (con agua y jabon o soluciones alcoholicas 70%), especialmente después del contacto directo con personas enfermas o su entorno.</li><li><strong>En el momento de toser o estornudar</strong>, tápate la boca y la nariz con pañuelos de un solo uso y deséchalos en la papelera. En su defecto usa la cara interna del codo. Acto seguido lávate las manos rápidamente con agua y jabón, o con soluciones alcohólicas 70%.</li><li><strong>Evita el contacto cercano</strong> (al menos una distancia de dos metros) con personas que padecen infecciones respiratoria agudas y presenten tos, estornudos y expectoraciones y no compartas las pertenencias personales.</li><li><strong>Evita compartir comida y utensilios</strong> (cubiertos, vasos, servilletas, pañuelos, etc.) y otros objetos sin limpiarlos debidamente.</li></ul></p>",
    "multicheck" : false,
    "showExitButton" : true,
    "children" : []
}

```

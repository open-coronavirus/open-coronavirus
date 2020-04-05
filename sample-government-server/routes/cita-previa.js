var express = require('express');
var moment = require('moment');
var uuidv4 = require('uuid').v4;

var router = express.Router();

router.post('/', ({ body }, res) => {
  res.json({
    codigoCita: uuidv4(),
    centro: {
      codigo: 'ALC:CESP:BBL',
      nombre: 'Centro de especialidades de Babel',
      sipPaciente: body.sip,
      coordenadas: {
        latitud: 38.3546956,
        longitud: -0.4983639,
      },
    },
    fecha: moment().add('1 days').format('DD/MM/YYYY'),
    hora: moment().format('HH:mm'),
  });
});

module.exports = router;

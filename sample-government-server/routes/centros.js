var express = require('express');
var moment = require('moment');
var uuidv4 = require('uuid').v4;

var router = express.Router();

router.post('/:id/cita-previa', ({ body, params }, res) => {
  res.json({
    codigoCita: uuidv4(),
    sipPaciente: body.sip,
    codigoCentro: params.id,
    fecha: moment().add('1 days').format('DD/MM/YYYY'),
    hora: moment().format('HH:mm'),
  });
});

module.exports = router;

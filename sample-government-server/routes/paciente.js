var express = require('express');

var router = express.Router();

router.get('/:sip/centros', (_, res) => {
  res.json([
    {
      codigo: 'ALC:CESP:BBL',
      nombre: 'Centro de especialidades de Babel',
      direccion: 'Plaza Manila 11, 03013 Alicante',
      coordenadas: {
        latitud: 38.3546956,
        longitud: -0.4983639,
      },
    },
  ]);
});

module.exports = router;

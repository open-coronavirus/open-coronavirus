json-format
==========

[![Build Status](https://travis-ci.org/luizstacio/json-format.svg?branch=master)](https://travis-ci.org/luizstacio/json-format.svg?branch=master)

Parse JavaScript Object to a JSON String indented.

#### Instaling
```
  npm install json-format
```

#### Usage
```
  var jsonFormat = require('./');
  var fs = require('fs');
  var obj = {
    a: 1,
    b: 2
  }

  /* using config default, indent with tabs */
  fs.writeFile('example_tabs.json', jsonFormat(obj), function(err){
    if (err) throw err;
    console.log('saved');
  });

  /* using indent with spaces */
  var config = {
    type: 'space',
    size: 2
  }

  fs.writeFile('example_spaces.json', jsonFormat(obj, config), function(err){
    if (err) throw err;
    console.log('saved');
  });
```

##### Result `example_tabs.json`
```
{
    "a": 1,
    "b": 2
}
```

##### Result `example_spaces.json`
```
{
  "a": 1,
  "b": 2
}
```

#### Default sizes
```
{
  tab: { size: 1 },
  space: { size: 4 }
}
```

#### Config default
```
{
  type: 'tab'
}
```

[Based in this project](https://github.com/phoboslab/json-format).
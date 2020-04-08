var jsonFormat = require('json-format');
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
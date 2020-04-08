const json = require('../');
const fs = require('fs');
const assert = require('assert');
const mock = {
  foo: "bar",
  children: {
    foo: "bar"
  }
}

function getMock(file) {
  return fs.readFileSync(`./test/mocks/${file}.json`).toString();
}

describe('Parse json', function() {
  it('should be parse with 4 spaces', function() {
    assert.equal(json(mock, { type: 'space' }), getMock('stringified_4_spaces'));
  });

  it('should be parse with 2 spaces', function() {
    assert.equal(json(mock, { type: 'space', size: 2 }), getMock('stringified_2_spaces'));
  });

  it('should be parse with tabs', function() {
    assert.equal(json(mock, { type: 'tab' }), getMock('stringified_1_tab'));
  });
});
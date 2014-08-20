jest.dontMock('../src/delorean.js');

var DeLorean = require('../src/delorean.js');

describe('generic patterns', function () {

  it('should have Flux', function () {
    expect(DeLorean.Flux).toBeDefined();
  });

});

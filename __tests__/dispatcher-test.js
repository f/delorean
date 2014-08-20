jest.dontMock('../src/dispatcher.js');

var Dispatcher = require('../src/dispatcher.js');

describe('dispatcher', function () {

  beforeEach(function () {
    this.dispatcher = new Dispatcher();
  })

  it('should be defined', function () {
    expect(Dispatcher).toBeTruthy();
  });

  it('should be exist', function () {
    expect(this.dispatcher).toBeDefined();
  });

  it('should have methods', function () {
    expect(this.dispatcher.waitFor).toBeDefined();
    expect(this.dispatcher.dispatch).toBeDefined();
    expect(this.dispatcher.registerAction).toBeDefined();
  });

  it('should have multiple stores', function () {

  });

});

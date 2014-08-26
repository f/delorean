var Flux = DeLorean.Flux;

describe('Flux', function () {
  it('should generate a store', function () {
    var store = Flux.createStore();
    expect(store instanceof DeLorean.Store).toBeTruthy();
  });

  it('should generate a dispatcher', function () {
    var dispatcher = Flux.createDispatcher();
    expect(dispatcher instanceof DeLorean.Dispatcher).toBeTruthy();
  });

});

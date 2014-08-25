var Store = DeLorean.Store;

describe("Store", function() {
  it('store entity should be defined', function () {
    expect(Store).toBeDefined();
  });

  it('should be an object', function () {
    expect(typeof Store).toBe('function');
  });
});

var Dispatcher = DeLorean.Dispatcher;

describe('Dispatcher', function () {

  beforeEach(function () {
    this.actions = jasmine
      .createSpyObj('actions', ['action1', 'action2', 'getStores']);

    this.dispatcher = new DeLorean.Dispatcher(this.actions);
  });

  it('should call action methods', function () {
    this.dispatcher.action1();
    expect(this.actions.action1).toHaveBeenCalled();

    this.dispatcher.action2('hello', 'world');
    expect(this.actions.action2).toHaveBeenCalledWith('hello', 'world');
  });

  it('should have stores if defined', function () {

  });

});

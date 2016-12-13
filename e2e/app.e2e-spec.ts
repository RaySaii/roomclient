import { RoomPage } from './app.po';

describe('room App', function() {
  let page: RoomPage;

  beforeEach(() => {
    page = new RoomPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

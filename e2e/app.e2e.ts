import { TractorPage } from './app.po';

describe('tractor App', function() {
  let page: TractorPage;

  beforeEach(() => {
    page = new TractorPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('tractor works!');
  });
});

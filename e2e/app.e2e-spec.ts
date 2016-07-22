import { TractorClientPage } from './app.po';

describe('tractor-client App', function() {
  let page: TractorClientPage;

  beforeEach(() => {
    page = new TractorClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

const puppeteer = require('puppeteer');
const resetDB = require('./actions/resetDB');

const BASE_URL = 'http://localhost:3000/';

function dataTestid(name) {
  return `[data-testid^=${name}]`;
}

describe('1 - Liste as tecnologias', () => {
  let browser;
  let page;

  beforeEach(async (done) => {
    await resetDB();
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
    page = await browser.newPage();
    await page.goto(BASE_URL);
    done();
  });

  afterEach(async (done) => {
    await browser.close();
    done();
  });

  it('Será validado que as 6 tecnologias são exibidas', async() => {
    await page.waitForSelector(dataTestid('current-name-'));

    const participantNames = await page.$$eval(dataTestid('current-name-'), (nodes) => nodes.map((n) => n.innerText));

    expect(participantNames[0]).toMatch('PHP');
    expect(participantNames[1]).toMatch('CSS');
    expect(participantNames[2]).toMatch('JS');
    expect(participantNames[3]).toMatch('Go');
    expect(participantNames[4]).toMatch('React');
    expect(participantNames[5]).toMatch('Python');
  });

  it('Será validado que as 6 tecnologias possuem o botão para votar', async() => {
    await page.waitForSelector(dataTestid('vote-tech-0'));

    const buttonVote1 = await page.$eval(`button${dataTestid('vote-tech-0')}`, el => el.innerText);
    const buttonVote2 = await page.$eval(`button${dataTestid('vote-tech-1')}`, el => el.innerText);
    const buttonVote3 = await page.$eval(`button${dataTestid('vote-tech-2')}`, el => el.innerText);
    const buttonVote4 = await page.$eval(`button${dataTestid('vote-tech-3')}`, el => el.innerText);
    const buttonVote5 = await page.$eval(`button${dataTestid('vote-tech-4')}`, el => el.innerText);
    const buttonVote6 = await page.$eval(`button${dataTestid('vote-tech-5')}`, el => el.innerText);
    
    expect(buttonVote1).toEqual('Votar');
    expect(buttonVote2).toEqual('Votar');
    expect(buttonVote3).toEqual('Votar');    
    expect(buttonVote4).toEqual('Votar');    
    expect(buttonVote5).toEqual('Votar');    
    expect(buttonVote6).toEqual('Votar');    
  });
});

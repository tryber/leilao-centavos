const puppeteer = require('puppeteer');
const resetDB = require('./actions/resetDB');

const BASE_URL = 'http://localhost:3000/';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

const getCurrentVotes = (page, index) => (page.$eval(dataTestid(`current-votes-${index}`), el => el.innerText));

describe('2 - Votar', () => {
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

  it('Será validado que ao votar em uma tecnologia o número de votos deve aumentar para qualquer pessoa online', async() => {
    await page.waitForTimeout(500);
    let currentVotes = await getCurrentVotes(page, 0);
    
    // Contagem atual é 0
    expect(currentVotes).toEqual('0');

    // Usuário 1 vota uma vez
    const buttonVote1 = await page.$(`button${dataTestid('vote-tech-0')}`);
    buttonVote1.click();
    await page.waitForTimeout(500);
    
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('1');

    // Usuário 1 vota novamente
    buttonVote1.click();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('2');


    // Usuário 1 vota novamente
    buttonVote1.click();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 0);
    expect(currentVotes).toEqual('3');

    // Usuário 2 acessa e deve verificar a quantidade correta de votos que ocorreram
    const context = await browser.createIncognitoBrowserContext();
    const page2 = await context.newPage();
    await page2.setCacheEnabled(false);
    await page2.goto(BASE_URL);
    await page2.waitForTimeout(500);

    currentVotes = await getCurrentVotes(page2, 0);
    expect(currentVotes).toEqual('3');

    // Tecnologia 1 deve ter 0 votos
    currentVotes = await getCurrentVotes(page2, 1);
    expect(currentVotes).toEqual('0');

    // Usuário 2 (page2) deve votar na segunda tecnologia 2
    const buttonVote2 = await page.$(`button${dataTestid('vote-tech-1')}`);
    buttonVote2.click();
    await page2.waitForTimeout(500);

    // Usuário 2 (page2) deve ver o voto computado do usuário 2 na tecnologia 2
    currentVotes = await getCurrentVotes(page2, 1);
    expect(currentVotes).toEqual('1');

    // Usuário 1 (page) deve ver o voto computado do usuário 2 na tecnologia 2
    await page.bringToFront();
    await page.waitForTimeout(500);
    currentVotes = await getCurrentVotes(page, 1);
    expect(currentVotes).toEqual('1');
  });
});

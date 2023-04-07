const puppeteer = require('puppeteer');
const fs = require('fs');

async function login(url, username, password, num) {

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url);

    let count = num.toString();
    let login_timer = username + count + ' login';
    let logout_timer = username + count + ' logout';

    // starts the login timer
    console.time(login_timer);
    

    await page.waitForSelector("#username");
    await page.type("#username", username, { delay: 0 });

    await page.waitForSelector("#password");
    await page.type("#password", password, { delay: 0 });


    // click login
    await page.waitForSelector('.formButton');
    const element0 = await page.$('.formButton');
    await page.evaluate(element0 => element0.click(), element0);

    console.timeEnd(login_timer); // end the timer

    // find AndyLiu button
    //console.time(logout_timer); // start the timer for logout;
    try {
      const aElement = await page.waitForSelector('.formButton', {timeout: 5000});
      //console.timeEnd(login_timer); // end the timer
      console.log(username + count + ' LOGIN Failed');
    }
    catch (error) {
      console.log(username + count + ' LOGIN Successful');
      console.time(logout_timer); // start the timer for logout;
      await page.goto('https://sit.login.security.gov.on.ca/oamsso/logout.html');
      console.log( count + 'loged out');
      // end logout timer.
      console.timeEnd(logout_timer); 
    }
}

process.setMaxListeners(100);

fs.readFile('login2.txt', 'utf8', (err, data) => {
  const lines = data.trim().split('\n');
  let int = 1;
  for (const line of lines) {
    const [url, username, password] = line.trim().split(',');
    login(url, username, password, int);
    ++int;
  }
});

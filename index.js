const puppeteer = require("puppeteer");
const fs = require("fs");
const jsonFile = require("./example.json");
const numberOfUrls = jsonFile.urls.length;
const urlsArray = jsonFile.urls;
const yourDomain = "https://yourdomain.com/";

(async () => {
  try {
    // initial settings for Chromium
    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: false,
      devtools: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
    );

    await page.setViewport({ width: 0, height: 0, deviceScaleFactor: 1 });

    // results array
    const result = [];

    // for loop on urls list
    for (let i = 0; i < numberOfUrls; i++) {
      await page.goto(urlsArray[i]);
      // await page.waitFor(1000);

      const elements = await page.$$eval(`a[href*="${yourDomain}"]`, elements => elements.map(el => el.innerText));
      result.push({ urlOrigin: urlsArray[i], backlinkTexts: elements })
    }
    await browser.close();
    //end for loop

    let file = fs.createWriteStream('backlinks-status.txt');
    file.on('error', function(err) { if (err) console.log('error', err) });
    result.forEach((el) => { file.write(`The url: ${el.urlOrigin} returns those backlinks texts: \n${el.backlinkTexts.length === 0 ? "Sorry, no backlinks on this url\n\n" : el.backlinkTexts.join('\n')}\n\n`); });
    file.end(); 
    
    exports.result = result;

  } catch (error) {
    console.log(`Catched error: ${error}`);
  }


})();

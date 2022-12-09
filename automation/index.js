const config = require("../config.json");
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
 

module.exports =  Automation = async (_data) => {
    try {

        let domains = _data;   

        // Browser configuration  
        const browser = await puppeteer.launch({
            headless: config.browser.headless,
            executablePath: config.browser.browser_path,
            userDataDir: config.browser.user_data_path,
            defaultViewport: config.browser.defaultViewport,
            args: [
                '--start-maximized', 
                '--enable-automation'
            ]
        });
         

        // Launch browser
        const page = await browser.newPage();  
        await page.goto(config.url, {waitUntil: 'networkidle2'});


        let added = 0;
        let alreadyAdded =0; 
        for(let i=0; i< domains.length; i++){
            
            const inputSelector = 'input[data-testid="domains/alias-domain-input"]';
            const buttonSelector = 'button[data-testid="project/settings/domains/add-alias-button"]';
            const errSelector = 'div[data-testid="domains/alias-domain-input/error"]';
            const str = domains[i].replace(/ /g,'').replace(/\t/g,'').replace(/\r/g,'');  
            
            console.log(`Remaining domains: `, domains.length - i)

            if(await page.$(inputSelector) != null && await page.$(buttonSelector) != null){ 
                
                // Type domain
                await page.evaluate((selector) => document.querySelector(selector).click(), inputSelector); 
                await page.$eval(inputSelector, el => el.value = '') ;
                await page.type(inputSelector, str);
                

                // Add domain
                page.click(buttonSelector);
                await page.waitForTimeout(5000);
                

                // Check for failure 
                if(await page.$(errSelector) != null){
                    ++alreadyAdded;
                    const errMessage = await page.$eval(errSelector, el => el.textContent); 
                    console.log(`Result: ${errMessage.includes('already in use') ? "Already added" : errMessage}, Domain: `, domains[i].toString());
                }else{
                    ++added;
                    console.log("Result: Successfully added, Domain: ", domains[i].toString());
                } 


            }else{  
                console.log("Result: Couldn't find selectors, Domain: ", domains[i].toString());
            }
        } 

        console.log('----------------------------------------');
        console.log(`Total domains: `, domains.length);
        console.log(`Added: `, added);
        console.log(`Already added: `, alreadyAdded);
        


    } catch (e) {
        console.log(e)
    }
} 
const fs = require('fs');
const Automation = require('./automation/index');
const config = require('./config.json');

const app = async () => {
    try {
        
        // Get data
        let domains = []; 
        const array = fs.readFileSync('./input/data.txt').toString().split("\n");
        for(i in array) { 
            if(array[i].toString().includes('.')){ 
                domains.push(array[i]);  
            }
        }
 
        
        // Start automation 
        if(domains.length && config.browser.browser_path && config.browser.user_data_path
        ){
            Automation(domains);
        }else{
            console.log(domains.length ? "Error: Browser is not configured" : "Error: Couldn't parse input data");
        }
       
        
      
    } catch (e) {
        console.log(e)
    }
}
app();
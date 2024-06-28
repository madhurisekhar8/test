// this is other way to login automatically only once 
// here we will inject cookies to the browser so all pages related to the application will login automatically 

const { test, expect } = require('@playwright/test');
// placing an order
test.beforeAll( async ({ browser }) => {
    const context= await newContext();
    const Page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.title("Let's Shop");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    const loginPage = new LoginPage(page);
    await page.waitForLoadState('networkidle');
    await context.storageState({path:'state.json'});
});
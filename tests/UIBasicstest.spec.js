const {test, expect} = require('@playwright/test');

test('First Playwright test', async ({browser,})=>
{
const context= await browser.newContext();
const page = await context.newPage();
await page.goto("https://rahulshettyacademy.com/client/auth/login");

});

//other easy way 

test('page playwright test', async({page})=>

    {
        const userName= page.locator('#username');
        const signIn=page.locator('#signInBtn');
        const cardTitles= page.locator(".card-title a");
        const documentLink=page.locator("[href*=documents-request]");
await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
//get title- assertion 

console.log(await page.title());
await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
//css
await userName.fill('rahulshetty');
await page.locator('#password').fill('learning');
await signIn.click();
// to extract the content present on the website while clicking on signin with wrong creds
console.log(await page.locator('[style="display: none;"]').textContent());
await expect (page.locator('[style="display: none;"]')).toContainText('Incorrect');
//entering correct details 
await userName.fill("");
await userName.fill("rahulshettyacademy");
await signIn.click();
console.log(await cardTitles.nth(0).textContent());
console.log(await cardTitles.allTextContents());
    }); 

   
     test('UI Controls', async({page})=>

        {
            await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
            const userName= await page.locator('#username');
            const signIn= await page.locator('#signInBtn');
            const documentLink=page.locator("[href*=documents-request]");

            const dropdown= page.locator("select.form-control ");
            await dropdown.selectOption("consult");
            await page.locator(".radiotextsty").last().click();
            await page.locator("#okayBtn").click();
            await expect (page.locator(".radiotextsty").last()).toBeChecked();
            await page.locator("#terms").click();
            await expect(page.locator("#terms")).toBeChecked();
            await page.locator("#terms").uncheck();
            expect (await page.locator("#terms").isChecked()).toBeFalsy();
          await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test('Child windows handling', async({browser})=>

    {
        const context= await browser.newContext();
        const page = await context.newPage();
        const userName= await page.locator('#username');
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        const documentLink=page.locator("[href*=documents-request]");
        const [newPage]= await Promise.all([
         context.waitForEvent('page'),//listen for any new page
        documentLink.click(),
    ])
     const text = await newPage.locator(".red").textContent();
     const arrayText= text.split("@")
     const domain=arrayText[1].split(" ")[0]
    console.log(domain);
   await userName.fill(domain);
   console.log(await userName.textContent());
   await page.pause();






    });
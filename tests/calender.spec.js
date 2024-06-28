const {test,expect} = require('@playwright/test');

test.only('calender ',async({page})=>{

const monthNumber ="6";
const date = "16";
const year = "2024";
const expectedList = [monthNumber,date,year];

await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
await page.locator(".react-date-picker__inputGroup").click();
await page.locator(".react-calendar__navigation__label").click();
await page.locator(".react-calendar__navigation__label").click();
await page.getByText(year).click();
await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
await page.locator("//abbr[text()='"+date+"']").click();
console.log(await page.getByText(year).textContent());
const inputs = await page.locator(".react-date-picker__inputGroup input");
for(let i=0; i<inputs.length; i++){
    const value = inputs[i].getAttribute("value");
    expect(value).toEqual(expectedList[i]);

}
})
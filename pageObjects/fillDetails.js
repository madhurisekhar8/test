class fillDetails{

    constructor(){
        


this.CVV =  page.locator("input[type='text']").nth(1).fill("666");
this. page.locator("input[type='text']").nth(2).click()
this.name = page.locator("input[type='text']").nth(2).fill("Anisha");
this. page.locator("input[type='text']").nth(3).click()
await page.locator("input[type='text']").nth(3).fill("rahulshettyacademy");
await page.locator("button[type='submit']").click();




    }





}

await expect(page.locator("text= Coupon Applied")).toHaveText("* Coupon Applied");
await page.locator("[placeholder*='Country']").pressSequentially('ind', { delay: 100 });
const dropdown = await page.locator(".ta-results");
await dropdown.waitFor();
const optionsCount = await dropdown.locator("button").count();
for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
        await dropdown.locator("button").nth(i).click();
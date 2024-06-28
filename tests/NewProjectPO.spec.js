const { test, expect } = require('@playwright/test');
const LoginPage = require('../pageObjects/loginPage');
// placing an order
test.only ('NewProject', async ({ page }) => {
    const products = page.locator(".card-body");
    const username = "anshika@gmail.com";
    const password = "Iamking";
    const ProductName = "ZARA COAT 3";
    await page.title("Let's Shop");
    const loginPage = new LoginPage(page);
    loginPage.goto;
    loginPage.validLogin(username,password);

    // await page.waitForLoadState('networkidle');
    const titles = await page.locator(".card-body b").first().waitFor();
    const count = await products.count();
    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === ProductName) {
            // add product to cart 
            await products.nth(i).locator("text = Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart'] ").click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text(' ZARA COAT 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.locator("text=Checkout").click();
    await page.locator("input[type='text']").nth(1).click();
    await page.locator("input[type='text']").nth(1).fill("666");
    await page.locator("input[type='text']").nth(2).click()
    await page.locator("input[type='text']").nth(2).fill("Anisha");
    await page.locator("input[type='text']").nth(3).click()
    await page.locator("input[type='text']").nth(3).fill("rahulshettyacademy");
    await page.locator("button[type='submit']").click();
    await expect(page.locator("text= Coupon Applied")).toHaveText("* Coupon Applied");
    await page.locator("[placeholder*='Country']").pressSequentially('ind', { delay: 100 });
    const dropdown = await page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " India") {
            await dropdown.locator("button").nth(i).click();
            break;
        }

    }

    await expect(page.locator("[style*='lightgray']")).toHaveText("anshika@gmail.com");
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    await page.locator("[routerlink*='myorders']").nth(0).click();
    await page.locator("tbody").waitFor();
    const ordersList = await page.locator("tbody tr");
    const ordersCount = await ordersList.count();
    for (let i = 0; i < ordersCount; i++) {
        const currentRow = await ordersList.nth(i);
        const currentOrderId = await currentRow.locator("th").textContent();
        if (orderId.includes(currentOrderId)) {
            await currentRow.locator("button").nth(0).click();
            break;
        }
    }
    const orderIDDetails = await page.locator(".col-text ").textContent();
    expect(orderId.includes(orderIDDetails)).toBeTruthy();
});


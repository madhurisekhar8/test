const { test, expect, request } = require('@playwright/test');
const loginPayLoad = {userEmail: "anshika@gmail.com", userPassword: "Iamking@000"}
let token;
let orderId;
const orderPayLoad = {orders: [{country: "India", productOrderedId: "6581ca399fd99c85e8ee7f45"}]}


test.beforeAll( async()=>{
    // creates new instance of API request context
    const apiContext = await request.newContext();
    
console.log(token);

// verifying if the order is placed
const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
{
        data: orderPayLoad,
        headers: 
    {
            'Authorization': token,
            'content-type':'application/json'
    }
})
const orderResponseJson = await orderResponse.json();
 orderId = orderResponseJson.orders[0];
console.log(orderId);
    





});
test.beforeEach(()=>{




})
// placing an order
test('NewProject', async ({ page }) => {
    page.addInitScript((value)=>
    {
        window.localStorage.setItem('token', value);
    },token );

    
    await page.goto("https://rahulshettyacademy.com/client");
    // await page.title("Let's Shop");
    // await page.locator("#userEmail").fill("anshika@gmail.com");
    // await page.locator("#userPassword").fill("Iamking@000");
    // await page.locator("[value='Login']").click();
    // await page.waitForLoadState('networkidle');
    const products = page.locator(".card-body");
    const ProductName = "ZARA COAT 3";
    const titles = await page.locator(".card-body b").first().waitFor();
    const count = await products.count();
    for (let i = 0; i < count; ++i) 
        {
        if (await products.nth(i).locator("b").textContent() === ProductName) 
        {
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
// verifying if order is placed 
// creating order is pre request but here we need to test if it is created 



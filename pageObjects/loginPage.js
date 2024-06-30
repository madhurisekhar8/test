class LoginPage{
    constructor(page){
        this.page=page;
        this.signInButton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");

    }

    async goTo()
    {
        await this.page("https://rahulshettyacademy.com/client");


        console.log('fixed');



    }
    async validLogin(){

        await this.userName.fill("anshika@gmail.com");
        await this.password.fill("Iamking@000");
        await  this.signInButton.click();
}
}
module.exports = {LoginPage};
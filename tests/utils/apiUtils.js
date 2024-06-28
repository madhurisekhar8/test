class apiUtils
{
    constructor(apiContext){
        this.apiContext= apiContext;


    }

    async getToken(){
        const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
            data: loginPayLoad
    
        })
        // to check if the login is sucessfull 
        // should use ok() to check if it is 
        expect(loginResponse.ok()).toBeTruthy();
        // we used json() to get the result in javascript object notation
        const loginResponseJson = await loginResponse.json();
            // result for the above  statement is 
    //         {
    //   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBjN2JmMTQ4NzY3ZjFmMTIxNWQyY2EiLCJ1c2VyRW1haWwiOiJhbnNoaWthQGdtYWlsLmNvbSIsInVzZXJNb2JpbGUiOjk4NzY1NDMyMTAsImlhdCI6MTcxODQ2NDY1MCwiZXhwIjoxNzUwMDIyMjUwfQ.qcG5WFAJydAap4W0ZgLbMNDETCVi7BvZ6yPvEVzW7BU',
    //   userId: '620c7bf148767f1f1215d2ca',
    //   message: 'Login Successfully'
    // }
    
    // we are just extraction only token from the output we got(as per above output)
     token = loginResponseJson.token;
     return token;


    }




} 
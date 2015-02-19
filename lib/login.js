/******************************************************************************
 * Simple login dialog singleton.
 *****************************************************************************/

var login = {

    userName: null,
    password: null,

    /******************************************************************************
     * Call from event handler for clicking the login button.
     * Note the DIV is not a button so you have to click it.
     *****************************************************************************/
    handleLoginClick: function (loginAction) {
        // Hide the login DIV so they can't click it more than once.
        document.getElementById("loginButton").style.display = "none";
        document.getElementById("loginButtonDisabled").style.display = "block";

        this.userName = getHTMLInputValue("userName");
        this.password = getHTMLInputValue("password");

        loginAction();
    },


    /******************************************************************************
     * Call this method for successful login.
     * Hides the login window.
     *****************************************************************************/
    loginOk: function (afterLoginAction) {
        document.getElementById("loginWindow").style.display = "none";

        afterLoginAction();
    },


    /******************************************************************************
     * Callback function for login failure.
     *****************************************************************************/
    loginFail: function () {
        document.getElementById("loginButton").style.display = "block";
        document.getElementById("loginButtonDisabled").style.display = "none";

        document.getElementById("loginMessage").innerHTML = "Login failed, please try again.";
        document.getElementById("loginMessageWindow").style.display = "block";
    }

};
/******************************************************************************
 * Common code for simple Javascript CMIS client applications.
 * Mainly deals with login and establishing a connection to the repository.
 *****************************************************************************/



// GLOBAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Connection options.
 *****************************************************************************/
var cmisConfig = {
   "serverUrl": null,
   "userName": null,
   "password": null
};


/******************************************************************************
 * CMIS session object (this comes from cmis.js).
 *****************************************************************************/
var session;


/******************************************************************************
 * login object (this comes from login.js).
 *****************************************************************************/
var login;



// MAIN ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onload = main;

function main() {
   // This is mainly as a hint to the user, or a reminder for me, what the
   // endpoint syntax looks like. You still have to fill in the server part.
   login.server = "http://myserver/nuxeo/json/cmis";

   document.getElementById("server").value = login.server;
   document.getElementById("loginButton").addEventListener("click", handleLoginClick);
}



// LOGIN //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Event handler for clicking the login button.
 *****************************************************************************/
function handleLoginClick(event) {
   login.handleLoginClick(startCMISSession);
}


/******************************************************************************
 * The main point of this is to see if the credentials work.
 *****************************************************************************/
function startCMISSession() {
   cmisConfig.userName = login.userName;
   cmisConfig.password = login.password;
   cmisConfig.serverUrl = login.server;

   session = cmis.createSession(cmisConfig.serverUrl);
   session.setCredentials(cmisConfig.userName, cmisConfig.password);
   session.loadRepositories().ok(cmisLoginOk).notOk(cmisLoginFail).error(cmisLoginFail);
}


/******************************************************************************
 * Callback function for CMIS login success.
 * Note 'initializeCmisApp' is declared in each app.
 *****************************************************************************/
function cmisLoginOk() {
   login.loginOk(initializeCmisApp);
}


/******************************************************************************
 * Callback function for CMIS login failure.
 *****************************************************************************/
function cmisLoginFail() {
   login.loginFail();
}
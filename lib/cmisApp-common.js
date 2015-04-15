/******************************************************************************
 * Common code for simple Javascript CMIS client applications.
 * Mainly deals with login and establishing a connection to the repository.
 *****************************************************************************/



// GLOBAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Default connection options.
 *****************************************************************************/
var cmisConfig = {
    // I'm cheating a little using the hostname, because the Apache server is
    // on the same machine as the Nuxeo server; this makes development much
    // easier as I can easily access both apps from another machine.
    serverUrl: "http://cm.cloud.nuxeo.com/nuxeo/json/cmis",
    userName: null,
    password: null
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
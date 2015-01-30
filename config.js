// I'm u sing CORS with Nuxeo so need to configure the header.
$.ajaxSetup({
    headers: {
        "Access-Control-Allow-Origin": "http://localhost"
    }
});

// Eventually I will collect the username and password from the UI.
var cmisOptions = {
    // Your CMIS endpoint url for Nuxeo:
    serverUrl: "http://localhost:8080/nuxeo/json/cmis",
    username: "Administrator",
    password: "Administrator"
};
/******************************************************************************
 * VERY simple Javascript CMIS client application.
 * Used to update the metadata for a document stored in Nuxeo.
 *****************************************************************************/

// GLOBAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * This is the in-memory copy of the Insurancee Claim Form (ICF).
 * It's possible I don't need this, that I could just directly use the object
 * returned via CMIS but it's my habit to copy values back and forth.
 *****************************************************************************/
var localInsuranceClaimForm = {
    objectId: null,
    firstName: null,
    lastName: null,
    phoneMain: null,
    contractId: null,
    incidentDate: null,
    typeAccident: null,
    typeBreakdown: null,
    typeOther: null,
    incidentDescription: null,
    comment: null
};


/******************************************************************************
 * Default connection options.
 *****************************************************************************/
var cmisConfig = {
    // I'm cheating a little because the Apache server is on the same machine as
    // the Nuxeo server; this makes development much easier as I can easily access
    // both apps from another machine.
    serverUrl: "http://" + window.location.hostname + ":8080/nuxeo/json/cmis",
    username: null,
    password: null
};


/******************************************************************************
 * CMIS session object (this comes from cmis.js).
 *****************************************************************************/
var session;



// MAIN ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * This is where the "magic" happens...
 *****************************************************************************/
window.onload = main;

function main() {
    document.getElementById("loginButton").addEventListener("click", handleLoginClick);
}



// LOGIN //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Event handler for clicking the login button.
 * Note the DIV is not a button so you have to click it.
 *****************************************************************************/
function handleLoginClick(event) {
    // Hide the login DIV so they can't click it more than once.
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("loginButtonDisabled").style.display = "block";

    cmisConfig.username = getHTMLInputValue("userName");
    cmisConfig.password = getHTMLInputValue("password");

    startCMISSession();
}


/******************************************************************************
 * The main point of this is to see if the credentials work.
 *****************************************************************************/
function startCMISSession() {
    session = cmis.createSession(cmisConfig.serverUrl);
    session.setCredentials(cmisConfig.username, cmisConfig.password);
    session.loadRepositories().ok(loginOk).notOk(loginFail).error(loginFail);
}



// CMISAPP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Callback method for successful login.
 * Hide the login window, show the app, then fetch the data.
 *****************************************************************************/
function loginOk() {
    document.getElementById("loginWindow").style.display = "none";
    document.getElementById("cmisApp").style.display = "inline-block";

    initializeCmisApp();
}


/******************************************************************************
 * Prepare the CMISapp.
 *****************************************************************************/
function initializeCmisApp() {
    // TEST CODE only, hard coded document ID.
    // Eventually this should be pulled from the URL.
    localInsuranceClaimForm.objectId = "f8935016-d323-4ac7-8203-ec4bd7183382";

    // Fetch the document via CMIS, show values in UI.
    getDocument(localInsuranceClaimForm.objectId, loadContent, documentMissing);

    // Don't forget to handle the Submit button!
    document.getElementById("submitButton").addEventListener("click", handleSubmitClick);
}


/******************************************************************************
 * Callback function.
 * Given the document returned via CMIS, copy the data to
 * localInsuranceClaimForm and then to the UI.
 *****************************************************************************/
function loadContent(remoteInsuranceClaimForm) {
    // Get values from the ICF returned via CMIS.
    localInsuranceClaimForm.firstName = remoteInsuranceClaimForm.succinctProperties['pein:first_name'];
    localInsuranceClaimForm.lastName = remoteInsuranceClaimForm.succinctProperties['pein:last_name'];
    localInsuranceClaimForm.phoneMain = remoteInsuranceClaimForm.succinctProperties['pein:phone_main'];
    localInsuranceClaimForm.contractId = remoteInsuranceClaimForm.succinctProperties['incf:contract_id'];
    localInsuranceClaimForm.incidentDate = remoteInsuranceClaimForm.succinctProperties['incf:incident_date'];
    localInsuranceClaimForm.typeAccident = remoteInsuranceClaimForm.succinctProperties['incf:type_accident'];
    localInsuranceClaimForm.typeBreakdown = remoteInsuranceClaimForm.succinctProperties['incf:type_breakdown'];
    localInsuranceClaimForm.typeOther = remoteInsuranceClaimForm.succinctProperties['incf:type_other'];
    localInsuranceClaimForm.incidentDescription = remoteInsuranceClaimForm.succinctProperties['incf:incident_description'];
    localInsuranceClaimForm.comment = remoteInsuranceClaimForm.succinctProperties['incf:comment'];


    // Map the values to the UI.
    setHTMLInputValue("firstName", localInsuranceClaimForm.firstName);
    setHTMLInputValue("lastName", localInsuranceClaimForm.lastName);
    setHTMLInputValue("phoneMain", localInsuranceClaimForm.phoneMain);
    setHTMLInputValue("contractId", localInsuranceClaimForm.contractId);
    setHTMLInputValue("incidentDescription", localInsuranceClaimForm.incidentDescription);

    // Dates are a little different than plain text.
    document.getElementById("incidentDate").valueAsDate = new Date(localInsuranceClaimForm.incidentDate);

    // The incident type is stored as a string so it requires some logic to represent meaningfully (i.e. as a radio button set).
    if (localInsuranceClaimForm.typeAccident == "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (localInsuranceClaimForm.typeBreakdown == "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (localInsuranceClaimForm.typeOther == "X") {
        document.getElementById("typeOther").checked = true;
    }

    document.getElementById("claimDeptComment").innerHTML = localInsuranceClaimForm.comment;
}



// ON SAVE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Event handler for clicking the Submit button.
 *****************************************************************************/
function handleSubmitClick(event) {
    // Disable the submit button.
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("submitButton_disabled").style.display = "inline-block";

    // Gray out the app.
    grayOut(true);

    // Submit the changes.
    submitChanges();
}


/******************************************************************************
 *  Save changes.
 *****************************************************************************/
function submitChanges() {
    // Get values from the UI.
    mapUIToLocalInsuranceClaimForm();

    // Save everything back to the server.
    updateRemoteInsuranceClaimForm();
}


/******************************************************************************
 * Get the values from the UI, copy them to the localInsuranceClaimForm.
 *****************************************************************************/
function mapUIToLocalInsuranceClaimForm() {
    // Get text values from the UI.
    localInsuranceClaimForm.firstName = getHTMLInputValue("firstName");
    localInsuranceClaimForm.lastName = getHTMLInputValue("lastName");
    localInsuranceClaimForm.phoneMain = getHTMLInputValue("phoneMain");
    localInsuranceClaimForm.contractId = getHTMLInputValue("contractId");
    localInsuranceClaimForm.incidentDescription = getHTMLInputValue("incidentDescription");

    // Dates must be handled differently.
    var theDate = html5DateToDate(document.getElementById("incidentDate").value);
    localInsuranceClaimForm.incidentDate = Date.parse(theDate); // Convert to ms.

    // Map the radio button values.
    localInsuranceClaimForm.typeAccident = "O";
    localInsuranceClaimForm.typeBreakdown = "O";
    localInsuranceClaimForm.typeOther = "O";

    if (document.getElementById("typeAccident").checked == true) {
        localInsuranceClaimForm.typeAccident = "X";
    } else if (document.getElementById("typeBreakdown").checked == true) {
        localInsuranceClaimForm.typeBreakdown = "X";
    } else if (document.getElementById("typeOther").checked == true) {
        localInsuranceClaimForm.typeOther = "X";
    }

    // A bit of a hack to let Nuxeo know that the document was updated by this Web app.
    // This will move the workflow forward.
    localInsuranceClaimForm.comment = "updated";
}


/******************************************************************************
 *  Submit changes back to the server.
 *****************************************************************************/
function updateRemoteInsuranceClaimForm() {
    // Update.
    session.updateProperties(localInsuranceClaimForm.objectId, {
        "pein:first_name": localInsuranceClaimForm.firstName,
        "pein:last_name": localInsuranceClaimForm.lastName,
        "pein:phone_main": localInsuranceClaimForm.phoneMain,
        "incf:contract_id": localInsuranceClaimForm.contractId,
        "incf:incident_date": localInsuranceClaimForm.incidentDate,
        "incf:type_accident": localInsuranceClaimForm.typeAccident,
        "incf:type_breakdown": localInsuranceClaimForm.typeBreakdown,
        "incf:type_other": localInsuranceClaimForm.typeOther,
        "incf:incident_description": localInsuranceClaimForm.incidentDescription
    }).ok(saveSuccess).notOk(saveFail);

    // TODO: Support versioning.  The checkIn method expects a bunch of params
    // that I don't understand, so I'm not doing versioning for now.
    /*    
    // Check out.
    session.checkOut(localInsuranceClaimForm.objectId).ok(function (data) {

        // Update.
        session.updateProperties(localInsuranceClaimForm.objectId, {
            "pein:first_name": localInsuranceClaimForm.firstName,
            "pein:last_name": localInsuranceClaimForm.lastName,
            "pein:phone_main": localInsuranceClaimForm.phoneMain,
            "incf:contract_id": localInsuranceClaimForm.contractId,
            "incf:incident_date": localInsuranceClaimForm.incidentDate,
            "incf:type_accident": localInsuranceClaimForm.typeBreakdown,
            "incf:type_breakdown": localInsuranceClaimForm.typeBreakdown,
            "incf:type_other": localInsuranceClaimForm.lastypeOthertName,
            "incf:incident_description": localInsuranceClaimForm.incidentDescription
        }).ok(function (data) {

            // Check in.
            session.checkIn(localInsuranceClaimForm.objectId, true, xxx, yyy, zzz).ok(function (data) {
                // If ok, show the thank you page.
                saveSuccess();
            }).notOk(cmisRequestNotOK);
        }).notOk(cmisRequestNotOK);
    }).notOk(cmisRequestNotOK);
    */
}


/******************************************************************************
 *  Callback function for successful save.
 *  Display a message to the user.
 *****************************************************************************/
function saveSuccess() {
    document.getElementById("submitButton_disabled").style.display = "none";
    document.getElementById("submitButton_done").style.display = "inline-block";

    showResultWindow("Claim updated!");
}



function showResultWindow(message) {
    document.getElementById("submitMessage").innerHTML = message;
    document.getElementById("resultWindow").style.display = "table";
}

// ERROR HANDLING /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Callback function for login failure.
 *****************************************************************************/
function loginFail() {
    document.getElementById("loginButton").style.display = "block";
    document.getElementById("loginButtonDisabled").style.display = "none";

    document.getElementById("loginMessage").innerHTML = "Login failed, please try again.";
    document.getElementById("loginMessageWindow").style.display = "block";
}


/******************************************************************************
 *  Callback for missing document.
 *****************************************************************************/
function documentMissing() {
    document.getElementById("submitButton").style.display = "none";
    grayOut(true);
    showResultWindow("Unable to access claim form!");
}

/******************************************************************************
 *  Callback function for unsuccessful save.
 *  Display a message to the user.
 *****************************************************************************/
function saveFail() {
    document.getElementById("submitButton_disabled").style.display = "none";
    document.getElementById("submitButton_done").style.display = "inline-block";

    showResultWindow("Update failed!");
}



// UTILITY FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Helper function to fetch a document via CMIS.
 *****************************************************************************/
function getDocument(id, okCallback, errorCallback) {
    session.getObject(id).ok(okCallback).notOk(errorCallback);
}
/*

Here's a summary of the CMIS calls that are used:

session = cmis.createSession()
session.setCredentials()
session.loadRepositories()
session.getObject()
session.checkOut()
session.updateProperties()
session.checkIn()

*/



/******************************************************************************
 * VERY simple Javascript CMIS client application.
 * Used to update the metadata for a document stored in Nuxeo.
 *****************************************************************************/



// GLOBAL SETTINGS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * This is the in-memory copy of the Insurancee Claim Form (ICF).
 * It's possible I don't need this, that I could just directly use the object
 * returned via CMIS but it's my habit to copy values to a local object.
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



// CMISAPP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Prepare the CMISapp.
 *****************************************************************************/
function initializeCmisApp() {
    document.getElementById("cmisApp").style.display = "block";

    // Get document id from the URL. 
    localInsuranceClaimForm.objectId = getURLParameter("docID");

    // Fetch the document via CMIS, show values in UI.
    getDocument(localInsuranceClaimForm.objectId, loadContent, documentMissing);
    /**
     * In retrospect what I should have done here was used a Query to return
     * only the fields I want. Fetching the entire document brings over a bunch
     * of properties that I don't actually use.  On the other hand I wonder
     * what the performance penalty of the query vs just directly accessing the
     * document would be?
     */

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
 * Save changes.
 *****************************************************************************/
function submitChanges() {
    // Get values from the UI.
    mapUIToLocalInsuranceClaimForm();

    // Save everything back to the server.
    checkOutInsuranceClaimForm();
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
}


/******************************************************************************
 * Check out the document so we can create a version.
 *****************************************************************************/
function checkOutInsuranceClaimForm() {
    session.checkOut(localInsuranceClaimForm.objectId).ok(updateRemoteInsuranceClaimForm).notOk(saveFail).error(saveFail);
}


/******************************************************************************
 * Update the document.
 *****************************************************************************/
function updateRemoteInsuranceClaimForm(data) {
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
    }).ok(checkInInsuranceClaimForm).notOk(saveFail).error(saveFail);
}


/******************************************************************************
 * Commit the changes.
 *****************************************************************************/
function checkInInsuranceClaimForm(data) {
    session.checkIn(localInsuranceClaimForm.objectId, false).ok(saveSuccess).notOk(saveFail).error(saveFail);
}


/******************************************************************************
 * Callback function for successful save.
 * Display a message to the user.
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
 * Callback for missing document.
 *****************************************************************************/
function documentMissing() {
    document.getElementById("submitButton").style.display = "none";
    grayOut(true);
    showResultWindow("Unable to access claim form!");
}


/******************************************************************************
 * Callback function for unsuccessful save.
 * Display a message to the user.
 * Log the data.
 *****************************************************************************/
function saveFail(data) {
    document.getElementById("submitButton_disabled").style.display = "none";
    document.getElementById("submitButton_done").style.display = "inline-block";

    showResultWindow("Update failed!");
    console.log(data)
}



// UTILITY FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Helper function to fetch a document via CMIS.
 *****************************************************************************/
function getDocument(id, okCallback, errorCallback) {
    session.getObject(id).ok(okCallback).notOk(errorCallback);
}
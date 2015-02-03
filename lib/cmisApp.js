/**
 * VERY simple Javascript CMIS application.
 * Used to update the metadata for a document stored in Nuxeo.
 */

/**
 * This is the in-memory copy of the Insurage Claim form.
 * It's possible I don't need this, that I could just directly use the object returned via CMIS but it's my habit to copy values back and forth.
 */
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
    incidentDescription: null
};

/** 
 * Default connection options.  The user namd and password should eventuall come from the UI.
 */
var cmisConfig = {
    serverUrl: "http://localhost:8080/nuxeo/json/cmis",
    username: "Administrator",
    password: "Administrator"
};

/**
 * CMIS session object.
 */
var session;


/**
 * Set value of an HTML Input field in the UI.
 */
function setHTMLInputValue(element, content) {
    document.getElementById(element).value = content;
}


/**
 * Given the document returned via CMIS, copy the data to the localInsuranceClaimForm and then to the UI.
 */
function getRemoteInsuranceClaimFormContent(remoteInsuranceClaimForm) {
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

    // Map these values to the UI.
    setHTMLInputValue("firstName", localInsuranceClaimForm.firstName);
    setHTMLInputValue("lastName", localInsuranceClaimForm.lastName);
    setHTMLInputValue("phoneMain", localInsuranceClaimForm.phoneMain);
    setHTMLInputValue("contractId", localInsuranceClaimForm.contractId);
    setHTMLInputValue("incidentDescription", localInsuranceClaimForm.incidentDescription);

    // Dates are a little different than plain text.
    document.getElementById("incidentDate").valueAsDate = new Date(localInsuranceClaimForm.incidentDate);

    // The incident type is stored as a string so it requires some logic to represent meaningfully (i.e. as a radio button set).
    if (localInsuranceClaimForm.typeAccident = "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (localInsuranceClaimForm.typeBreakdown = "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (localInsuranceClaimForm.typeOther = "X") {
        document.getElementById("typeOther").checked = true;
    }
}


/**
 * Get value of an HTML Input field from the UI.
 */
function getHTMLInputValue(element) {
    return document.getElementById(element).value;
}


/**
 * Get the values from the UI, copy them to the localInsuranceClaimForm, then write them back to the server.
 */
function setRemoteInsuranceClaimFormContent() {
    // Get values from the UI.
    localInsuranceClaimForm.firstName = getHTMLInputValue("firstName");
    localInsuranceClaimForm.lastName = getHTMLInputValue("lastName");
    localInsuranceClaimForm.phoneMain = getHTMLInputValue("phoneMain");
    localInsuranceClaimForm.contractId = getHTMLInputValue("contractId");
    localInsuranceClaimForm.incidentDescription = getHTMLInputValue("incidentDescription");

    /*
    localInsuranceClaimForm.typeAccident = remoteInsuranceClaimForm.succinctProperties['incf:type_accident'];
    localInsuranceClaimForm.typeBreakdown = remoteInsuranceClaimForm.succinctProperties['incf:type_breakdown'];
    localInsuranceClaimForm.typeOther = remoteInsuranceClaimForm.succinctProperties['incf:type_other'];

    setHTMLInputValue("firstName", localInsuranceClaimForm.firstName);
    setHTMLInputValue("lastName", localInsuranceClaimForm.lastName);
    setHTMLInputValue("phoneMain", localInsuranceClaimForm.phoneMain);
    setHTMLInputValue("contractId", localInsuranceClaimForm.contractId);
    setHTMLInputValue("incidentDescription", localInsuranceClaimForm.incidentDescription);

    // document.getElementById("incidentDate").innerHTML = new Date(localInsuranceClaimForm.incidentDate).toLocaleDateString();
    document.getElementById("incidentDate").valueAsDate = new Date(localInsuranceClaimForm.incidentDate);

    if (localInsuranceClaimForm.typeAccident = "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (localInsuranceClaimForm.typeBreakdown = "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (localInsuranceClaimForm.typeOther = "X") {
        document.getElementById("typeOther").checked = true;
    }
    */
}


/**
 * Helper function to fetch the document via CMIS.
 */
function getDocument(id, callback) {
    session.getObject(id).ok(callback);
}


/**
 * Event handler for clicking the Submit button.
 */
function handleSubmitClick(event) {
    // Disable the submit button.
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("submitButton_disabled").style.display = "inline-block";
    grayOut(true);

    // Submit the changes.
    session.updateProperties(localInsuranceClaimForm.objectId, {
        "pein:first_name": localInsuranceClaimForm.firstName
    }).ok(function (data) {
        console.log(data)
    });
    // If ok, show the thank you page.
    // If not ok show an error.
}

/**
 * This is where the "magic" happens...
 */
function main() {
    // TEST CODE only, hard coded document.
    localInsuranceClaimForm.objectId = "61c59aa9-88d1-42da-8ae7-559c6bece701"; // BIC_DOC1.pdf 

    getDocument(localInsuranceClaimForm.objectId, getRemoteInsuranceClaimFormContent);

    document.getElementById("submitButton").addEventListener("click", handleSubmitClick);
}


var session = cmis.createSession(cmisConfig.serverUrl);
session.setCredentials(cmisConfig.username, cmisConfig.password);
session.loadRepositories().ok(main);


/**
 * Experiments.
 
session.loadRepositories().ok(changeDocumentName);
session.loadRepositories().ok(documentToConsole);
function showDocumentTitle(remoteInsuranceClaimForm) {
    var documentTitle = remoteInsuranceClaimForm.succinctProperties['dc:title'];
    document.getElementById("cmisApp").innerHTML = documentTitle;
}

function documentToConsole(data) {
    console.log(data);
}


function changeDocumentName() {
    session.updateProperties(objectId, {
        "dc:title": "BIC_DOC1.pdf"
    });
}

*/
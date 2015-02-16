/**
 * VERY simple Javascript CMIS application.
 * Used to update the metadata for a document stored in Nuxeo.
 */

/**
 * This is the in-memory copy of the Insurage Claim form.
 * It's possible I don't need this, that I could just directly use the object returned via CMIS but it's my habit to copy values back and forth.
 */
var localInsuranceClaim = {
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
 * Given the document returned via CMIS, copy the data to the localInsuranceClaim and then to the UI.
 */
function getRemoteInsuranceClaimFormContent(remoteInsuranceClaimForm) {
    // Get values from the ICF returned via CMIS.
    localInsuranceClaim.firstName = remoteInsuranceClaimForm.succinctProperties['pein:first_name'];
    localInsuranceClaim.lastName = remoteInsuranceClaimForm.succinctProperties['pein:last_name'];
    localInsuranceClaim.phoneMain = remoteInsuranceClaimForm.succinctProperties['pein:phone_main'];
    localInsuranceClaim.contractId = remoteInsuranceClaimForm.succinctProperties['incf:contract_id'];
    localInsuranceClaim.incidentDate = remoteInsuranceClaimForm.succinctProperties['incf:incident_date'];
    localInsuranceClaim.typeAccident = remoteInsuranceClaimForm.succinctProperties['incf:type_accident'];
    localInsuranceClaim.typeBreakdown = remoteInsuranceClaimForm.succinctProperties['incf:type_breakdown'];
    localInsuranceClaim.typeOther = remoteInsuranceClaimForm.succinctProperties['incf:type_other'];
    localInsuranceClaim.incidentDescription = remoteInsuranceClaimForm.succinctProperties['incf:incident_description'];

    // Map these values to the UI.
    setHTMLInputValue("firstName", localInsuranceClaim.firstName);
    setHTMLInputValue("lastName", localInsuranceClaim.lastName);
    setHTMLInputValue("phoneMain", localInsuranceClaim.phoneMain);
    setHTMLInputValue("contractId", localInsuranceClaim.contractId);
    setHTMLInputValue("incidentDescription", localInsuranceClaim.incidentDescription);

    // Dates are a little different than plain text.
    document.getElementById("incidentDate").valueAsDate = new Date(localInsuranceClaim.incidentDate);

    // The incident type is stored as a string so it requires some logic to represent meaningfully (i.e. as a radio button set).
    if (localInsuranceClaim.typeAccident = "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (localInsuranceClaim.typeBreakdown = "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (localInsuranceClaim.typeOther = "X") {
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
 * Get the values from the UI, copy them to the localInsuranceClaim, then write them back to the server.
 */
function setRemoteInsuranceClaimFormContent() {
    // Get values from the UI.
    localInsuranceClaim.firstName = getHTMLInputValue("firstName");
    localInsuranceClaim.lastName = getHTMLInputValue("lastName");
    localInsuranceClaim.phoneMain = getHTMLInputValue("phoneMain");
    localInsuranceClaim.contractId = getHTMLInputValue("contractId");
    localInsuranceClaim.incidentDescription = getHTMLInputValue("incidentDescription");

    /*
    localInsuranceClaim.typeAccident = remoteInsuranceClaimForm.succinctProperties['incf:type_accident'];
    localInsuranceClaim.typeBreakdown = remoteInsuranceClaimForm.succinctProperties['incf:type_breakdown'];
    localInsuranceClaim.typeOther = remoteInsuranceClaimForm.succinctProperties['incf:type_other'];

    setHTMLInputValue("firstName", localInsuranceClaim.firstName);
    setHTMLInputValue("lastName", localInsuranceClaim.lastName);
    setHTMLInputValue("phoneMain", localInsuranceClaim.phoneMain);
    setHTMLInputValue("contractId", localInsuranceClaim.contractId);
    setHTMLInputValue("incidentDescription", localInsuranceClaim.incidentDescription);

    // document.getElementById("incidentDate").innerHTML = new Date(localInsuranceClaim.incidentDate).toLocaleDateString();
    document.getElementById("incidentDate").valueAsDate = new Date(localInsuranceClaim.incidentDate);

    if (localInsuranceClaim.typeAccident = "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (localInsuranceClaim.typeBreakdown = "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (localInsuranceClaim.typeOther = "X") {
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
    session.updateProperties(localInsuranceClaim.objectId, {
        "pein:first_name": localInsuranceClaim.firstName
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
    localInsuranceClaim.objectId = "60b01c93-02bd-44e3-9ccb-a44c101bca5f";

    /*
    session.getRenditions(localInsuranceClaim.objectId).ok(function (data) {
        console.log(data);
    });
    */

    session.getContentStream(localInsuranceClaim.objectId, true, {
        streamId: "nuxeo:rendition:poop"
    });


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
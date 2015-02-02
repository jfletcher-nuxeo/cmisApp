/**
 * VERY simple Javascript CMIS application.
 * Used to update the metadata for a document stored in Nuxeo.
 */

var insuranceClaimForm = {
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

// Default options.
var cmisConfig = {
    serverUrl: "http://localhost:8080/nuxeo/json/cmis",
    username: "Administrator",
    password: "Administrator",
    objectId: "61c59aa9-88d1-42da-8ae7-559c6bece701", // BIC_DOC1.pdf 
    objectPath: "Insurance Claims/Misc./Incoming/BIC_DOC1.pdf"
};

var session = cmis.createSession(cmisConfig.serverUrl);
session.setCredentials(cmisConfig.username, cmisConfig.password);



function setFieldValue(element, content) {
    document.getElementById(element).value = content;
}


function getInsuranceClaimFormContent(theDocument) {
    insuranceClaimForm.firstName = theDocument.succinctProperties['pein:first_name'];
    insuranceClaimForm.lastName = theDocument.succinctProperties['pein:last_name'];
    insuranceClaimForm.phoneMain = theDocument.succinctProperties['pein:phone_main'];
    insuranceClaimForm.contractId = theDocument.succinctProperties['incf:contract_id'];
    insuranceClaimForm.incidentDate = theDocument.succinctProperties['incf:incident_date'];
    insuranceClaimForm.typeAccident = theDocument.succinctProperties['incf:type_accident'];
    insuranceClaimForm.typeBreakdown = theDocument.succinctProperties['incf:type_breakdown'];
    insuranceClaimForm.typeOther = theDocument.succinctProperties['incf:type_other'];
    insuranceClaimForm.incidentDescription = theDocument.succinctProperties['incf:incident_description'];

    setFieldValue("firstName", insuranceClaimForm.firstName);
    setFieldValue("lastName", insuranceClaimForm.lastName);
    setFieldValue("phoneMain", insuranceClaimForm.phoneMain);
    setFieldValue("contractId", insuranceClaimForm.contractId);
    setFieldValue("incidentDescription", insuranceClaimForm.incidentDescription);

    // document.getElementById("incidentDate").innerHTML = new Date(insuranceClaimForm.incidentDate).toLocaleDateString();
    document.getElementById("incidentDate").valueAsDate = new Date(insuranceClaimForm.incidentDate);

    if (insuranceClaimForm.typeAccident = "X") {
        document.getElementById("typeAccident").checked = true;
    } else if (insuranceClaimForm.typeBreakdown = "X") {
        document.getElementById("typeBreakdown").checked = true;
    } else if (insuranceClaimForm.typeOther = "X") {
        document.getElementById("typeOther").checked = true;
    }
}



function getDocument(id, callback) {
    session.getObject(id).ok(callback);
}

function handleSubmitClick(event) {
    // Disable the submit button.
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("submitButton_disabled").style.display = "inline-block";
    document.getElementById("cover").style.visibility = "visible";
    grayOut(true);
    // Submit the changes.
    // If ok, show the thank you page.
    // If not ok show an error.
}


function main() {
    getDocument(cmisConfig.objectId, getInsuranceClaimFormContent);

    document.getElementById("submitButton").addEventListener("click", handleSubmitClick);
}

session.loadRepositories().ok(main);


/**
 * Experiments.
 
session.loadRepositories().ok(changeDocumentName);
session.loadRepositories().ok(documentToConsole);
function showDocumentTitle(theDocument) {
    var documentTitle = theDocument.succinctProperties['dc:title'];
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
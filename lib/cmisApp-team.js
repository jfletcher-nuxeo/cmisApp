/*

Here's a summary of the CMIS calls that are used:

session = cmis.createSession()
session.setCredentials()
session.loadRepositories()
session.query()
session.getContentStreamURL()

*/



/******************************************************************************
 * Simple Javascript CMIS client application.
 * Demonstrate Rendition access via CMIS.
 *****************************************************************************/



// CMISAPP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/******************************************************************************
 * Prepare the CMISapp.
 *****************************************************************************/
function initializeCmisApp() {

    document.getElementById("cmisApp").style.display = "block";

    // Get all the claims belonging to the logged in user.
    var query = "";
    query = query + "SELECT ";
    query = query + "   cmis:objectId, ";
    query = query + "   incl:incident_id, ";
    query = query + "   pein:first_name, ";
    query = query + "   pein:last_name, ";
    query = query + "   nuxeo:lifecycleState ";
    query = query + "FROM ";
    query = query + "   InsuranceClaim ";
    query = query + "WHERE ";
    query = query + "   cmis:createdBy = '" + cmisConfig.userName + "' ";
    query = query + "ORDER BY ";
    query = query + "   incl:incident_id";

    session.query(query).ok(fillClaimList);
}


/******************************************************************************
 * Create list of claims.
 *****************************************************************************/
function fillClaimList(queryResults) {
    var claimListBody = "";

    // Loop over the results and fetch each document.
    var len = queryResults.results.length;

    for (var i = 0; i < len; i++) {
        // Write out a list of the results.
        claimListBody = claimListBody + "<tr class=\"claimListRow\">";
        claimListBody = claimListBody + createClaimListCell(queryResults.results[i].succinctProperties['incl:incident_id'], "claimListBodyCell");
        claimListBody = claimListBody + createClaimListCell(queryResults.results[i].succinctProperties['pein:first_name'], "claimListBodyCell");
        claimListBody = claimListBody + createClaimListCell(queryResults.results[i].succinctProperties['pein:last_name'], "claimListBodyCell");
        claimListBody = claimListBody + createClaimListCell(queryResults.results[i].succinctProperties['nuxeo:lifecycleState'], "claimListBodyCell");
        // This is the link to download the rendition.
        claimListBody = claimListBody + createClaimListCell(createClaimReportLink(queryResults.results[i].succinctProperties['cmis:objectId']), "claimListBodyDownloadCell");
        claimListBody = claimListBody + "</tr>";
    }

    document.getElementById("claimListBody").innerHTML = claimListBody;
}


/******************************************************************************
 * Create claim list body cell.
 * Specify the CSS class in "cellType".
 *****************************************************************************/
function createClaimListCell(cellData, cellType) {
    var tableCell = "<td class=\"" + cellType + "\">" + cellData + "</td>";
    return tableCell;
}


/******************************************************************************
 * Create link to Claim Report rendition.
 *****************************************************************************/
function createClaimReportLink(docId) {
    var reportURL = session.getContentStreamURL(docId, true, {
        streamId: "nuxeo:rendition:claimReport"
    });
    var claimReportLink = "<a href=\"" + reportURL + "\"><img src=\"images/download.png\"></a>";
    return claimReportLink;
}
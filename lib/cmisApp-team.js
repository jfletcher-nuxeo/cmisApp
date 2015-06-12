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

   // Loop over the results and fetch each document.

   // Note: the previous version just built a string of HTML and added it as innerHTML.
   // I'm now building the elements with the DOM because a) it's better and b) I need to add an event listener to handle the download via JS.
   var len = queryResults.results.length;

   var claimListTbody = document.getElementById("claimListBody")

   for (var i = 0; i < len; i++) {
      // Write out a list of the results.

      var claimListTr = claimListTbody.insertRow(-1);
      claimListTr.setAttribute("class", "claimListRow");

      // Claim ID
      createStyledTD(
         claimListTr,
         document.createTextNode(queryResults.results[i].succinctProperties['incl:incident_id']),
         "claimListBodyCell"
      );

      // Client first name.
      createStyledTD(
         claimListTr,
         document.createTextNode(queryResults.results[i].succinctProperties['pein:first_name']),
         "claimListBodyCell"
      );

      // Client last name.
      createStyledTD(
         claimListTr,
         document.createTextNode(queryResults.results[i].succinctProperties['pein:last_name']),
         "claimListBodyCell"
      );


      // State of the claim.
      createStyledTD(
         claimListTr,
         document.createTextNode(queryResults.results[i].succinctProperties['nuxeo:lifecycleState']),
         "claimListBodyCell"
      );


      // The following code creates the link to download the rendition.

      // Save the claim id as a custom attribute. I use this for the file name during the download.
      var reportNameAttribute = document.createAttribute("data-reportName");
      reportNameAttribute.value = queryResults.results[i].succinctProperties['incl:incident_id'];

      // Display a generic download icon.
      var newRenditionLinkImage = document.createElement("img");
      newRenditionLinkImage.src = "images/download.png";

      // The id of the HTML element is the id of the document.
      // Easy way to make sure it's unique.
      // I use the docID to get the URL to download the rendition.
      newRenditionLinkImage.id = queryResults.results[i].succinctProperties['cmis:objectId'];

      newRenditionLinkImage.setAttributeNode(reportNameAttribute);
      newRenditionLinkImage.addEventListener("click", handleReportDownload);

      createStyledTD(
         claimListTr,
         newRenditionLinkImage,
         "claimListBodyDownloadCell"
      );

   }

}


/******************************************************************************
 * Dynamically add a td to a tr and assign content and CSS class.
 *****************************************************************************/
function createStyledTD(parentTr, tdData, tdClass) {
   var tdNode = parentTr.insertCell(-1);
   tdNode.appendChild(tdData);
   tdNode.setAttribute("class", tdClass);
}



/******************************************************************************
 * Gather report metadata on click.
 *****************************************************************************/
function handleReportDownload(clickEvent) {
   var docId = clickEvent.target.id;

   var report = {
      "renditionURL": session.getContentStreamURL(docId, true, {
         streamId: "nuxeo:rendition:claimReport"
      }),
      "reportName": clickEvent.target.getAttribute("data-reportName") + ".pdf"
   }

   downloadReport(report);
}


/******************************************************************************
 * Download report.
 *****************************************************************************/
function downloadReport(report) {
   var xhr = new XMLHttpRequest();
   xhr.open('GET', report.renditionURL, true);
   // Set the authorization header.
   xhr.setRequestHeader("Authorization", "Basic " + Base64.encode(login.userName + ":" + login.password));
   xhr.responseType = 'blob';
   xhr.onload = function (e) {
      saveAs(xhr.response, report.reportName);
   }
   xhr.send();
}
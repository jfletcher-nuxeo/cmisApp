function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}


// http://hungred.com/how-to/tutorial-how-does-javascript-grey-out-the-screen/
function grayOut(vis, options, extra) {
    // Pass true to gray out screen, false to ungray
    // options are optional.  This is a JSON object with the following (optional) properties
    // opacity:0-100         // Lower number = less grayout higher = more of a blackout 
    // zindex: #             // HTML elements with a higher zindex appear on top of the gray out
    // bgcolor: (#xxxxxx)    // Standard RGB Hex color code
    // grayOut(true, {'zindex':'50', 'bgcolor':'#0000FF', 'opacity':'70'});
    // Because options is JSON opacity/zindex/bgcolor are all optional and can appear
    // in any order.  Pass only the properties you need to set.
    var options = options || {};
    var zindex = options.zindex || 50;
    var opacity = options.opacity || 70;
    var opaque = (opacity / 100);
    var bgcolor = options.bgcolor || '#000000';
    var dark = document.getElementById('darkenScreenObject');
    if (!dark) {
        // The dark layer doesn't exist, it's never been created.  So we'll
        // create it here and apply some basic styles.
        // If you are getting errors in IE see: http://support.microsoft.com/default.aspx/kb/927917
        var tbody = document.getElementsByTagName("body")[0];
        var tnode = document.createElement('div'); // Create the layer.
        tnode.style.position = 'absolute'; // Position absolutely
        tnode.style.top = '0px'; // In the top
        tnode.style.left = '0px'; // Left corner of the page		
        tnode.style.overflow = 'hidden'; // Try to avoid making scroll bars            
        tnode.style.display = 'none'; // Start out Hidden
        tnode.id = 'darkenScreenObject'; // Name it so we can find it later

        var msgnode = document.createElement('div'); // Create the box layer.
        msgnode.style.position = 'fixed'; // Position fixed
        msgnode.style.display = 'none'; // Start out Hidden
        msgnode.id = 'box'; // Name it so we can find it later
        // give it a size and align it to center
        msgnode.style.width = "300px";
        msgnode.style.height = "300px";
        msgnode.style.marginLeft = "-150px";
        msgnode.style.marginTop = "-150px";
        msgnode.style.textAlign = 'center';
        msgnode.style.top = "50%"; // In the top	
        msgnode.style.left = "50%"; // Left corner of the page	
        tbody.appendChild(msgnode); // Add it to the grey screen
        tbody.appendChild(tnode); // Add it to the web page
        dark = document.getElementById('darkenScreenObject'); // Get the object.
    }
    if (vis) {
        // Calculate the page width and height 
        if (document.body && (document.body.scrollWidth || document.body.scrollHeight)) {
            var pageWidth = document.body.scrollWidth + 'px';
            var pageHeight = document.body.scrollHeight + 'px';
        } else if (document.body.offsetWidth) {
            var pageWidth = document.body.offsetWidth + 'px';
            var pageHeight = document.body.offsetHeight + 'px';
        } else {
            var pageWidth = '100%';
            var pageHeight = '100%';
        }
        //set the shader to cover the entire page and make it visible.
        dark.style.opacity = opaque;
        dark.style.MozOpacity = opaque;
        dark.style.filter = 'alpha(opacity=' + opacity + ')';
        dark.style.zIndex = zindex;
        dark.style.backgroundColor = bgcolor;
        dark.style.width = pageWidth;
        dark.style.height = pageHeight;
        dark.style.display = 'block';
        if (extra == 'Y')
            document.body.style.overflow = 'hidden';

        document.getElementById("box").style.zIndex = zindex + 10;
        document.getElementById("box").style.border = "#000 solid 1px";
        document.getElementById("box").style.display = "block";


        document.getElementById("box").onclick = function () //attach a event handler to hide both div
            {
                dark.style.display = "none";
                document.getElementById("box").style.display = "none";
                document.body.style.overflow = 'auto';

            }
        document.getElementById("box").style.backgroundColor = "#FFF";
        document.getElementById("box").innerHTML = "This is a box. Click me to exit effect.";
    } else {
        dark.style.display = 'none';
    }
}
/******************************************************************************
 * Generic utility functions.
 *****************************************************************************/


/******************************************************************************
 * Get parameter value from URL.
 *****************************************************************************/
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}


/******************************************************************************
 * Set value of an HTML Input element.
 *****************************************************************************/
function setHTMLInputValue(element, content) {
    document.getElementById(element).value = content;
}


/******************************************************************************
 * Get value of an HTML Input element.
 *****************************************************************************/
function getHTMLInputValue(element) {
    return document.getElementById(element).value;
}


/******************************************************************************
 * Convert HTML5 Date Input value to Javascript Date.
 *
 * Explanation:
 *
 *    The algorithm used to create a Date from a string (e.g. new Date("string"))
 *    assumes the string is a UTC date. This is pretty much useless unless you're
 *    actually sitting in the UTC time zone...
 *
 *    The algorithm used to create a Date from parameters (e.g. new Date( yy, mm, dd ))
 *    assumes the params are for a local date.
 *
 *    I don't really care which one is "right" but it should be fricking
 *    consistent!
 *****************************************************************************/
function html5DateToDate(str) {
    var date = str.split("-"),
        yy = date[0],
        mm = date[1] - 1, // Reminder: month starts at 0.
        dd = date[2];
    return (new Date(yy, mm, dd));
}


/******************************************************************************
 * Gray out the entire screen. From here:
 * http://hungred.com/how-to/tutorial-how-does-javascript-grey-out-the-screen/
 *****************************************************************************/
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

    } else {
        dark.style.display = 'none';
    }
}
/*
    File Name:   FormUtils.js
    Author:      Corey Dyson
    Date:        October 15, 2018
    Purpose:     Utility logic that can be used to easily
				 interact with the editor
*/

//initializes the document by clearing the editor, hiding the
//editor, and hiding the message box to present the user with
//a fresh start
function initDocument()
{
	clearForm();
}

/*
 Clears all fields within the editor
*/
function clearForm()
{
	//Will need to add new form fields to this method	

	setFormFieldsEnabled( true );	
}

/*
 Sets all editor fields to enabled ( true ) or 
 disabled ( false )
*/
function setFormFieldsEnabled( bool )
{
	//Add setEnabled calls for form fields here
}

/*
 Editor fields that should never be modified
 ( e.g. Id fields ) should be added to this
 method so that they
 are always set to read-only
*/
function configureReadOnly()
{

}

/*
 Clears the text field within the editor with 
 specified id
*/
function clearTextField( elementId )
{
	setField( elementId, "" );
}

/*
 Clears the options element within the editor with 
 specified name
*/
function clearRadioOptions( elementName )
{
	var elements = document.getElementsByName( elementName );
	
	for( let i = 0; i < elements.length; i++ )
	{
		elements[i].checked = false;
	}
}

/*
 Clears the selection editor within the editor with 
 specified id
*/
function clearSelection( elementId )
{
	var elements = document.getElementById( elementId );
	
	for( let i = 0; i < elements.length; i++ )
	{
		elements[i].checked = false;
	}
}

/*
 Clears the number field within the editor with 
 specified id ( i.e. sets it to '0' )
*/
function clearNumberField( elementId )
{
	setField( elementId, "0" );
}

/*
 Clears the checkbox element within the editor with 
 specified id
*/
function clearCheckbox( elementId ) 
{
    document.getElementById( elementId).checked = false;
}

/*
 Sets the field associated with the specified elementId
 to the specified value
*/
function setField( elementId, value )
{
	document.getElementById( elementId ).value = value;	
}

/*
 Sets the disabled/enabled state of the field associated with the 
 provided element Id to the specified value ( true = enabled 
 false = disabled )
*/
function setEnabled( elementId, bool )
{
	document.getElementById( elementId ).disabled = !bool;
}

/*
 * Sets the disabled/enabled state of the radio buttons associated with the 
 * provided element Id to the specified value ( true = enabled 
 * false = disabled )
 */
function setRadioEnabled( elementId, bool )
{
	var radios = document.getElementsByName( elementId );
	
	for( i = 0; i < radios.length; i++ )
	{
		radios[i].disabled = !bool;
	}
}

/*
 * Populates the editor with the data from the
 * specified image map
 */
function populateForm( imageMap )
{
	//TODO This method should populate all form elements
	//with the values of a given map object
}

/*
 * Creates an image map object from the data currently existing
 * within the editor fields
 */
function createImageMapFromForm()
{
	//TODO need to implement so that form field
	//values are extracted and set on the image map
	//object
}

/*
 * Populates the specified image map with the data
 * currently within the editor's fields
 */
function populateImageMap( imageMap )
{
	if( imageMap.instanceType == "imageMap" )
	{	
		populateMapLayers( imageMap.layers );
	}
}

/*
 * Populates the provided array with layer
 * objects derived from the current values
 * of the image map's form fields
 */
function populateMapLayers( layers )
{
	//TODO: iterate for each layer, read in applicable fields
    // and push each layer onto the provided array 
	
}

/*
 * Creates a shape object with the values of the
 * editor field(s) associated with the provided
 * layer id and shape id value
 */
function createShapeFromEditor( layerId, shapeEditorId )
{
	
	
}


/*
 * Sets the value of the specified element to
 * checked
 */
function setChecked( elementName, value )
{
	var elements = document.getElementsByName( elementName );
	
	for( let i = 0; i < elements.length; i++ )
	{
	if( elements[i].value == value )
	  elements[i].checked = true;
	}
}

/*
 * Sets the value of the selection element associated with 
 * the provided element id to the specified value
 */
function setSelected( elementId, selectedValue )
{
	var elmnt = document.getElementById( elementId );
	
	for(var i=0; i < elmnt.options.length; i++)
	{
		console.log( elmnt.options[i].value );
		if(elmnt.options[i].value === selectedValue ) 
		{
			elmnt.selectedIndex = i;
			break;
		}
	}
}

/*
 * returns the layer id of the currently selected layer
 */
function getSelectedLayerId()
{
	return 0;
}

/*
 * returns the layer ( if it exists ) associated with the
 * provided layer id
 */
function getLayerById( imageMap, layerId )
{
	return imageMap.find( ( map ) => 
	{ 
		return ( map.layerId == layerId ) 
	} );
}

/*
 * Creates a new shape editor to allow the user
 * to define an additional shape within the
 * currently selected map layer.  Temporarily 
 * sets the initial field value to the shape id
 * at the moment
 */
function addNewShapeEditor()
{
	var layerId = getSelectedLayerId();
	var shapeListName = "layer" + layerId + "shapes"
	var elements = document.getElementsByName( shapeListName );
	let nextId = 0;

	if( elements != undefined )
	 nextId = elements.length + 1;
	else
	 nextId = 1;

	let shapeId = "layer" + layerId + "shape" + nextId
		
	let editorHtml = "<div id = " + shapeId + "div>";
		editorHtml = editorHtml.concat( createTextEditor( "Shape Title", shapeId, shapeListName, shapeId ) );
		editorHtml = editorHtml.concat( "</div>" );
	$('#shapeInput').append( editorHtml );
	addInteraction() ; 
}
 
function createTextEditor( label, id, name, defaultValue )
{
	if( label == undefined )
		label = "Label"
	if( id == undefined )
		id == ""
	if( name == undefined )
		name == ""
	if( defaultValue == undefined )
		defaultValue == ""
		
	
	let txtEditor = label + ": <input type = \"text\" id = " + id + " value = " + defaultValue + " name = " + name + " />"
	return txtEditor;
}
 
/*
* Adds a new layer editor to the image map
* editor
*/
function addnewLayerEditor()
{
  
}

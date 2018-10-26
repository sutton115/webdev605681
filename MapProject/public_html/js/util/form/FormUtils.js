/*
    File Name:   FormUtils.js
    Author:      Corey Dyson
    Date:        October 15, 2018
    Purpose:     Utility logic that can be used to easily
				 interact with the editor
*/

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
	var mapLayers = imageMap.layers;
	
	return mapLayers.find( ( mapLayer ) => 
	{ 
		return ( mapLayer.id == layerId ) 
	} );
}

/*
 * Sets the fields and appropriate
 * buttons to enabled or editable states
 * to allow modification
 */
function addNewShape()
{
	//First clear editor fields
	clearShapeEditor();
	
	//Set button enabled state(s)
	$("#shapeAdd").attr('disabled',true);
	$("#shapeDelete").attr('disabled',true);
	$("#submit").attr('disabled',false);
	$("#cancel").attr('disabled',false);
	
	//Set shape editable
	setShapeEditable( true );
}

function clearShapeEditor()
{
	// Clear entries
	$("#shapeTitle").val("");
	$("#shapeLink").val("");

	
	var points = document.getElementById("pointList");
	var length = points.options.length;
	for (i = 0; i < length; i++) 
	{
		points.options[i] = null;
	}
		
	$("#pointX").val("");
	$("#pointY").val("");

}

function setShapeEditable( bool )
{
	$("#shapeTitle").attr('readonly', !bool );
	$("#shapeLink").attr('readonly', !bool );
}

/*
* Updates object for given data
*/
function submitData()
{
	
	// Control actions
	$("#shapeAdd").attr('disabled',false);
	$("#shapeDelete").attr('disabled',false);
	$("#submit").attr('disabled',true);
	$("#cancel").attr('disabled',true);
}

/*
* Clears data without updates
*/
function cancelData()
{
	//First clear editor fields
	clearShapeEditor();
	
	//Set button enabled state(s)
	$("#shapeAdd").attr('disabled', false);
	$("#shapeDelete").attr('disabled', false);
	$("#submit").attr('disabled', true);
	$("#cancel").attr('disabled', true );
	
	setShapeEditable( false );
}

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

function getSelectedShapeId()
{
	var selectedOption = $("#shapeList option:selected");
	return selectedOption.val();	
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

function getShapeById( mapLayer, shapeId )
{
	var shapes = mapLayer.shapes;
	
	return shapes.find( ( shape ) => 
	{ 
		return ( shape.id == shapeId ) 
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
        
    // Start Interaction (new polygon)
    addInteraction();
}

function deleteSelectedShape()
{
	var shapeId = getSelectedShapeId();
	let deleted = deleteShape( shapeId );
	
	if( deleted == true )
		$("#shapeList option[value='" + shapeId + "']").remove();	
}

function deleteShape( id )
{
	//This assumes that the shape currently
	//displayed within the editor will always
	//be the selected shape
	clearShapeEditor();
	var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
	var idToDelete = id;
		
	let deleted = false;
	var shapes = currentLayer.shapes;
	
	//delete the shape id from the list
	for( var i = 0; i < shapes.length; i++ )
	{
		let shape = shapes[i];
		
		if( shape.id == idToDelete )
		{
			shapes.splice( i, 1 );
			deleted = true;
		}
	}

	//delete the feature associated with the shape
	var feature = source.getFeatureById( id );
	source.removeFeature( feature );
	
	return deleted;
}

function clearShapeEditor()
{
	// Clear entries
	$("#shapeTitle").val("");
	$("#shapeLink").val("");
	clearShapePointList();
	$("#pointX").val("");
	$("#pointY").val("");

}

function clearShapePointList()
{
	var points = document.getElementById("pointList");
	var length = points.options.length;
	for (i = 0; i < length; i++) 
	{
		$("#pointList option[value='" + ( i + 1 ) + "']").remove();
	}
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
	
	var mapShape = createShape();
	var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
	let added = replaceOrAddShape( currentLayer, mapShape )
	
	if( added == true )
	{
		$('#shapeList').append($("<option></option>")
						   .attr("value", mapShape.id )
						   .text( mapShape.title ) ); 
	}
}

/*
 * Attempts to replace the specified shape within the specified
 * layer.  If the shape cannot be found, it will be added to the
 * layer.  Returns FALSE if the shape existed and was replaced.
 * Returns TRUE if the shape did not exist and was added
 */
function replaceOrAddShape( currentLayer, mapShape )
{
	let added = true;
	var shapes = currentLayer.shapes;
	
	for( var i = 0; i < shapes.length; i++ )
	{
		let shape = shapes[i];
		
		if( shape.id == mapShape.id )
		{
			shapes[i] = mapShape;
			added = false;
		}
	}
	
	if( added == true )
		shapes.push( mapShape );
	
	return added;	
}

function createShape()
{
	var shape = new MapShape();
	
	let features = source.getFeatures();
    let i = features.length - 1 ;
	shape.id = features[i].getId();
	shape.points = getPolygonCoordinates();
	shape.title = $("#shapeTitle").prop('value');
	shape.url = $("#shapeLink").prop('value');	
	
	return shape;
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

function updateOnPointChange()
{
	//Update the values of the
	//xpos and ypos editors when the
	//comboBox value changes
	var selectedOption = $("#pointList option:selected");
	var value = selectedOption.val();
	var index = value - 1;
	var mapLayer = getLayerById( imageMap, getSelectedLayerId() );
	var shape = getShapeById( mapLayer, getSelectedShapeId() );
	var points = getPolygonCoordinatesByFeatureId( shape.id );
	var point = points[index];
	
	setField( "pointX", point[0] );
	setField( "pointY", point[1] );
}

/*
* Display the selected polygon and its title and link
*/
function displayData()
{
	var selectedLayer = getLayerById( imageMap, getSelectedLayerId() );
	var shapes = selectedLayer.shapes;
	var selectedShapeId = getSelectedShapeId();
	var shapeToLoad;
	
	for( var i = 0; i < shapes.length; i++ )
	{
		let shape = shapes[i];
		
		if( shape.id == selectedShapeId )
		{
			shapeToLoad = shape;
		}
	}	
	
	if( shapeToLoad != undefined )
	{
		setField( "shapeTitle", shapeToLoad.title );
		setField( "shapeLink", shapeToLoad.url );
		clearShapePointList();
		populateShapePointList( shapeToLoad.points );
		updateOnPointChange();
	}
	
	
	/*
	var val=$(this).val();
	var polygonObject=store(val);
	console.log(polygonObject.coords);
	source.clear();
	source.addFeature(new ol.Feature({
		geometry: new ol.geom.Polygon(polygonObject.coords),
		name: polygonObject.id
	}
		));
	$("#shapeTitle").val(polygonObject.title).attr("readonly",false);
	$("#shapeLink").val(polygonObject.url).attr("readonly",false);
	polygonObject.active=true;
	console.log(polygonObject);
	*/
}

function populateShapePointList( points )
{
	var pointList = document.getElementById( "pointList" );
	
	for( var i = 0; i < points.length; i++ )
	{
		var newOption = document.createElement( "option" );
		newOption.value = i + 1;
		newOption.text = "Point " + ( i + 1 );
		pointList.add( newOption, i );
	}
    $('#pointList').val('1');	
}
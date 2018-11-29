/*
    File Name:   FormUtils.js
    Author:      Corey Dyson
    Date:        October 15, 2018
    Purpose:     Utility logic that can be used to easily
				 interact with the editor
*/
var newLoad = false;
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
		//console.log( elmnt.options[i].value );
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
	return currentLayer;
}

/*
 * Returns the id of the currently selected
 * shape
 */
function getSelectedShapeId()
{
	var selectedOption = $("#shapeList option:selected");
	return selectedOption.val();	
}

/*
 * Returns the layer ( if it exists ) associated with the
 * provided image map and layer id
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
 * Returns the shape associated with the specified
 * layer and id ( if it exists )
 */
function getShapeById( mapLayer, shapeId )
{
	var shapes = mapLayer.shapes;
	
	return shapes.find( ( shape ) => 
	{ 
		return ( shape.id == shapeId ) 
	} );
}

/*
 * Adds a new layer to the current image map
 * object and refreshes the layer list to include
 * the newly created layer.
 */
function addNewLayer()
{
	if( map != undefined )
		removeMapLayers();
	
	clearEditor();	
        var layerId = getSelectedLayerId();    
	var mapLayers = imageMap.layers;
        var persistImage = mapLayers[layerId].url;
	var mapLayer = new MapLayer();
	mapLayer.id = mapLayers.length;	
	mapLayer.url = persistImage;
	//console.log( "New Map Layer id set to " + mapLayer.id );
	mapLayers.push( mapLayer );
	currentLayer = mapLayer.id;
	refreshLayers();
        loadImageMapLayer( $("#layerList").val() );
}

/*
 * Deletes the currently selected layer from the
 * image map object and loads the next layer
 * contained within the image map object into
 * the editor.  If the deleted layer is the
 * last layer in the image map, the previous
 * layer will be loaded and if it is the only
 * layer in the image map, the editor will be
 * cleared.
 */
function deleteSelectedLayer()
{
	var layerId = getSelectedLayerId();
	var nextLayerToLoad = -1;
	var mapLayers = imageMap.layers;
	var mapLayer;
	
	for( var i =0; i < mapLayers.length; i++ )
	{
		mapLayer = mapLayers[i];
		
		if( mapLayer.id == layerId )
		{
			//determine which ( if any ) layer should been
			//loaded after the current layer is deleted
			if( i < ( mapLayers.length - 1 ) )
				nextLayerToLoad = i;
			else
				nextLayerToLoad = i - 1;
			
			//Remove the layer from the underlying object
			mapLayers.splice( i, 1 );
			
			//Re-assigned the layer id values so that they
			//always go from 0 to n
			for( var j = 0; j < mapLayers.length; j++ )
			{
				mapLayer = mapLayers[j];
				mapLayer.id = j;
			}
			//refresh the layer list
			refreshLayers();
			break;			
		}		
	}
	
	//If we've found another layer to load, load it
	//Otherwise, just clear the editor
	if( nextLayerToLoad > -1 )
		loadImageMapLayer( nextLayerToLoad );
	else
	{
		clearEditor();	
	}
	
}

/*
 * Updates the currently selected layer within the
 * image map object 
 */
function updateSelectedLayer()
{
	var layerId = getSelectedLayerId();
	var mapLayers = imageMap.layers;
	var mapLayer;
	
	for( var i =0; i < mapLayers.length; i++ )
	{
		mapLayer = mapLayers[i];
		
		if( mapLayer.id == layerId )
		{
			mapLayer.minZoom = $("#minZoom").prop('value');	
			mapLayer.maxZoom = $("#maxZoom").prop('value');		
			break;			
		}		
	}	
}



/*
 * Sets the fields and appropriate
 * buttons to enabled or editable states
 * to allow modification and enables 
 * drawing for the user via addInteraction()
 */
function addNewShape()
{
    //First clear editor fields
    clearShapeEditor();

    //Unselect option if applicable
    $("#shapeList option:selected").prop("selected", false);

    //Set shape editable
    setShapeEditable( true );
    $("#shapeDelete").attr('disabled',true);
    $("#shapeUpdate").attr('disabled',true);

    // Disable selectClick interaction to prevent inadvertent cancellation
    selectController.setActive(false) ;

    // Start Interaction (new polygon)
    addInteraction();
}

/*
 * Sets fields available to be updated for selected shape
 */
function updateSelectedShape(){
    setShapeEditable(true) ;

    // Disable Update/Delete buttons
    $("#shapeUpdate").attr('disabled',true);
    $("#shapeDelete").attr('disabled',true);
    
    // Disable selectClick interaction to prevent inadvertent cancellation
    selectController.setActive(false) ;

    //addPolyModInteraction() ;
    polyMod = new modifyPolygon() ;
    polyMod.start() ;
}
/*
 * Deletes the currently selected shape.  By default,
 * this function will remove the shape from the underlying
 * data structure as well
 */
function deleteSelectedShape()
{
	var shapeId = getSelectedShapeId();
	let deleted = deleteShape( shapeId, true );	
}

/*
 * "Deletes" a shape from the editor.  If removeFromStructure
 * is set to TRUE, the shape will also be removed from the 
 * underlying image map data structure.  If removeFromStructure
 * is set to FALSE, the shape will merely be removed from the
 * shape list and the associated feature/geometry on the map will
 * be removed.
 */
function deleteShape( id, removeFromStructure )
{
	//This assumes that the shape currently
	//displayed within the editor will always
	//be the selected shape
	clearShapeEditor();
	var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
	var shapes;
	var idToDelete = id;		
	let deleted = false;
	
	if( currentLayer != undefined )
		shapes = currentLayer.shapes;
	
	//delete the shape id from the list
	
	if( removeFromStructure && shapes != undefined )  //Only delete the shape from the underlying data struture if this is true
	{
		for( var i = 0; i < shapes.length; i++ )
		{
			let shape = shapes[i];
			
			if( shape.id == idToDelete )
			{
				//console.log( "Deleting shape with id = " + idToDelete + " from image map object" );
				shapes.splice( i, 1 );
				deleted = true;
			}
			else
			{
				//console.log( "No shape found with id = " + idToDelete );
			}
		}
	}
	
	$("#shapeList option[value='" + idToDelete + "']").remove();

	//delete the feature associated with the shape
	var feature = source.getFeatureById( id );
	
	if( feature != undefined )
	{
		console.log( "Removing feature from map" );
		source.removeFeature( feature );
	}
	
        setShapeEditable( false );
        
	return deleted;
}

/*
 * Clears all shape editor values and also
 * clears the point list for the current shape
 */
function clearShapeEditor()
{
	// Clear entries
	$("#shapeTitle").val("");
	$("#shapeLink").val("");
	clearShapePointList();
	$("#pointX").val("");
	$("#pointY").val("");

}

/*
 * Clears the list of points within the point list
 */
function clearShapePointList()
{
	var points = document.getElementById("pointList");
        if(points == undefined) return ;
	var length = points.options.length;
	for (i = 0; i < length; i++) 
	{
		$("#pointList option[value='" + ( i + 1 ) + "']").remove();
	}
}

/*
 * Sets a shape's editor values so that they can be modified
 */
function setShapeEditable( bool )
{
    // Enable/Disable CRUD buttons as appropriate
    $("#submit").attr('disabled',!bool);
	$("#cancel").attr('disabled',!bool);
    $("#shapeAdd").attr('disabled',bool);
	$("#shapeUpdate").attr('disabled',!bool);
	$("#shapeDelete").attr('disabled',!bool);
    $("#shapeList").attr('disabled',bool);
        
    // Enable/Disable Form Fields
    $("#shapeTitle").attr('disabled',!bool);
    $("#shapeLink").attr('disabled',!bool);
}

/*
* Updates object for given data
*/
function submitData()
{
	
	// Control actions
	setShapeEditable( false );
	
	//If no shape is currently selected then it has yet
	//to be saved so create it.  Otherwise, update the
	//currently selected shape
	var mapShape = getSelectedShape() ;
	if( mapShape == undefined ){
		// Creating a new shape
		mapShape = createShape();
	}
	else
	{
		// Updating existing shape
		updateShape(mapShape);
	}
        

	$.getJSON({url:" https://hakureimap.appspot.com/proxy?address="+mapShape.url+"&jsoncallback=?",
	  success: function(json){
	    console.log(json);
			if(json==200||json==302||json==301) {

				setShapeEditable( false );
				alert("update successfully");
				var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
				let added = replaceOrAddShape( currentLayer, mapShape );

				//If a new shape was added, then add it to the shape list also
				//If it was just updated, select that shape in the list
				map.addInteraction( selectController );
				if( added == true )
				{
					addShapeToShapeList( mapShape.id, mapShape.title );
				}
				else
				{
					$("#shapeList").val( mapShape.id );
			                $('#shapeList option:selected').text(mapShape.title) ;
			    }
			    if(polyMod)
                {
                polyMod.end() ;
                polyMod = null ;
                }
			} else {
				alert("Unavailable link, please retry");
					setShapeEditable( true );

			}
		}
	});
        
        // Restore selectClick interaction
        selectController.setActive(true) ;
}

/*
 * Adds an entry to the shape list with the specified
 * id and title values
 */
function addShapeToShapeList( id, title )
{
	//console.log( "Adding Shape with Id = " + id + "and title = " + title + "to shape list" );
	let newOption = $("<option></option>")
							.attr("value", id )
							.text( title ) ;
		$('#shapeList').append(newOption); 
		newOption.prop('selected', true) ;
}

/*
 * Saves the current image map to a file
 */
 function saveToFile()
 {
	 var fileName = $("#fileName").prop('value');
	 var body = JSON.stringify( imageMap );	 
	 var downloadElement = document.createElement( "a" );
	 
	 downloadElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( body ) );
     downloadElement.setAttribute( 'download', fileName );
	 document.body.appendChild( downloadElement );
	 downloadElement.click();
	 document.body.removeChild( downloadElement );	 
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

/*
 * Creates a shape object from the values
 * currently in the shape editor along with the
 * list of points retrieved from the newest shape
 */
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
 * Updates the specified shape's points,
 * title, and link values
 */
function updateShape(shape)
{
    shape.points = getPolygonCoordinatesByFeatureId( shape.id );
    shape.title = $("#shapeTitle").prop('value');
    shape.url = $("#shapeLink").prop('value');	
}

/*
* Clears data without updates
*/
function cancelData()
{
	//End interaction (if any)
	if(draw) 
		map.removeInteraction(draw);

	//If the source is undefined, then we're likely
	//in a freshly initialized state so nothing has 
	//been drawn yet.  If it's not, we need to be sure
	//to remove any unsaved drawing
	if( source != undefined )
	{
		//Check for a new unsaved shape.  If one exists, delete the feature
		//As the user has opted not to save/submit it
		let features = source.getFeatures();
		let i = features.length - 1 ;
		let feature = features[i];
		var featureId;
		
		if( feature != undefined )
                {
			featureId = feature.getId();

			var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
			var shape = getShapeById( currentLayer, featureId );

			if( shape == undefined )
			{
				//console.log( "Deleting shape " + featureId );
				deleteShape( featureId, false );		
			}else if(polyMod){
                            
                                polyMod.revert() ;
                            
                        }
		}
	}
	
        // Remove modify interaction (if any)
        if(polyMod){
            polyMod.end() ;
            polyMod = null ;
        }
        
        // Clear editor fields
	clearShapeEditor();
        
	// Set button enabled state(s)
	setShapeEditable( false );
        
        // Restore selectClick interaction
        if(selectController){
            selectController.setActive(true) ;
        }
}

/*
 * Updates the pointX and pointY editor values
 * upon selection of a new point
 */
 
/*
 * This function handles the selection of a new
 * point by updating the pointx and pointy values
 * in the editor
 */
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
	var points;
	
	if( shape != undefined )
		points = getPolygonCoordinatesByFeatureId( shape.id );
	else
		points = getPolygonCoordinates();
	
	var point = points[index];
	
	setField( "pointX", point[0] );
	setField( "pointY", point[1] );
}

/*
 * Returns the currently selected shape ( if any )
 */
function getSelectedShape()
{
    var selectedLayer = getLayerById( imageMap, getSelectedLayerId() );
    var shapes = selectedLayer.shapes;
    var selectedShapeId = getSelectedShapeId();
    if(selectedShapeId == undefined) return ;
    var shapeToLoad;

    for( var i = 0; i < shapes.length; i++ )
    {
            let shape = shapes[i];

            if( shape.id == selectedShapeId )
            {
                    shapeToLoad = shape;
            }
    }

    return shapeToLoad ;
}

/*
 * Display the selected polygon and its title and link
 * within the editor's field and highlight it within
 * the map display
 */
function displayData()
{
	cancelData();
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
		selectShape( shapeToLoad );
                $('#shapeUpdate').attr('disabled', false) ;
                $('#shapeDelete').attr('disabled', false) ;
	}
        if (newLoad){
            cancelData();
            newLoad = false;
        }
}

/*
 * Populates the shape point list with the points
 * specified
 */
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
	updateOnPointChange();
}

/*
 * Loads a local image map file into the
 * editor.  This function loads the first layer
 * ( id = 0 ) of the image map into the editor
 * by default 
 */
function loadImageMap( evt )
{
	//First we need to cancel any current unsaved
	//Input or actions
	//clearEditor();
	
	//TODO: Handle multiple imageMaps
	var imageMapFiles = evt.target.files;
	var imageMapFile = imageMapFiles[0];
	var fr = new FileReader();
	
	fr.onload = function( e )
	{
		var body = fr.result;
		var obj = getObjectFromJSON( body );
		//console.log( body );
		//console.log ( obj );
	
		if( obj != undefined && obj.instanceType != undefined && obj.instanceType == "MapObject" )
		{
			console.log( "Image Map loaded successfully" );
			imageMap = obj;
			
			//Load the editor with the first layer
			//by default
			loadImageMapLayer( 0 );
                        newLoad = true;
		}	
	};
	fr.readAsText( imageMapFile );
        
        let newName = baseName($(this).val()) ;
        $('#fileName').val(newName) ;
        $(this).val('');
}

function baseName(str)
{
    if(str.includes('/')){
        var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    }else{
        var base = new String(str).substring(str.lastIndexOf('\\') + 1); 
    }
   
    return base;
}

/*
 * loads the specified map layer into the editor
 */
function loadImageMapLayer( layerId )
{
	currentLayer = layerId;
	var mapLayer = imageMap.layers[layerId];
	
	console.log( imageMap );
	
	if( mapLayer.url != "" )
        {
		$("#url").val( mapLayer.url ) ;
                $("#Continue").click() ;
        }else{
		removeMapLayers();
		clearEditor();
		loadLayers();
	}
	$("#minZoom").val( mapLayer.minZoom );	
	$("#maxZoom").val( mapLayer.maxZoom );	
}

/*
 * Loads the specified list of shapes into the
 * editor's shape list and draws them on the map
 * layer
 */
function loadShapes( shapes )
{
	var shape;
	var points;
	
	for( var i = 0; i < shapes.length; i++ )
	{
		shape = shapes[i];
		points = shape.points;
		drawShape( points, shape.id );
		addShapeToShapeList( shape.id, shape.title );
	}
	
	shape = shapes[0];
	// select nothing in the shape list after loading
	$("#shapeList").val( [] );
}

/*
 * Refreshes the image map's layer list by clearing
 * and rebuilding the list based on the data currently
 * stored within the image map object
 */
function refreshLayers()
{
	clearLayers();
	loadLayers();
}

/*
 * Clears the layers editor of the editor
 */
function clearLayers()
{
	var mapLayers = document.getElementById("layerList");
        if( mapLayers )
        {
            var length = mapLayers.options.length;
            for (i = 0; i < length; i++) 
            {
                    $("#layerList option[value='" + i + "']").remove();
            }
        }
}

/*
 * Loads an image map's layers into the layers
 * editor
 */
function loadLayers()
{
    var mapLayers = imageMap.layers;
    var layerCount = mapLayers.length;

    if(layerCount)
    {
        for( var i = 0; i < layerCount; i++ )
        {
                //console.log( "Adding layer with id " + i );
                addLayerToLayerList( i );
        }
        $('#layerList').val( currentLayer );
		
    }
}

function refreshShapeList()
{
	clearShapeList();
	loadShapeList();
}

/*
 * Clears the layers editor of the editor
 */
function clearShapeList()
{
	var mapLayers = document.getElementById("layerList");
	var length = mapLayers.options.length;
	for (i = 0; i < length; i++) 
	{
		$("#layerList option[value='" + i + "']").remove();
	}
}

/*
 * Loads an image map's layers into the layers
 * editor
 */
function loadShapeList()
{
	var mapLayers = imageMap.layers;
	var layerCount = mapLayers.length;
	
	for( var i = 0; i < layerCount; i++ )
	{
		//console.log( "Adding layer with id " + i );
		addLayerToLayerList( i );
	}
    $('#layerList').val( currentLayer );		
}

/*
 * Adds a new layer option to the list of layers
 */
function addLayerToLayerList( id )
{
    var layerList = document.getElementById( "layerList" );
    if(layerList)
    {
        var newOption = document.createElement( "option" );
        newOption.value = id;
        newOption.text = "Layer " + ( id + 1 );
        layerList.add( newOption, id );
    }
}

/*
 * Clears the editor of all elements including
 * shapes, shape points, title, link, etc, but does
 * NOT remove the elements from the underlying data
 * structure
 */
function clearEditor()
{
	//TODO:  Handle other layers
	clearLayers();	
	$("#shapeList > option").each( function ()
	{
		//console.log( "Deleting shape with id = " + this.value );
		deleteShape( this.value, false );
	});
	clearShapeEditor();
}

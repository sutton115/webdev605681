/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function(){
    $('#loadImageMap').on('change', displayImageMap) ;
})


function displayImageMap( evt )
{
	//TODO: Handle multiple imageMaps
	var imageMapFiles = evt.target.files;
	var imageMapFile = imageMapFiles[0];
	var fr = new FileReader();
	
	fr.onload = function( e )
	{
		var body = fr.result;
		var obj = getObjectFromJSON( body );
	
		if( obj != undefined && obj.instanceType != undefined && obj.instanceType == "MapObject" )
		{
			console.log( "Image Map loaded successfully" );
			imageMap = obj;
			
			//Load the map layers into the viewer
			displayImageMapLayer( 0 );
		}	
	}
	fr.readAsText( imageMapFile );
}

/*
 * loads the specified map layer into the viewer
 */
function displayImageMapLayer( layerId )
{
	currentLayer = layerId;
	var mapLayer = imageMap.layers[layerId];
        loadImageFromUrl( mapLayer.url ) ;
	//$("#url").val( mapLayer.url ).trigger('change');
}

function loadImageFromUrl(url)
{
    var imgObj = new Image();
    imgObj.src = url;
    var mapLayer = getLayerById( imageMap, getSelectedLayerId() );
    mapLayer.url = url;
    //After the image is loaded, display it on the canvas.
    imgObj.onload = function(data){
        createMapDisplayForViewer( data, url );

        // Add MouseWheelZoom Interaction
        var mapZoom = new ol.interaction.MouseWheelZoom() ;
	map.addInteraction(mapZoom);
        
        // Allow rotate-map when holding shift-key
        var mapRotate = new ol.interaction.DragRotate({
            condition: ol.events.condition.shiftKeyOnly
        }) ;
	map.addInteraction(mapRotate);
        
        var northControl = new ol.control.Rotate({
            autoHide: false
        }) ;
	map.addControl(northControl);
        
        // Allow Fullscreen
        var fullScreen = new ol.control.FullScreen();
	map.addControl(fullScreen);
        
        $('#map').after('<span class="instruction">Hold Shift-key and drag-to-rotate</span>') ;
        
        map.on('click', function(evt) {
            //console.log('map clicked');
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature, layer) 
				{
					console.log( "Feature: " );
					console.log( feature );
                    let thisId = feature.getId();
					console.log( "Feature Id: " );
					console.log( thisId );

                    let thisShape = getShapeById( mapLayer, thisId );
					console.log( "Shape: " );
					console.log( thisShape );
					
                    if( thisShape.url )
                    {
                        window.open(thisShape.url, '_blank') ;
                    }
                }
            );
        });
    }
}
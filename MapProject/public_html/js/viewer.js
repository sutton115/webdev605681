/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function(){
    $('#loadImageMap').on('change', displayImageMap) ;
})


/*
 * Reads in an Image Map JSON file from the file
 * system and loads the default ( 0 ) layer into the 
 * application
 */
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
        $(this).val('') ;
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
        
        // Allow (and always show) "northControl" to reset map orientation
        var northControl = new ol.control.Rotate({
            autoHide: false
        }) ;
	map.addControl(northControl);
        
        // Allow Fullscreen
        var fullScreen = new ol.control.FullScreen();
	map.addControl(fullScreen);
        
        //$('#map').after('<span class="instruction">Hold Shift-key and drag-to-rotate</span>') ;
        $('body').addClass('map-loaded') ;
        
        map.on('click', function(evt) {
            //console.log('map clicked');
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature, layer) 
				{
                    let thisId = feature.getId();

                    let thisShape = getShapeById( undefined, thisId );
					
                    if( thisShape.url )
                    {
                        window.open(thisShape.url, '_blank') ;
                    }
                }
            );
        });
    }
}
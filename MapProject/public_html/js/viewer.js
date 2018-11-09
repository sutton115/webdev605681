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
			
			//Load the editor with the first layer
			//by default
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
        createMapDisplay( data, url );
        map.on('click', function(evt) {
            //console.log('map clicked');
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature, layer) {
                    let thisId = feature.getId() ;

                    let thisShape = getShapeById( mapLayer, thisId ) ;
                    if( thisShape.url )
                    {
                        window.open(thisShape.url, '_blank') ;
                    }
                }
            );
        });
    }
}
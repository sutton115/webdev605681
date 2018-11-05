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
            const img = data.path[0];
            preW = img.width;
            preH = img.height;

            var extent = [0, 0, preW, preH];
            var projection = new ol.proj.Projection({
              units: 'pixels',
              extent: extent
            });

            var baseLayer = new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                            url: url,
                            projection: projection,
                            imageExtent: extent
                    })
            }) ;

            source = new ol.source.Vector({wrapX: false});

            var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                            color: '#319FD3',
                            width: 1
                    }),
                    text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            fill: new ol.style.Fill({
                                    color: '#000'
                            }),
                            stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 3
                            })
                    })
            });
            var vector = new ol.layer.Vector({
                    source: source,
                    style: function(feature) {
                            style.getText().setText(feature.get('name'));
                            return style;
                    }
            });

            var view1 = new ol.View({
                    projection: projection,
                    center: ol.extent.getCenter(extent),
                    zoom: 2,
                    maxZoom: 8
            }) ;

            if( map != undefined )
            {
                removeMapLayers();
            }

            map = new ol.Map({
                layers: [ baseLayer, vector ],
                target: 'map',
                view: view1
            });
            

            //Load the shapes onto the layer
            var mapLayer = getLayerById( imageMap, currentLayer );
            var shapes = mapLayer.shapes;
            loadShapes( shapes );
            displayData();
            
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
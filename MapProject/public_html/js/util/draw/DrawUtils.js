/*
	File Name:		DrawUtils.js
	Purpose:		Utility functions for drawing and
					handling shapes within the map
	
	Modification History:
*/

/*
 * Draws a new shape with the specified points 
 * on to the map and sets the specified id on the
 * resulting feature object
 */
function drawShape( points, id )
{
	//console.log( "Drawing Shape with id" + id );
	
	//It seems that the geometry constructor expects
    //the points to be added to another array so we just
	//create one here and push them on
	var featurePoints = new Array();
	featurePoints.push( points );
	
	let newFeature = new ol.Feature({
		geometry: new ol.geom.Polygon( featurePoints ),
		source : source
	});
	newFeature.setId( id );
	source.addFeature( newFeature ) ;
}

/*
 * Clears the current graphical map.  Useful when
 * the editor's visual map component needs to be 
 * cleared or reset ( e.g. During layer changes, re-init ).
 */
function removeMapLayers()
{
	if( map != undefined )
	{
		map.setTarget( null );
		map = null;
	}
}

/*
 * Selects the specified shape within the map display
 */
function selectShape( shape )
{
  if( shape != undefined )
	selectShapeById( shape.id );
}

/*
 * Selects the shape associated with the specified 
 * id within the map display
 */
function selectShapeById( shapeId )
{
	if( source != undefined && selectController != undefined )
	{
		var feature = source.getFeatureById( shapeId );
		
		selectController.getFeatures().clear();
		selectController.getFeatures().push( feature );
	}
}

function createMapDisplay( data, url )
{
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
		removeMapLayers();
	
	map = new ol.Map({
	  layers: [ baseLayer, vector ],
	  target: 'map',
	  view: view1
	});
	var baseTextStyle = {
         font: '24px Calibri,sans-serif',
         textAlign: 'center',
         fill: new ol.style.Fill({
           color: [0,0,0,1]
         }),
         stroke: new ol.style.Stroke({
           color: [255,255,255,0.5],
           width: 4
         })
       };

	var changeStyle = function(feature){
		
		let tCoord = feature.getGeometry().getCoordinates() ;
		//console.log(tCoord);
		tCoord = tCoord[0];
		//console.log(tCoord);
		var currentLayer = getLayerById( imageMap, getSelectedLayerId() );
		var shapes = currentLayer.shapes;
		//console.log(shapes);
		var find = false;
		var title = "";
		for(var sid in shapes) {
			var s = shapes[sid];
			if(s.points.length!=tCoord.length)
				continue;
			var same = true;
			for(var i=0; i<s.points.length; i++) {

					if(s.points[i][0]!=tCoord[i][0]||s.points[i][1]!=tCoord[i][1]) {
						same = false;
						break;
					}
			}
			if(same) {
				find = true;
				title = s.title;
				break;
			}
		}
		if(find) {
			baseTextStyle.text = title;
		} else {
				baseTextStyle.text = "";
		}
			return new ol.style.Style({
				text: new ol.style.Text(baseTextStyle),
				stroke:new ol.style.Stroke({
					width:5,
					color:'#007bff'
				}),

			});

	};

	var selectClick = new ol.interaction.Select({
		condition: ol.events.condition.mouseOnly,
		style:changeStyle
	});
	map.addInteraction(selectClick);
	var mouseZoom = new ol.interaction.MouseWheelZoom();
	map.addInteraction(mouseZoom);
	loadMapData();	
	// create select interaction to highlight shapes when clicked
	selectController = createSelectController();	
	selectController.on( "select", handleSelection );
	map.addInteraction( selectController );
};


function loadMapData()
{
	//First clear the old shapes from the editor
	//This is important in the event that we're either
	//loading a new layer or a completely new image map
	clearEditor();
	loadLayers();
	//Load the shapes onto the layer
	var mapLayer = getLayerById( imageMap, currentLayer );
	var shapes = mapLayer.shapes;
	loadShapes( shapes );
	displayData();
}

function createSelectController()
{
	return new ol.interaction.Select({
	condition: ol.events.condition.click
	});			
}

function handleSelection( e )
{
	//Get selected features
	var features = e.selected;
	var feature;
	
	//TODO???: Handle multi-select?
	if( features != undefined )
	{
		feature = features[0];
		
		if( feature != undefined )
			$("#shapeList").val( feature.getId() ).trigger('change');
	}		
}
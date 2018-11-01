/*
	File Name:		map_object.js
	Purpose:		Constructor functions for Image Map
					objects and complex attributes
	
	Modification History:
*/

// Global variables so we can access them later
var map, draw, source ;

/*
 * Constructs a default shapePoint object
 *
 */ 
function ShapePoint( options )
{
	this.instanceType = "ShapePoint";
	this.x = 0 ;
	this.y = 0 ;
	
	for( let prop in options )
	{
		if( this[prop] != options[prop] )
			this[prop] = options[prop];
			
	}
	
	function setPoints(x, y){
		this.x = x ;
		this.y = y ;
	}
	function getPoints()
	{
		return [this.x, this.y] ;
	}
}

/*
 * Constructs a default mapShape object
 *
 */ 
function MapShape( options )
{
	this.instanceType = "MapShape";
	this.type = 'polygon' ;
	this.id = 0;
	this.points = [] ;
	this.title = '' ;
	this.url = '' ;
	this.target = '_blank';
	this.active=false;
	
	for( let prop in options )
	{
		if( this[prop] != options[prop] )
			this[prop] = options[prop];
			
	}
	
	function addPoint(tuple)
	{
		this.points.push(tuple) ;
	}
	function getPoints()
	{
		return this.points ;
	}
}

/*
 * Constructs a default mapLayer object
 *
 */ 
function MapLayer( options )
{
	this.instanceType = "MapLayer";
	this.type = 'link';
	this.id = 0;
	this.url = '' ;
	this.shapes = [] ;

	for( let prop in options )
	{
		if( this[prop] != options[prop] )
			this[prop] = options[prop];
			
	}
	
	function addShape(obj)
	{
		this.shapes.push(obj) ;
	}
	
}

/*
 * Constructs a default mapObject object
 *
 */
function MapObject( options )
{
	this.instanceType = 'MapObject';
	this.title = '';
	this.layers = [];
	
	for( let prop in options )
	{
		if( this[prop] != options[prop] )
			this[prop] = options[prop];
			
	}
	
	this.addLayer = function(obj)
	{
		this.layers.push(obj) ;
	}	
}

function addInteraction() {
    if(draw)
        map.removeInteraction(draw);
    
    draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
    });
    map.addInteraction(draw);
    draw.setActive(true) ;

    draw.on('drawend', function()
	{
        map.removeInteraction(draw);
        //draw.setActive(false) ;
    });
	
	source.on('addfeature', function (event) 
	{
		var feature = event.feature;
		
		if( feature != undefined )
		{
			if( feature.getId() == undefined )
				feature.setId( Math.floor( Math.random() * 1000000 ) );
			var points = getPolygonCoordinates();
			//This is a hack until I can figure out
			//how to correctly execute this logic only
			//once
			clearShapePointList();
			populateShapePointList( points );
			updateOnPointChange();
		}
	});
}

function getPolygonCoordinates(){
    let features = source.getFeatures() ;
    let i = features.length - 1 ;
    let tCoord = features[i].getGeometry().getCoordinates() ;
    //console.log(tCoord);
	tCoord = tCoord[0];
    return tCoord ;
}

function getPolygonCoordinatesByFeatureId( featureId )
{
    let feature = source.getFeatureById( featureId )
    let tCoord = feature.getGeometry().getCoordinates() ;
	tCoord = tCoord[0];
    return tCoord ;
}
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
function shapePoint(){
	this.x = 0 ;
	this.y = 0 ;
	
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
function mapShape(){
	this.type = 'polygon' ;
	this.id = 0;
	this.points = [] ;
	this.title = '' ;
	this.url = '' ;
	this.target = '_blank';
	
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
function mapLayer(){
	this.type = 'link';
	this.id = 0;
	this.url = '' ;
	this.shapes = [] ;

	function addShape(obj)
	{
		this.shapes.push(obj) ;
	}
	
}

/*
 * Constructs a default mapObject object
 *
 */
function mapObject(){
	this.objType = 'mapObject' ;
	this.title = '' ;
	this.layers = [] ;
	
	function addLayer(obj)
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

    draw.on('drawend', function(){
        map.removeInteraction(draw);
        //draw.setActive(false) ;
    }) ;
}

function getPolygonCoordinates(){
    let features = source.getFeatures() ;
    let i = features.length ;
    let tCoord = features[i].getGeometry().getCoordinates() ;
    console.log(tCoord) ;
    return tCoord ;
}

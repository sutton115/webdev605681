/*
	File Name:		map_object.js
	Purpose:		Constructor functions for Image Map
					objects and complex attributes
	
	Modification History:
*/

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
	function getPoints(){
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
	
	function addPoint(tuple){
		this.points.push(tuple) ;
	}
	function getPoints(){
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

	function addShape(obj){
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
	
	function addLayer(obj){
		this.layers.push(obj) ;
	}	
}

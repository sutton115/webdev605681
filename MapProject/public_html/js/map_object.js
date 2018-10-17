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
function mapShape(){
	this.type = 'polygon' ;
	this.id = 0 ;
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

function mapLayer(){
	this.type = 'link';
	this.id = 0 ;
	this.url = '' ;
	this.shapes = [] ;

	function addShape(obj){
		this.shapes.push(obj) ;
	}
	
}

function mapObject(){
	this.objType = 'mapObject' ;
	this.title = '' ;
	this.layers = [] ;
	
	function addLayer(obj){
		this.layers.push(obj) ;
	}
	
}



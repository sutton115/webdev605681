/*
	File Name:		map_object.js
	Purpose:		Constructor functions for Image Map
					objects and complex attributes
	
	Modification History:
*/

// Global variables so we can access them later
var map, draw, polyMod, source, selectController, selectClick ;

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
	this.minZoom = 1;
	this.maxZoom = 1;
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
	
    selectController.setActive(false) ;
    
    draw = new ol.interaction.Draw({
        source: source,
        type: 'Polygon'
    });
    map.addInteraction(draw);
    draw.setActive(true) ;

    draw.on('drawend', function(e)
    {
        map.removeInteraction(draw);
        draw = null ;
        
        // Immediately allow to modify
        polyMod = new modifyPolygon() ;
        polyMod.start(e.feature) ;
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

function modifyPolygon(){
    this.shapeId = 0 ;
    this.origCoord = 0 ;
    this.origFeat = 0 ;
    this.modInt = 0 ;
    
    //function addPolyModInteraction(){
    this.start = function(newFeat){
        $('body').addClass('modify-polygon') ;
        if(newFeat)
        {
            // must be a brand new shape
            this.origFeat = newFeat ;
        }else{
            // Must be an existing feature (selected for update)
            this.shapeId = getSelectedShapeId() ;
            this.origFeat = source.getFeatureById( this.shapeId );
            this.origCoord = this.origFeat.getGeometry().getCoordinates() ;
        }
        
        let collection = new ol.Collection() ;
        collection.push(this.origFeat) ;

        this.modInt = new ol.interaction.Modify({
            //source: source,
            features: collection
        });
            
        map.addInteraction(this.modInt);
    }
    
    this.end = function(){
        // End Interaction
        if(this.modInt)
            map.removeInteraction(this.modInt);
        
        // Reset attributes
        this.shapeId = 0 ;
        this.origCoord = 0 ;
        this.origFeat = 0 ;
        this.modInt = 0 ;
        
        $('body').removeClass('modify-polygon') ;
    }

    this.revert = function(){
        // If this was a modification, reset the shape
        if( this.origCoord )
        {
            // Restore original coordinates
            let newGeom = new ol.geom.Polygon(this.origCoord) ;
            this.origFeat.setGeometry(newGeom) ;
        }
        this.end() ;
    }
    return this ;
}
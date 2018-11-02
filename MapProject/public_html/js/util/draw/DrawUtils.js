/*
	File Name:		DrawUtils.js
	Purpose:		Utility functions for drawing and
					handling shapes within the map
	
	Modification History:
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

function removeMapLayers()
{
	if( map != undefined )
	{
		map.setTarget( null );
		map = null;
	}
}
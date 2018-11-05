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
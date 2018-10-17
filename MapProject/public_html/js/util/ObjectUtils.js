/*
	File Name:		ObjectUtils.js
	Purpose:		Utility functions for creating 
					and handling various objects
	
	Modification History:
*/


/* Returns an instance of an object previously 
 * stringified by JSON
 */
function getObjectFromJSON( stringifiedObject )
{
	parsedObject = JSON.parse( stringifiedObject );
	dataType = parsedObject.instanceType;
	return new window[dataType]( parsedObject);
}	
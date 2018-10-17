


//Returns an instance of an object previously 
//stringified by JSON
function getObjectFromJSON( stringifiedObject )
{
	parsedObject = JSON.parse( stringifiedObject );
	dataType = parsedObject.instanceType;
	return new window[dataType]( parsedObject);
}	
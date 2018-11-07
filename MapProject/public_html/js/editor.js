/*
	File Name:		editor.js
	Purpose:		Fuctionality for CRUD buttons.
	
	Modification History:
		October 7, 2018 - Add button
		October 17, 2018 - Minor comment change
*/

$( function() 
{
	//Set disabled to start
	$("#shapeTitle").attr('readonly',true);
	$("#shapeLink").attr('readonly',true);
	$("#pointList").attr('readonly',true);
	$("#pointX").attr('readonly',true);
	$("#pointY").attr('readonly',true);
	$("#submit").attr('disabled',true);
	$("#cancel").attr('disabled',true);
   
    const urlInput = $("#url");
    $("#loadImageButton").click(function () {
        urlInput.val("");
        //linkInput.val("");
    });

    $('#exampleModal').on('hide.bs.modal', function () {
      urlInput.val("");
	});

    function callback(data)
	{
        //console.log(data);
        return data;
    }
    
	let preW = 800;
    let preH = 400;

	//The image URL part
    $("#Continue").click(function ()
	{
        const url = $("#url").val();
        if ((url.startsWith("http://") || url.startsWith("https://"))&&
            (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".jpeg")|| url.endsWith(".JPG")|| url.endsWith(".JPEG")|| url.endsWith(".$")|| url.endsWith(".GIF")) ) 
		{
			//imgContainer.show();
			$("#Continue").css("background","#00B0F0");
			var imgObj = new Image();
			imgObj.src = url;
			var mapLayer = getLayerById( imageMap, getSelectedLayerId() );
			mapLayer.url = url;
			//After the image is loaded, display it on the canvas.
			imgObj.onload = function( data )
			{
				urlInput.removeClass('redBorder');
				$("#cross").hide();
				$("#close").click();
				createMapDisplay( data, url );
				
			};
			imgObj.onerror = function(){
				console.log('fdf');
				urlInput.addClass('redBorder');
				$("#Continue").css("background","#DDDDDD");
				$("#cross").show()
			};
		}
		else 
		{
			urlInput.addClass('redBorder');
			$("#Continue").css("background","#DDDDDD");
			$("#cross").show();
		}			
    }); // End URL input change
    
    $("#shapeAdd").on( "click", addNewShape );
	$("#shapeDelete").on( "click", deleteSelectedShape );
	$("#layerAdd").on( "click", addNewLayer );
	$("#layerDelete").on( "click", deleteSelectedLayer );
	$("#layerList").on( "change", function(){ loadImageMapLayer( $("#layerList").val() ) });
    $("#submit").on("click", submitData);
    $("#cancel").on("click", cancelData);
    $("#shapeList").on("click change", displayData );
	$("#saveToFile").on("click", saveToFile );
	$("#loadImageMap").on("change", loadImageMap );
});

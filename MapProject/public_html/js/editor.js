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
	
    //const imgContainer = $("#imgContainer");
    //get canvas
    //var cvs = document.getElementById("cvs");
    //var ctx = cvs.getContext('2d');

    $("#clear").click(function () {
        urlInput.val("");
        //linkInput.val("");
    });

    function callback(data){
        console.log(data);
        return data;
    }
    let preW = 800;
    let preH = 400;

	//The image URL part
    urlInput.on('change',function () {
        const url = $(this).val();
        if ((url.startsWith("http://") || url.startsWith("https://"))&&
            (url.endsWith(".jpg") || url.endsWith(".png") || url.endsWith(".gif") || url.endsWith(".jpeg")|| url.endsWith(".JPG")|| url.endsWith(".JPEG")|| url.endsWith(".$")|| url.endsWith(".GIF")) ) {

            //imgContainer.show();
            $("#Continue").css("background","#00B0F0");
            var imgObj = new Image();
            imgObj.src = url;
            //After the image is loaded, display it on the canvas.
            imgObj.onload = function(data){
                //console.log(data);
                const img = data.path[0];
                preW = img.width;
                preH = img.height;
                
                var extent = [0, 0, preW, preH];
                var projection = new ol.proj.Projection({
                  units: 'pixels',
                  extent: extent
                });

                var baseLayer = new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        url: url,
                        projection: projection,
                        imageExtent: extent
                    })
                }) ;
                
                source = new ol.source.Vector({wrapX: false});
                
                var style = new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#319FD3',
                        width: 1
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({
                            color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 3
                        })
                    })
                });
                var vector = new ol.layer.Vector({
                    source: source,
                    style: function(feature) {
                        style.getText().setText(feature.get('name'));
                        return style;
                    }
                });

                var view1 = new ol.View({
                    projection: projection,
                    center: ol.extent.getCenter(extent),
                    zoom: 2,
                    maxZoom: 8
                }) ;

                map = new ol.Map({
                  layers: [ baseLayer, vector ],
                  target: 'map',
                  view: view1
                });
                //cvs.setAttribute("width", preW);
                //cvs.setAttribute("height", preH);
                //ctx.clearRect(0,0,preW,preH);

                //ctx = cvs.getContext('2d');

                urlInput.removeClass('redBorder');
                $("#cross").hide();
                $("#close").click();
                // var ctx = cvs.getContext('2d');
                //ctx.drawImage(this, 0, 0);//this is imgObj,keep the image original size ：470*480
            };
            imgObj.onerror = function(){
                console.log('fdf');
                urlInput.addClass('redBorder');
                $("#Continue").css("background","#DDDDDD");
                $("#cross").show()
            };
        }else {
            urlInput.addClass('redBorder');
            $("#Continue").css("background","#DDDDDD");
            $("#cross").show();
        }
    }); // End URL input change

/* MES - Not positive this is ever called
//The link part
    const linkInput = $("#link");
    linkInput.on("change",function () {
        const url = $(this).val();

        if ((url.startsWith("http://") || url.startsWith("https://")) ) {
            //Set the link text 
            //ctx.font="bold 14px Arial";
            //ctx.textAlign="start";
            //ctx.textBaseline="middle";
            //ctx.fillText(url,10,80);

            linkInput.removeClass('redBorder');
        }else {
            linkInput.addClass('redBorder');

        }
    }); */
    
    $("#shapeAdd").on( "click", addNewShape ) ;
    $("#submit").on("click", submitData) ;
    $("#cancel").on("click", cancelData) ;
    $("#shapeList").on("change", displayData) ;
});

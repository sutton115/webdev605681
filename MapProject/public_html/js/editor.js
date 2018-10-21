/*
	File Name:		editor.js
	Purpose:		Fuctionality for CRUD buttons.
	
	Modification History:
		October 7, 2018 - Add button
		October 17, 2018 - Minor comment change
*/

$( function() 
{
    const urlInput = $("#url");
    const imgContainer = $("#imgContainer");
    //get canvas
    //var cvs = document.getElementById("cvs");
    //var ctx = cvs.getContext('2d');

    $("#clear").click(function () {
        urlInput.val("");
        linkInput.val("");
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

            imgContainer.show();
            $("#Continue").css("background","#00B0F0");
            var imgObj = new Image();
            imgObj.src = url;
            //After the image is loaded, display it on the canvas.
            imgObj.onload = function(data){
                console.log(data);
                const img = data.path[0];
                preW = img.width;
                preH = img.height;
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
    });

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
    
    $("#shapeAdd").on( "click",  addNewShapeEditor )
});
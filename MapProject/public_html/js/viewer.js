/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function(){
    
    
    
    $("#loadImageMap").on("change", showImageMap );
})

function showImageMap( e ){
    new Promise(function(fulfill, reject){
        //do something for 5 seconds
        loadImageMap( e )
        return new Promise ;
    }).then(function(){
        return new Promise(function(fulfill, reject){
            //do something for 5 seconds
            console.log(imageMap) ;
        });
    }) ;
    
}

function prepImageMap( url ){
    
    var imgObj = new Image();
    imgObj.src = url;
    var mapLayer = getLayerById( imageMap, getSelectedLayerId() );
    mapLayer.url = url;
    //After the image is loaded, display it on the canvas.
    imgObj.onload = function(data){
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

            if( map != undefined )
                    removeMapLayers();

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

            //First clear the old shapes from the editor
            //This is important in the event that we're either
            //loading a new layer or a completely new image map
            clearEditor();

            //Load the shapes onto the layer
            var mapLayer = getLayerById( imageMap, currentLayer );
            var shapes = mapLayer.shapes;
            loadShapes( shapes );
            displayData();
    };
}
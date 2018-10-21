/* This was my Sutton-Demo code, so it all works, but isn't directly applicable
 * as a part of this project.  It serves as some kind of example of something
 * that kinda works in a way one might want to use OpenLayers
 */

/*
$(function(){
    // Map views always need a projection.  Here we just want to map image
    // coordinates directly to map coordinates, so we create a projection that uses
    // the image extent in pixels.
    var extent = [0, 0, 1024, 968];
    var projection = new ol.proj.Projection({
      code: 'xkcd-image',
      units: 'pixels',
      extent: extent
    });
    
    var baseLayer = new ol.layer.Image({
        source: new ol.source.ImageStatic({
        attributions: '© <a href="http://xkcd.com/license.html">xkcd</a>',
        url: 'https://imgs.xkcd.com/comics/online_communities.png',
        projection: projection,
        imageExtent: extent
        })
    }) ;
    
    var source = new ol.source.Vector({wrapX: false});
    
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
    
    var map = new ol.Map({
      layers: [ baseLayer, vector ],
      target: 'map',
      view: view1,
    });
    
    var draw ; // global so we can remove it later
    function addInteraction() {
        draw = new ol.interaction.Draw({
            source: source,
            type: 'Polygon'
        });
        map.addInteraction(draw);
        draw.setActive(true) ;
        
        draw.on('drawend', function(){
            map.removeInteraction(draw);
            draw.setActive(false) ;
        }) ;
      }

    $('#drawNew').on('click', function(){
        if(draw)
            map.removeInteraction(draw);
        //console.log(map) ;
        addInteraction();
    }) ;
    
    $('#drawFinish').on('click', function(){
        if(draw){
            map.removeInteraction(draw);
            draw.setActive(false) ;
        }
        let allCoords = [] ;
        var features = source.getFeatures() ;
        for(let i=0; i < features.length; i++){
            let tCoord = features[i].getGeometry().getCoordinates() ;
            //console.log(tCoord.length + " coords in this feature") ;
            for(let j=0; j < tCoord.length; j++){
                allCoords.push(tCoord[j]) ;
            }
            //console.log("Feature Number: " + i) ;
            //console.log('Coordinate ' + i + ": " + tCoord) ;
            
        }
        localStorage.removeItem('myCoords') ;
        //console.log(JSON.stringify(allCoords)) ;
        localStorage.setItem('myCoords', JSON.stringify(allCoords) );
    }) ;
    
    
    let baseCoords = localStorage.getItem('myCoords') ;
    //console.log(baseCoords) ;
    if(baseCoords && baseCoords.length){
        let polys = JSON.parse(baseCoords) ;
        //console.log(polys) ;
        addMyPolygon(polys) ;
    }
    
    
    function addMyPolygon(polyCoords){
        //console.log(polyCoords);
        let newFeature = new ol.Feature({
            geometry: new ol.geom.Polygon(polyCoords),
            name: 'New Poly',
            url: 'https://www.google.com',
        }) ;
        //let someStyle = newFeature.getStyle() ;
        //console.log(someStyle) ;
        source.addFeature(newFeature) ;
        
        //console.log(source) ;
    }
    
    
    map.on('click', function(evt) {
        //console.log('map clicked');
        var feature = map.forEachFeatureAtPixel(evt.pixel,
          function(feature, layer) {
                // do stuff here
                if(draw){
                    console.log( draw.getActive() ) ;
                }
                
                if(feature.values_.url && (!draw || !draw.getActive())){
                    window.open(feature.values_.url, '_blank') ;
                }
          });
    });
    
});
*/
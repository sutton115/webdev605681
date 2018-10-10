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
    
    var raster = new ol.layer.Tile({
        source: new ol.source.OSM()
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

    var vector = new ol.layer.Vector({
        source: source
    });
    
    var view1 = new ol.View({
        projection: projection,
        center: ol.extent.getCenter(extent),
        zoom: 2,
        maxZoom: 8
    }) ;
    
    var view2 = new ol.View({
        center: [-11000000, 4600000],
        zoom: 4
    }) ;
    
    var map = new ol.Map({
      layers: [ baseLayer, vector ],
      target: 'map',
      view: view1
    });
    
    var draw ; // global so we can remove it later
    function addInteraction() {
        draw = new ol.interaction.Draw({
            source: source,
            type: 'Polygon'
        });
        map.addInteraction(draw);
      }

    $('#drawNew').on('click', function(){
        //if(draw)
        //    console.log(draw.sketchLineCoords_) ;
        var features = source.getFeatures() ;
        for(let i=0; i < features.length; i++){
            console.log(features[i].getGeometry().getCoordinates()) ;
            
        }
        map.removeInteraction(draw);
        //console.log(map) ;
        addInteraction();
    }) ;
    
});
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function(){
    console.log(imageMap) ;
    
    imageMap.on('click', function(evt) {
        //console.log('map clicked');
        var feature = imageMap.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                let thisId = feature.getId() ;
                
                console.log(thisid) ;
                
                //if(feature.values_.url && (!draw || !draw.getActive())){
                //    window.open(feature.values_.url, '_blank') ;
                }
          );
    });
    
})

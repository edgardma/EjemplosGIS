function toggleLayer(eve) {
    var lyrname = eve.target.value;
    var chechedStatus = eve.target.checked;
    var lyrList = map.getLayers();

    lyrList.forEach(function(element){
        if (lyrname == element.get('title')) {
            element.setVisible(chechedStatus)
        }
    })
}
/*
 * Julio Del Valle
 * THREE.js
 * 3d Mosque - Building
 */

var mosque = window.mosque || {};
mosque.building = mosque.building || {};

mosque.building = (function(){

    var testVar = 'Ich bin das Gebäude';

    var position = new THREE.Vector3( 0, 0, 0 );
    var height = 8;
    var treeScale = 1;

    // mosque.tree.illustrateTree(position, height, treeScale);
    
    for(var treeX = 0; treeX < 20; treeX++){
        position = new THREE.Vector3(treeX, 0, 0);
        mosque.tree.illustrateTree(position, height, treeScale);
    }

    return {
        testVar : testVar
    };
})();
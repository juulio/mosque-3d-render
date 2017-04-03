
mosque.tree = (function(){
    

    var sphereGeometry = new THREE.SphereGeometry( radius, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( {color: color} );

    var cylinderGeometry = new THREE.CylinderGeometry( 0.35, 0.35, height, 32 );
    var cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xA0522D} );
    
    /*
     * CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments)
     */
    var drawCylinder = function(height){
        
        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y = height/2;
        mosque.main.publicScene.add( cylinder );
    };

    /*
     * SphereGeometry(radius, widthSegments, heightSegments)
     */
    var drawSphere = function(radius, position, color){
        
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(position.x, position.y, position.z);
        mosque.main.publicScene.add( sphere );
    };

    /*
     * illustrates a Tree on the provided position
     */
    var illustrateTree = function (position, height, scale){
        var endPosition = new THREE.Vector3(position.x, position.y+height, position.z);

        drawCylinder(height);

        var spherePosition = new THREE.Vector3(-2, 5, 0);
        var sphereRadius = 2;
        var sphereColor = 0x006400;
        
        drawSphere(sphereRadius, spherePosition, sphereColor);

        spherePosition = new THREE.Vector3(1, 6.5, 1);
        sphereRadius = 3;
        sphereColor = 0x008000;
        drawSphere(sphereRadius, spherePosition, sphereColor);

        spherePosition = new THREE.Vector3(0, 10, 3);
        sphereRadius = 3;
        sphereColor = 0x32CD32;
        drawSphere(sphereRadius, spherePosition, sphereColor);
    };

    return {
        a : a,
        tree : mosque.tree,
        illustrateTree : illustrateTree
    };
})();


/*
 * TODO
 * Define Building structure: 4 minarets
 * Maybe separate code into several files
 * Update Gulp Boilerplate
 * Update THREE.js boilerplate
 */

/*
 * Julio Del Valle
 * 3d Mosque
 * THREE.js
 */

/** @namespace Namespace for MOSQUE classes and functions. */
var MOSQUE = MOSQUE || {};

// var mosque = window.mosque || {};
// mosque.main = mosque.main || {};


/**
 * Creates a Tree object
 * @class Tree
 * @constructor
 * @namespace MOSQUE
 * @param {THREE.Vector3} position
 * @param {Number} height
 * @param {Number} scale
 */
// MOSQUE.Tree = function(position, height, scale){
//     this.position = position;
//     this.height = height;    
//     this.scale = scale;
// };

// /**
//  * Renders a new Tree
//  * @class Tree
//  * @namespace MOSQUE
//  */
// MOSQUE.Tree.prototype.renderTree = function(){
//     var treeGroup = new THREE.Group();  

//     // Tree Trunk
//     var cylinderGeometry = new THREE.CylinderGeometry( 0.35, 0.35, this.height, 32 );
//     var cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0xA0522D} );
//     var trunk = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
//     trunk.position.set(this.position.x, this.position.y+2, this.position.z);
//     treeGroup.add(trunk);

//     var sphereMaterial1 = new THREE.MeshBasicMaterial( {color: 0x006400} );
//     var sphereMaterial2 = new THREE.MeshBasicMaterial( {color: 0x32A956} );
//     var sphereMaterial3 = new THREE.MeshBasicMaterial( {color: 0x47AA12} );

//     var sphereGeometry1 = new THREE.SphereGeometry( 2*this.scale, 32, 32 );
//     var sphereGeometry2 = new THREE.SphereGeometry( 1.3*this.scale, 32, 32 );
//     var sphereGeometry3 = new THREE.SphereGeometry( 1.5*this.scale, 32, 32 );

//     var sphere1 = new THREE.Mesh( sphereGeometry1, sphereMaterial1 );
//     // sphere1.position.set(this.position.x-1.2, this.position.y+4, this.position.z);
//     sphere1.position.set(this.position.x-1.2, this.height*0.45, this.position.z);
//     treeGroup.add(sphere1);

//     var sphere2 = new THREE.Mesh( sphereGeometry2, sphereMaterial2 );
//     sphere2.position.set(this.position.x+1.7, this.height*0.5, this.position.z-0.4);
//     treeGroup.add(sphere2);

//     var sphere3 = new THREE.Mesh( sphereGeometry3, sphereMaterial3 );
//     sphere3.position.set(this.position.x+0.2, this.height*0.6  , this.position.z-0.4);
//     treeGroup.add(sphere3);

//     return treeGroup;
// };

/**
 * Creates a Building object
 * @class building
 * @constructor
 * @namespace MOSQUE
 * @param {THREE.Vector3} position
 * @param {Number} scale
 */
MOSQUE.Building = function(position){
    this.position = position;
};

/**
 * Load textures, models and render the 3D building using the new Arch model (imported from Blender)
 */
MOSQUE.Building.prototype.renderBuilding = function(){

    var texture = new THREE.Texture();
    var arch;
    var archWidth = 12;
    var mosqueBuildingGroup = new THREE.Object3D();

    // Load textures
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
    };

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };

    var onError = function ( xhr ) {
    };

    // Load first texture
    loader = new THREE.ImageLoader( manager );
    loader.load( './assets/textures/stone.png', function ( image ) {
        texture.image = image;
        texture.needsUpdate = true;
    } );

    // Load models
    loader = new THREE.OBJLoader( manager );
    loader.load( './assets/models/blueArch/blue_arch.obj', function ( object ) {

        object.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material.map = texture;
            }
        } );

        object.position.z = 4;
        object.rotation.y = -Math.PI / 2;
        
        for(var i=-80;i<80;i+=archWidth){
            arch = object.clone();
            arch.position.x = i;
            mosqueBuildingGroup.add(arch);
        }

        object.position.z = 76;
        for(i=-80;i<80;i+=archWidth){
            arch = object.clone();
            arch.position.x = i;
            mosqueBuildingGroup.add(arch);
        }

        object.rotation.y = 0;
        for(i=-40;i<40;i+=archWidth){
            arch = object.clone();
            arch.position.x = -80;
            arch.position.z = i+40;
            mosqueBuildingGroup.add(arch);
        }

        for(i=-40;i<40;i+=archWidth){
            arch = object.clone();
            arch.position.x = 80;
            arch.position.z = i+40;
            mosqueBuildingGroup.add(arch);
        }
    }, onProgress, onError );

    return mosqueBuildingGroup;
};

MOSQUE.Main = MOSQUE.Main || (function () {

    var camera, scene, renderer;
    var container, controls, loader;


    init();
    animate();
    
    /* * 
     * Init all functions
     */
    function init() {
        setScene();

        // Render Elements on the Screen
        var buildingPosition = new THREE.Vector3(0, 0, 0);
        var mosqueBuilding = new MOSQUE.Building(buildingPosition);
        scene.add(mosqueBuilding.renderBuilding());

        // renderHelpers();
        // renderBuilding();
        renderSkybox();

        renderTrees();

        renderFloor();

        var minaretHeight = 36;
        renderMinaret(new THREE.Vector3(-80, minaretHeight/2, 80), minaretHeight); // front left
        renderMinaret(new THREE.Vector3(80, minaretHeight/2, 80), minaretHeight); // front right
        renderMinaret(new THREE.Vector3(-80, minaretHeight/2, 0), minaretHeight); // rear left
        renderMinaret(new THREE.Vector3(80, minaretHeight/2, 0), minaretHeight); // rear right    
    }

    /*
     * Sets initial elements for the scene
     */
    function setScene(){
        var bodyEl = document.body;
        bodyEl.style.margin = 0;
        bodyEl.style.overflow = "hidden";

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.x = -6;
        camera.position.y = 40;
        camera.position.z = 70;

        scene = new THREE.Scene();

        // scene.fog = new THREE.Fog( 0xeecbad, 10, 1020 );

        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff);
        directionalLight.position.set( 0, -3, 1 );
        scene.add( directionalLight );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );
    }

    /*
     *
     */
    function renderHelpers(){
        var gridXZ = new THREE.GridHelper(60, 33);
        // scene.add(gridXZ);

        var axisHelper = new THREE.AxisHelper( 25 );
        scene.add( axisHelper );
    }

    /*
     * Load textures, models and render the 3D Mosque
     */
    function renderBuilding(){
        var texture = new THREE.Texture();
        var texture2 = new THREE.Texture();
        var arch, i;
        var mosqueLeft = new THREE.Object3D();

        // Load textures
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            // console.log( item, loaded, total );
        };

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                // console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };

        // Load first texture
        loader = new THREE.ImageLoader( manager );
        loader.load( './assets/textures/stone.png', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
        } );

        // Load second texture
        loader = new THREE.ImageLoader( manager );
        loader.load( './assets/textures/disturb.jpg', function ( image ) {
            texture2.image = image;
            texture2.needsUpdate = true;
        } );

        // Load models
        loader = new THREE.OBJLoader( manager );
        loader.load( './assets/models/arc.obj', function ( object ) {

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
            } );
            object.position.x = -19;
            object.rotation.y = -Math.PI / 2;
            object.position.z = -19;
            scene.add( object );

            //------------------------------------------
            // 1. Render back side archs
            // 1.a First Level Archs
            // Render left side archs
            for(i=0;i<10;i+=2){
                arch = object.clone();
                arch.position.x = i;
                mosqueLeft.add( arch );

                if(i>1){
                    arch = object.clone();
                    arch.position.x = i;
                    arch.position.y = 3;
                    mosqueLeft.add( arch );    
                }
            }

            // Render right side archs
            for(i=14;i<24;i+=2){
                arch = object.clone();
                arch.position.x = i;
                mosqueLeft.add( arch );

                if(i<22){
                    arch = object.clone();
                    arch.position.x = i;
                    arch.position.y = 3;
                    mosqueLeft.add( arch );    
                }
            }

            // 1.b 2nd level archs
            // Render big central arch
            arch = object.clone();
            arch.position.x = 11;
            arch.position.y = 6;
            arch.scale.y = 2;
            arch.scale.z = 2;
            mosqueLeft.add(arch);

            // Render 2 small central archs
            arch = object.clone();
            arch.position.x = 8;
            arch.position.y = 6;
            mosqueLeft.add(arch);

            arch = object.clone();
            arch.position.x = 14;
            arch.position.y = 6;
            mosqueLeft.add(arch);

            //------------------------------------------
            // 1. Render side archs
            // 2.a First Level Archs
            var leftSideArch, rightSideArch;
            for(i=-19;i<10;i+=2){
                leftSideArch = object.clone();
                leftSideArch.position.x = -2;
                leftSideArch.position.z = i;
                leftSideArch.rotation.y = Math.PI;
                mosqueLeft.add(leftSideArch);

                rightSideArch = leftSideArch.clone();
                rightSideArch.position.x = 24;
                rightSideArch.position.z = i;
                rightSideArch.rotation.y = -Math.PI;
                mosqueLeft.add(rightSideArch);
            }

        }, onProgress, onError );

        // Render big central Archs
        var loader2 = new THREE.OBJLoader( manager );
        loader2.load( './assets/models/arc.obj', function ( object ) {

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture2;
                }
            } );

            object.position.x = 11;
            // object.position.y = 26;
            object.position.z = -19;
            object.rotation.y = -Math.PI / 2;
            object.scale.y = 2;
            object.scale.z = 2;
            mosqueLeft.add( object );

        }, onProgress, onError );

        mosqueLeft.position.z = 2;
        mosqueLeft.name = "mosqueLeft";
        scene.add(mosqueLeft);

        // console.log("LEFT");
        // console.log(mosqueLeft);
        // console.log(scene);  
    }

    /*
     * Render minaret models and place them on the mosque
     * THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments)
     */
    function renderMinaret(position, height){
        var arabicTexture =  new THREE.TextureLoader().load('./assets/textures/arabic08.jpg');
        var material = new THREE.MeshBasicMaterial( { map: arabicTexture } );
        var minaretGeometry = new THREE.CylinderGeometry( 1, 1, height, 32 );


        var minaret = new THREE.Mesh(minaretGeometry, material);
        minaret.position.set(position.x, position.y, position.z);
        scene.add(minaret);

        renderBooth(position, 1.5);
        renderBooth(new THREE.Vector3(position.x, position.y+12, position.z), 1.5);
        renderBooth(new THREE.  Vector3(position.x, position.y+20, position.z), 2.7);

        renderCone(position);
    }

    /*
     * Render the booths on minarets
     */
    function renderBooth(position, radius){
        var stoneTexture =  new THREE.TextureLoader().load('./assets/textures/arabic08.jpg');
        var material = new THREE.MeshBasicMaterial( { map: stoneTexture } );
        var boothGeometry = new THREE.CylinderGeometry( radius, radius, 5, 5 );
        var booth = new THREE.Mesh(boothGeometry, material);
        booth.position.set(position.x, position.y, position.z);
        scene.add(booth);
    }

    /**
     * Renders all the trees around the Mosque
     * @class Main
     * @namespace MOSQUE
     */
    function renderTrees(){
        var treeObject,
            treePosition,
            x,
            treeHeight = 10,
            treeScale = 1;

        for(x=-78;x<78;x+=8){
            treePosition = new THREE.Vector3( x, 0, 0 );
            scene.add(MOSQUE.Tree(treePosition, treeHeight, treeScale));

            treePosition = new THREE.Vector3( x, 0, 80 );
            // treeObject = new MOSQUE.Tree(treePosition, treeHeight, treeScale);
            scene.add(MOSQUE.Tree(treePosition, treeHeight, treeScale)); 
        }
    }

    /*
     * Render the cone on top of the minaret
     * ConeGeometry(radius, height, radialSegments, heightSegments)
     */
    function renderCone(position){
        var geometry = new THREE.ConeGeometry( 3, 6, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xeecbad} );
        var cone = new THREE.Mesh( geometry, material );
        cone.position.set(position.x, position.y+25, position.z);
        scene.add( cone );
    }

    /*
     * Render skybox
     */
    function renderSkybox(){
        var urls = [ "./assets/skybox/mars_back.png", "./assets/skybox/mars_front.png", "./assets/skybox/mars_top.png", "./assets/skybox/mars_bottom.png", "./assets/skybox/mars_right.png", "./assets/skybox/mars_left.png"];
        var cubeMaterials = [
            // Do not modify the images order
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[0]), side: THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[1]), side: THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[2]), side: THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[3]), side: THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[4]), side: THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load(urls[5]), side: THREE.DoubleSide } ),
        ];

        // Create a MeshFaceMaterial, which allows the cube to have different materials on each face
        var cubeMaterial = new THREE.MultiMaterial( cubeMaterials );

        var skybox = new THREE.Mesh(
            new THREE.BoxGeometry( 900, 900, 900),
            cubeMaterial
        );

        scene.add( skybox );
    }

    /*
     * Render floor
     */
    function renderFloor(){
        var geometry = new THREE.PlaneGeometry( 160, 80, 100, 100 );
        geometry.rotateX( - Math.PI / 2 );

        for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

            var vertex = geometry.vertices[ i ];
            vertex.x += Math.random() * 20 - 1;
            // vertex.y += Math.random() * 4;
            vertex.y += Math.random() * 1;
            vertex.z += Math.random() * 15 - 10;
        }

        for ( i = 0, l = geometry.faces.length; i < l; i ++ ) {

            var face = geometry.faces[ i ];
            // face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            // face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            // face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
            face.vertexColors[ 0 ] = new THREE.Color().setRGB(1, 0.972, 0.862);
            face.vertexColors[ 1 ] = new THREE.Color().setRGB(0.713, 0.439, 0.227);
            face.vertexColors[ 2 ] = new THREE.Color().setRGB(0.580, 0.419, 0.298);

        }

        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.setZ(40);
        mesh.position.setX(-7);
        scene.add( mesh );
    }

    /*
     * Properly scales elements when the browser is resized
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    /*
     *
     */
    function animate() {

        requestAnimationFrame( animate );


        renderer.render( scene, camera );
    }

    // Keep only if public vars are needed.
    return {
        publicScene : scene,
        init : init
    };

}());

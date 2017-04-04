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
        scene.add(MOSQUE.Skybox(900));

        renderTrees();

        var floor = MOSQUE.Floor();
        scene.add(floor);

        var minaretHeight = 36;
        scene.add(MOSQUE.Minaret(new THREE.Vector3(-80, minaretHeight/2, 80), minaretHeight)); // front left
        scene.add(MOSQUE.Minaret(new THREE.Vector3(80, minaretHeight/2, 80), minaretHeight)); // front right
        scene.add(MOSQUE.Minaret(new THREE.Vector3(-80, minaretHeight/2, 0), minaretHeight)); // rear left
        scene.add(MOSQUE.Minaret(new THREE.Vector3(80, minaretHeight/2, 0), minaretHeight)); // rear right    
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

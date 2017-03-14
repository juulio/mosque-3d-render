/*
 * TODO
 */

/*
 * Julio Del Valle
 * THREE.js
 * 3d Mosque
 */
 var mosque = window.mosque || {};

/*
 * Global logic
 * @namespace
 */

(function (context) {

	'use strict';


    var camera, scene, renderer, container;

    var controls;

    var objects = [];

    var loader;
    

    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    init();
    animate();
    
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();

    /*  
     * Init all functions
     */
    function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );

        // camera.position.z = 78;
        // camera.position.x = -483;
        // camera.position.z = 100;

        // camera.lookAt(200, 0.8, 0);
        // scene
        scene = new THREE.Scene();
        // camera.lookAt( scene.position );


        // scene.fog = new THREE.Fog( 0xeecbad, 20, 120 );

        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff);
        directionalLight.position.set( 0, -3, 1 );
        scene.add( directionalLight );

        // Render Elements on the Screen
        // renderHelpers();
        // renderBuilding();
        renderSkybox();

        renderNewBuilding();
        renderMinaret(new THREE.Vector3(7, 22.5, -19)); // left minaret
        renderMinaret(new THREE.Vector3(15, 22.5, -19)); // right minaret

        var geometry = new THREE.SphereGeometry( 9, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(0, 15, 0);
        // scene.add( sphere );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        // window.addEventListener('mousemove', function(e){
        //     var mouse3D = new THREE.Vector3(
        //         ( event.clientX / window.innerWidth ) * 2 - 1,
        //         - ( event.clientY / window.innerHeight ) * 2 + 1,
        //         0.5 );

        //     // lookAt(mouse3D);
        // });

        window.addEventListener( 'resize', onWindowResize, false );
    }

    /*
     *
     */
    function renderHelpers(){
        var gridXZ = new THREE.GridHelper(60, 33);
        scene.add(gridXZ);

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
        loader.load( './textures/stone.png', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
        } );

        // Load second texture
        loader = new THREE.ImageLoader( manager );
        loader.load( './textures/disturb.jpg', function ( image ) {
            texture2.image = image;
            texture2.needsUpdate = true;
        } );

        // Load models
        loader = new THREE.OBJLoader( manager );
        loader.load( 'models/arc.obj', function ( object ) {

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
            } );
            object.position.x = -19;
            object.rotation.y = -Math.PI / 2;
            object.position.z = -19;
            // scene.add( object );

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
        loader2.load( 'models/arc.obj', function ( object ) {

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
     * Load textures, models and render the 3D building using the new Arch model (imported from Blender)
     */
    function renderNewBuilding(){
        var texture = new THREE.Texture();
        var arch;
        var archWidth = 15;
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
        loader.load( './textures/stone.png', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
        } );

        // Load models
        loader = new THREE.OBJLoader( manager );
        loader.load( 'models/blueArch/blue_arch.obj', function ( object ) {

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
            } );

            object.position.x = -30;
            object.position.z = -25;
            object.rotation.y = -Math.PI / 2;
            
            for(var i=-500;i<500;i+=archWidth){
                arch = object.clone();
                arch.position.x = i;
                scene.add(arch);
            }

            

            //     //------------------------------------------
            //     // 1. Render side archs
            //     // 2.a First Level Archs
            //     var leftSideArch, rightSideArch;
            //     for(var i=-19;i<10;i+=2){
            //         leftSideArch = object.clone();
            //         leftSideArch.position.x = -2;
            //         leftSideArch.position.z = i;
            //         leftSideArch.rotation.y = Math.PI;
            //         mosqueLeft.add(leftSideArch);

            //         rightSideArch = leftSideArch.clone();
            //         rightSideArch.position.x = 24;
            //         rightSideArch.position.z = i;
            //         rightSideArch.rotation.y = -Math.PI;
            //         mosqueLeft.add(rightSideArch);
            //     }

        }, onProgress, onError );
    }

    /*
     * Render minaret models and place them on the mosque
     * THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments)
     */
    function renderMinaret(position){
        var arabicTexture =  new THREE.TextureLoader().load('./textures/arabic08.jpg');
        var material = new THREE.MeshBasicMaterial( { map: arabicTexture } );
        var minaretGeometry = new THREE.CylinderGeometry( 1, 1, 45, 32 );


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
        var stoneTexture =  new THREE.TextureLoader().load('./textures/arabic08.jpg');
        var material = new THREE.MeshBasicMaterial( { map: stoneTexture } );
        var boothGeometry = new THREE.CylinderGeometry( radius, radius, 5, 5 );
        var booth = new THREE.Mesh(boothGeometry, material);
        booth.position.set(position.x, position.y, position.z);
        scene.add(booth);
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
        var urls = [ "./img/mars_back.png", "./img/mars_front.png", "./img/mars_top.png", "./img/mars_bottom.png", "./img/mars_right.png", "./img/mars_left.png"];
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
     *
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
    context.publicMosque = {
        camera : camera,
        publicScene : scene,
    };

}(mosque));

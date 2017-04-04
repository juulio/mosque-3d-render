/*
 * Julio Del Valle
 * 3d Mosque
 * THREE.js
 */

/** @namespace Namespace for MOSQUE classes and functions. */
var MOSQUE = MOSQUE || {};

/**
 * Creates a Building object
 * Load textures, models and render the 3D building using the new Arch model (imported from Blender)
 * @class building
 * @constructor
 * @namespace MOSQUE
 * @param {THREE.Vector3} position
 * @param {Number} scale
 */
MOSQUE.Building = function(position, size){
    var mosqueBuildingGroup = new THREE.Object3D();

    var i,
        arch,
        texture,
        texture2,
        manager = new THREE.LoadingManager();

    // Load textures
    manager.onProgress = function ( item, loaded, total ) {
    };

    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
        }
    };

    var onError = function ( xhr ) {
    };

    var renderMainBuilding = function(){
        var mainBuildingGroup = new THREE.Object3D();
        var archWidth = 12;
        texture = new THREE.Texture();

        // Load first texture
        loader = new THREE.ImageLoader( manager );
        loader.load( './assets/textures/stone.png', function ( image ) {
            texture.image = image;
            texture.needsUpdate = true;
        } );

        // Load external Arch models
        loader = new THREE.OBJLoader( manager );
        loader.load( './assets/models/blueArch/blue_arch.obj', function ( object ) {

            object.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture;
                }
            } );

            object.rotation.y = -Math.PI / 2;
            
            for(i=-80;i<80;i+=archWidth){
                arch = object.clone();
                arch.position.x = i;
                mainBuildingGroup.add(arch);
            }

            object.position.z = 84;
            for(i=-80;i<80;i+=archWidth){
                arch = object.clone();
                arch.position.x = i;
                mainBuildingGroup.add(arch);
            }

            object.rotation.y = 0;
            for(i=-40;i<40;i+=archWidth){
                arch = object.clone();
                arch.position.x = -89;
                arch.position.z = i+46;
                mainBuildingGroup.add(arch);
            }

            for(i=-40;i<40;i+=archWidth){
                arch = object.clone();
                arch.position.x = 85;
                arch.position.z = i+46;
                mainBuildingGroup.add(arch);
            }
        }, onProgress, onError );

        return mainBuildingGroup;
    };

    /**
     * Render outer archs
     */
    var renderOuterArchs = function(){
        var outerArchsGroup = new THREE.Object3D();
        
        texture = new THREE.Texture();
        texture2 = new THREE.Texture();

        
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

            // 1. Render back side archs
            // 1.a First Level Archs
            // Render left side archs
            for(i=0;i<10;i+=2){
                arch = object.clone();
                arch.position.x = i;
                outerArchsGroup.add( arch );

                if(i>1){
                    arch = object.clone();
                    arch.position.x = i;
                    arch.position.y = 3;
                    outerArchsGroup.add( arch );    
                }
            }

            // Render right side archs
            for(i=14;i<24;i+=2){
                arch = object.clone();
                arch.position.x = i;
                outerArchsGroup.add( arch );

                if(i<22){
                    arch = object.clone();
                    arch.position.x = i;
                    arch.position.y = 3;
                    outerArchsGroup.add( arch );    
                }
            }

            // 1.b 2nd level archs
            // Render big central arch
            arch = object.clone();
            arch.position.x = 11;
            arch.position.y = 6;
            arch.scale.y = 2;
            arch.scale.z = 2;
            outerArchsGroup.add(arch);

            // Render 2 small central archs
            arch = object.clone();
            arch.position.x = 8;
            arch.position.y = 6;
            outerArchsGroup.add(arch);

            arch = object.clone();
            arch.position.x = 14;
            arch.position.y = 6;
            outerArchsGroup.add(arch);

            // 1. Render side archs
            // 2.a First Level Archs
            var leftSideArch, rightSideArch;
            for(i=-19;i<10;i+=2){
                leftSideArch = object.clone();
                leftSideArch.position.x = -2;
                leftSideArch.position.z = i;
                leftSideArch.rotation.y = Math.PI;
                outerArchsGroup.add(leftSideArch);

                rightSideArch = leftSideArch.clone();
                rightSideArch.position.x = 24;
                rightSideArch.position.z = i;
                rightSideArch.rotation.y = -Math.PI;
                outerArchsGroup.add(rightSideArch);
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
            outerArchsGroup.add( object );

        }, onProgress, onError );

        return outerArchsGroup;
    };

    var mainBuilding = renderMainBuilding();
    var outerArchs = renderOuterArchs();

    mosqueBuildingGroup.add(mainBuilding);
    mosqueBuildingGroup.add(outerArchs);
    
    return mosqueBuildingGroup;
};


    /*
     * Load textures, models and render the 3D Mosque
     */

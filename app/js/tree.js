/*
 * Julio Del Valle
 * THREE.js
 * 3d Tree
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

    init();
    animate();

    /*  
     * Init all functions
     */
    function init() {
        var bodyEl = document.body;
        bodyEl.style.margin = 0;
        bodyEl.style.overflow = "hidden";

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 30;
        camera.position.y = 17;

        scene = new THREE.Scene();

        var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
        light.position.set( 0.5, 1, 0.75 );
        scene.add( light );

        var directionalLight = new THREE.DirectionalLight( 0xffffff);
        directionalLight.position.set( 0, -3, 1 );
        scene.add( directionalLight );

        var startPosition = new THREE.Vector3( 0, 0, 0 );
        var treeDepth = 4;
        var color = new THREE.Color(0.509, 0.301, 0.129);
        var growthRatio = 0.1;

        /*
         * CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments)
         */
        function drawCylinder(height){
            var geometry = new THREE.CylinderGeometry( 0.35, 0.35, height, 32 );
            var material = new THREE.MeshBasicMaterial( {color: 0xA0522D} );
            var cylinder = new THREE.Mesh( geometry, material );
            cylinder.position.y = height/2;
            scene.add( cylinder );
        }

        /*
         * SphereGeometry(radius, widthSegments, heightSegments)
         */
        function drawSphere(radius, position, color){
            var geometry = new THREE.SphereGeometry( radius, 32, 32 );
            var material = new THREE.MeshBasicMaterial( {color: color} );
            var sphere = new THREE.Mesh( geometry, material );
            sphere.position.set(position.x, position.y, position.z);
            scene.add( sphere );
        }

        function illustrateTree (position, height, scale){
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
        }

        var position = new THREE.Vector3( 0, 0, 0 );
        var height = 8;
        var treeScale = 1;
        illustrateTree(position, height, treeScale);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        controls = new THREE.OrbitControls( camera, renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );
    }

    /*
     * Render a Line
     * @params( THREE.Vector3 point1, THREE.Vector3 point2)
     */
    function renderLine(point1, point2, lineColor){
        var material = new THREE.LineBasicMaterial({
            color: lineColor
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(point1, point2);

        var line = new THREE.Line( geometry, material );
        scene.add( line );
    }

    /*
     * Takes a floating point value and rounds it to the specified amount of decimals
     */
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    /*
     * Returns a random value between min and max
     */
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // Keep only if public vars are needed.
    context.publicContext = {
        camera : camera,
        publicScene : scene,
        renderer : renderer
    };

}(mosque));

// =============  AreaControl.js  ===================================

// @author hofk https://hofk.de/main/threejs/    https://github.com/hofk
// https://discourse.threejs.org/t/circular-control-used-for-walkable-areas-control/14057 
// https://github.com/hofk/threejsResources/tree/master/Circular-%20Area-Control

'use strict'

/*
// use 
	|	<body ondragover="drag_over( event )" ondrop="drop( event )" >
	|	
	|	<div id="navPane" draggable="true" ondragstart="drag_start( event )"> 
	|	
	|	</div>
	|
	|	<div id="sliderContainer"> 
	|		<input id="velocityRange" type="range" min="0" max="100" value="50" class="slider" >
	|		<span id="showVelocity"></span>
	|	</div>
	|	
	|	</body>
	|
// in HTML

// define your walkable areas as an array of arrays with several overlapping/touching circles, rectangles, triangles 
	walkableAreas = [
		[ 'circle', x, z, r ],
		[ 'rectangle', xMin, zMin, xMax, zMax  ],
		[ 'triangle', xa,za, xb,zb, xc,zc ], // (clockwise)	
	]
*/

// ------------------ configuration AreaControl ----------------------

//define center and command rings, rings can lie on a circle at different angles 
const AreaControlIni = [

	// size, color, borderColorCenter (rasterSize is size) for center
	[ 16, '#eeeeee', '#777777'],
	// rings:
	// commandImageSize, commandRadius (as faktor for rasterSize), commandCount, commandStartAngle in °
	[ 32, 2.2, 4,   0 ],
	[ 32, 5,   4,   0 ],
	[ 32, 5,   4,  45 ],

];

// define the navigation action commands

const speedVorward = 0.01;
const speedBackward =0.005;
const speedLeftRight = 0.003;
const speedTurn = 0.001;
const speedLookHighDeep = 0.0006;
let stopFactor = 1; // it is set to -1.1 to reverse the direction at the margin of walkable area

function noCommand(obj ) { }
function turnRight( obj ) { obj.rotateY( -speedTurn * velocity ); }
function lookUp( obj ) { if ( obj.rotation.x < 1.3 ) obj.rotation.x += speedLookHighDeep * velocity; }
function turnLeft( obj ) { obj.rotateY( speedTurn * velocity ); }
function lookDown( obj ) { if ( obj.rotation.x > -1.5 ) obj.rotation.x += -speedLookHighDeep * velocity; }
function moveRight( obj ) {	obj.translateX( speedLeftRight * velocity * stopFactor ); }
function moveForward( obj ) { obj.translateZ( -speedVorward * velocity * stopFactor ); }
function moveLeft( obj ) { obj.translateX( -speedLeftRight * velocity * stopFactor ); }
function moveBack( obj ) { obj.translateZ( speedBackward * velocity * stopFactor ); }
function moveRightForward( obj ){ 0.7 * moveRight( obj ); 0.7 * moveForward( obj ) }
function moveLeftForward( obj ){ 0.7 * moveLeft( obj ); 0.7 * moveForward( obj ) }
function moveLeftBack( obj ){ 0.7 * moveLeft( obj ); 0.7 * moveBack( obj ) }  
function moveRightBack( obj ){ 0.7 * moveRight( obj ); 0.7 * moveBack( obj ) }

const navActionCommands = [

	noCommand, 							//  0  navigation center, drag and drop,
	turnRight,							//  1
	lookUp,								//  2
	turnLeft,							//  3
	lookDown,							//  4
	moveRight,							//  5
	moveForward,						//  6
	moveLeft,							//  7
	moveBack,							//  8
	moveRightForward,					//  9
	moveLeftForward,					// 10
	moveLeftBack,						// 11
	moveRightBack,						// 12
	
];

const navImages = [

 	'',  								//    0 place holder, navigation center, no image
	'ccimg/turnRight32.png',			//    1 turnRight
	'ccimg/lookUp32.png',				//    2 lookUp
	'ccimg/turnLeft32.png',				//    3 turnLeft
	'ccimg/lookDown32.png',				//    4 lookDown
	'ccimg/moveRight32.png',			//    5 moveRight
	'ccimg/moveForward32.png',			//    6 moveForward
	'ccimg/moveLeft32.png',				//    7 moveLeft
	'ccimg/moveBack32.png',				//    8 moveBack
	'ccimg/moveRightForward32.png',		//    9 moveRightForward
	'ccimg/moveLeftForward32.png',		//   10 moveLeftForward
	'ccimg/moveLeftBack32.png',			//   11 moveLeftBack
	'ccimg/moveRightBack32.png',		//   12 moveRightBack
	
];

// ----------------- end of AreaControl configuration -------------------------------


let block = []; // block the command temporarily
for ( let i = 0; i < navActionCommands.length; i ++ ) block.push( false );

const rasterSize = AreaControlIni[ 0 ][ 0 ];
let paneRadius = -Infinity;
let pr;

for ( let i = 1; i < AreaControlIni.length; i ++ ) {
	
	pr = rasterSize * ( AreaControlIni[ i ][ 1 ]  + AreaControlIni[ i ][ 0 ] / AreaControlIni[ 0 ][ 0 ] / 2 ) + 2;
	
	paneRadius = pr > paneRadius ? pr : paneRadius;
	
}

const paneDiameter = 2 * paneRadius;

const sliderContainer = document.getElementById("sliderContainer"); 
const slider = document.getElementById("velocityRange");
const showVelocity = document.getElementById("showVelocity");

let velocity;
getVelocity( );

slider.oninput = getVelocity;

showVelocity.style.background = 'rgba(200,200,200,0.5)'; 
showVelocity.style.borderRadius =  '6px';
showVelocity.style.position = 'absolute';
showVelocity.style.left = paneRadius.toString() / 6 + 'px';
 
const navPane = document.getElementById('navPane'); // HTML: <div id="navPane" draggable="true" ondragstart="drag_start(event)"> </div> 
navPane.style.overflow = 'hidden'; 
navPane.style.position = 'absolute'; 
navPane.style.left = paneRadius.toString() / 2 + 'px';
navPane.style.top = paneRadius.toString() + 'px';
navPane.style.width = paneDiameter.toString() + 'px';
navPane.style.height = paneDiameter.toString() + 'px';
navPane.style.zIndex = '90';
navPane.style.background = 'rgba(200,200,200,0.08)';
navPane.style.borderRadius = paneRadius.toString() + 'px';

navPane.addEventListener( 'mouseover', mouseover );
navPane.addEventListener( 'mouseout', mouseout );

document.addEventListener( 'keydown', keydown );
document.addEventListener( 'keyup', keyup );

sliderContainer.style.width = paneRadius.toString( ) + 'px';
sliderContainer.style.position = 'absolute'; 
sliderContainer.style.left = paneRadius.toString( ) + 'px';
sliderContainer.style.top =  paneRadius.toString( ) / 2 + 'px';

let navs = []; // navigation span
let imgs = []; // navigation image

let dcc;	// d.ifference to c.enter of Area C.ontrol 
let angle;

let navAction = []; // navigation in action

for ( let i = 0; i < navActionCommands.length; i ++ ) navAction[ i ] = false;

let cNo = 0; // command No  (navigation center) 

navs[ 0 ] = document.createElement( 'span' );
document.getElementById( 'navPane' ).appendChild( navs[ 0 ] );

navs[ 0 ].style.overflow = 'hidden';
navs[ 0 ].style.position = 'absolute';
navs[ 0 ].style.background = AreaControlIni[0][ 1 ].toString();
navs[ 0 ].style.opacity = '0,5';
navs[ 0 ].style.border = '2px solid ' + AreaControlIni[0][ 2 ].toString();
navs[ 0 ].style.cursor = 'move';

let navX = paneRadius - rasterSize / 2 - 2; // border 2px !
let navY = paneRadius - rasterSize / 2 - 2; 
let navW = rasterSize;
let navH = rasterSize; 
let navR = rasterSize / 2 + 2;			// border 2px !

navs[ 0 ].style.left = navX.toString() + 'px'; 
navs[ 0 ].style.top = navY.toString() + 'px';
navs[ 0 ].style.width = navW.toString() + 'px';
navs[ 0 ].style.height = navH.toString() + 'px';	
navs[ 0 ].style.borderRadius = navR.toString() + 'px';

cNo ++;

for ( let r = 1; r < AreaControlIni.length; r ++ ) { 
	
	dcc = paneRadius - AreaControlIni[ r ][ 0 ] / 2; 

	for ( let i = 0; i < AreaControlIni[ r ][ 2 ]; i ++ ) {
		
		navs[ cNo ] = document.createElement('span');
		document.getElementById( 'navPane' ).appendChild( navs[ cNo ] );
		navs[ cNo ].style.overflow = 'hidden';
		navs[ cNo ].style.position = 'absolute';
		navs[ cNo ].style.background = '#dddddd';
		navs[ cNo ].style.opacity = '0.25';
		
		angle = i * 2 * Math.PI / AreaControlIni[ r ][ 2 ] + AreaControlIni[ r ][ 3 ]* Math.PI / 180;
		
		navX = dcc + Math.cos( angle ) * rasterSize * AreaControlIni[ r ][ 1 ];
		navY = dcc - Math.sin( angle ) * rasterSize * AreaControlIni[ r ][ 1 ];
		navW = AreaControlIni[ r ][ 0 ];
		navH = AreaControlIni[ r ][ 0 ];
		navR = AreaControlIni[ r ][ 0 ] / 2;
		
		navs[ cNo ].style.left = navX.toString() + 'px';
		navs[ cNo ].style.top = navY.toString() + 'px';
		navs[ cNo ].style.width = navW.toString() + 'px';
		navs[ cNo ].style.height = navH.toString() + 'px';
		navs[ cNo ].style.borderRadius = navR.toString() + 'px';
		
		cNo ++;
		
	}
	
}

for ( let i = 1; i < navImages.length; i ++ ) {
	
	imgs[ i ] = document.createElement( 'img' );
	navs[ i ].appendChild( imgs[ i ] );
	imgs[ i ].src = navImages[ i ];
	imgs[ i ].setAttribute( 'id', i.toString( ) + ' imgId' );
	
}

// ...............................................................................

function getVelocity() {
	
	velocity = Math.floor( 36 * ( parseInt( slider.value ) + 25 ) / 100 ) / 10;
	showVelocity.innerHTML = velocity.toString() + 'km/h';
	
}

function move( ) {
	
	for (  let i = 1; i < cNo; i ++ ){
		
		if ( navAction[ i ] && i < navActionCommands.length ) {
			
			if ( i === 1 || i === 3 )  {
				
				navActionCommands[ i ]( camHolder );
				viewer.quaternion.copy( camHolder.quaternion );
				
			}
			
			if ( i === 2 || i === 4 ) { 
				
				navActionCommands[ i ]( camera ); 
				
			}
			
			if ( i > 4 && !block[ i ] ) {
				
				navActionCommands[ i ]( camHolder );
							
				if ( !withinWalkableAreas( camHolder, walkableAreas ) ) {  //  define your walkableAreas array
					
					block[ i ] = true; // border reached or slightly exceeded, block the command temporarily
					
					stopFactor = -1.1; // reverse direction
					navActionCommands[ i ]( camHolder );
					stopFactor = 1;  // reverse direction again
					
				}
				
				viewer.quaternion.copy( camHolder.quaternion );
				
				viewer.position.set( camHolder.position.x, camHolder.position.y, camHolder.position.z );
				
			}
			
		}
		
	}

}

function withinWalkableAreas( cH, wA ) {
	
	// cH: camHolder 
	// wA:  walkableAreas, array of arrays, use overlapping/touching circles, rectangles, triangles
	// [ 'circle', x, z, r ],
	// [ 'rectangle', xMin, zMin, xMax, zMax  ],
	// [ 'triangle', xa,za, xb,zb, xc,zc ],	(clockwise)
	
	const xp = cH.position.x;
	const zp = cH.position.z;
	
	let x, z,  xa,za, xb,zb, xc,zc;
	let wi = false; 
	
	for ( let v = 0; v < wA.length; v ++ ) {
		
		switch ( wA[ v ][ 0 ] ) {
		
			case 'rectangle':
			wi = wi || ( xp >= wA[ v ][ 1 ] && xp <= wA[ v ][ 3 ] && zp >= wA[ v ][ 2 ] && zp <= wA[ v ][ 4 ] );
			break;
			
			case 'circle':
			x = xp - wA[ v ][ 1 ];
			z = zp - wA[ v ][ 2 ];
			wi = wi || (  x * x + z * z <= wA[ v ][ 3 ] * wA[ v ][ 3 ] );
			break;
			
			case 'triangle':
			xa = wA[ v ][ 1 ];
			za = wA[ v ][ 2 ];
			xb = wA[ v ][ 3 ];
			zb = wA[ v ][ 4 ];
			xc = wA[ v ][ 5 ];
			zc = wA[ v ][ 6 ];
			//  p inside a, b, c
			wi = wi || !( ( ( za - zb ) * ( xp - xa ) + ( xb - xa ) * ( zp - za ) ) <= 0 || ( ( zb - zc ) * ( xp - xb ) + ( xc - xb ) * ( zp - zb ) ) <= 0  || ( ( zc - za ) * ( xp - xc ) + ( xa - xc ) * ( zp - zc ) ) <= 0 );
			break;
			
		}
		
	}
	
	return wi;
	
}

function mouseover( event ) {
	
	const idx = parseInt( event.target.getAttribute( 'id' ) );
	
	 if ( idx > 0 ) {
		
		navs[ idx ].style.opacity = '1.0';
		navs[ idx ].style.background = 'rgba( 0, 140, 0, 1 )';
		navs[ idx ].style.cursor = 'pointer';
		navAction[ idx ] = true; // enable the command
		
	}
	
}

function mouseout( event ) {
	
	const idx = parseInt( event.target.getAttribute( 'id' ) );
	
	if ( idx > 0 ) {
		
		navs[ idx ].style.opacity = '0.25';
		navs[ idx ].style.background = 'rgba( 255, 255, 255, 1 )';
		navs[ idx ].style.cursor = 'default';
		navAction[ idx ] = false; // disable the command
		block[ idx ] = false; // cancel the temporary blocking of the command
		
	}
	
}

function keydown( event ) {
	
	const kc = event.keyCode;
	if ( kc ===  39 ) { navAction[  1 ] = true; } // turnRight        cursor →
	if ( kc ===  38 ) { navAction[  2 ] = true; } // lookUp           cursor ↑
	if ( kc ===  37 ) { navAction[  3 ] = true; } // turnLeft         cursor ←
	if ( kc ===  40 ) { navAction[  4 ] = true; } // lookDown         cursor ↓
	if ( kc === 102 ) { navAction[  5 ] = true; } // moveRight        numpad 6
	if ( kc === 104 ) { navAction[  6 ] = true; } // moveForward      numpad 8
	if ( kc === 100 ) { navAction[  7 ] = true; } // moveLeft         numpad 4
	if ( kc ===  98 ) { navAction[  8 ] = true; } // moveBack         numpad 2
	if ( kc === 105 ) { navAction[  9 ] = true; } // moveRightForward numpad 9
	if ( kc === 103 ) { navAction[ 10 ] = true; } // moveLeftForward  numpad 7
	if ( kc ===  97 ) { navAction[ 11 ] = true; } // moveLeftBack     numpad 1
	if ( kc ===  99 ) { navAction[ 12 ] = true; } // moveRightBack    numpad 3
}

function keyup( event ) {
	
	const kc = event.keyCode;
	if ( kc ===  39 ) { navAction[  1 ] = false; block[  1 ] = false; } // turnRight        cursor →
	if ( kc ===  38 ) { navAction[  2 ] = false; block[  2 ] = false; } // lookUp           cursor ↑
	if ( kc ===  37 ) { navAction[  3 ] = false; block[  3 ] = false; } // turnLeft         cursor ←
	if ( kc ===  40 ) { navAction[  4 ] = false; block[  4 ] = false; } // lookDown         cursor ↓
	if ( kc === 102 ) { navAction[  5 ] = false; block[  5 ] = false; } // moveRight        numpad 6
	if ( kc === 104 ) { navAction[  6 ] = false; block[  6 ] = false; } // moveForward      numpad 8
	if ( kc === 100 ) { navAction[  7 ] = false; block[  7 ] = false; } // moveLeft         numpad 4
	if ( kc ===  98 ) { navAction[  8 ] = false; block[  8 ] = false; } // moveBack         numpad 2
	if ( kc === 105 ) { navAction[  9 ] = false; block[  9 ] = false; } // moveRightForward numpad 9
	if ( kc === 103 ) { navAction[ 10 ] = false; block[ 10 ] = false; } // moveLeftForward  numpad 7
	if ( kc ===  97 ) { navAction[ 11 ] = false; block[ 11 ] = false; } // moveLeftBack     numpad 1
	if ( kc ===  99 ) { navAction[ 12 ] = false; block[ 12 ] = false; } // moveRightBack    numpad 3
	
}

function drag_start( event ) {
	
	const style = window.getComputedStyle( event.target, null );
	const str = ( parseInt(style.getPropertyValue("left")) - event.clientX ) + ',' + ( parseInt(style.getPropertyValue( "top" ) ) - event.clientY ) + ',' + event.target.id;
	event.dataTransfer.setData( "Text", str );
	
} 

function drop( event ) {
	
	const offset = event.dataTransfer.getData( "Text" ).split( ',' );
	const dm = document.getElementById( offset[ 2 ] );
	dm.style.left = ( event.clientX + parseInt( offset[ 0 ], 10 ) ) + 'px';
	dm.style.top  = ( event.clientY + parseInt( offset[ 1 ], 10 ) ) + 'px';
	
	sliderContainer.style.left = ( event.clientX + parseInt( offset[ 0 ], 10 ) ) + paneRadius.toString( ) / 2 + 'px';
	sliderContainer.style.top  = ( event.clientY + parseInt( offset[ 1 ], 10 ) ) - paneRadius.toString( ) / 2 + 'px';
	
	event.preventDefault( );
	return false;
	
}

function drag_over( event ) {
	
	event.preventDefault( );
	return false;
	
}

//  =========   END of AreaControl.js  ===================

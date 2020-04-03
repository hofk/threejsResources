// =============  CircularControl.js  ===================================

// @author hofk https://hofk.de/main/threejs/    https://github.com/hofk
// https://discourse.threejs.org/t/circular-control-used-for-walkable-areas-control/14057 
// https://github.com/hofk/threejsResources/tree/master/Circular-%20Area-Control

'use strict'

/*
// use

	<body ondragover="drag_over( event )" ondrop="drop( event )" >

		<div id="navPane" draggable="true" ondragstart="drag_start( event )"></div>
		
		<div id="sliderContainer"></div>
 
	</body>
	
// in HTML
*/

// ------------------ configuration CircularControl ----------------------

//define center and command rings, rings can lie on a circle at different angles 
const CircularControlIni = [

	// size, color, borderColorCenter (rasterSize is size) for center
	[ 16, '#fefefe', '#ff2233'],
	// rings:
	// commandImageSize, commandRadius (as faktor for rasterSize), commandCount, commandStartAngle in °	
	[ 24, 2.2,  3, 90 ],
	[ 16, 4.0,  6,  0 ],
	//[ 32, 6,  3, 45 ]
	
	// 2 other variants
	/*// size 14 and 14 commands
	[ 24, 2.2,  4,  0 ],
	[ 16, 2.5,  2, 45 ],
	[ 16, 4,    8,  0 ]
	 */
	/* //size 18 and 24 commands
	[ 12, 2.5, 12, 15 ],
	[ 18, 3.7,  6,  0 ],
	[ 12, 3.7,  6, 30 ]
	*/
];

// define the navigation action commands, quantity of the sum of the commands in the rings
 
function noCommand(obj) {}
function command01( obj ) {  } // insert your command e.g. obj.rotateY( ... ); into { }
function command02( obj ) {  }
function command03( obj ) {  }
function command04( obj ) {  }
function command05( obj ) {  }
function command06( obj ) {  }
function command07( obj ) {  }
function command08( obj ) {  }
function command09( obj ) {  }
 
const navActionCommands = [

	noCommand,		//  0  navigation center, drag and drop,
	command01,		//  1
	command02,		//  2
	command03,		//  3
	command04,		//  4
	command05,		//  5
	command06,		//  6
	command07,		//  7
	command08,		//  8
	command09,		//  9
	
];

const navImages = [
	
	'',								//    0 place holder, navigation center, no image
	'ccimg/img01.png',				//    1
	'ccimg/img02.png',				//    2
	'ccimg/img03.png',				//    3
	'ccimg/img04.png',				//    4
	'ccimg/img05.png',				//    5
	'ccimg/img06.png',				//    6
	'ccimg/img07.png',				//    7
	'ccimg/img08.png',				//    8
	'ccimg/img09.png',				//    9

];

// ----------------- end of CircularControl configuration -------------------------------

const rasterSize = CircularControlIni[ 0 ][ 0 ];
let paneRadius = -Infinity;
let pr;

for ( let i = 1; i < CircularControlIni.length; i ++ ) {
	
	pr = rasterSize * ( CircularControlIni[ i ][ 1 ]  + CircularControlIni[ i ][ 0 ] / CircularControlIni[ 0 ][ 0 ] / 2 ) + 2;
	
	paneRadius = pr > paneRadius ? pr : paneRadius;
	
}

const paneDiameter = 2 * paneRadius;

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
navs[ 0 ].style.background = CircularControlIni[0][ 1 ].toString();
navs[ 0 ].style.opacity = '0,5';
navs[ 0 ].style.border = '2px solid ' + CircularControlIni[0][ 2 ].toString();
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

for ( let r = 1; r < CircularControlIni.length; r ++ ) { 
	
	dcc = paneRadius - CircularControlIni[ r ][ 0 ] / 2; 
	
	for ( let i = 0; i < CircularControlIni[ r ][ 2 ]; i ++ ) {
		
		navs[ cNo ] = document.createElement('span');
		document.getElementById( 'navPane' ).appendChild( navs[ cNo ] );
		navs[ cNo ].style.overflow = 'hidden';
		navs[ cNo ].style.position = 'absolute';
		navs[ cNo ].style.background = '#dddddd';
		navs[ cNo ].style.opacity = '0.25';
		
		angle = i * 2 * Math.PI / CircularControlIni[ r ][ 2 ] + CircularControlIni[ r ][ 3 ]* Math.PI / 180;
		
		navX = dcc + Math.cos( angle ) * rasterSize * CircularControlIni[ r ][ 1 ];
		navY = dcc - Math.sin( angle ) * rasterSize * CircularControlIni[ r ][ 1 ];
		navW = CircularControlIni[ r ][ 0 ];
		navH = CircularControlIni[ r ][ 0 ];
		navR = CircularControlIni[ r ][ 0 ] / 2;
		
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
		
	}
	
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

//  =========   END of CircularControl.js  ===================

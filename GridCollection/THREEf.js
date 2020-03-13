// THREEf.js ( r89.0 )

/**
 * @author hofk / http://sandbox.threejs.hofk.de/
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.THREEf = global.THREEf || {})));
}(this, (function (exports) {

'use strict';

var g;	// THREE.Geometry or THREE.BufferGeometry

function createMorphGeometry( p ) {
 
/*	parameter overview	--- all parameters are optional ---

p = {

		// simple properties
		
	indexed,		// indexed or non indexed BufferGeometry
	radius,			// reference radius, multiplier for functions
	height,			// reference height, multiplier for functions
	radiusSegments,	// radius segments (number)
	heightSegments,	// height segments (number)
	circOpen,		// circular connected or disconnected (see quadLine)
	withTop,		// with a top
	fixedMatTop,	// fixed given material index (string of digits for faces), overrides materialTop values
	withBottom,		// with a bottom
	fixedMatBottom,	// fixed given material index (string of digits for faces), overrides materialBottom values
	waffled,		// four faces / segment, with center vertex
	quadLine,		// separate quad line, only aviable when circular open
	quadColor,		// color of quad line
	style,			// 'map', 'cover', 'complete'
			
		// functions: u,v and result normally 0 .. 1, otherwise specific / interesting results!
			// ( trigonometric functions often with factor n * PI )
		// u radial, v heigt, t time
	
	rCircHeight,  	//	function ( u, v, t )	// radius depending on segment location
	centerX,		//	function ( v, t )	// centerpoint x by height
	centerY,		//	function ( v, t )	// centerpoint y by height
	centerZ,		//	function ( v, t )	// centerpoint z by height
	unrollCover,	//	function ( v, t )	// 0 closed, 1 linear open (to -1*radius)
	waffleDeep,		//	function ( u, v, t )	// radius difference center vertex	
	moveX,			//	function ( u, v, t )	// factor for radius, move in x direction 
	moveY,			//	function ( u, v, t )	// factor for height, move in y direction
	moveZ,			//	function ( v, u, t )	// factor for radius, move in z direction
	explode,		// 	function ( t )		// factor for exploded view (only non indexed BufferGeometry)
	endCircAngle,	//	function ( v, t )	// circular end angle (per height)
	startCircAngle,	//	function ( v, t )	// circular starting angle (per height)
	scaleCircAngle,	//	function ( u, t )	// scaling between start and end of circular angle
	topHeight,		//	function ( u, t )	// top height (per circular angle)
	bottomHeight,	//	function ( u, t )	// bottom height (per circular angle)
	scaleHeight, 	//	function ( v, t )	// scaling between bottom and top height
	materialTop,	//	function ( u, t )	// material top ( per circular sector)
	materialBottom,	//	function ( u, t )	// material bottom ( per circular sector)
	materialCover,	//	function ( u, v, t )	// material cover ( per circular sector and height )
											// material: round( result*10 ) is material index  0 .. 10
	
		// string array (strings of digits) seperated with a ,
		
	fixedMaterial,	//  fixed given material index, overrides materialCover
	
		// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	centerPoints	// array of arrays of coordinates [ [ x0, y0, z0 ], ..  [ xi , yi, zi ] ], values normally 0 .. 1
	
  }
  
*/
    if ( p === undefined ) p = {};
	
	g = this;  // this is a THREE.Geometry() / THREE.BufferGeometry() - the base geometry objects from THREE.js
	
	g.noCenterPoints = p.centerPoints === undefined ? true : false;
	
	g.explodeDefault = p.explode === undefined ? true : false;
	
	g.centerXdefault = p.centerX === undefined ? true : false;
	g.centerYdefault = p.centerY === undefined ? true : false;
	g.centerZdefault = p.centerZ === undefined ? true : false;
	
	g.materialTopDefault = p.materialTop === undefined ? true : false;
	g.materialBottomDefault = p.materialBottom === undefined ? true : false;
	g.materialCoverDefault = p.materialCover === undefined ? true : false;
	g.fixedMaterialDefault = p.fixedMaterial === undefined ? true : false;
	g.materialDefault = g.materialTopDefault && g.materialBottomDefault && g.materialCoverDefault && g.fixedMaterialDefault;
	
	//...................................................................... set defaults
	
	g.indexed = 		p.indexed			!== undefined ? p.indexed			: true;
	g.radius = 			p.radius			!== undefined ? p.radius			: 16;
	g.height =			p.height			!== undefined ? p.height			: 100;
	g.radiusSegments =	p.radiusSegments	!== undefined ? p.radiusSegments	: 10;
	g.heightSegments =	p.heightSegments	!== undefined ? p.heightSegments	: 10; 
	g.circOpen =		p.circOpen			!== undefined ? p.circOpen			: false; // is automatic set true if quadLine
	g.withTop =			p.withTop			!== undefined ? p.withTop			: false;
	g.fixedMatTop =		p.fixedMatTop		!== undefined ? p.fixedMatTop		: ""; 
	g.withBottom =		p.withBottom		!== undefined ? p.withBottom		: false;
	g.fixedMatBottom =	p.fixedMatBottom	!== undefined ? p.fixedMatBottom	: "";
	g.waffled =			p.waffled			!== undefined ? p.waffled			: false;
	g.quadLine = 		p.quadLine			!== undefined ? p.quadLine			: false;
	if ( g.quadLine ) g.circOpen = true; 				// quad line is only aviable when circular open
	g.quadColor = 		p.quadColor			!== undefined ? p.quadColor			: 0x000000;
	g.style =			p.style				!== undefined ? p.style				: "complete";
	g.rCircHeight =		p.rCircHeight		!== undefined ? p.rCircHeight		: function ( u, v, t ) { return 1 };
	g.centerX =			p.centerX			!== undefined ? p.centerX			: function ( v, t ) { return 0 };
	g.centerY =			p.centerY			!== undefined ? p.centerY			: function ( v, t ) { return v };
	g.centerZ =			p.centerZ			!== undefined ? p.centerZ			: function ( v, t ) { return 0 };
	g.unrollCover =		p.unrollCover		!== undefined ? p.unrollCover 		: function ( v, t ) { return 0 };
	g.waffleDeep =		p.waffleDeep		!== undefined ? p.waffleDeep		: function ( u, v, t ) { return 0 };
	g.moveX =			p.moveX				!== undefined ? p.moveX				: function ( u, v, t ) { return 0 };
	g.moveY =			p.moveY				!== undefined ? p.moveY				: function ( u, v, t ) { return 0 };
	g.moveZ =			p.moveZ				!== undefined ? p.moveZ				: function ( u, v, t ) { return 0 };
	g.explode = 		p.explode			!== undefined ? p.explode			: function ( t ) { return 0 };
	g.endCircAngle =	p.endCircAngle		!== undefined ? p.endCircAngle		: function ( v, t ) { return 1 };
	g.startCircAngle =	p.startCircAngle	!== undefined ? p.startCircAngle	: function ( v, t ) { return 0 };
	g.scaleCircAngle =	p.scaleCircAngle	!== undefined ? p.scaleCircAngle	: function ( u, t ) { return u };
	g.topHeight =		p.topHeight			!== undefined ? p.topHeight			: function ( u, t ) { return 1 };
	g.bottomHeight =	p.bottomHeight		!== undefined ? p.bottomHeight		: function ( u, t ) { return 0 };
	g.scaleHeight =		p.scaleHeight		!== undefined ? p.scaleHeight		: function ( v, t ) { return v };
	
	// When using multi material:
	// Take index 0 for invisible faces like THREE.MeshBasicMaterial( { visible: false } ),
	// or use transparent faces like THREE.MeshBasicMaterial( {transparent: true, opacity: 0.05 } )
	
	// Please note!	The functions normally should have results from 0 to 1. If the multimaterial array
	// contains fewer materials than the functional result * 10 or highest digit in fixedMatBottom / fixedMatTop
	// the script will crash. Even if the result is negative.
	
	g.materialCover = function() { return 1 };	// default material index is 0.1 * 10 = 1
	g.materialBottom = function() { return 1 }; // can be overwritten by fixedMatBottom (string of digits for faces)
	g.materialTop =	function() { return 1 };	// can be overwritten by fixedMatTop (string of digits for faces)
	
	if ( p.materialCover !== undefined ) g.materialCover = function ( u, v, t ) { return  Math.floor( 10 * p.materialCover( u, v, t ) ) };
	if ( p.materialBottom !== undefined ) g.materialBottom = function ( u, t ) { return  Math.floor( 10 * p.materialBottom( u, t ) ) };
	if ( p.materialTop !== undefined ) g.materialTop = function ( u, t ) { return  Math.floor( 10 * p.materialTop( u, t ) ) };
	
	// Please note!
	// If the multimaterial array contains fewer materials than the highest number in fixed material, the script will crash.
	// String array fixedMaterial contains strings of digits 0 to 9, for instance [ '0011..997741', '22.2.200' ].
	// Every string represents a corresponding row of faces from left-top from cover. The dot is the placeholder for unchanged faces!
	// It's not necessary, that the length of array / strings equals the number of faces, e.g. only ['1'] is sufficient.
	
	g.fixedMaterial = p.fixedMaterial !== undefined ? p.fixedMaterial : []; // default is empty
	
	// array of center points replaces heightSegments, scaleHeight and the center functions centerX, centerY, centerZ
	
	g.centerPoints  = g.noCenterPoints ? [] : p.centerPoints; // default is empty
		
	//..............................................................................................
	
	g.create =	create;
	g.morphVertices	=	morphVertices;
	g.morphFaces =		morphFaces;
	
	g.create();
	g.morphVertices();
	
	if ( !g.materialDefault ) {
	
		g.morphFaces();
	
	}
	
}

function create() {
	
	g = this;
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
	
	var rs = g.radiusSegments;
	var rss = rs + 1;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	
	var nj;					// relative radius segment (circular)
	var nj1;				// next relative radius segment
	var ni;					// relative height segment
	var ni1;				// next relative height segment
	var x, x1, xC;			// coordinates	
	var y, y1, yC;
	var uX, uX1;	
	var uZ, uZ1;
	var topOffset;
	
	if ( g.isGeometry ) {
		
		var vertexCount = hvc * rs;
		vertexCount += ( g.circOpen || ( !g.circOpen && g.isBufferGeometry ) ) ? hss : 0; // extra vertices right to the end
		vertexCount += g.withBottom ? 1 : 0;
		vertexCount += g.withTop ? 1 : 0;
		
		var circFaceCount = g.circOpen ? rs : rs - 1;
		
		var j0;	// j - index
		var j1; // j - index
			
		var a;					// vertices (index)
		var b1, b2, b3, b4;
		var c1, c2, c3, c4;
		
		function uvCoordinatesX() {
	
			nj = j / rs;
			nj1 = ( j + 1 ) / rs;
			x = g.scaleCircAngle( nj );
			x1 = g.scaleCircAngle( nj1 );
		
		}
	
		function uvCoordinatesY() {
	
			ni = i / hs;
			ni1 = ( i + 1 ) / hs;
			y = g.scaleHeight( ni );
			y1 = g.scaleHeight( ni1 );
		
		}
	
		function uvCoordinatesBottomTop() {
	
			uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
			uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
		
		}
		
		function pushTwoFaceVertexUvs() {
		
			g.faceVertexUvs[ 0 ].push( [		// right-bottom
				new THREE.Vector2( x, y ),
				new THREE.Vector2( x1, y ),
				new THREE.Vector2( x1, y1 )
			] );	
			
			g.faceVertexUvs[ 0 ].push( [		// left-top
				new THREE.Vector2( x, y  ),
				new THREE.Vector2( x1, y1 ),
				new THREE.Vector2( x, y1 )
			] );
			
		}
		
		function pushFourFaceVertexUvs() {
			
			g.faceVertexUvs[ 0 ].push( [		// bottom
				new THREE.Vector2( xC, yC ),
				new THREE.Vector2( x, y ),
				new THREE.Vector2( x1, y )
			] );
			
			g.faceVertexUvs[ 0 ].push([			// left
				new THREE.Vector2( xC, yC ),
				new THREE.Vector2( x, y1 ),
				new THREE.Vector2( x, y )
			] );
			
			g.faceVertexUvs[ 0 ].push( [		// right
				new THREE.Vector2( xC, yC ),
				new THREE.Vector2( x1, y ),
				new THREE.Vector2( x1, y1 )
			] );
			
			g.faceVertexUvs[ 0 ].push( [		// top
				new THREE.Vector2( xC, yC ),
				new THREE.Vector2( x1, y1 ),
				new THREE.Vector2( x, y1 )
			] );
		
		}
		
		function pushBottomFaceVertexUvs() {
		
			g.faceVertexUvs[ 0 ].push( [
				new THREE.Vector2( 0.5, 0.5 ),
				new THREE.Vector2( uX1, uZ1 ),
				new THREE.Vector2( uX, uZ )
			] );
			
		}
		
		function pushTopFaceVertexUvs() {
		
			g.faceVertexUvs[ 0 ].push( [
				new THREE.Vector2( 0.5, 0.5 ),
				new THREE.Vector2( uX, uZ ),
				new THREE.Vector2( uX1, uZ1 )
			] );
			
		}
		
	
		for ( var i = 0; i < vertexCount; i ++ ) { 
		
			g.vertices.push( new THREE.Vector3( 0, 0, 0 ) ); 
	
		}
		
		if ( g.quadLine ) {
			
			g.lineGeometry = new THREE.Geometry();  // quad line geometry 
			g.quadLine = new THREE.Line( g.lineGeometry, new THREE.LineBasicMaterial( { color: g.quadColor } ) );
			
			for ( var i = 0; i <  2 * hss * rss; i ++ ) { 
				
				g.lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
				
			}
			
		}
		
		if ( !g.waffled ) {
		
			for ( var j = 0; j < circFaceCount; j ++ ) {
				
				uvCoordinatesX();
				
				j0 = hvc * j; 
				j1 = hvc * ( j + 1 );
				
				for ( var i = 0; i < hs; i ++ ) {
					
					// 2 faces / segment,  3 vertex indices
					a =  j0 + i;
					b1 = j1 + i;		// right-bottom
					c1 = j1 + 1 + i;
					b2 = j1 + 1 + i;	// left-top
					c2 = j0 + 1 + i;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // right-bottom
					g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left-top
					
					uvCoordinatesY();
					
					pushTwoFaceVertexUvs();
					
				}
				
			}
			
		}
		
		if ( g.waffled ) {
		
			for ( var j = 0; j < circFaceCount; j ++ ) {
			
				uvCoordinatesX();
				xC = 0.5 * ( x + x1 );
				
				j0 = hvc * j; 
				j1 = hvc * ( j + 1 );
				
				for ( var i = 0; i < hs; i ++ ) {
				
					// 4 faces / segment, 3 vertex indices
					a =  hvc * j + hss + i;
					
					b1 = j0 + i;		// bottom
					c1 = j1 + i;
					
					b2 = j0 + 1 + i;	// left
					c2 = j0 + i;
					
					b3 = j1 + i;		// right
					c3 = j1 + 1 + i;
					
					b4 = j1 + 1 + i;	// top
					c4 = j0 + 1 + i;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // bottom
					g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left
					g.faces.push( new THREE.Face3( a, b3, c3, null, null, 1 ) ); // right
					g.faces.push( new THREE.Face3( a, b4, c4, null, null, 1 ) ); // top
					
					uvCoordinatesY();
					
					yC = 0.5 * ( y + y1 );
					
					pushFourFaceVertexUvs();
				
				}
				
			}
			
		}	
		
		if ( !g.circOpen && g.style === "complete" ) {
		
			j  = rs - 1;					// connection to first radius segment
			j0 = hvc * j; 
			j1 = hvc * ( j + 1 );
			
			nj = j / rs;
			
			//   UVs
			x  = g.scaleCircAngle( nj );
			x1 = g.scaleCircAngle(  1 );
		
			if ( !g.waffled ) {
			
				for ( var i = 0; i < hs; i ++ ) {
				
					// 2 faces / segment,  3 vertex indices
					a =  j0 + i;
					
					b1 = i;					// right-bottom
					c1 = 1 + i;
					
					b2 = 1 + i;				// left-top
					c2 = j0 + 1 + i;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // right-bottom
					g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left-top
					
					uvCoordinatesY();
					
					pushTwoFaceVertexUvs();
				
				}
				
			}
			
			if ( g.waffled ) {
				
				xC  = 0.5 * ( x + x1 ); //   UVs
				
				for ( var i=0; i < hs; i ++ ) {
				
					// 4 faces / segment, 3 vertex indices
					a =  j0 + hss + i;
					
					b1 = j0 + i;			// bottom
					c1 = i;
					
					b2 = j0 + 1 + i;		// left
					c2 = j0 + i;
					
					b3 = i;					// right
					c3 = 1 + i;
					
					b4 = 1 + i;				// top
					c4 = j0 + 1 + i;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) ); // bottom
					g.faces.push( new THREE.Face3( a, b2, c2, null, null, 1 ) ); // left
					g.faces.push( new THREE.Face3( a, b3, c3, null, null, 1 ) ); // right
					g.faces.push( new THREE.Face3( a, b4, c4, null, null, 1 ) ); // top
					
					uvCoordinatesY();	
					
					yC = 0.5 * ( y + y1 );
					pushFourFaceVertexUvs();
				
				}
				
			}
		
		}
	
		if ( g.withBottom || g.withTop ) {
	
			topOffset = 0;
		
			if ( g.withBottom ) {
			
				topOffset = 1;
				
				a  = g.circOpen ? hvc * rs + hss : hvc * rs ;  // from center a
			
				for ( var j = 0; j < circFaceCount; j ++ ) {
					
					nj  = ( rs - j ) / rs;
					nj1 = ( rs - j - 1 ) / rs;
	
					b1 = hvc * ( j + 1 );
					c1 = hvc * j;
	
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
					
					uvCoordinatesBottomTop();
					
					pushBottomFaceVertexUvs();
	
				}
						
				if ( !g.circOpen ) {
		
					j = rs - 1;					// connect to the first segment
					
					nj  = ( rs - j ) / rs;
					nj1 = ( rs - j - 1 ) / rs;
					
					a  = hvc * rs;
					b1 = 0;
					c1 = hvc * j;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
					
					uvCoordinatesBottomTop();
					
					pushBottomFaceVertexUvs();
					
				}	
			}
			
			if ( g.withTop ) {
			
				a  = g.circOpen ? hvc * rs + hss + topOffset : hvc * rs + topOffset;	// from center a
				
				for ( var j = 0; j < circFaceCount; j ++ ) {
					
					nj  = j / rs;
					nj1 = ( j + 1 ) / rs;
	
					b1 = hvc * j + hs;
					c1 = hvc * ( j + 1 ) + hs;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
					
					uvCoordinatesBottomTop();
					
					pushTopFaceVertexUvs();
				
				}
				
				if ( !g.circOpen ) {
				
					j = rs - 1;					// connect to the first segment
					
					nj  = j / rs;
					nj1 = ( j + 1 ) / rs;
				
					a  = hvc * rs + topOffset;	// from center a
					b1 = hvc * j + hs;
					c1 = hs;
					
					g.faces.push( new THREE.Face3( a, b1, c1, null, null, 1 ) );
					
					uvCoordinatesBottomTop();
					
					pushTopFaceVertexUvs();
				
				}
			
			}
	
		}

	}

	if ( g.isBufferGeometry && g.indexed ) {
	
		var vIdx;				// vertex index
		var waffleVidx; 		// waffle vertex index	
		var circVertexCount = g.circOpen ? rss : rs;
	
		var vertexCount = hvc * rs + hss;	
		vertexCount += g.withBottom ? 1 + rss : 0;
		vertexCount += g.withTop ? 1 + rss : 0;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount =  hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		var idxCount = 0;
		
		function uvCoordinatesBottomTop() {
	
			uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			// uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) ); // not required for indexed
			uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			// uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) ); // not required for indexed
		
		}
		
		g.faceIndices = new Uint32Array( faceCount * 3 );
		g.vertices = new Float32Array( vertexCount * 3 );  
		g.normals = new Float32Array( vertexCount * 3 ); 
		g.uvs = new Float32Array( vertexCount * 2 ); // uvs to vertices	
		
		g.setIndex( new THREE.BufferAttribute( g.faceIndices, 1 ) );	
		g.addAttribute( 'position', new THREE.BufferAttribute( g.vertices, 3 ).setDynamic( true ) );
		g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
		g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) );
		
		if ( g.quadLine ) {
			
			g.lineGeometry = new THREE.BufferGeometry();
			g.quadLine = new THREE.Line( g.lineGeometry, new THREE.LineBasicMaterial( { color: g.quadColor } ) );
			
			g.linePositions = new Float32Array(  2 * hss * rss * 3 );
			g.lineGeometry.addAttribute( 'position', new THREE.BufferAttribute( g.linePositions, 3 ) );
			
		}	
		
		g.vertexFaces = [];		// needed to calculate the normals
		
		if ( !g.waffled ) {
	
			for ( var j = 0; j < rs; j ++ ) {
				
				//uvCoordinatesX();
				
				for ( var i = 0; i < hs; i ++ ) {
					
					// 2 faces / segment,  3 vertex indices
					a =  hvc * j + i;
					b1 = hvc * ( j + 1 ) + i;		// right-bottom
					c1 = hvc * ( j + 1 ) + 1 + i;
					b2 = hvc * ( j + 1 ) + 1 + i;	// left-top
					c2 = hvc * j + 1 + i;
					
					g.faceIndices[ idxCount     ] = a; // right-bottom
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					g.faceIndices[ idxCount + 3 ] = a; // left-top
					g.faceIndices[ idxCount + 4 ] = b2,
					g.faceIndices[ idxCount + 5 ] = c2; 
					
					idxCount += 6;
					
				}
				
			}
			
			// faces to vertex
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					//vIdx =  hvc * j + i;	// vertex index
					fLeft = 2 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 3;
					fRight = 2 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 3;
					
					vFace = [];
					
					if  ( !g.circOpen && j === 0  ) {
					
						// connect face
						
						fIdx = ( ( rs - 1 ) * hs  + i ) * 2;
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							if ( i === 0 ) vFace.push( fIdx * 3 ); // face double (equal number left and right) 
							
						}
						
						if ( i > 0 ) { 
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 2 ) * 3 );
							
						}
						
					}
					
					if  ( !g.circOpen && j === rs  ) {
						
						// connect face
						
						fIdx = i * 2;
						
						if ( i < hs ) {
						
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 1 ) * 3 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							if ( i === hs ) vFace.push( ( fIdx - 1 ) * 3 ); // face double (equal number left and right) 
							
						}	
						
					}
					
					if  (  j > 0 ) {
						
						if ( i < hs ) {
							
							vFace.push(  fLeftPos );
							if ( i === 0 && ( !g.circOpen || ( g.circOpen && j !== rs ) ) ) vFace.push( fLeftPos ); // face double (equal number left and right)
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 3 );
							vFace.push( fLeftPos - 6 );
							
						}
						
					}
					
					if	( j < rs ) {
					
						if ( i < hs ) { 
							
							vFace.push( fRightPos );
							vFace.push( fRightPos + 3 ); 
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 3 );
							if ( i === hs && ( !g.circOpen || ( g.circOpen && j !== 0 ) ) ) vFace.push( fRightPos - 3 ); // face double (equal number left and right)
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx = hs * rs * 2 + j;
						
						if ( !g.circOpen && j === 0  ) vFace.push( ( fIdx + rs - 1  ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0  ) vFace.push( ( fIdx - 1 ) * 3 );
					}
						
					if ( i === hs && g.withTop ) {
						
						fIdx =  hs * rs * 2 + ( g.withBottom ? rs : 0 ) + j; 
						
						if (  !g.circOpen  && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 );
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0 ) vFace.push( ( fIdx - 1 ) * 3 );
						
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
			
				//uvCoordinatesX();
				//xC = 0.5 * ( x + x1 );
				
				for ( var i = 0; i < hs; i ++ ) {
				
					// 4 faces / segment, 3 vertex indices
					a =  hvc * j + hss + i;
					
					b1 = hvc * j + i;				// bottom
					c1 = hvc * ( j + 1 ) + i;
					
					b2 = hvc * j + 1 + i;			// left
					c2 = hvc * j + i;
					
					b3 = hvc * ( j + 1 ) + i;		// right
					c3 = hvc * ( j + 1 ) + 1 + i;
					
					b4 = hvc * ( j + 1 ) + 1 + i;	// top
					c4 = hvc * j + 1 + i;
					
					g.faceIndices[ idxCount] = a;		// bottom
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					g.faceIndices[ idxCount + 3 ] =  a; // left
					g.faceIndices[ idxCount + 4 ] =  b2,
					g.faceIndices[ idxCount + 5 ] =  c2; 
					
					g.faceIndices[ idxCount + 6 ] = a;	// right
					g.faceIndices[ idxCount + 7 ] = b3;
					g.faceIndices[ idxCount + 8 ] = c3; 
					
					g.faceIndices[ idxCount + 9 ] =  a; // top
					g.faceIndices[ idxCount + 10 ] =  b4,
					g.faceIndices[ idxCount + 11 ] =  c4;
					
					idxCount += 12;
					
				}
				
			}
			
			// faces to vertex
			
			for ( var j = 0; j < rss; j ++ ) {
			
				for ( var i = 0; i < hss; i ++ ) {
						
					// vIdx =  hvc * j + i;	// vertex index
					fLeft = 4 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 3;
					fRight = 4 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 3;
					
					vFace = [];
					
					if  ( !g.circOpen && j === 0 ) {
					
						// connect face
						
						fIdx = ( ( rs - 1 ) * hs + i ) * 4; 
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 2 ) * 3 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 2 ) * 3 ); 
							
						}
						
					}
					
					if  ( !g.circOpen && j === rs  ) {
						
						// connect face
						
						fIdx = i * 4;
						
						if ( i < hs ) {
							
							vFace.push( fIdx * 3 );
							vFace.push( ( fIdx + 1 ) * 3 );
					
						}
						
						if ( i > 0 ) {
							
							vFace.push( ( fIdx - 1 ) * 3 );
							vFace.push( ( fIdx - 3 ) * 3 ); 
							
						}
						
					}
					
					if  ( j > 0 ) {
						
						if ( i < hs ) { 
							
							vFace.push( fLeftPos );
							vFace.push( fLeftPos + 6 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 3 );
							vFace.push( fLeftPos - 6 );
							
						}
						
					}
				
					if	( j < rs ) {
						
						if ( i < hs ) {
							
							vFace.push( fRightPos + 3 );
							vFace.push( fRightPos );
							
						}
						
						if ( i > 0 ) {
						
							vFace.push( fRightPos - 3 );
							vFace.push( fRightPos - 9 );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
					
						fIdx =  hs * rs * 4 + j;
						
						if ( !g.circOpen && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0  ) vFace.push( ( fIdx - 1 ) * 3 ); 
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx = hs * rs * 4 + ( g.withBottom ? rs : 0 ) + j;
						
						if ( !g.circOpen  && j === 0 ) vFace.push( ( fIdx + rs - 1 ) * 3 ); 
						
						if ( !g.circOpen && j === rs ) vFace.push( ( fIdx - rs ) * 3 ); 
						
						if ( j < rs ) vFace.push( fIdx * 3 );
						
						if ( j > 0 ) vFace.push( ( fIdx - 1 ) * 3  );
						 
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
				// waffle vertices with four faces
				
				if ( j < rs ) {
					
					for ( var i = 0; i < hs; i ++ ) {
					
						vFace = []; 
						
						// fIdx = ( j * hs + i ) * 4; // face index
						fPos = ( j * hs + i ) * 12 // fIdx * 3
						
						vFace.push( fPos );
						vFace.push( fPos + 3 );
						vFace.push( fPos + 6 );
						vFace.push( fPos + 9 );
						
						g.vertexFaces.push( vFace );
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				a = hvc * rs + hss;  // from center a
				
				for ( var j = 0; j < rs; j ++ ) {
					
					b1 = a + j + 2;
					c1 = a + j + 1;
					
					g.faceIndices[ idxCount ] = a;
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					idxCount += 3;
					
				}
				
				// faces to center vertex
				
				vFace = []; 
				
				for ( var j = 0; j < rs; j ++ ) {
					
					vFace.push( (  hs * rs * fps + j ) * 3 );
					
				}
				
				g.vertexFaces.push( vFace );
				
				// faces to edge-vertices
				
				for ( var j = 0; j < rss; j ++ ) {
					
					vFace = []; 
					
					if ( j === 0  && !g.circOpen ) vFace.push( ( hs * rs * fps + rs - 1 ) * 3 );
					if ( j === rs  && !g.circOpen ) vFace.push( hs * rs * fps * 3 );
					if ( j > 0 ) vFace.push( ( hs * rs * fps + j - 1 ) * 3 );
					if ( j < rs ) vFace.push( ( hs * rs * fps + j ) * 3 );
					
					if ( !g.waffled ) {
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push(  hs * ( rs - 1) * 2 * 3 );
							vFace.push(  hs * ( rs - 1) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( 0 );
							vFace.push( 3 );
							vFace.push(  hs * ( rs - 1) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j > 0 ) {
							
							vFace.push(  hs * ( j - 1 ) * 2 * 3 );
							if ( j !== rs ) vFace.push(  hs * ( j - 1 ) * 2 * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j < rs ) {
							
							vFace.push( hs * j * 2 * 3 );
							vFace.push( ( hs * j * 2 + 1 ) * 3 );
							
						}
						
					}
					
					if ( g.waffled ) { 
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( hs * ( rs - 1 ) * 4 * 3 );
							vFace.push( ( hs * ( rs - 1 ) * 4 + 2 ) * 3 );
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( 0 );
							vFace.push( 3 );
							
						}
						
						if ( j > 0 ) {
							
							vFace.push( hs * ( j - 1 ) * 4 * 3 );
							vFace.push( ( hs * ( j - 1 ) * 4 + 2 ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( hs * j * 4 * 3 );
							vFace.push( ( hs * j * 4 + 1 ) * 3 );
							
						}
						
					}
					
					g.vertexFaces.push( vFace ); 
					
				}
				
			}
			
			if ( g.withTop ) {
			
				a = hvc * rs + hss + topOffset ;   // from center a
				
				for ( var j = 0; j < rs; j ++ ) {
					
					b1 = a + j + 1;
					c1 = a + j + 2;
					
					g.faceIndices[ idxCount ] = a;
					g.faceIndices[ idxCount + 1 ] = b1;
					g.faceIndices[ idxCount + 2 ] = c1; 
					
					idxCount += 3;
					
				}
				
				// faces to center vertex	
				
				vFace = []; 
				
				for ( var j = 0; j < rs; j ++ ) {
					
					vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 3 );
					
				}
				
				g.vertexFaces.push( vFace );
				
				// faces to edge-vertices
				
				for ( var j = 0; j < rss; j ++ ) {
					
					vFace = []; 
					
					if ( j === 0  && !g.circOpen ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + rs - 1 ) * 3 );
					if ( j === rs  && !g.circOpen ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) ) * 3 );
					if ( j > 0 ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j - 1 ) * 3 );
					if ( j < rs ) vFace.push( ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 3 );
					
					if ( !g.waffled ) {
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( ( hs * rs * 2 - 2 ) * 3 );
							vFace.push( ( hs * rs * 2 - 1 ) * 3 ); 
							vFace.push( (hs * 2 - 1 )* 3 ); // face double (equal number left and right)
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( ( hs * 2 - 1 ) * 3 );
							vFace.push( ( hs * 2 - 1 ) * 3 ); // face double (equal number left and right)
							
						}
						
						if ( j > 0 ) {
							
							vFace.push( ( hs * j * 2  - 2  ) * 3 );
							vFace.push( ( hs * j * 2  - 1  ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( ( hs * ( j + 1 ) * 2 - 1 ) * 3 );
							if ( j !== 0 ) vFace.push( ( hs * ( j + 1 ) * 2 - 1 ) * 3 ); // face double (equal number left and right)
							
						}
						
						
					}
					
					if ( g.waffled ) { 
						
						if ( !g.circOpen && j === 0 ) {
							
							vFace.push( ( hs * rs * 4 - 1 ) * 3 );
							vFace.push( ( hs * rs * 4 - 2 ) * 3 );
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							vFace.push( ( hs * 4 - 1 ) * 3 );
							vFace.push( ( hs * 4 - 3 ) * 3 );
						
						}
						
						if ( j > 0 ) {
							
							vFace.push( ( hs * j * 4 - 1 ) * 3 );
							vFace.push( ( hs * j * 4 - 2 ) * 3 );
							
						}
						
						if ( j < rs ) {
							
							vFace.push( ( hs * ( j + 1 ) * 4 - 1 ) * 3 );
							vFace.push( ( hs * ( j + 1 ) * 4 - 3 ) * 3 );
							
						}
					
					}
					
					g.vertexFaces.push( vFace );
					
				}
				
			}
			
		}
		
		// write uv buffer array cover
		
		for ( var j = 0; j < rss; j ++ ) {
			
			for ( var i = 0; i < hss; i ++ ) {
				
				vIdx = hvc * j + i;	// vertex index
				
				g.uvs[ vIdx * 2 ] = g.scaleCircAngle( j / rs );
				g.uvs[ vIdx * 2 + 1 ] = g.scaleHeight( i / hs );
				
			}
			
		}
		
		// write uv buffer array waffle points
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
			
				for ( var i = 0; i < hs; i ++ ) {
					
					waffleVidx = hvc * j + i + hss; // waffle-vertex index
					
					g.uvs[ waffleVidx * 2 ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
					g.uvs[ waffleVidx * 2 + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
					
				}
				
			}
			
		}
		
		// write uv buffer array bottom / top
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				vIdx = hvc * rs  + hss;  // center bottom
				
				g.uvs[ vIdx * 2 ] = 0.5;
				g.uvs[ vIdx * 2 + 1 ] = 0.5;
				
				for ( var j = 0; j < rss; j ++ ) { 
					
					vIdx = hvc * rs  + hss + 1 + j; // vertex index
					
					nj  = 1 - j / rs;
					uvCoordinatesBottomTop();
					
					g.uvs[ vIdx * 2 ] = uX;
					g.uvs[ vIdx * 2 + 1 ] = uZ;
					
				}
				
			}
		
			if ( g.withTop ) {
				
				vIdx = hvc * rs  + hss + topOffset; // center top
				
				g.uvs[ vIdx * 2 ] = 0.5;
				g.uvs[ vIdx * 2 + 1 ] = 0.5;
				
				for ( var j = 0; j < rss; j ++ ) { 
					
					vIdx = hvc * rs  + hss + topOffset + 1 + j; // vertex index
					
					nj  = j / rs;
					uvCoordinatesBottomTop();
					
					g.uvs[ vIdx * 2 ] = uX;
					g.uvs[ vIdx * 2 + 1 ] = uZ;
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0, p = 0; f < faceCount; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
	if ( g.isBufferGeometry && !g.indexed ) {
		
		var fLeft;				// face left (index)
		var fLeftPos;
		var fRight;				// face right (index)
		var fRightPos;
		var fIdx;				// face index
		var fPos 
		var vIdx;				// vertex index
		var waffleVidx; 		// waffle vertex index
		var uvIdx;				// uv index
		
		var circVertexCount = g.circOpen ? rss : rs;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		function uvCoordinatesBottomTop() {
	
			uX =  0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uX1 = 0.5 * ( 1 - Math.sin( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
			uZ =  0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj ) ) );
			uZ1 = 0.5 * ( 1 + Math.cos( 2 * Math.PI * g.scaleCircAngle( nj1 ) ) );
		
		}
		
		g.positions = new Float32Array( faceCount * 9 );
		g.normals = new Float32Array( faceCount * 9 );
		g.uvs = new Float32Array( faceCount * 6 );  // uv's to positions
		
		g.addAttribute( 'position', new THREE.BufferAttribute( g.positions, 3 ).setDynamic( true ) );
		g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
		g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) ); 
		
		if ( g.quadLine ) {
			
			g.lineGeometry = new THREE.BufferGeometry();
			g.quadLine = new THREE.Line( g.lineGeometry, new THREE.LineBasicMaterial( { color: g.quadColor } ) );
			
			g.linePositions = new Float32Array(  2 * hss * rss * 3 );
			g.lineGeometry.addAttribute( 'position', new THREE.BufferAttribute( g.linePositions, 3 ) );
			
		}	
		
		g.vertexFaces = [];		// needed to calculate the normals
		g.vertexPositions = [];
		
		var vFace = [];
		var vPos = [];
		
		// const a = 0; //  position index offset, triangle corners a, b, c
		const b = 3;
		const c = 6;
		
		if ( !g.waffled ) {
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					//vIdx =  hvc * j + i;	// vertex index
					fLeft = 2 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 9;
					fRight = 2 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 9;
					
					vFace = [];
					vPos = [];
					
					if ( !g.circOpen && j === 0 ) {
						
						// connect face / positions on the far right are identical
						
						fIdx = ( ( rs - 1 ) * hs  + i ) * 2;
						
						if ( i < hs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							if ( i === 0 ) vFace.push( fPos  ); // face double (equal number left and right)
							vPos.push( fPos + b );
							
						}
						
						if ( i > 0 ) { 
							
							fPos = ( fIdx - 1 ) * 9
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
							fPos = ( fIdx - 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
					}
					
					if ( !g.circOpen && j === rs ) {
						
						// connect face
						
						// fIdx = i * 2;
						fPos = i * 2 * 9;
						
						if ( i < hs ) {
							
							vFace.push( fPos );
							vPos.push(  fPos );
							
							vFace.push( fPos + 9 );
							vPos.push(  fPos + 9 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fPos - 9 );
							if ( i === hs ) vFace.push( fPos - 9 ); // face double (equal number left and right)
							vPos.push( fPos - 9 + c );
							
						}
						
					}
					
					if  (  j > 0 ) {
						
						if ( i < hs ) {
							
							vFace.push(  fLeftPos );
							if ( i === 0 && ( !g.circOpen || ( g.circOpen && j !== rs ) ) ) vFace.push( fLeftPos );
							vPos.push( fLeftPos + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 9 );
							vPos.push( fLeftPos - 9 + b );
							
							vFace.push( fLeftPos - 18 );
							vPos.push( fLeftPos - 18 + c );
							
						}
						
					}
					
					if	( j < rs ) {
						
						if ( i < hs ) { 
							
							vFace.push( fRightPos );
							vPos.push( fRightPos );
							
							vFace.push( fRightPos + 9 ); 
							vPos.push( fRightPos + 9 );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 9 );
							if ( i === hs && ( !g.circOpen || ( g.circOpen && j !== 0 ) ) ) vFace.push( fRightPos - 9 ); // face double (equal number left and right)
							vPos.push( fRightPos - 9 + c );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx = hs * rs * 2 + j;
						
						if ( !g.circOpen && j === 0  ) {  
							
							fPos = ( fIdx + rs - 1  ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + b ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos ); 
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
						if (  j > 0 ) {  
							
							fPos = ( fIdx - 1 ) * 9; 
							
							vFace.push( fPos ); 
							vPos.push( fPos + b ); 
							
						}
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx =  hs * rs * 2 + ( g.withBottom ? rs : 0 ) + j; 
						
						if ( !g.circOpen && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
					}
					
					g.vertexFaces.push( vFace );
					g.vertexPositions.push( vPos );
					
				}
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rss; j ++ ) {
				
				for ( var i = 0; i < hss; i ++ ) {
					
					// vIdx =  hvc * j + i;	// vertex index
					fLeft = 4 * ( ( j - 1 ) * hs + i ); // face indices left
					fLeftPos = fLeft * 9;
					fRight = 4 * ( j * hs + i );		// face indices right
					fRightPos = fRight * 9;
					
					vFace = [];
					vPos = [];
					
					if  ( !g.circOpen && j === 0 ) {
						
						// connect face / positions on the far right are identical
						
						fIdx = ( ( rs - 1 ) * hs + i ) * 4; 
						
						if ( i < hs ) {
							
							fPos = fIdx * 9; 
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
							fPos = ( fIdx + 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( i > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
							fPos = ( fIdx - 2 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
					}
					
					if ( !g.circOpen && j === rs ) {
					
						// connect face
						
						// fIdx = i * 4;
						fPos = i * 4 * 9;
					
						if ( i < hs ) { 
							
							vFace.push( fPos );	
							vPos.push( fPos + b );
							
							vFace.push( fPos + 9 );	
							vPos.push( fPos + 9 + c );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fPos - 9 );	
							vPos.push( fPos - 9 + c );
							
							vFace.push( fPos - 27 );
							vPos.push( fPos - 27 + b );
							
						}
						
					}
					
					if ( j > 0 ) {
						
						if ( i < hs ) { 
							
							vFace.push( fLeftPos );
							vPos.push( fLeftPos + c );
							
							vFace.push( fLeftPos + 18 );
							vPos.push( fLeftPos + 18 + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fLeftPos - 9 );
							vPos.push( fLeftPos - 9 + b );
							
							vFace.push( fLeftPos - 18 );
							vPos.push( fLeftPos - 18 + c );
						}
						
					}
					
					if ( j < rs ) {
						
						if ( i < hs ) {
							
							vFace.push( fRightPos + 9 );
							vPos.push( fRightPos + 9 + c );
							
							vFace.push( fRightPos );
							vPos.push( fRightPos + b );
							
						}
						
						if ( i > 0 ) {
							
							vFace.push( fRightPos - 9 );
							vPos.push( fRightPos - 9 + c );
							
							vFace.push( fRightPos - 27 );
							vPos.push( fRightPos - 27 + b );
							
						}
						
					}
					
					if ( i === 0 && g.withBottom ) {
						
						fIdx =  hs * rs * 4 + j;
						
						if ( !g.circOpen && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + c );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + b );
							
						}
						
					}
					
					if ( i === hs && g.withTop ) {
						
						fIdx = hs * rs * 4 + ( g.withBottom ? rs : 0 ) + j;
						
						if ( !g.circOpen  && j === 0 ) {
							
							fPos = ( fIdx + rs - 1 ) * 9;
							
							vFace.push( fPos ); 
							vPos.push( fPos + c ); // position far right is identical
							
						}
						
						if ( !g.circOpen && j === rs ) {
							
							fPos = ( fIdx - rs ) * 9;
							
							vFace.push( fPos );
							
						}
						
						if ( j < rs ) {
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + b );
							
						}
						
						if ( j > 0 ) {
							
							fPos = ( fIdx - 1 ) * 9
							
							vFace.push( fPos  );
							vPos.push( fPos + c );
							
						}
						
					}
					
					g.vertexFaces.push( vFace );
					g.vertexPositions.push( vPos );
					
				}
				
				// waffle vertices with four faces
				
				if ( j < rs ) {
					
					for ( var i = 0; i < hs; i ++ ) {
						
						vFace = []; 
						vPos = [];
						
						// fIdx = ( j * hs + i ) * 4; // face index
						fPos = ( j * hs + i ) * 36 // fIdx * 9
						
						vFace.push( fPos );
						vPos.push( fPos );
						
						vFace.push( fPos + 9 );
						vPos.push( fPos + 9 );
						
						vFace.push( fPos + 18 );
						vPos.push( fPos + 18 );
						
						vFace.push( fPos + 27 );
						vPos.push( fPos + 27 );
						
						g.vertexFaces.push( vFace );
						g.vertexPositions.push( vPos );
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom ) {
			
			vFace = []; 
			vPos = [];
			
			for ( var j = 0; j < rs; j ++ ) {
				
				fPos = ( hs * rs * fps + j ) * 9;
				
				vFace.push( fPos );
				vPos.push( fPos );
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
		}
		
		if ( g.withTop ) {
			
			vFace = [];
			vPos = [];
			
			for ( var j = 0; j < rs; j ++ ) {
				
				fPos = ( hs * rs * fps + ( g.withBottom ? rs : 0 ) + j ) * 9;
				
				vFace.push( fPos );
				vPos.push( fPos);
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
		}
		
		// write uv buffer array
		
		for ( var j = 0; j < circVertexCount; j ++ ) {
			
			for ( var i = 0; i < hss; i ++ ) {
				
				vIdx = hvc * j + i;	// vertex index
				
				for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
					
					uvIdx = g.vertexPositions[ vIdx ][ p ] / 3 * 2;
					
					g.uvs[ uvIdx ] = g.scaleCircAngle( j / rs );
					g.uvs[ uvIdx + 1 ] = g.scaleHeight( i / hs );
					
				}
				
			}
		}
		
		// write uv buffer array waffle points
		
		if ( g.waffled ) {
			
			//for ( var j = 0; j < circVertexCount - 1; j ++ ) {
			for ( var j = 0; j < rs; j ++ ) {
				
				for ( var i = 0; i < hs; i ++ ) {
					
					waffleVidx = hvc * j + i + hss; // waffle-vertex index
					
					for ( var p = 0; p < g.vertexPositions[ waffleVidx ].length; p ++ ) {
						
						uvIdx =  g.vertexPositions[ waffleVidx  ][ p ] / 3 * 2;
						
						g.uvs[ uvIdx ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
						g.uvs[ uvIdx + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
						
					}
					
				}
				
			}
			
		}
		
		// write uv buffer array bottom
		
		if ( g.withBottom ) {
			
			fIdx =  rs * hs * fps;
			
			for ( var j = 0; j < rs; j ++ ) {
			
				nj  = ( rs - j ) / rs;
				nj1 = ( rs - j - 1 ) / rs;
				
				uvCoordinatesBottomTop();
				
				uvIdx = ( fIdx + j ) * 6;
				
				g.uvs[ uvIdx ] = 0.5;
				g.uvs[ uvIdx + 1 ] = 0.5;
				
				g.uvs[ uvIdx + 2 ] = uX1;
				g.uvs[ uvIdx + 3 ] = uZ1;
				
				g.uvs[ uvIdx + 4 ] = uX;
				g.uvs[ uvIdx + 5 ] = uZ;
				
			}
			
		}
		
		// write uv buffer array top
		
		if ( g.withTop ) {
			
			fIdx =  rs * hs * fps + ( g.withBottom ? rs : 0 );
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj  = j / rs;
				nj1 = ( j + 1 ) / rs;
				
				uvCoordinatesBottomTop();
				
				uvIdx = ( fIdx + j ) * 6;
				
				g.uvs[ uvIdx ] = 0.5;
				g.uvs[ uvIdx + 1 ] = 0.5;
				
				g.uvs[ uvIdx + 2 ] = uX;
				g.uvs[ uvIdx + 3 ] = uZ;
				
				g.uvs[ uvIdx + 4 ] = uX1;
				g.uvs[ uvIdx + 5 ] = uZ1;
				
			}
			
		}
		
		// overwrite last right uvs (u with scaled 1)
		
		if ( !g.circOpen ) {
			
			for ( var i = 0; i < hs; i ++ ) {
				
				fIdx = ( rs - 1 ) * hs * fps; // last right face index (i=0)
				
				if ( !g.waffled ) {
					
					uvIdx = fIdx * 6 + i * 12;
					
					g.uvs[ uvIdx + 2 ] = g.scaleCircAngle( 1 );	// lower face, vertex b, u 
					g.uvs[ uvIdx + 4 ] = g.scaleCircAngle( 1 ); // lower face, vertex c, u 
					g.uvs[ uvIdx + 8 ] = g.scaleCircAngle( 1 ); // upper face, vertex b, u 
					
				}
				
				if ( g.waffled ) {
					
					uvIdx = fIdx * 6 + i * 24;
					
					g.uvs[ uvIdx +  4 ] = g.scaleCircAngle( 1 ); // lower face, vertex c, u 
					g.uvs[ uvIdx + 14 ] = g.scaleCircAngle( 1 ); // right face, vertex b, u 
					g.uvs[ uvIdx + 16 ] = g.scaleCircAngle( 1 ); // right face, vertex c, u 
					g.uvs[ uvIdx + 20 ] = g.scaleCircAngle( 1 ); // upper face, vertex b, u 
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0, p = 0; f < faceCount; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
}

function morphVertices( time ) {
	
	var t = time !== undefined ? time : 0;
	
	g = this;
	
	var rs = g.radiusSegments;
	var rss = rs + 1;
	var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
	var hss	= hs + 1;
	var hvc	= g.waffled ? hss + hs : hss;   // height vertex count
	var circVertexCount = g.circOpen ? rss : rs;
	var halfH = 0.5 * g.height; // half height
	var nj;					// relative radius segment (circular)
	var ni;					// relative height segment
	var ni01;				// relative height segment (0.1 over segment bottom)
	var x, y, z;			// vertex position 
	var cX, cY, cZ;			// center curve (coordinates segment bottom)
	var cX01, cY01, cZ01;	// center curve (coordinates 0.1 over segment bottom)
	var tX, tY, tZ;			// tangent
	var nX, nY, nZ;			// normal
	var bX, bY, bZ;			// binormal	
	var angle;				// calculated angle
	var lenV;				// length of vector
	var xC, yC, zC;			// center of unroll circle
	var r;					// calculated radius
	var scalingAngle;
	var scalingHeight;
	var scalingHeight01;
	var unrC;				// unroll cover
	var rUnrC;				// radius unroll circle
	var sigma0;				// start angle unroll
	var sigma;				// unroll angle 
	var f0Vec = {};
	var f1Vec = {};
	var f2Vec = {};
	var normal = {};
	var leftBtm;
	var leftTop;
	var rightBtm;
	var rightTop;
	var lastCircSegmentWidth;
	var idx;
	var vIdx; 				// vertex index
	var posIdx;				// position index
	var posIdx0;
	var fIdx;				// face index
	var fIdx0;
	var waffleVidx; 		// waffle vertex index
	var pi = Math.PI;
	var topOffset = 0;
	// quad line
	var sign;				// for vertical line up / down
	var vlst;				// vertical line start indices
	var hlIdx;				// horizontal line index
	var hld0; 				// horizontal line difference even
	var hld1; 				// horizontal line difference odd
	
	function xyzCalculation() {
		
		scalingAngle = g.startCircAngle( ni, t ) + ( g.endCircAngle( ni, t ) - g.startCircAngle( ni, t ) ) * g.scaleCircAngle( nj, t );
		
		// scalingHeight
		if ( g.noCenterPoints ) {
			
			scalingHeight = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * g.scaleHeight( ni, t );
			
		} else {
			
			scalingHeight = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * scHeight[ i ] / g.height;
			
		}
		
		if ( g.style === "map"  || g.style === "cover" ) {
			
			x = g.radius * 2 * pi * scalingAngle;
			y = g.height * scalingHeight + g.height * g.moveY( nj, ni, t ) - halfH;
			z = g.style === "map"  ?  0  :  g.radius * g.rCircHeight( nj, ni, t ) - g.radius;
			
		}
		
		if ( g.style === "complete" ) {
			
			unrC = g.unrollCover( ni, t );
			
			// prevent division by zero:
			unrC = unrC <= 1.0 ? ( unrC < 0.9999 ? unrC : 0.9999 ) : ( unrC > 1.0001 ? unrC : 1.0001 );
			
			sigma0 = 0.5 * unrC;
			sigma  = 1 - unrC;		//  ... 1 .. 0 ...
			rUnrC  = 1 / sigma;		// radius unroll circle: ... 1 .. near infinity
			
			angle =  2 * pi * ( sigma0 + sigma * scalingAngle );
			
			if ( g.centerXdefault && g.centerYdefault && g.centerZdefault && g.noCenterPoints ) {
				
				xC	= g.radius * ( rUnrC - 1 );			// center unroll circle ( unroll: 0 -> xC: 0 )
				r 	= g.radius * ( ( rUnrC - 1 )	+ g.rCircHeight( nj,  ni, t ) );
				
				x 	= xC  +  r * Math.cos( angle )	+ g.radius * g.moveX( nj, ni, t );
				y	= g.height * scalingHeight		+ g.height * g.moveY( nj, ni, t ) - halfH;
				z	=	    -r * Math.sin( angle )	+ g.radius * g.moveZ( nj, ni, t );
				
			} else {
				
				// calculation of the vector equation of circle in 3D space:
				
				if ( g.noCenterPoints ) {
					
					cX = g.centerX( ni, t );
					cY = g.centerY( scalingHeight, t );
					cZ = g.centerZ( ni, t );
					
					scalingHeight01 = g.bottomHeight( nj, t ) + ( g.topHeight( nj, t ) - g.bottomHeight( nj, t ) ) * g.scaleHeight( ni01, t );
					
					cX01 = g.centerX( ni01, t );
					cY01 = g.centerY( scalingHeight01, t );
					cZ01 = g.centerZ( ni01, t );
					
					// approximated tangent vector of center curve (is the normal of segment bottom)
					
					tX = cX01 - cX;
					tY = cY01 - cY;
					tZ = cZ01 - cZ;
					
				} else {
					
					cX = g.centerPoints[ i ][ 0 ];
					cY = g.centerPoints[ i ][ 1 ];
					cZ = g.centerPoints[ i ][ 2 ];
					
					p = i < hs ? i : i - 1; // ... to last point
					
					tX = g.centerPoints[ p + 1 ][ 0 ] - g.centerPoints[ p ][ 0 ];
					tY = g.centerPoints[ p + 1 ][ 1 ] - g.centerPoints[ p ][ 1 ];
					tZ = g.centerPoints[ p + 1 ][ 2 ] - g.centerPoints[ p ][ 2 ];
					
				}
				
				if ( i === 0 ) {
					
					// first binormal

					bX = 1;
					bY = tY !== 0 ? 0.000101 : -0.999989;
					bZ = 0;
					
				}
				
				/* If there are problems with the first binormal in an example, try one of the following variants.
				
					// prevents division by zero
					tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
					
					bX = tX;
					bY = -( tX * tX + tZ * tZ ) / tY;
					bZ = tZ;
					
					//...............................
						
					// prevents division by zero
					tZ = ( tZ < 0 ) ? ( ( tZ > -0.0000001 ) ? -0.0000001 : tZ ) : ( ( tZ < 0.0000001 ) ? 0.0000001 : tZ );		
					
					bX = 1;
					bY = ( tY * tY - tX ) / tZ;
					bZ = tZ;
					
					//...............................
									
					bX = tZ;
					bY = 0;
					bZ = -tX;
					
					//...............................
					
					// prevents division by zero
					tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
					
					bX = 1;
					bY = -tX / tY ;
					bZ = 0;
					
					//...............................
					
					// prevents division by zero
					tY = ( tY < 0 ) ? ( ( tY > -0.0000001 ) ? -0.0000001 : tY ) : ( ( tY < 0.0000001 ) ? 0.0000001 : tY );
					
					bX = 1;
					bY = tY < 0 ? ( tX < 0 ? tX / tY  :  -tX / tY ) : ( tX < 0 ? -tX / tY : tX / tY );
					bZ = 0;
					
					//...............................
																
					bX = tY !== 0 ? 1 : 0;
					bY = tY !== 0 ? -tX / tY : 1;
					bZ = 0;	
					
				*/
				
				// cross product b, t calculates the normal ( if i > 0  binormal from last segment )
				// see http://www.cs.cmu.edu/afs/andrew/scs/cs/15-462/web/old/asst2camera.html
				
				nX = tY * bZ - tZ * bY;
				nY = tZ * bX - tX * bZ;
				nZ = tX * bY - tY * bX;
				
				// new binormal
				
				bX = nY * tZ - nZ * tY;
				bY = nZ * tX - nX * tZ;
				bZ = nX * tY - nY * tX;
				
				// normalize
				
				lenV = Math.sqrt( bX * bX + bY * bY + bZ * bZ );
				
				bX = bX / lenV;
				bY = bY / lenV;
				bZ = bZ / lenV;
				
				lenV = Math.sqrt( nX * nX + nY * nY + nZ * nZ );
				
				nX = nX / lenV;
				nY = nY / lenV;
				nZ = nZ / lenV;
				
				r = g.radius * ( ( rUnrC - 1 ) + g.rCircHeight( nj, ni, t ) );
				
				// vector equation of circle in 3D space
				
				x = cX * g.height + r * ( Math.cos( angle ) * bX + Math.sin( angle ) * nX );
				y = cY * g.height + r * ( Math.cos( angle ) * bY + Math.sin( angle ) * nY );
				z = cZ * g.height + r * ( Math.cos( angle ) * bZ + Math.sin( angle ) * nZ );
				
				x = x + g.radius * g.moveX( nj, ni, t );
				y = y + g.height * g.moveY( nj, ni, t ) - halfH;
				z = z + g.radius * g.moveZ( nj, ni, t );
				
				// straight line for center of unroll circle, ( unroll: 0 -> xC: cX, yC: cY, zC: cZ )
				
				xC = cX + g.radius * ( rUnrC - 1 ) * bX;
				yC = cY + g.radius * ( rUnrC - 1 ) * bY;
				zC = cZ + g.radius * ( rUnrC - 1 ) * bZ;
				
				x = x + xC;
				y = y + yC;
				z = z + zC;
				
			}
		
		}
		
	}
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop  = false; g.circOpen = true; }
	
	if ( !g.noCenterPoints ) {
		
		var dX;
		var dY;
		var dZ;
		var scHeight = [];	// scaling the height by the given coordinates
		
		scHeight[ 0 ] = 0; 
			
		for ( var i = 0; i < g.centerPoints.length; i ++ ) {
			
			if ( i > 0 ) {
				
				dX = g.centerPoints[ i ][ 0 ] - g.centerPoints[ i - 1 ][ 0 ];
				dY = g.centerPoints[ i ][ 1 ] - g.centerPoints[ i - 1 ][ 1 ];
				dZ = g.centerPoints[ i ][ 2 ] - g.centerPoints[ i - 1 ][ 2 ];
				
				scHeight[ i ] = scHeight[ i - 1 ] + Math.sqrt( dX * dX + dY * dY + dZ * dZ ) * g.height;
				
			}
			
		}
		
	}
	
	if ( g.isGeometry ) {
		
		function xyzCenterPoint() {
			
			// calculation of the center points
			
			g.vertices[ waffleVidx ].setScalar( 0 );
			
			leftBtm  = hvc * j + i;															// left-bottom
			leftTop  = hvc * j + i + 1;  													// left-top
			rightBtm = ( !g.circOpen && j === rs - 1 ) ? i : hvc * ( j + 1 ) + i;  			// right-bottom
			rightTop = ( !g.circOpen && j === rs - 1 ) ? i + 1 : hvc * ( j + 1 ) + i + 1; 	// right-top
			
			g.vertices[ waffleVidx ].add( g.vertices[ leftBtm ] );
			g.vertices[ waffleVidx ].add( g.vertices[ leftTop ] );
			
			if ( !g.circOpen && j===rs - 1 && g.style !== "complete" ) {
				
				lastCircSegmentWidth = g.vertices[ leftBtm ].x - g.vertices[ hvc * ( j - 1 ) + i ].x ;
				
				g.vertices[ waffleVidx ].x += g.vertices[ leftBtm ].x  + lastCircSegmentWidth;
				g.vertices[ waffleVidx ].y += g.vertices[ leftBtm ].y;
				g.vertices[ waffleVidx ].z += g.vertices[ leftBtm ].z;
				
				g.vertices[ waffleVidx ].x += g.vertices[ leftTop ].x  + lastCircSegmentWidth;
				g.vertices[ waffleVidx ].y += g.vertices[ leftTop ].y;
				g.vertices[ waffleVidx ].z += g.vertices[ leftTop ].z;
				
			} else {
				
				g.vertices[ waffleVidx ].add( g.vertices[ rightBtm ] );
				g.vertices[ waffleVidx ].add( g.vertices[ rightTop ] );
				
			}
			
			
			g.vertices[ waffleVidx ].multiplyScalar( 0.25 );				// calculate center
			
		}
		
		function wafflePoint() {
			
			f1Vec.x = g.vertices[ leftTop ].x - g.vertices[ waffleVidx ].x;
			f1Vec.y = g.vertices[ leftTop ].y - g.vertices[ waffleVidx ].y;
			f1Vec.z = g.vertices[ leftTop ].z - g.vertices[ waffleVidx ].z;
			
			f2Vec.x = g.vertices[ leftBtm ].x - g.vertices[ waffleVidx ].x;
			f2Vec.y = g.vertices[ leftBtm ].y - g.vertices[ waffleVidx ].y;
			f2Vec.z = g.vertices[ leftBtm ].z - g.vertices[ waffleVidx ].z;
			
			// cross product
			
			normal.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
			normal.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
			normal.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z  );
			
			//normalize
			
			normal.x = -g.waffleDeep( nj, ni, t ) * normal.x / lenV;
			normal.y = -g.waffleDeep( nj, ni, t ) * normal.y / lenV;
			normal.z = -g.waffleDeep( nj, ni, t ) * normal.z / lenV;
			
			// set vertex position
			
			g.vertices[ waffleVidx ].x += normal.x;
			g.vertices[ waffleVidx ].y += normal.y;
			g.vertices[ waffleVidx ].z += normal.z;
			
		}
		
		g.verticesNeedUpdate  = true;
		
		if ( !g.quadLine ) {
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					xyzCalculation();
					
					g.vertices[ hvc * j + i ].set( x , y , z );
					
				}
				
			}
			
		} else {
		
			sign = 1;	// quad line vertical line up / down
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
			
				nj = j / rs;
				
				// quad line
				
				hlIdx = hss * rss - j - 1; // horizontal line index ( start )
				
				hld0 = 2 * rs - 2 * j + 1; // horizontal line vertices difference
				hld1 = 2 * j + 1;
				
				vlst = ( rss + j ) * hss + ( j % 2 === 0 ? 0 : hs ) ;	// vertical line start
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					xyzCalculation();
					
					g.vertices[ hvc * j + i ].set( x , y , z );	// set geometry vertices
					
					// quad line
					
					g.lineGeometry.vertices[ vlst + sign * i ].set( x , y, z );	// vertical line 
					g.lineGeometry.vertices[ hlIdx ].set( x, y, z );			// horizontal line
					
					hlIdx -= i % 2 === 0 ? hld0 : hld1; // horizontal line ( index difference )
					
				}
				
				sign = -sign;	// alternately up / down
				
			}
			
			g.lineGeometry.verticesNeedUpdate  = true;
			
		}	 
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i  < hs; i ++ ) {
					
					ni =  i / hs;
					
					waffleVidx =  hvc * j + i + hss;
					
					xyzCenterPoint();
					
					if ( g.style === "cover" || g.style === "complete" ) {
						
						wafflePoint();
						
					}
					
				}
				
			}
			
		}
		
		if ( g.withBottom ) {
			
			topOffset = 1;
			x = 0;
			y = 0;
			z = 0;
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				vIdx = hvc * j;
				
				x += g.vertices[ vIdx ].x;
				y += g.vertices[ vIdx ].y;
				z += g.vertices[ vIdx ].z;
				
			}
			
			x = x / circVertexCount;
			y = y / circVertexCount;
			z = z / circVertexCount;
			
			g.vertices[ g.circOpen ? hvc * rs + hss  :  hvc * rs ].set( x, y, z );	// set vertex position
			
		}
		
		if ( g.withTop ) {
			
			x = 0;
			y = 0;
			z = 0;
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				vIdx = hvc * j + hs;
				
				x += g.vertices[ vIdx ].x;
				y += g.vertices[ vIdx ].y;
				z += g.vertices[ vIdx ].z;
				
			}
			
			x = x / circVertexCount;
			y = y / circVertexCount;
			z = z / circVertexCount;
			
			g.vertices[ g.circOpen ? hvc * rs + hss + topOffset  : hvc * rs + topOffset ].set( x, y, z );	// set vertex position
			
		}
		
		g.computeVertexNormals(); 
		
	}
	
	if ( g.isBufferGeometry && g.indexed ) {
		
		var leftBtmVec = {}; 
		var leftTopVec = {};
		var rightBtmVec = {};
		var rightTopVec = {};
		var wVec = {};
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		function xyzSet() {
			
			posIdx = vIdx * 3;
			
			g.vertices[ posIdx ]  = x;		// set vertex position
			g.vertices[ posIdx + 1 ]  = y;
			g.vertices[ posIdx + 2 ]  = z;
			
		}
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		if ( !g.quadLine ) {
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
					
					xyzSet(); // set vertex position
					
					if (j === 0  && !g.circOpen ) {
						
						vIdx =  hvc * rs + i;	// vertex index
						
						xyzSet(); // connect face / positions on the far right are identical
						
					}
					
					if ( i === 0 && g.withBottom ){
						
						topOffset = 1 + rss;
						
						vIdx = hvc * rs + hss + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
						
					}
					
					if ( i === hs && g.withTop){
						
						vIdx = hvc * rs + hss + topOffset + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
								
					}
					
				}
				
			}
			
		} else {
		
			g.lineGeometry.attributes.position.needsUpdate = true;
			
			sign = 1;	// quad line vertical line up / down
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				// quad line
				
				hlIdx = hss * rss - j - 1; // horizontal line index ( start )
				
				hld0 = 2 * rs - 2 * j + 1; // horizontal line vertices difference
				hld1 = 2 * j + 1;
				
				vlst = ( rss + j ) * hss + ( j % 2 === 0 ? 0 : hs ) ;	// vertical line start
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
										
					xyzCalculation();
					
					xyzSet(); // set vertex position
					
					// quad line
						
					posIdx = ( vlst + sign * i ) * 3;	// vertical line 
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
											
					posIdx = hlIdx * 3;					// horizontal line
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
						
						
					hlIdx -= i % 2 === 0 ? hld0 : hld1; // horizontal line ( index difference )
					
					if (j === 0  && !g.circOpen ) {
						
						vIdx =  hvc * rs + i;	// vertex index
						
						xyzSet(); // connect face / positions on the far right are identical
						
					}
					
					if ( i === 0 && g.withBottom ){
						
						topOffset = 1 + rss;
						
						vIdx = hvc * rs + hss + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
						
					}
					
					if ( i === hs && g.withTop){
						
						vIdx = hvc * rs + hss + topOffset + 1 + j;
						
						xyzSet(); // set vertex position
						
						if (j === 0  && !g.circOpen ) {
							
							vIdx += rs; 
							
							xyzSet(); // connect face / positions on the far right are identical
							
						}
								
					}
					
				}
				
				sign = -sign;	// alternately up / down
				
			}
			
		}
		
		if ( g.waffled ) {
			
			// calculation of the center points (waffle points)
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i  < hs; i ++ ) {
					
					ni =  i / hs;
					
					waffleVidx =  hvc * j + i + hss;		// waffle vertex index
					
					g.uvs[ waffleVidx * 2 ] = g.scaleCircAngle( ( j + 0.5 ) / rs );
					g.uvs[ waffleVidx * 2 + 1 ] = g.scaleHeight( ( i + 0.5 ) / hs );
					
					
					leftBtm  = hvc * j + i;				// left-bottom
					leftTop  = hvc * j + i + 1;  		// left-top
					rightBtm = hvc * ( j + 1 ) + i;  	// right-bottom
					rightTop = hvc * ( j + 1 ) + i + 1; // right-top
					
					leftBtmVec.x =  g.vertices[ leftBtm * 3 ];
					leftBtmVec.y =  g.vertices[ leftBtm * 3 + 1 ];
					leftBtmVec.z =  g.vertices[ leftBtm * 3 + 2 ];
					
					leftTopVec.x =  g.vertices[ leftTop * 3 ];
					leftTopVec.y =  g.vertices[ leftTop * 3 + 1 ];
					leftTopVec.z =  g.vertices[ leftTop * 3 + 2 ];
					
					rightBtmVec.x =  g.vertices[ rightBtm  * 3 ];
					rightBtmVec.y =  g.vertices[ rightBtm * 3 + 1 ];
					rightBtmVec.z =  g.vertices[ rightBtm * 3 + 2 ];
					
					rightTopVec.x =  g.vertices[ rightTop * 3 ];
					rightTopVec.y =  g.vertices[ rightTop * 3 + 1 ];
					rightTopVec.z =  g.vertices[ rightTop * 3 + 2 ];
					
					wVec.x = leftBtmVec.x + leftTopVec.x;
					wVec.y = leftBtmVec.y + leftTopVec.y;
					wVec.z = leftBtmVec.z + leftTopVec.z;
					
					wVec.x += rightBtmVec.x;
					wVec.y += rightBtmVec.y;
					wVec.z += rightBtmVec.z;
					
					wVec.x += rightTopVec.x;
					wVec.y += rightTopVec.y;
					wVec.z += rightTopVec.z;
					
					// center
					wVec.x *= 0.25; 
					wVec.y *= 0.25; 
					wVec.z *= 0.25;
					
					
					if ( g.style === "cover" || g.style === "complete" ) {
						
						f1Vec.x = leftTopVec.x - wVec.x;
						f1Vec.y = leftTopVec.y - wVec.y;
						f1Vec.z = leftTopVec.z - wVec.z;
						
						f2Vec.x = leftBtmVec.x - wVec.x;
						f2Vec.y = leftBtmVec.y - wVec.y;
						f2Vec.z = leftBtmVec.z - wVec.z;
						
						// cross product
						
						normal.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
						normal.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
						normal.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
						
						lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
						
						// normalize and waffleDeep
						
						normal.x = -g.waffleDeep( nj, ni, t ) * normal.x / lenV;
						normal.y = -g.waffleDeep( nj, ni, t ) * normal.y / lenV;
						normal.z = -g.waffleDeep( nj, ni, t ) * normal.z / lenV;
						
						// new position
						wVec.x += normal.x; 
						wVec.y += normal.y;
						wVec.z += normal.z;
						
					}
					
					g.vertices[ waffleVidx * 3 ] = wVec.x;
					g.vertices[ waffleVidx * 3 + 1 ] = wVec.y;
					g.vertices[ waffleVidx * 3 + 2 ] = wVec.z;
					
				}
				
			}
			
		}
		
		if ( g.withBottom || g.withTop ) {
			
			topOffset = 0;
			
			if ( g.withBottom ) {
				
				topOffset = 1 + rss;
				
				vIdx = hvc * rs + hss;
				
				x = 0;
				y = 0;
				z = 0;
				
				for ( var j = 0; j < rs; j ++ ) {
					
					posIdx = hvc * j * 3;	// position index of cover/bottom
					
					x += g.vertices[ posIdx ];
					y += g.vertices[ posIdx + 1 ];
					z += g.vertices[ posIdx + 2 ];
					
				}
				
				x = x / rs;
				y = y / rs;
				z = z / rs;
				
				xyzSet(); // set vertex position bottom
				
			}
			
			if ( g.withTop ) {
				
				vIdx = hvc * rs + hss + topOffset;
				
				x = 0;
				y = 0;
				z = 0;
				
				for ( var j = 0; j < rs; j ++ ) {
					
					posIdx = ( hvc * j + hs ) * 3 ; // position index of cover/top
					
					x += g.vertices[ posIdx ];
					y += g.vertices[ posIdx + 1 ];
					z += g.vertices[ posIdx + 2 ];
					
				}
				
				x = x / rs;
				y = y / rs;
				z = z / rs;
				
				xyzSet(); // set vertex position top
				
			}
			
		}
		
		// face normals (needed for vertex normals) 
		
		g.faceNormals = [];
		
		for ( var f = 0; f < faceCount ; f ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			fIdx = f * 3 + 1;
			fIdx0 = f * 3;
			
			f1Vec.x = g.vertices[ g.faceIndices[ fIdx ] * 3 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 ];
			f1Vec.y = g.vertices[ g.faceIndices[ fIdx ] * 3 + 1 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 1 ];
			f1Vec.z = g.vertices[ g.faceIndices[ fIdx ] * 3 + 2 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 2 ];
			
			fIdx ++;
			
			f2Vec.x = g.vertices[ g.faceIndices[ fIdx ] * 3 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 ];
			f2Vec.y = g.vertices[ g.faceIndices[ fIdx ] * 3 + 1 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 1 ];
			f2Vec.z = g.vertices[ g.faceIndices[ fIdx ] * 3 + 2 ] - g.vertices[ g.faceIndices[ fIdx0 ] * 3 + 2 ];
			
			//  add cross product
			
			normal.x += f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
			normal.y += f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
			normal.z += f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			g.faceNormals.push( normal.x, normal.y, normal.z );
			
		}
		
		//vertex normals
		
		for ( var v = 0; v < g.vertexFaces.length; v ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			// add face normals	
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				normal.x += g.faceNormals[ g.vertexFaces[ v ][ f ] ];
				normal.y += g.faceNormals[ g.vertexFaces[ v ][ f ] + 1 ];
				normal.z += g.faceNormals[ g.vertexFaces[ v ][ f ] + 2 ];
				
			}
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			// write the vertex normal
			
			g.normals[ v * 3 ] = normal.x;
			g.normals[ v * 3 + 1 ] = normal.y;
			g.normals[ v * 3 + 2 ] = normal.z;
		}
		
	}
	
	if ( g.isBufferGeometry && !g.indexed ) {
		
		// const a = 0; //  position index offset, triangle corners a, b, c
		const b = 3;
		const c = 6;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		var faceCount = hs * rs * fps;
		faceCount += g.withBottom ? rs : 0;
		faceCount += g.withTop ? rs : 0;
		
		var posIdx; // position index
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		if ( !g.quadLine ) { 
		
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
										
					for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ vIdx ][ p ] ] = x;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
						
					}
					
				}
				
			}
					
		} else {
			
			g.lineGeometry.attributes.position.needsUpdate = true;
			
			sign = 1;	// quad line vertical line up / down
			
			for ( var j = 0; j < circVertexCount; j ++ ) {
				
				nj = j / rs;
				
				// quad line
				
				hlIdx = hss * rss - j - 1; // horizontal line index ( start )
				
				hld0 = 2 * rs - 2 * j + 1; // horizontal line vertices difference
				hld1 = 2 * j + 1;
				
				vlst = ( rss + j ) * hss + ( j % 2 === 0 ? 0 : hs ) ;	// vertical line start
				
				for ( var i = 0; i < hss; i ++ ) {
					
					ni   = i / hs;
					ni01 = ( i + 0.1 ) / hs;
					
					vIdx =  hvc * j + i;	// vertex index
					
					xyzCalculation();
										
					for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ vIdx ][ p ] ] = x;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
						g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
						
					}
					
					// quad line
			
					posIdx = ( vlst + sign * i ) * 3;	// vertical line 
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
											
					posIdx = hlIdx * 3;					// horizontal line
					
					g.linePositions[ posIdx ] = x;
					g.linePositions[ posIdx + 1 ] = y;
					g.linePositions[ posIdx + 2 ] = z;
						
						
					hlIdx -= i % 2 === 0 ? hld0 : hld1; // horizontal line ( index difference )	
					
				}
				
				sign = -sign;	// alternately up / down
				
			}
			
		}
		
		if ( g.waffled ) {
			
			for ( var j = 0; j < rs; j ++ ) {
				
				nj = j / rs;
				
				for ( var i = 0; i  < hs; i ++ ) {
					
					ni =  i / hs;
					
					waffleVidx =  hvc * j + i + hss;
					posIdx = ( j * hs + i ) * 36  // position index ( 4 faces * 9 positions)
					
					// xyzCenterPoint
					
					f0Vec.x = 0;
					f0Vec.y = 0;
					f0Vec.z = 0;
					
					f0Vec.x += g.positions[ posIdx + 3 ];	// lower face, b, x
					f0Vec.x += g.positions[ posIdx + 6 ];	// lower face, c, x
					f0Vec.x += g.positions[ posIdx + 30 ];	// upper face, b, x
					f0Vec.x += g.positions[ posIdx + 33 ];	// upper face, c, x
					
					f0Vec.y += g.positions[ posIdx + 4 ];	// lower face, b, y
					f0Vec.y += g.positions[ posIdx + 7 ];	// lower face, c, y
					f0Vec.y += g.positions[ posIdx + 31 ];	// upper face, b, y
					f0Vec.y += g.positions[ posIdx + 34 ];	// upper face, c, y
					
					f0Vec.z += g.positions[ posIdx + 5 ];	// lower face, b, z
					f0Vec.z += g.positions[ posIdx + 8 ];	// lower face, c, z
					f0Vec.z += g.positions[ posIdx + 32 ];	// upper face, b, z
					f0Vec.z += g.positions[ posIdx + 35 ];	// upper face, c, z
					
					f0Vec.x *= 0.25;
					f0Vec.y *= 0.25;
					f0Vec.z *= 0.25;
					
					if ( g.style === "cover" || g.style === "complete" ) {
						
						// wafflePoint();
						f1Vec.x = g.positions[ posIdx + 33 ] - g.positions[ posIdx + 6 ]; // left top -  right bottom
						f1Vec.y = g.positions[ posIdx + 34 ] - g.positions[ posIdx + 7 ];
						f1Vec.z = g.positions[ posIdx + 35 ] - g.positions[ posIdx + 8 ];
						
						f2Vec.x = g.positions[ posIdx + 3 ] - g.positions[ posIdx + 30 ]; // left bottom - right top
						f2Vec.y = g.positions[ posIdx + 4 ] - g.positions[ posIdx + 31 ];
						f2Vec.z = g.positions[ posIdx + 5 ] - g.positions[ posIdx + 32 ];
						
						// cross product
						
						normal.x = f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
						normal.y = f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
						normal.z = f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
						
						lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
						
						//normalize
						
						normal.x = -g.waffleDeep( nj, ni, t ) * normal.x / lenV;
						normal.y = -g.waffleDeep( nj, ni, t ) * normal.y / lenV;
						normal.z = -g.waffleDeep( nj, ni, t ) * normal.z / lenV;
						
						f0Vec.x += normal.x;
						f0Vec.y += normal.y;
						f0Vec.z += normal.z;
						
					}
					
					// set positions
					
					for ( var p = 0; p < g.vertexPositions[ waffleVidx ].length; p ++) {
						
						g.positions[ g.vertexPositions[ waffleVidx][ p ] ] = f0Vec.x;
						g.positions[ g.vertexPositions[ waffleVidx ][ p ] + 1 ] = f0Vec.y;
						g.positions[ g.vertexPositions[ waffleVidx ][ p ] + 2 ] = f0Vec.z;
						
					}
					
				}
			
			}
			
		}
		
		if (g.withBottom) {
			
			// calculate bottom center
			
			x = 0;
			y = 0;
			z = 0;
			
			for ( j = 0; j < rs; j ++ ) {
				
				posIdx = ( rs * hs * fps + j ) * 9;
				
				x += g.positions[ posIdx + 3 ];
				y += g.positions[ posIdx + 4 ];
				z += g.positions[ posIdx + 5 ];
				
				x += g.positions[ posIdx + 6 ];
				y += g.positions[ posIdx + 7 ];
				z += g.positions[ posIdx + 8 ];
				
			}
			
			x = x / ( rs * 2 );
			y = y / ( rs * 2 );
			z = z / ( rs * 2 );
			
			vIdx = hvc * rs + hss;
			
			// set positions
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 0 ] = x;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
				
			}
			
		}
		
		if (g.withTop) {
			
			// calculate top center
			
			x = 0;
			y = 0;
			z = 0;
			
			for ( j = 0; j < rs; j ++ ) {
				
				posIdx = ( rs * hs * fps + ( g.withBottom ? rs : 0 ) + j ) * 9;
				
				x += g.positions[ posIdx + 3 ];
				y += g.positions[ posIdx + 4 ];
				z += g.positions[ posIdx + 5 ];
					
				x += g.positions[ posIdx + 6 ];
				y += g.positions[ posIdx + 7 ];
				z += g.positions[ posIdx + 8 ];
				
			}
			
			x = x / ( rs * 2 );
			y = y / ( rs * 2 );
			z = z / ( rs * 2 );
			
			vIdx = hvc * rs + hss + ( g.withBottom ? 1 : 0 ) ;
			
			// set positions
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 0 ] = x;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
				
			}
			
		}
		
		// face normals
		
		g.faceNormals = []; // clear face normals
		
		for ( var f = 0; f < faceCount ; f ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			posIdx = f * 9 + 3;
			posIdx0 = f * 9;
			
			f1Vec.x = g.positions[ posIdx ] - g.positions[ posIdx0 ];
			f1Vec.y = g.positions[ posIdx + 1 ] - g.positions[ posIdx0 + 1 ];
			f1Vec.z = g.positions[ posIdx + 2 ] - g.positions[ posIdx0 + 2  ];
			
			posIdx = f * 9 + 6;
			
			f2Vec.x = g.positions[ posIdx ] - g.positions[ posIdx0 ];
			f2Vec.y = g.positions[ posIdx + 1 ] - g.positions[ posIdx0 + 1 ];
			f2Vec.z = g.positions[ posIdx + 2 ] - g.positions[ posIdx0 + 2 ];
			
			//  add cross product
			
			normal.x += f1Vec.y * f2Vec.z - f1Vec.z * f2Vec.y;
			normal.y += f1Vec.z * f2Vec.x - f1Vec.x * f2Vec.z;
			normal.z += f1Vec.x * f2Vec.y - f1Vec.y * f2Vec.x;
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			g.faceNormals.push( normal.x, normal.y, normal.z );
			
		}
		
		// vertex normals
		
		for ( var v = 0; v < g.vertexFaces.length; v ++ ) {
			
			normal.x = 0;
			normal.y = 0;
			normal.z = 0;
			
			// add face normals	
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				normal.x += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 ];
				normal.y += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 + 1 ];
				normal.z += g.faceNormals[ g.vertexFaces[ v ][ f ] / 3 + 2 ];
				
			}
			
			// normalize
			
			lenV = Math.sqrt( normal.x * normal.x + normal.y * normal.y + normal.z * normal.z );
			
			normal.x = normal.x / lenV;
			normal.y = normal.y / lenV;
			normal.z = normal.z / lenV;
			
			// write the vertex normals corresponding to positions 
			
			for ( var f = 0; f < g.vertexFaces[ v ].length; f ++ ) {
				
				g.normals[ g.vertexPositions[ v ][ f ] ] = normal.x;
				g.normals[ g.vertexPositions[ v ][ f ] + 1 ] = normal.y;
				g.normals[ g.vertexPositions[ v ][ f ] + 2 ] = normal.z;
				
			}
			
		}
		
		// explode
		
		if ( !g.explodeDefault ) {
		
			for ( var f = 0; f < faceCount; f ++ ) {
				
				for ( var p = 0; p < 3; p ++ ) {
						
					g.positions[ f * 9 + p * 3 ] = g.positions[ f * 9 + p * 3 ] + g.faceNormals[ f * 3 ] * g.radius * g.explode( t );				
					g.positions[ f * 9 + p * 3 + 1 ] = g.positions[ f * 9 + p * 3 + 1 ] + g.faceNormals[ f * 3 + 1 ] * g.radius * g.explode( t );
					g.positions[ f * 9 + p * 3 + 2 ] = g.positions[ f * 9 + p * 3 + 2 ] + g.faceNormals[ f * 3 + 2 ] * g.radius * g.explode( t );
										
				}	
				
			}
			
		}	
		
	}
	
}

function morphFaces( time ) {
	
	if ( !g.materialDefault ) {
	
		var t = time !== undefined ? time : 0;
		
		g = this;
		
		var rs = g.radiusSegments;
		var hs = g.noCenterPoints ? g.heightSegments : g.centerPoints.length - 1;
		var hsMinFixed;
		var fIdx;		// face index
		var fixMatIdx;	// fixed material Index
		var j0;			// j - index
		var j1;			// j - index
		var topOffset;
		
		var fps = g.waffled ? 4 : 2; // faces per segment
		
		if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.circOpen = true; }
		
		if ( g.isGeometry ) {
			
			g.groupsNeedUpdate = true; // to change materialIndex for multi material
			
			if ( !g.materialCoverDefault || !g.fixedMaterialDefault ) {
				
				if ( !g.waffled ) {
					
					hsMinFixed = hs - Math.min( hs, g.fixedMaterial.length );
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						j0 = 2 * j; 
						j1 = j0 + 1;
						
						for ( var i = 0; i < hs; i ++ ) {
							
							// right bottom
							
							fIdx  = 2 * hs * j + 2 * i;
							fixMatIdx =  hs - ( i + 1 );
							
							g.faces[ fIdx ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
							
							}
							
							// left top
							
							fIdx ++;
							
							g.faces[ fIdx ].materialIndex  = g.materialCover( j / rs , i / hs, t );	// by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
						}
						
					}
					
				}
				
				if ( g.waffled ) {
					
					hsMinFixed = hs - Math.min( hs, 0.5 * g.fixedMaterial.length );
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						if ( g.fixedMaterial.length % 2 !== 0 ) g.fixedMaterial.push( '.' );   // make length even
						
						j0 = 2 * j; 
						j1 = j0 + 1;
						
						for ( var i = 0; i < hs; i ++ ) {
							
							// bottom
							
							fIdx  =  4 * hs * j + 4 * i;
							
							fixMatIdx = 2 * hs - ( 2 * i + 1 );
							
							g.faces[ fIdx  ].materialIndex  = g.materialCover( j / rs , i / hs, t );	// by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// left
							
							fIdx ++;
							fixMatIdx --;
							
							g.faces[ fIdx ].materialIndex  = g.materialCover( j / rs, ( i + 0.5 ) / hs, t );	// by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// right
							
							fIdx ++;
							fixMatIdx ++;
							
							g.faces[ fIdx ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, i / hs , t );	// by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
							
							}
							
							// top
							
							fIdx ++;
							fixMatIdx --;
							
							g.faces[ fIdx ].materialIndex  = g.materialCover( ( j + 0.5 ) / rs, ( i + 0.5 ) / hs , t );	// by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
								
							}
							
						}
						
					}
					
				}
				
			}
			
			if ( g.withBottom || g.withTop ) {
				
				topOffset = 0;
				
				if  ( g.withBottom ) topOffset = rs;
				
				if ( g.withBottom  && ( !g.materialBottomDefault || g.fixedMatBottom !== "" ) ) {
				
					fIdx = hs * rs * fps;
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.faces[ fIdx  + j ].materialIndex  = g.materialBottom( j / rs , t ); // by function
						
						if ( j < g.fixedMatBottom.length ) {
							
							if ( g.fixedMatBottom[ j ] !== "." ) {
								
								g.faces[ fIdx  + j ].materialIndex =  g.fixedMatBottom[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
				if ( g.withTop && ( !g.materialTopDefault || g.fixedMatTop !== "" ) ) {
					
					fIdx = topOffset + hs * rs * fps;
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.faces[ fIdx  + j ].materialIndex  = g.materialTop( j / rs , t ); // by function
						
						if ( j < g.fixedMatTop.length ) {
							
							if ( g.fixedMatTop[ j ] !== "." ) {
								
								g.faces[ fIdx  + j ].materialIndex  =  g.fixedMatTop[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
		// indexed and non-indexed BufferGeometry identical
		
		if ( g.isBufferGeometry ) {
			
			if ( !g.materialCoverDefault || !g.fixedMaterialDefault ) {
				
				if ( !g.waffled ) {
					
					hsMinFixed = hs - Math.min( hs, g.fixedMaterial.length );
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						j0 = 2 * j; 
						j1 = j0 + 1;
						
						for ( var i = 0; i < hs; i ++ ) {
							
							// right bottom
							
							fIdx  = 2 * hs * j + 2 * i;	
							fixMatIdx =  hs - ( i + 1 );
							
							g.groups[ fIdx ].materialIndex = g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// left top
							
							fIdx ++;
							
							g.groups[ fIdx ].materialIndex = g.materialCover( j / rs , i / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
						}
						
					}
					
				}
				
				if ( g.waffled ) {
					
					hsMinFixed = hs - Math.min( hs, 0.5 * g.fixedMaterial.length );
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						if ( g.fixedMaterial.length % 2 !== 0 ) g.fixedMaterial.push( '.' );   // make length even
						
						j0 = 2 * j; 
						j1 = j0 + 1;
						
						for ( var i = 0; i < hs; i ++ ) {
							
							// bottom
							
							fIdx  =  4 * hs * j + 4 * i;
							fixMatIdx = 2 * hs - ( 2 * i + 1 );
							
							g.groups[ fIdx ].materialIndex =  g.materialCover( j / rs, i / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[fixMatIdx ][ j0 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// left
							
							fIdx ++;
							fixMatIdx --;
							
							g.groups[ fIdx ].materialIndex =  g.materialCover( j / rs, ( i + 0.5 ) / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j0 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j0 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j0 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// right
							
							fIdx ++;
							fixMatIdx ++;
							
							g.groups[ fIdx ].materialIndex =  g.materialCover( ( j + 0.5 ) / rs, i / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
								
							}
							
							// top
							
							fIdx ++;
							fixMatIdx --;
							
							g.groups[ fIdx ].materialIndex = g.materialCover( ( j + 0.5 ) / rs, ( i + 0.5 ) / hs, t ); // by function
							
							if ( hsMinFixed <= i ) {
								
								if ( j1 < g.fixedMaterial[ fixMatIdx ].length ) {
									
									if ( g.fixedMaterial[ fixMatIdx ][ j1 ] !== "." ) {
										
										g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j1 ]; // overwrite by array
										
									}
									
								}
								
							}
							
						}
						
					}
					
				}
				
			}
			
			if ( g.withBottom || g.withTop ) {
				
				topOffset = 0;
				
				if  ( g.withBottom ) topOffset = rs;
				
				if ( g.withBottom  && ( !g.materialBottomDefault || g.fixedMatBottom !== "" ) ) {
					
					fIdx = hs * rs * fps; 
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.groups[ fIdx + j ].materialIndex = g.materialBottom( j / rs, t ); // by function
						
						if ( j < g.fixedMatBottom.length ) {
							
							if ( g.fixedMatBottom[ j ] !== "." ) {
								
								g.groups[ fIdx + j ].materialIndex  =  g.fixedMatBottom[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
				if ( g.withTop && ( !g.materialTopDefault  || g.fixedMatTop !== "" ) ) {
					
					fIdx = topOffset + hs * rs * fps;
					
					for ( var j = 0; j < rs ; j ++ ) {
						
						g.groups[ fIdx + j ].materialIndex = g.materialTop( j / rs, t ); // by function
						
						if ( j < g.fixedMatTop.length ) {
							
							if ( g.fixedMatTop[ j ] !== "." ) {
								
								g.groups[ fIdx + j ].materialIndex  =  g.fixedMatTop[ j ]; // overwrite
								
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
	}

}


function vertexFaceNumbersHelper( mesh, mode, size, color ) {

	//  mode: 0 nothing, 1 vertex, 2 face, 3 vertex & face
	
	var verticesCount;
	var facesCount;
	 
	var vertexNumbers = [];
	var faceNumbers = [];
	var materialDigits = new THREE.LineBasicMaterial( { color: color } );
	var geometryDigit = [];
	var digit = [];
	var d100, d10, d1;		// digits
	var coordDigit = [];	// design of the digits
	
	var digitPositions = [];
	
	function numbering() { 
				
		i1 ++;														// starts with  -1 + 1 = 0
		
		if ( i1   === 10 ) {i1   = 0; i10 ++ }
		if ( i10  === 10 ) {i10  = 0; i100 ++ }
		if ( i100 === 10 ) {i100 = 0 }								// hundreds (reset when overflow)
		
		if ( i100 > 0 ) {
			
			d100 = digit[ i100 ].clone();							// digit for hundreds
			board.add( d100 );										// on the board ...
			d100.position.x = -8 * 0.1 * size;						// ... move slightly to the left
			
		}
		
		if ( ( i100 > 0 ) || ( ( i100 === 0 ) && ( i10 > 0 ) ) ) {	// no preceding zeros tens
			
			d10 = digit[ i10 ].clone();								// digit for tenth
			board.add( d10 );										// on the board
			
		}
		
		d1 =   digit[ i1 ].clone();									// digit 
		board.add( d1 );											//  on the board ...
		d1.position.x = 8 * 0.1 * size;		 						// ... move slightly to the right
					
	}
	
	coordDigit[ 0 ] = [ 0,0, 0,9, 6,9, 6,0, 0,0 ];
	coordDigit[ 1 ] = [ 0,6, 3,9, 3,0 ];
	coordDigit[ 2 ] = [ 0,9, 6,9, 6,6, 0,0, 6,0 ];
	coordDigit[ 3 ] = [ 0,9, 6,9, 6,5, 3,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 4 ] = [ 0,9, 0,5, 6,5, 3,5, 3,6, 3,0 ];
	coordDigit[ 5 ] = [ 6,9, 0,9, 0,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 6 ] = [ 6,9, 0,9, 0,0, 6,0, 6,5, 0,5 ];
	coordDigit[ 7 ] = [ 0,9, 6,9, 6,6, 0,0 ];
	coordDigit[ 8 ] = [ 0,0, 0,9, 6,9, 6,5, 0,5, 6,5, 6,0, 0,0 ];
	coordDigit[ 9 ] = [ 6,5, 0,5, 0,9, 6,9, 6,0, 0,0 ];
	
	if ( mesh.geometry.isGeometry) {
		
		if ( mode === 1 || mode === 3 ) {
		
			verticesCount = mesh.geometry.vertices.length;
			
		}
		
		if ( mode === 2 || mode === 3 ) {
		
			facesCount = mesh.geometry.faces.length ;
			
		}
			
		for ( var i = 0; i<10; i ++ ) {
			
			geometryDigit[ i ]  = new THREE.Geometry();
			
			for ( var j = 0; j < coordDigit[ i ].length/ 2; j ++ ) {
				
				geometryDigit[ i ].vertices.push( new THREE.Vector3( 0.1 * size * coordDigit[ i ][ 2 * j ], 0.1 * size * coordDigit[ i ][ 2 * j + 1 ], 0 ) );
				
			}
			
			digit[ i ] = new THREE.Line( geometryDigit[ i ], materialDigits );
			
		}
		
		if ( mode === 1 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < verticesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there
	
				var board = new THREE.Mesh( new THREE.Geometry() );
					
				numbering(); // numbering the vertices, hundreds ...
					
				vertexNumbers.push( board );	// place the table in the vertex numbering data field
				mesh.add( vertexNumbers[ i ] );	
				
			}
			
		}
		
		if ( mode === 2 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < facesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there
				
				var board = new THREE.Mesh( new THREE.Geometry() );
				
				numbering(); // numbering the facesces, hundreds ...
					
				faceNumbers.push( board );	// place the table in the face numbering data field
				mesh.add( faceNumbers[ i ] );	
				
			}
			
		}
				
	}
	
	// indexed BufferGeometry
	
	if ( mesh.geometry.isBufferGeometry && mesh.geometry.indexed) { 
			
		if ( mode === 1 || mode === 3 ) {
	
			verticesCount = mesh.geometry.vertices.length / 3 ; 
											
		}
		
		if ( mode === 2 || mode === 3 ) {
			
			facesCount = mesh.geometry.faceIndices.length / 3;
				
		}
				
		for ( var i = 0; i < 10; i ++ ) {
			
			geometryDigit[ i ] = new THREE.BufferGeometry();
			
			digitPositions[ i ] =  new Float32Array( coordDigit[ i ].length / 2 * 3 );
			geometryDigit[ i ].addAttribute( 'position', new THREE.BufferAttribute( digitPositions[ i ], 3 ) );
			
			for ( var j = 0; j < coordDigit[ i ].length/ 2; j ++ ) {
				
				digitPositions[ i ][ j * 3 ] =  0.1 * size * coordDigit[ i ][ 2 * j ];
				digitPositions[ i ][ j * 3 + 1 ] = 0.1 * size * coordDigit[ i ][ 2 * j + 1 ];
				digitPositions[ i ][ j * 3 + 2 ] = 0;
				
			}
			
			digit[ i ] = new THREE.Line( geometryDigit[ i ], materialDigits );
			
		}	
						
		if ( mode === 1 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < verticesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there
	
				var board = new THREE.Mesh( new THREE.BufferGeometry() );
				
				numbering(); // numbering the vertices, hundreds ...
					
				vertexNumbers.push( board );	// place the table in the vertex numbering data field
				mesh.add( vertexNumbers[ i ] );	
				
			}
			
		}
		
		if ( mode === 2 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < facesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there

				var board = new THREE.Mesh( new THREE.BufferGeometry() );
						
				numbering(); // numbering the facesces, hundreds ...
					
				faceNumbers.push( board );	// place the table in the face numbering data field
				mesh.add( faceNumbers[ i ] );	
				
			}
			
		}
					
	}
	
	// non indexed BufferGeometry
	
	if ( mesh.geometry.isBufferGeometry && !mesh.geometry.indexed) { 
			
		if ( mode === 1 || mode === 3 ) {
				
			verticesCount = mesh.geometry.vertexPositions.length;
				
		}
		
		if ( mode === 2 || mode === 3 ) {
			
			facesCount = mesh.geometry.positions.length / 9;
			
		}
				
		for ( var i = 0; i < 10; i ++ ) {
			
			geometryDigit[ i ] = new THREE.BufferGeometry();
			
			digitPositions[ i ] =  new Float32Array( coordDigit[ i ].length / 2 * 3 );
			geometryDigit[ i ].addAttribute( 'position', new THREE.BufferAttribute( digitPositions[ i ], 3 ) );
			
			for ( var j = 0; j < coordDigit[ i ].length/ 2; j ++ ) {
				
				digitPositions[ i ][ j * 3 ] =  0.1 * size * coordDigit[ i ][ 2 * j ];
				digitPositions[ i ][ j * 3 + 1 ] = 0.1 * size * coordDigit[ i ][ 2 * j + 1 ];
				digitPositions[ i ][ j * 3 + 2 ] = 0;
				
			}
			
			digit[ i ] = new THREE.Line( geometryDigit[ i ], materialDigits );
			
		}	
						
		if ( mode === 1 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < verticesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there
	
				var board = new THREE.Mesh( new THREE.BufferGeometry() );
				
				numbering(); // numbering the vertices, hundreds ...
					
				vertexNumbers.push( board );	// place the table in the vertex numbering data field
				mesh.add( vertexNumbers[ i ] );	
				
			}
			
		}
		
		if ( mode === 2 || mode === 3 ) {
		
			var i100 =  0;
			var i10  =  0;
			var i1   = -1;
			
			for ( var i = 0; i < facesCount ; i ++ ) {
			
				// Number on board, up to three digits are pinned there

				var board = new THREE.Mesh( new THREE.BufferGeometry() );
						
				numbering(); // numbering the facesces, hundreds ...
					
				faceNumbers.push( board );	// place the table in the face numbering data field
				mesh.add( faceNumbers[ i ] );	
				
			}
			
		}
					
	}
	
	// update helper
	
	this.update = function ( mode ) {
	
		var x, y, z;
		
		// Geometry
		
		if ( mesh.geometry.isGeometry ) {
		
			if ( mode === 1 || mode === 3 ) {
									
				for( var n = 0; n < vertexNumbers.length; n ++ ) {
					
					vertexNumbers[ n ].position.set( mesh.geometry.vertices[ n ].x, mesh.geometry.vertices[ n ].y, mesh.geometry.vertices[ n ].z ); 
					vertexNumbers[ n ].lookAt( camera.position );
					
				}
				
			}
			
			if ( mode === 2 || mode === 3 ) {
				
				for( var n = 0; n < faceNumbers.length; n ++ ) {
					
					x = 0;
					x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].x;
					x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].x; 
					x += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].x;
					x /= 3;
					
					y = 0;
					y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].y;
					y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].y;
					y += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].y;
					y /= 3;
					
					z = 0;
					z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].a ].z;
					z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].b ].z;
					z += mesh.geometry.vertices[ mesh.geometry.faces[ n ].c ].z;
					z /= 3;
					
					faceNumbers[ n ].position.set( x, y, z );
					faceNumbers[ n ].lookAt( camera.position );
				
				}
				
			}
						
		}
		
		// indexed BufferGeometry
		
		if ( mesh.geometry.isBufferGeometry && mesh.geometry.indexed ) {
			
			if ( mode === 1 || mode === 3 ) {
								
				for( var n = 0; n < vertexNumbers.length; n ++ ) {
					
					vertexNumbers[ n ].position.set( mesh.geometry.vertices[ 3 * n ], mesh.geometry.vertices[ 3 * n  + 1 ], mesh.geometry.vertices[ 3 * n  + 2 ] );
					vertexNumbers[ n ].lookAt( camera.position );
					
				}

			}
			
			if ( mode === 2 || mode === 3 ) {
							
				for( var n = 0; n < faceNumbers.length; n ++ ) {
				
					x = 0;
					x += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n ] * 3 ];
					x += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 1 ] * 3 ];
					x += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 2 ] * 3 ];
					x /= 3;
					
					y = 0;
					y += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n ] * 3  + 1 ];
					y += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 1 ] * 3 + 1 ];
					y += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 2 ] * 3 + 1 ];
					y /= 3;
					
					z = 0;
					z += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n ] * 3  + 2 ];
					z += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 1 ] * 3 + 2 ];
					z += mesh.geometry.vertices[ mesh.geometry.faceIndices[ 3 * n + 2 ] * 3 + 2 ];
					z /= 3;
					
					faceNumbers[ n ].position.set( x, y, z );
					faceNumbers[ n ].lookAt( camera.position );
					
				}
				
			}
					
		}
		
		// non indexed BufferGeometry
		
		if ( mesh.geometry.isBufferGeometry && !mesh.geometry.indexed ) {
			
			if ( mode === 1 || mode === 3 ) {
						
				for( var n = 0; n < vertexNumbers.length; n ++ ) { 
					
					vertexNumbers[ n ].position.set( mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] ], mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] + 1 ], mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] + 2] );
					vertexNumbers[ n ].lookAt( camera.position );
					
				}
							
			}
			
			if ( mode === 2 || mode === 3 ) {
									
				for( var n = 0; n < faceNumbers.length; n ++ ) {
					
					x = 0;
					x += mesh.geometry.positions[ 9 * n ];	
					x += mesh.geometry.positions[ 9 * n + 3 ];	
					x += mesh.geometry.positions[ 9 * n + 6 ];	
					x /= 3;	
						
					y = 0;	
					y += mesh.geometry.positions[ 9 * n + 1 ];	
					y += mesh.geometry.positions[ 9 * n + 4 ];	
					y += mesh.geometry.positions[ 9 * n + 7 ];	
					y /= 3;	
						
					z = 0;	
					z += mesh.geometry.positions[ 9 * n + 2 ];	
					z += mesh.geometry.positions[ 9 * n + 5 ];	
					z += mesh.geometry.positions[ 9 * n + 8 ];	
					z /= 3;	
						
					faceNumbers[ n ].position.set( x, y, z );
					faceNumbers[ n ].lookAt( camera.position );
											
				}
								
			}
					
		}
		
	}
	
}

exports.createMorphGeometry = createMorphGeometry;
exports.create = create;
exports.morphVertices =	morphVertices;
exports.morphFaces = morphFaces;

exports.vertexFaceNumbersHelper = vertexFaceNumbersHelper;

Object.defineProperty(exports, '__esModule', { value: true });

})));
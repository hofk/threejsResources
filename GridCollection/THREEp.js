// THREEp.js ( rev 89.0 )

/**
 * @author hofk / http://threejs.hofk.de/
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.THREEp = global.THREEp || {})));
}(this, (function (exports) {

'use strict';

var g;	// THREE.Geometry or THREE.BufferGeometry

function createMorphGeometry( p ) {
 
/*	parameter overview	--- all parameters are optional ---

p = {
	
		// simple properties
	
	indexed,		// indexed or non indexed BufferGeometry
	radius,			// reference sphere radius, multiplier for functions
	wedges,			// spherical wedges, total
	usedWedges,		// used from total sperical wedges
	wedgeOpen,		// wedge on edge open or closed
	equator,		// half of spherical segments
	bottom,			// south pole is 0
	top,			// max. equator * 2 (is north pole)
	withBottom,		// with a bottom (bottom > 0)
	withTop,		// with a top (top < equator * 2)
	style,			// 'map', 'relief', 'complete'
	
		// functions: u,v and result normally 0 .. 1, otherwise specific / interesting results!
		// u azimuth (start: x axis, counterclockwise)
	
	endPole,		//	function ( u, t )		// end angle ( to equator, per phi)
	startPole,		//	function ( u, t )		// start angle ( from south- or north pole, per phi)
	
		// for hemispheres: v polar (start: pole 0, end: equator 1), t time
	
	stretchSouth,	//	function ( u, v, t )	// stretch / compress south hemisphere in -y direction
	stretchNorth,	//	function ( u, v, t )	// stretch / compress north hemisphere in +y direction
	scalePoleH,		//	function ( v, t )		// scaling hemispheres from pole to equator ( is overwritten by scalePole )
	
		// for sphere: v polar (start: south pole 0, end: north pole 1), t time
		
	scalePole,		//	function ( v, t )		// scaling between start and end of polar angle (theta -PI/2 .. PI/2 )
	rAzimuthPole,	//	function ( u, v, t )	// radius depending on location,
	equatorGap,		//	function ( u, t )		// gap in relation to the radius
	squeeze,		//	function ( u, t )		// 0 sphere to 1 flat circle
	moveX,			//	function ( u, v, t )	// factor for radius, move in x direction 
	moveY,			//	function ( u, v, t )	// factor for radius, move in y direction
	moveZ,			//	function ( v, u, t )	// factor for radius, move in z direction
	explod,			// 	function ( t )			// factor for exploded view (only non indexed BufferGeometry)
	endAzimuth,		//	function ( v, t )		// end azimuth angle phi (per theta)
	startAzimuth,	//	function ( v, t )		// starting azimuth angle phi (per theta)
	scaleAzimuth,	//	function ( u, t )		// scaling between start and end of azimuth angle ( phi 0 .. 2*PI)
  	materialSouth,	//	function ( u, v, t )	// material South
	materialNorth,	//	function ( u, v, t )	// material North
	materialPlane,	//	function ( u, t )		// material of extra south top or north bottom
	materialWedge,	//	function ( v, t )		// material wedge side
												// material: round( result*10 ) is material index  0 .. 10
	
			// string array (strings of digits) seperated with a ,
	
	fixedMaterial,	//  fixed given material index, overrides materialSouth, materialNorth

*/

	if ( p === undefined ) p = {};
	
	g = this;  // this is a THREE.Geometry() or THREE.BufferGeometry() - geometry objects from three.js
	
	g.squeezeDefault = p.squeeze === undefined ? true : false;
	g.explodeDefault = p.explode === undefined ? true : false;
	
	g.materialSouthDefault = p.materialSouth === undefined ? true : false;
	g.materialNorthDefault = p.materialNorth === undefined ? true : false;
	g.materialPlaneDefault = p.materialPlane === undefined ? true : false;
	g.materialWedgeDefault = p.materialWedge === undefined ? true : false;
	g.fixedMaterialDefault = p.fixedMaterial === undefined ? true : false;
	g.materialDefault = g.materialSouthDefault && g.materialNorthDefault && g.materialPlaneDefault && g.materialWedgeDefault && g.fixedMaterialDefault;
	
	//....................................................................... set defaults
	g.indexed =		p.indexed !== undefined ?			p.indexed			: true;
	g.radius =			p.radius !== undefined ?			p.radius			: 16;
	g.wedges =			p.wedges !== undefined ?			p.wedges 			: 6;
	g.usedWedges =		p.usedWedges !== undefined ?		p.usedWedges 		: g.wedges;
	g.wedgeOpen =		p.wedgeOpen !== undefined ?			p.wedgeOpen 		: false;
	g.equator =			p.equator !== undefined ?			p.equator			: 9;
	g.bottom =			p.bottom !== undefined ? 			p.bottom			: 0;
	g.top =				p.top !== undefined ? 				p.top				: g.equator * 2;
	g.withTop =			p.withTop	!== undefined ?			p.withTop			: false;
	g.withBottom =		p.withBottom	!== undefined ?		p.withBottom		: false;
	g.style =			p.style !== undefined ?				p.style				: "complete";
	g.endPole =			p.endPole !== undefined ? 			p.endPole			: function ( u, t ) { return 1 };
	g.startPole =		p.startPole !== undefined ? 		p.startPole			: function ( u, t ) { return 0 };
	g.stretchSouth =	p.stretchSouth !== undefined ?		p.stretchSouth		: function ( u, v, t ) { return 1 };
	g.stretchNorth =	p.stretchNorth !== undefined ? 		p.stretchNorth		: function ( u, v, t ) { return 1 };
	g.scalePoleH =		p.scalePoleH !== undefined ? 		p.scalePoleH		: function ( v, t ) { return v };
	g.scalePole =		p.scalePole !== undefined ? 		p.scalePole			: function ( v, t ) { return v };
	g.rAzimuthPole =	p.rAzimuthPole !== undefined ? 		p.rAzimuthPole		: function ( u, v, t ) { return 1 };
	g.equatorGap =		p.equatorGap !== undefined ? 		p.equatorGap		: function ( u, t ) { return 0 };
	g.squeeze =			p.squeeze !== undefined ? 			p.squeeze			: function ( u, t ) { return 0 };
	g.moveX =			p.moveX	!== undefined ? 			p.moveX				: function ( u, v, t ) { return 0 };
	g.moveY =			p.moveY	!== undefined ? 			p.moveY				: function ( u, v, t ) { return 0 };
	g.moveZ =			p.moveZ	!== undefined ? 			p.moveZ				: function ( u, v, t ) { return 0 };
	g.explode =			p.explode !== undefined ? 			p.explode			: function ( t ) { return 0 };
	g.endAzimuth =		p.endAzimuth !== undefined ? 		p.endAzimuth		: function ( v, t ) { return 1 };
	g.startAzimuth =	p.startAzimuth !== undefined ? 		p.startAzimuth		: function ( v, t ) { return 0 };
	g.scaleAzimuth =	p.scaleAzimuth !== undefined ? 		p.scaleAzimuth		: function ( u, t ) { return u };
	
	if( p.scalePole === undefined ) {
		
		g.scaleH = true; // scaling between pole and equator per hemisphere,
		
	} else {
		
		g.scaleH = false; // uses the decomposed function, scaling per sphere
		
	}
	
	if ( g.top - g.bottom <= 0 ) g.wedgeOpen = true;
	if ( g.wedges < g.usedWedges ) g.usedWedges = g.wedges;
	if ( g.bottom >= g.equator * 2 ) g.bottom  = 0;
	if ( g.top > g.equator * 2) g.top = g.equator * 2;
	
	if ( g.top < g.bottom ) {
		
		g.bottom  = 0;
		g.top = g.equator * 2;
		
	}
	
	// When using multi material:
	// Take index 0 for invisible faces like THREE.MeshBasicMaterial( { visible: false } ),
	// or use transparent faces like THREE.MeshBasicMaterial( {transparent: true, opacity: 0.05 } )
	
	// Please note!	The functions normally should have results from 0 to 1. If the multimaterial array
	// contains fewer materials than the functional result * 10, the script will crash.
	// Even if the result is negative.
	
	g.materialSouth = function() { return 1 }; // default material index is 0.1 * 10 = 1
	g.materialNorth = function() { return 1 };
	g.materialPlane = function() { return 1 };
	g.materialWedge = function() { return 1 };
	
	if ( p.materialSouth !== undefined ) g.materialSouth = function ( u, v, t ) { return  Math.floor( 10 * p.materialSouth( u, v, t ) ) };
	if ( p.materialNorth !== undefined ) g.materialNorth = function ( u, v, t ) { return  Math.floor( 10 * p.materialNorth( u, v, t ) ) };
	if ( p.materialPlane !== undefined ) g.materialPlane = function ( u, t ) { return  Math.floor( 10 * p.materialPlane( u, t ) ) };
	if ( p.materialWedge !== undefined ) g.materialWedge = function ( v, t ) { return  Math.floor( 10 * p.materialWedge( v, t ) ) };
	
	// Please note!
	// If the multimaterial array contains fewer materials than the highest number in fixed material, the script will crash.
	// String array fixedMaterial contains strings of digits 0 to 9, for instance [ .. '0011997741', 'equator','222200' .. ].
	
	// Every string represents the faces of a corresponding spherical segment for a hemisphere from pole to equator. Additional bottom and top.
	// It starts with south. If you have not only one hemisphere, devide the array by  'equator'.
	// The sequence of the faces can be determined with the function vertexFaceNumbersHelper ( .. ).
	// It's not necessary, that the length of array / strings equals the number of faces, e.g. only ['1'] or ['92', '321', 'equator', '44.48'] is sufficient.
	// The dot . is a placeholder for faces that should not change.
	
	g.fixedMaterial = p.fixedMaterial !== undefined ? p.fixedMaterial : []; // default is empty
	
	if ( !g.fixedMaterialDefault ) {
		
		g.minFixed = g.top - g.bottom;
		g.minFixed += g.withBottom ? 1 : 0;
		g.minFixed += g.withTop ? 1 : 0;
		g.minFixed += !g.wedgeOpen ? ( g.bottom < g.equator && g.top > g.equator ? 2 : 1 ) : 0;
		g.minFixed = Math.min( g.minFixed , g.fixedMaterial.length );
		
	}
	//..............................................................................................
	
	g.create = create;
	g.morphVertices = morphVertices;
	g.morphFaces= morphFaces;
	
	g.create();
	g.morphVertices();
	
	if ( !g.materialDefault ) {
		
		g.morphFaces();
		
	}
	
}

function create() {
	
	g = this;
	
	if ( g.style !== "complete" ) { g.withBottom = false; g.withTop = false; g.wedgeOpen = true; }
	
	var eqt = g.equator;
	var eq2 = eqt * 2;
	var wed = g.wedges;
	var uWed = g.usedWedges;
	var vIdx;			// vertex index
	var x, y, z, ux, uy;
	var a, b, c;
	var nih, iMin, iMax, jMin, jMax;
	var uvIdx;
	var theta;
	var phi;
	var phiOffset = Math.PI * ( 1 - uWed / wed);
	var bottomS = g.bottom; 					// bottom south	hemisphere
	var topS = Math.min( eqt, g.top ); 			// top south	hemisphere
	var bottomN = eq2 - g.top; 					// bottom north	hemisphere (direction from north pole ..)
	var topN = Math.min( eqt, eq2 - g.bottom);	// top north	hemisphere ( .. to equator)
	g.wedgeSouthStartIdx = [];
	g.wedgeSouthEndIdx = [];
	g.wedgeNorthStartIdx = [];
	g.wedgeNorthEndIdx = [];
	
	var ssIdx = topS - ( bottomS === 0 ? 1 : bottomS ); // wedge south start index
	var seIdx = 0; // wedge south end index
	var nsIdx = topN - ( bottomN === 0 ? 1 : bottomN ); // wedge north start index
	var neIdx = 0; // wedge north end index
	var pi2 = Math.PI / 2;
	const SOUTH = -1;
	const NORTH = 1;
	const BOTTOM = 0;
	const TOP = 1;
	
	if ( g.bottom === 0 ) g.withBottom = false;
	if ( g.top === eq2 ) g.withTop = false;
	
	if ( g.scaleH ) {
		
		//  ...HSE Hemisphere Start- End
		
		g.scalePoleHSE = function( u, v, t ) { return  1 - ( g.startPole( u, t ) + ( g.endPole( u, t ) - g.startPole(u, t ) ) * g.scalePoleH( v, t ) ) }
		
	} else {
		
		// uses the decomposed scale function (South and North)
		
		g.scalePoleS = function( u, v, t ) { return 2 * ( g.startPole( u, t ) + ( g.endPole( u, t ) - g.startPole( u, t ) ) * g.scalePole(  v / 2, t ) ) }
		g.scalePoleN = function( u, v, t ) { return 2 * ( 1 - g.endPole( u, t ) + ( g.endPole( u, t ) - g.startPole( u, t ) ) * ( 1 - g.scalePole( 1 -  v / 2, t ) ) ) }
		
	}
	
	//count vertices: south and north hemisphere
	
	g.vertexCount = 0;
	
	if ( g.bottom < eqt ) {
		
		g.vertexCount += ( bottomS === 0  || g.withBottom ) ? 1 : 0;	// south pole || bottom
		
		g.southVertex = g.vertexCount;
		
		for ( var i = bottomS === 0 ? 1 : bottomS ; i <= topS; i ++ ) {
			
			g.vertexCount += i * uWed + 1;
			
		}
		
		g.southTopVertex = g.vertexCount - 1;
		
		g.vertexCount += ( g.top <= eqt && g.withTop ) ? g.top * uWed + 2 : 0;	// south top
		
		g.southWedgeVertex =  g.vertexCount;
		g.vertexCount += ( !g.wedgeOpen ) ? 2 : 0; // wedge closed
		
		for ( var i = bottomS === 0 ? 1 : bottomS ; i <= topS; i ++ ) {
			
			g.vertexCount += ( !g.wedgeOpen ) ? 2 : 0;  // wedge closed ( start / end )
			
		}
		
	}
	
	g.vertexNorthOffset = g.vertexCount;
	
	if ( g.top > eqt ) {
		
		g.vertexCount += ( bottomN === 0 || g.withTop ) ? 1 : 0;	// north pole || top
		
		g.northVertex =  g.vertexCount;
		
		for ( var i = bottomN === 0 ? 1 : bottomN ; i <= topN; i ++ ) {
			
			g.vertexCount += i * uWed + 1; // equator is double (uv's, equator gap)
			
		}
		
		g.northBottomVertex = g.vertexCount - 1;
		
		g.vertexCount += ( g.bottom >= eqt &&  g.withBottom ) ? topN * uWed + 2 : 0;	// north bottom
		
		g.northWedgeVertex =  g.vertexCount;
		g.vertexCount += ( !g.wedgeOpen ) ? 2 : 0;	// wedge closed
		
		for ( var i = bottomN === 0 ?  1 : bottomN; i <= topN; i ++ ) {
			
			g.vertexCount += ( !g.wedgeOpen ) ? 2 : 0;  // wedge closed ( start / end )
			
		}
		
	}
	
	// count faces: south and north hemisphere
	
	g.faceCount = 0;
	
	if ( g.bottom < eqt ) {
		
		g.faceCount += ( bottomS > 0 && g.withBottom ) ? bottomS * uWed : 0; // bottom south
		
		g.southFace = g.faceCount;
		
		for ( var i = bottomS; i < topS; i ++ ) {
			
			g.faceCount += ( 2 * i + 1 ) * uWed;
			
		}
		
		g.southTopFace = g.faceCount;
		
		g.faceCount += ( g.top <= eqt && g.withTop ) ? g.top * uWed : 0; // top south
		
		g.southWedgeFace = g.faceCount;
		
		for ( var i = bottomS; i < topS; i ++ ) {
			
			g.faceCount += ( !g.wedgeOpen ) ? 2 : 0;	// wedge closed ( start / end )
			
		}
		
		g.faceCount += ( !g.wedgeOpen  &&  bottomS > 0  ) ? 2 : 0;	// wedge closed  middle if  g.bottom > 0 
		
	}
	
	g.faceNorthOffset = g.faceCount;
	
	if ( g.top > eqt ) {
		
		g.faceCount += ( bottomN > 0 && g.withTop ) ? bottomN * uWed : 0;  // top is bottom of north hemisphere
		
		g.northFace = g.faceCount;
		
		for ( var i = bottomN; i < topN	; i ++ ) {
			
			g.faceCount += ( 2 * i + 1 ) * uWed;
			
		}
		
		g.northBottomFace = g.faceCount;
		
		g.faceCount += ( g.bottom >= eqt && g.withBottom ) ? topN * uWed : 0; // bottom	 is top of north hemisphere
		
		g.northWedgeFace = g.faceCount;
		
		for ( var i = bottomN; i < topN	; i ++ ) {
			
			g.faceCount += ( !g.wedgeOpen ) ? 2 : 0;	// wedge closed ( start / end )
			
		}
		
		g.faceCount += ( !g.wedgeOpen  && bottomN > 0  ) ? 2 : 0;	// wedge closed  middle if  bottomN > 0
		
	}
	
	// .........................................................................................................
	
	if ( g.isGeometry ) {
		
		var vertexUV = [];
		var nih1;
		
		function pushFaceAndUv() {
			
			g.faces.push( new THREE.Face3( a, b, c, null, null, 1 ) );
			g.faceVertexUvs[ 0 ].push( [ vertexUV[ a ], vertexUV[ b ],vertexUV[ c ] ] );
			
		}
		
		function calculateVertexUvs( sn ) {
			
			var btm;
			var withBtm;
			var top;
			var withTop;
			var vOffs;
			var topVertex;
			var wedgeVertex;
			
			if ( sn === SOUTH ) {
				
				btm = bottomS;
				withBtm = g.withBottom;
				top = topS;
				vOffs = 0;							// vertex vIdx 0: south pole || bottom
				withTop = g.withTop;
				topVertex = g.southTopVertex;
				wedgeVertex = g.southWedgeVertex;
				
				vIdx = g.southVertex;				// start index
						
			} else { 
				
				btm = bottomN;
				withBtm = g.withTop;				// bottom of north hemisphere is top of sphere
				top = topN;
				withTop = g.withBottom;				// top of north hemisphere is bottom of sphere
				vOffs = g.vertexNorthOffset;		// vertex north pole || top
				topVertex = g.northBottomVertex;	// hemispheres
				wedgeVertex = g.northWedgeVertex;
				
				vIdx = g.northVertex;				// start index
				
			}
			
			
			if ( btm === 0 || withBtm ) {
				
				vertexUV[ vOffs ] = new THREE.Vector2( 0.5, 0.5 );
				
			}
			
			for ( var i = btm === 0 ? 1 : btm; i <= top; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					// nji = j / ( i * wed );
					
					phi = 2 * Math.PI * j / ( i * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 + sn * nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 - sn * nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
					vIdx ++;
					
				}
				
			}
			
			if ( withTop ) {
				
				vIdx = topVertex + 1; // uv's  c, b
				
				nih = top / eqt;
				
				for ( var j = 0; j < top * uWed + 1; j ++ ) {
					
					// nji = j / ( top * wed );
					
					phi = 2 * Math.PI * j / ( top * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 - sn * nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 + sn * nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5;
				
				vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
				
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = wedgeVertex;
				
				ux = 0.5;
				uy = 0.5 * ( 1 + Math.sin(  sn * Math.PI / 2 * ( 1 - top / eqt ) ) );
				
				vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
				vIdx ++;
				
				iMin = btm > 0 ? btm - 1 : 0;
				
				for ( var i = top; i > iMin; i -- ) {
					
					theta = sn * Math.PI / 2 * ( 1 - i / eqt );
					
					ux = 0.5 * ( 1 + sn * Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5 * ( 1 +  Math.sin( sn * Math.PI / 2 * ( 1 - btm / eqt ) ) );
				
				vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
				vIdx ++;
				
				for ( var i = iMin + 1; i <= top; i ++  ) {
					
					theta = sn * Math.PI / 2 * ( 1 - i / eqt );
					
					ux = 0.5 * ( 1 - sn * Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					vertexUV[ vIdx ] = new THREE.Vector2( ux, uy );
					vIdx ++;
					
				}
				
			}
			
		}		
				
		// create the vertices
		
		for ( var i = 0; i < g.vertexCount; i ++ ) {
			
			g.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			
		}
		
		if ( g.bottom < eqt) calculateVertexUvs( SOUTH ); // calculate south vertex uv's
		
		if ( g.top > eqt ) calculateVertexUvs( NORTH ); // calculate north vertex uv's
		
		// faces south hemisphere
		
		if ( g.bottom < eqt ) {
			
			if ( bottomS === 0 || g.withBottom ) {
				
				a = 0;  // vertex vIdx 0: south pole || bottom
				b = 1;
				c = 0;
				
				jMax = bottomS === 0 ? uWed : bottomS * uWed;
				
				for ( var j = 1; j <= jMax; j ++ ) {
					
					c ++;
					b ++;
					
					pushFaceAndUv()
					
				}
				
			}
			
			vIdx = g.southVertex;
			
			for ( var i = bottomS === 0 ? 1 : bottomS; i < topS; i ++ ) {
				
				for ( var w = 0; w < uWed; w ++ ) {
					
					for ( var j = 0; j < i + 1 ; j ++ ) {
						
						if ( j === 0 ) {
							
							//  first face in wedge 
							
							a = vIdx;
							b = a + uWed * i + w + 2;
							c = b - 1;
							
							pushFaceAndUv()
							
						} else {
						
							//  two faces / vertex
							
							a = j + vIdx; 
							b = a + uWed * i + w + 1;
							c = a - 1;
							
							pushFaceAndUv()
							
							// a  from first face
							b++; // b from first face
							c = b - 1;
							
							pushFaceAndUv()
							
						}
						
					}
					
					vIdx += i;
					
				}
				
				vIdx ++;
			
			}
			
			if ( g.top <= eqt && g.withTop ) {
				
				vIdx  = g.southTopVertex + 1; // uv's  c, b
				
				a = vIdx + g.top * uWed + 1;
				b = vIdx - 1;
				c = vIdx;
				
				for ( var j = 0; j < g.top * uWed; j ++ ) {
					
					b ++;
					c ++;
					
					pushFaceAndUv()
					
				}
			
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				a = vIdx;
				b = a;
				c = a + 1;
				
				iMax = ( topS - ( bottomS > 0 ? bottomS - 1 : 0 ) ) * 2;
				
				for ( var i = 0; i < iMax; i ++ ) {
					
					b ++;
					c ++;
					
					pushFaceAndUv();
					
				}
			
			}
			
			// south: store wedge index
			
			vIdx = g.southVertex;
			
			for ( var i = bottomS === 0 ? 1 : bottomS; i <= topS; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( !g.wedgeOpen || uWed === wed  ) {
						
						if ( j === 0 ) {
							
							g.wedgeSouthEndIdx[ seIdx ] = vIdx;
							
							seIdx ++;
							
						}
						
						if ( j === i * uWed ) {
							
							g.wedgeSouthStartIdx[ ssIdx ] = vIdx;
							
							ssIdx --;
							
						}
						
					}
					
					vIdx ++;
					
				}
				
			}
			
		}
		
		// faces north hemisphere
		
		if ( g.top > eqt ) {
			
			if ( bottomN === 0 || g.withTop ) {
				
				a = g.vertexNorthOffset; // north pole || top
				
				b = a;
				c = a + 1;
				
				jMax = bottomN === 0 ? uWed : bottomN * uWed;
				
				for ( var j = 1; j <= jMax; j ++ ) {
					
					b ++;
					c ++;
					
					pushFaceAndUv()
					
				}
				
			}
			
			vIdx = g.northVertex;
			
			for ( var i = bottomN === 0 ? 1 : bottomN; i < topN	; i ++ ) {
				
				for ( var w = 0; w < uWed; w ++ ) {
					
					for ( var j = 0; j < i + 1 ; j ++ ) {
						
						if ( j === 0 ) {
							
							//  first face in wedge
							
							a = vIdx;
							b = a + uWed * i + w + 1;
							c = b + 1;
							
							pushFaceAndUv()
							
						} else {
							
							//  two faces / vertex
							
							a = j + vIdx; 
							b = a - 1; 
							c = a + uWed * i + w + 1;
							
							pushFaceAndUv()
							
							// a  from first face 
							b = c; // from first face
							c = b + 1;
							
							pushFaceAndUv()
							
						}
						 
					}
					
					vIdx += i;
					
				}
				
				vIdx ++;
				
			}
			
			if ( g.bottom >= eqt && g.withBottom ) {
			
				vIdx  = g.northBottomVertex + 1; // uv's  c, b
				
				a = vIdx + topN	* uWed + 1;
				b = vIdx;
				c = vIdx - 1;
				
				for ( var j = 0; j < topN * uWed; j ++ ) {
					
					b ++;
					c ++;
					
					pushFaceAndUv()
					
				}
				
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				a = vIdx;
				b = a;
				c = a + 1;
				
				iMax = ( topN - ( bottomN > 0 ? bottomN - 1 : 0 ) ) * 2;
				
				for ( var i = 0; i < iMax; i ++ ) {
					
					b ++;
					c ++;
					
					pushFaceAndUv();
					
				}
				
			}
			
			// north: store wedge index & uv's
			
			vIdx = g.northVertex;
			
			for ( var i = bottomN === 0 ? 1 : bottomN; i <= topN; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( !g.wedgeOpen || uWed === wed ) {
						
						
						if ( j === 0 ) {
							
							g.wedgeNorthStartIdx[ nsIdx ] = vIdx;
							
							nsIdx --;
							
						}
						
						if ( j === i * uWed ) {
							
							g.wedgeNorthEndIdx[ neIdx ] = vIdx;
							
							neIdx ++;
							
						}
					
					}
					
					vIdx ++;
					
				}
				
			}
			
		}
		
	}
	
	if ( g.isBufferGeometry && g.indexed ) {
		
		var faceArrayIdx;	// face array index (face index * 3)
		
		function pushFace() {
			
			g.faceIndices[ faceArrayIdx ] = a;
			g.faceIndices[ faceArrayIdx + 1 ] = b;
			g.faceIndices[ faceArrayIdx + 2 ] = c;
			
			faceArrayIdx += 3;
			
		}
		
		function storeUvs() {
			
			uvIdx = vIdx * 2;
			
			g.uvs[ uvIdx ] = ux;
			g.uvs[ uvIdx + 1 ] = uy;
			
		}
		
		g.vertices = new Float32Array( g.vertexCount * 3 );
		g.faceIndices = new Uint32Array( g.faceCount * 3 );
		g.normals = new Float32Array( g.vertexCount * 3 );
		g.uvs = new Float32Array( g.vertexCount * 2 );
		
		g.setIndex( new THREE.BufferAttribute( g.faceIndices, 1 ) );
		g.addAttribute( 'position', new THREE.BufferAttribute( g.vertices, 3 ).setDynamic( true ) );
		g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
		g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) );
		
		faceArrayIdx = 0;
		
		// faces, uvs south hemisphere
		
		if ( g.bottom < eqt ) {
			
			if ( bottomS === 0 || g.withBottom ) {
				
				a = 0;  // vertex vIdx 0: south pole || bottom
				b = 1;
				c = 0;
				
				jMax = bottomS === 0 ? uWed : bottomS * uWed;
				
				for ( var j = 1; j <= jMax; j ++ ) {
					
					c ++;
					b ++;
					
					pushFace(); 
					
				}
				
				vIdx = 0; // south pole || bottom
				
				ux = 0.5;
				uy = 0.5;
				
				storeUvs();
				
			}
			
			vIdx = g.southVertex;
			
			for ( var i = bottomS === 0 ? 1 : bottomS; i < topS; i ++ ) {
				
				for ( var w = 0; w < uWed; w ++ ) {
					
					for ( var j = 0; j < i + 1 ; j ++ ) {
						
						if ( j === 0 ) {
							
							//  first face in wedge 
							
							a = vIdx;
							b = a + uWed * i + w + 2;
							c = b - 1;
							
							pushFace();
							
						} else {
							
							//  two faces / vertex
							
							a = j + vIdx; 
							b = a + uWed * i + w + 1;
							c = a - 1;
							
							pushFace();
							
							// a  from first face 
							b++; // b from first face
							c = b - 1;
							
							pushFace();
							
						}
						
					}
					
					vIdx += i;
					
				}
				
				vIdx ++;
				
			}
			
			if ( g.top <= eqt && g.withTop ) {
				
				vIdx  = g.southTopVertex + 1; // uv's  c, b
				
				a = vIdx + g.top * uWed + 1;
				b = vIdx - 1;
				c = vIdx;
				
				// faces
				
				for ( var j = 0; j < g.top * uWed; j ++ ) {
					
					b ++;
					c ++;
					
					pushFace(); 
					
				}
				
				// uv's
				
				nih = topS / eqt;
				
				for ( var j = 0; j < topS * uWed + 1; j ++ ) {
					
					// nji = j / ( topS * wed );
					
					phi = 2 * Math.PI * j / ( topS * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 + nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 - nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5;
				
				storeUvs();
				
			} 
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				// faces
				
				a = vIdx;
				b = a;
				c = a + 1;
				
				iMax = ( topS - ( bottomS > 0 ? bottomS - 1 : 0 ) ) * 2;
				
				for ( var i = 0; i < iMax; i ++ ) {
					b ++;
					c ++;
					
					pushFace();
					
				}
				
				// wedge uv's
				
				ux = 0.5;
				uy = 0.5 * ( 1 + Math.sin( -Math.PI / 2 * ( 1 - topS / eqt ) ) );
				
				storeUvs();
				vIdx ++;
				
				iMin = bottomS > 0 ? bottomS - 1 : 0;
				
				for ( var i = topS; i > iMin; i -- ) {
					
					theta = -Math.PI / 2 * (1 - i / eqt);
					
					ux = 0.5 * ( 1 - Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5 * ( 1 +  Math.sin( -Math.PI / 2 * ( 1 - bottomS / eqt ) ) );
				
				storeUvs();
				vIdx ++;
				
				for ( var i = iMin + 1; i <= topS; i ++ ){
					
					theta = -Math.PI / 2 * ( 1 - i / eqt );
					
					ux = 0.5 * ( 1 + Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
			}
			
			// south: store wedge index & south uv's
			
			vIdx = g.southVertex;
			
			for ( var i = bottomS === 0 ? 1 : bottomS; i <= topS; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( !g.wedgeOpen || uWed === wed  ) {
						
						if ( j === 0 ) {
							
							g.wedgeSouthEndIdx[ seIdx ] = vIdx * 3;
							
							seIdx ++;
							
						}
						
						if ( j === i * uWed ) {
							
							g.wedgeSouthStartIdx[ ssIdx ] = vIdx * 3;
							
							ssIdx --;
							
						}
						
					}
					
					// nji = j / ( i * wed );
					
					phi = 2 * Math.PI * j / ( i * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 - nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 + nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
			}
			
		}
		
		// faces, uvs  north hemisphere
		
		if ( g.top > eqt ) {
			
			if ( bottomN === 0 || g.withTop ) {
				
				a = g.vertexNorthOffset; // north pole || top
				
				b = a;
				c = a + 1;
				
				jMax = bottomN === 0 ? uWed : bottomN * uWed;
				
				for ( var j = 1; j <= jMax; j ++ ) {
					
					b ++;
					c ++;
					
					pushFace();
					
				}
				
				vIdx = g.vertexNorthOffset; // north pole || top
				
				ux = 0.5;
				uy = 0.5;
				
				storeUvs();
			}
			
			vIdx = g.northVertex;
			
			for ( var i = bottomN === 0 ? 1 : bottomN; i < topN	; i ++ ) {
				
				for ( var w = 0; w < uWed; w ++ ) {
					
					for ( var j = 0; j < i + 1 ; j ++ ) {
						
						if ( j === 0 ) {
							
							//  first face in wedge 
							
							a = vIdx;
							b = a + uWed * i + w + 1;
							c = b + 1;
							
							pushFace();
							
						} else {
							
							//  two faces / vertex
							
							a = j + vIdx; 
							b = a - 1; 
							c = a + uWed * i + w + 1;
							
							pushFace();
							
							// a  from first face 
							b = c; // from first face
							c = b + 1;
							
							pushFace();
							
						}
						
					}
					
					vIdx += i;
					
				}
				
				vIdx ++;
				
			}
			
			if ( g.bottom >= eqt && g.withBottom ) {
				
				vIdx  = g.northBottomVertex + 1; // uv's  c, b
				
				a = vIdx + topN	* uWed + 1;
				b = vIdx;
				c = vIdx - 1;
				
				// faces
				
				for ( var j = 0; j < topN * uWed; j ++ ) {
					
					b ++;
					c ++;
					
					pushFace();
					
				}
				
				// uv's
				
				nih = topN / eqt;
				
				for ( var j = 0; j < topN * uWed + 1; j ++ ) {
					
					// nji = j / ( topN  * wed );
					
					phi = 2 * Math.PI * j / ( topN * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 -  niht * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 + nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5;
				
				storeUvs();
				
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				// faces
				
				a = vIdx;
				b = a;
				c = a + 1;
				
				iMax = ( topN - ( bottomN > 0 ? bottomN - 1 : 0 ) ) * 2;
				
				for ( var i = 0; i < iMax; i ++ ) {
					
					b ++;
					c ++;
					
					pushFace();
					
				}
				
				// wedge uv's
				
				ux = 0.5;
				uy = 0.5 * ( 1 + Math.sin( Math.PI / 2 * ( 1 - topN / eqt ) ) );
				
				storeUvs();
				vIdx ++;
				
				iMin = bottomN > 0 ? bottomN - 1 : bottomN;
				
				for ( var i = topN ; i > iMin; i -- ) {
					
					theta = Math.PI / 2 * ( 1  - i / eqt );
					
					ux = 0.5 * ( 1 + Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
				ux = 0.5;
				uy = 0.5 * ( 1 +  Math.sin( Math.PI / 2 * ( 1 - bottomN / eqt ) ) );
				
				storeUvs();
				vIdx ++;
				
				for ( var i = iMin + 1; i <= topN; i ++ ){
					
					theta = Math.PI / 2 * ( 1  - i / eqt );
					
					ux = 0.5 * ( 1 - Math.cos( theta ) );
					uy = 0.5 * ( 1 + Math.sin( theta ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
			}
			
			// north: store wedge index & uv's
			
			vIdx = g.northVertex;
			
			for ( var i = bottomN === 0 ? 1 : bottomN; i <= topN; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( !g.wedgeOpen || uWed === wed ) {
						
						if ( j === 0 ) {
							
							g.wedgeNorthStartIdx[ nsIdx ] = vIdx * 3;
							
							nsIdx --;
							
						}
						
						if ( j === i * uWed ) {
							
							g.wedgeNorthEndIdx[ neIdx ] = vIdx * 3;
							
							neIdx ++;
							
						}
					
					}
					
					//nji = j / ( i * wed );
					phi = 2 * Math.PI * j / ( i * wed ) + phiOffset;
					
					//ux = 0.5 * ( 1 + nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 - nih * Math.sin( phi ) ); 
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					storeUvs();
					vIdx ++;
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0 , p = 0; f < g.faceCount ; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
	if ( g.isBufferGeometry && !g.indexed ) {
		
		var fIdx;				// face index
		var fPos;				// face position a or b or c index
		
		g.positions = new Float32Array( g.faceCount * 9 );
		g.normals = new Float32Array( g.faceCount * 9 );
		g.uvs = new Float32Array( g.faceCount * 6 );  // uv's to positions
		
		g.addAttribute( 'position', new THREE.BufferAttribute( g.positions, 3 ).setDynamic( true ) );
		g.addAttribute( 'normal', new THREE.BufferAttribute( g.normals, 3 ).setDynamic( true ) );
		g.addAttribute( 'uv', new THREE.BufferAttribute( g.uvs, 2 ) ); 
		
		g.vertexFaces = []; // needed to calculate the normals
		g.vertexPositions = [];
		
		var vFace = [];
		var vPos = [];
		
		// const a = 0; // position index offset, triangle corners a, b, c
		const b = 3;
		const c = 6;
		
		// const uva = 0; // uv index offset, triangle corners a, b, c
		const uvb = 2;
		const uvc = 4;
		
		function storePosUvs() {
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				uvIdx = g.vertexPositions[ vIdx ][ p ] / 3 * 2;
				
				g.uvs[ uvIdx ] = ux;
				g.uvs[ uvIdx + 1 ] = uy;
				
			}
			
		}
		
		function createCenter( jMax, fOffset ) {
			
			vFace = [];
			vPos = [];
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				fPos = ( fOffset + j ) * 9;
				
				vFace.push( fPos );
				vPos.push( fPos );
				
				// set uv's 
				
				uvIdx = ( fOffset + j ) * 6;
				
				g.uvs[ uvIdx ] = 0.5 ;
				g.uvs[ uvIdx + 1 ] = 0.5 ;
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
		}
		
		function createPlane( sn, jMax, fOffset ) {
			
			var posOffs1;
			var posOffs2;
			var uvOffs1; 
			var uvOffs2; 
			var top;
			
			if ( sn === SOUTH ) {
				
				posOffs1 = c;
				posOffs2 = b;
				uvOffs1 = uvc;
				uvOffs2 = uvb;
				top = topS;
				
			} else {
				
				posOffs1 = b;
				posOffs2 = c;
				uvOffs1 = uvb;
				uvOffs2 = uvc;
				top = topN;
				
			}
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				vFace = [];
				vPos = [];
				
				if ( j > 0 ) {
					
					fIdx = fOffset + j - 1;
					fPos = fIdx * 9;
					
					vFace.push( fPos );
					vPos.push( fPos + posOffs1 );
					
					// calculate, set uv's
					
					uvIdx = fIdx * 6 + uvOffs1;
					
					phi = 2 * Math.PI * j / ( top * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 - sn * top / eqt * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 + sn * top / eqt * Math.sin( phi ) );
					uy = 0.5 * ( 1 + top / eqt * Math.cos( phi ) );
					
					g.uvs[ uvIdx ] = ux;
					g.uvs[ uvIdx + 1 ] = uy;
					
				}
				
				if ( j < top * uWed ) {
					
					fIdx = fOffset + j;
					fPos = fIdx * 9;
					
					vFace.push( fPos );
					vPos.push( fPos + posOffs2 );
					
					// calculate uv's
					
					uvIdx = fIdx * 6 + uvOffs2;
					
					phi = 2 * Math.PI * j / ( top * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 - sn * top / eqt * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 + sn *  top / eqt * Math.sin( phi ) );
					uy = 0.5 * ( 1 + top / eqt * Math.cos( phi ) );
					
					g.uvs[ uvIdx ] = ux;
					g.uvs[ uvIdx + 1 ] = uy;
					
				}
				
				g.vertexFaces.push( vFace );
				g.vertexPositions.push( vPos );
				
			}
			
		}
		
		function createSouthNorth( sn ) {
			
			var btm;
			var withBtm;
			var top;
			var fSNOffs;
			var fOffs; 
			var posOffs1;
			var posOffs2;
			var uvOffs1;
			var uvOffs2;
			
			if ( sn === SOUTH ) {
				
				btm = bottomS;
				withBtm = g.withBottom;
				top = topS;	
				fSNOffs = 0;
				fOffs = g.southFace;
				posOffs1 = b;
				posOffs2 = c;
				uvOffs1 = uvc;
				uvOffs2 = uvb;
				
			} else {
				
				btm = bottomN;
				withBtm = g.withTop;  // bottom of north hemisphere is top of sphere
				top = topN;
				fSNOffs = g.faceNorthOffset;
				fOffs = g.northFace;
				posOffs1 = c;
				posOffs2 = b;
				uvOffs1 = uvb;
				uvOffs2 = uvc;
				
			}
			
			// vertex faces and positions
			
			for ( var i = btm === 0 ? 1 : btm; i <= top; i ++ ) {
				
				for ( var w = 0; w < uWed; w ++ ) {
					
					for ( var j = 0; j < i ; j ++ ) {
						
						// faces to vertex
						
						vFace = [];
						vPos = [];
						
						if ( j === 0 ) {
							
							if ( i === btm && withBtm ) {
								
								// pole circle faces
								
								if ( w > 0) {
									
									// from previous wedge
									
									fPos = ( fSNOffs +  w * btm - 1 ) * 9;
									
									vFace.push( fPos );
									vPos.push( fPos + posOffs1 );
									
								}
								
								fPos = ( fSNOffs + w * btm ) * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs2 );
								
							}
							
							if( i > btm ) {
								
								fIdx = fOffs + uWed * ( i - 1 ) * ( i - 1 ) +  w * ( 2 * ( i - 1 ) + 1 ) - uWed * btm * btm;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs2 );
								
								if ( w > 0) {
									
									// from previous wedge
									
									fIdx --;
									
									fPos = fIdx * 9;
									
									vFace.push( fPos );
									vPos.push( fPos + posOffs1 );
									
								}
								
							}
							
							if( i < top ) {
								
								fIdx = fOffs + uWed * i * i +  w * ( 2 * i + 1 ) - uWed * btm * btm;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos );
								
								fIdx ++;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs2 );
								
								if ( w > 0) {
									
									// from previous wedge
									
									fIdx -= 2;
									
									fPos = fIdx * 9;
									
									vFace.push( fPos );
									vPos.push( fPos );
									
									fIdx --;
									
									fPos = fIdx * 9;
									
									vFace.push( fPos );
									vPos.push( fPos );
									
								}
								
							}
							
						}
						
						if ( j > 0 ) {
							
							if ( i === btm && withBtm ) {
								
								// pole circle faces
								
								if ( j > 0 ) {
									
									fPos = ( fSNOffs + w * btm + j - 1 ) * 9;
									
									vFace.push( fPos );
									vPos.push( fPos + posOffs1 );
									
								}
								
								if ( j < btm * uWed ) {
									
									fPos = ( fSNOffs + w * btm + j ) * 9;
									
									vFace.push( fPos );
									vPos.push( fPos + posOffs2 );
									
								}
								
							}
							
							if( i > btm ) {
								
								//  low index
								
								fIdx = fOffs + uWed * ( i - 1 ) * ( i - 1 ) + w * ( 2 * ( i - 1 ) + 1 ) + 2 * ( j - 1 ) - uWed * btm * btm;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs1 );
								
								fIdx ++;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs1 );
								
								fIdx ++;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs2 );
								
								
							}
							
							if( i < top ) {
								
								// low index
								
								fIdx = fOffs + uWed * i * i + w * ( 2 * i + 1 ) + 2 * j - 1 - uWed * btm * btm;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos );
								
								fIdx ++;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos );
								
								fIdx ++;
								
								fPos = fIdx * 9;
								
								vFace.push( fPos );
								vPos.push( fPos + posOffs2 );
								
							}
							
						}
						
						g.vertexFaces.push( vFace );
						g.vertexPositions.push( vPos );
						
					}
					
					//  vertices to close last wedge
					
					if ( w === uWed - 1) {
						
						// faces to vertex
						
						vFace = [];
						vPos = [];
						
						if ( i === btm && withBtm ) {
							
							// pole circle face
							
							fPos = ( fSNOffs + w * btm + btm - 1 ) * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + posOffs1 );
							
						}
						
						if( i > btm ) {
							
							fIdx = fOffs + uWed * ( i - 1 ) * ( i - 1 ) + w * ( 2 * ( i - 1 ) + 1 ) + 2 * ( i - 1 ) - uWed * btm * btm;
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos + posOffs1 );
							
						}
						
						if( i < top ) {
							
							fIdx = fOffs + uWed * i * i + w * ( 2 * i + 1 ) + 2 * i - 1 - uWed * btm * btm;
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos );
							
							fIdx ++;
							
							fPos = fIdx * 9;
							
							vFace.push( fPos );
							vPos.push( fPos );
							
							
						}
						 
						g.vertexFaces.push( vFace );
						g.vertexPositions.push( vPos );
						
					}
					
				}
				
			}
			
			// calculate uv's 
			
			for ( var i = btm === 0 ? 1 : btm; i <= top; i ++ ) {
				
				nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					// nji = j / ( i * wed );
					
					phi = 2 * Math.PI * j / ( i * wed ) + phiOffset;
					
					// ux = 0.5 * ( 1 - nih * Math.sin( phi ) ); // mirrored
					ux = 0.5 * ( 1 - sn * nih * Math.sin( phi ) );
					uy = 0.5 * ( 1 + nih * Math.cos( phi ) );
					
					storePosUvs();
					
					vIdx ++;
					
				}
				
			}
		
		}
		
		function createWedge( sn, iMax, fOffset ) {
			
			var top;
			var btm;
			
			if ( sn === SOUTH ) {
				
				top = topS;
				btm = bottomS;
				
			} else {
				
				top = topN;
				btm = bottomN;
				
			}
			
			// center
			
			vFace = [];
			vPos = [];
			
			for ( var i = 0; i < iMax; i ++ ) {
				
				fIdx = fOffset + i;
				fPos = fIdx * 9;
				
				vFace.push( fPos );
				vPos.push( fPos );
				
			}
			
			g.vertexFaces.push( vFace );
			g.vertexPositions.push( vPos );
			
			// periphery: faces, positions
			
			for ( var i = 0; i <= iMax; i ++ ) {
				
				vFace = [];
				vPos = [];
				
				if ( i > 0 ) {
					
					fIdx = fOffset + i - 1;
					fPos = fIdx * 9;
					
					vFace.push( fPos );
					vPos.push( fPos + c );
					
				}
				
				if ( i < iMax ) {
					
					fPos = ( fOffset + i ) * 9;
					
					vFace.push( fPos );
					vPos.push( fPos + b );
					
				}
				
				g.vertexFaces.push( vFace );
				g.vertexPositions.push( vPos );
				
			}
			
			// calculate uv's
			
			ux = 0.5;
			uy = 0.5 * ( 1 + Math.sin( sn * Math.PI / 2 * ( 1 - top / eqt ) ) );
			
			storePosUvs();
			
			vIdx ++;
			
			for ( var i = top; i > ( btm > 0 ? btm - 1 : 0 ); i -- ) {
				
				theta = sn * Math.PI / 2 * (1 - i / eqt);
				
				ux = 0.5 * ( 1  + sn * Math.cos( theta ) );
				uy = 0.5 * ( 1 + Math.sin( theta ) );
				
				storePosUvs();
				
				vIdx ++;
				
			}
			
			ux = 0.5;
			uy = 0.5 * ( 1 + Math.sin( sn * Math.PI / 2 * ( 1 - btm / eqt ) ) );
			
			storePosUvs();
			
			vIdx ++;
			
			for ( var i = btm > 0 ? btm : 1; i <= top; i ++ ){
				
				theta = sn * Math.PI / 2 * ( 1 - i / eqt );
				
				ux = 0.5 * ( 1 - sn * Math.cos( theta ) );
				uy = 0.5 * ( 1 + Math.sin( theta ) );
				
				storePosUvs();
				
				vIdx ++;
				
			}
			
		}
		
		// ....................................................................
		
		// faces south hemisphere
		
		if ( g.bottom < eqt ) {
			
			if ( bottomS === 0 || g.withBottom ) {
				
				jMax = bottomS === 0 ? uWed : bottomS * uWed;
				
				createCenter( jMax, 0 ); //  start with face 0
				
			}
			
			vIdx = g.southVertex;
			
			createSouthNorth( SOUTH );
			
			if ( g.top <= eqt && g.withTop ) {
				
				jMax = topS * uWed + 1;
				
				createPlane( SOUTH, jMax, g.southTopFace );
				
				jMax = topS * uWed;
				
				createCenter( jMax, g.southTopFace );
				
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				iMax = ( topS - ( bottomS > 0 ? bottomS - 1 : 0 ) ) * 2;
				
				createWedge( SOUTH, iMax, g.southWedgeFace );
				
			}
			
		}
		
		// faces north hemisphere
		
		if ( g.top > eqt ) {
			
		 	if ( bottomN === 0 || g.withTop ) {
				
				jMax = bottomN === 0 ? uWed : bottomN * uWed;
				
				createCenter( jMax, g.faceNorthOffset );
				
			}
			
			vIdx = g.northVertex;
			
			createSouthNorth( NORTH );
			
			if ( g.bottom >= eqt && g.withBottom ) {
				
				jMax = topN * uWed + 1;
				
				createPlane( NORTH, jMax, g.northBottomFace );
				
				jMax = topN * uWed;
				
				createCenter( jMax, g.northBottomFace );
				
			}
			
			if ( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				iMax = ( topN - ( bottomN > 0 ? bottomN - 1 : 0 ) ) * 2;
				
				createWedge( NORTH, iMax, g.northWedgeFace );
				
			}
			
		}
		
		// store wedge index south hemisphere
		
		if ( g.bottom < eqt && ( !g.wedgeOpen || uWed === wed ) ) {
			
			vIdx = g.southVertex;
			
			for ( var i = bottomS === 0 ? 1 : bottomS; i <= topS; i ++ ) {
				
				// nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( j === 0 ) {
						
						g.wedgeSouthEndIdx[ seIdx ] = vIdx;
						seIdx ++;
						
					}
					
					if ( j === i * uWed ) {
						
						g.wedgeSouthStartIdx[ ssIdx ] = vIdx;
						ssIdx --;
						
					}
					
					vIdx ++;
					
				}
				
			}
			
		}
		
		// store wedge index north hemisphere
		
		if ( g.top > eqt && ( !g.wedgeOpen || uWed === wed ) ) {
			
			vIdx = g.northVertex;
			
			for ( var i = bottomN === 0 ? 1 : bottomN; i <= topN; i ++ ) {
				
				// nih = i / eqt;
				
				for ( var j = 0; j < i * uWed + 1; j ++ ) {
					
					if ( j === 0 ) {
						
						g.wedgeNorthStartIdx[ nsIdx ] = vIdx;
						nsIdx --;
						
					}
					
					if ( j === i * uWed ) {
						
						g.wedgeNorthEndIdx[ neIdx ] = vIdx;
						neIdx ++;
						
					}
					
					vIdx ++;
					
				}
				
			}
			
		}
		
		// write groups for multi material
		
		for ( var f = 0 , p = 0; f < g.faceCount ; f ++, p += 3 ) {
			
			g.addGroup( p, 3, 1 ); // default material index is 0.1 * 10 = 1
			
		}
		
	}
	
}

function morphVertices( time ) {
	
	var t = time !== undefined ? time : 0;
	
	g = this;
	
	var eqt = g.equator;
	var eq2 = eqt * 2;
	var wed = g.wedges;
	var uWed = g.usedWedges;
	var vIdx;			// vertex index
	var r, ry, r0, r1, r1y, r2;			// calculated radius
	var x, x0, x1, x2, y, y0, y1, y2, z, z0, z1, z2;	// coordinates
	var dx, dy, dz;
	var ni, nih, nji, iMin, iMax, jMin, jMax;;
	var posIdx, posIdx0;
	var theta, thetaSq;
	var phi;
	var scalingAzimuth, scalingPole;
	var phiOffset = Math.PI * ( 1 - uWed / wed);
	
	var lenV;				// length of vector
	var f1Vec = {};
	var f2Vec = {};
	var normal = {};
	var wL;
	
	var nX, nX1, nX2; // normals
	var nY, nY1, nY2;
	var nZ, nZ1, nZ2;
	
	var vS;
	var vN;
	
	var bottomS = g.bottom; 					// bottom south	hemisphere
	var topS = Math.min( eqt, g.top ); 			// top south	hemisphere
	var bottomN = eq2 - g.top; 					// bottom north	hemisphere
	var topN = Math.min( eqt, eq2 - g.bottom);	// top north	hemisphere
	
	var qSq, alphaSq, rSq, hSq, cSq; // squeeze
	
	var bottomSCount = bottomS * wed;
	var topSCount = topS * wed;
	var topNCount = topN * wed;
	var bottomNCount = bottomN * wed;
	
	var xBottomS = 0;
	var yBottomS = 0;
	var zBottomS = 0;
	
	var xBottomN = 0;
	var yBottomN = 0;
	var zBottomN = 0;
	
	var xPlaneS = 0;
	var yPlaneS = 0;
	var zPlaneS = 0;
	
	var xPlaneN = 0;
	var yPlaneN = 0;
	var zPlaneN = 0;
	
	var sumBottomS;
	var sumPlaneS;
	var sumBottomN;
	var sumPlaneN;
	
	var sumCircle;
	
	var xPole;
	var yPole;
	var zPole;
	
	var startPole;
	var endPole;
	
	var pi2 = Math.PI / 2;
	
	const SOUTH = -1;
	const NORTH = 1;
	const BOTTOM = 0;
	const TOP = 1;
	
	function xyzCalculation( sn ) {
		
		// sn: SOUTH or NORTH
		
		scalingAzimuth = g.startAzimuth( ni, t ) + ( g.endAzimuth( ni, t ) - g.startAzimuth( ni, t ) ) * g.scaleAzimuth( nji, t );
		 
		phi = 2 * Math.PI * uWed / wed * scalingAzimuth + ( ( ni === 0 || ni === 1 ) ? 0 : phiOffset );
		
		if ( g.scaleH ) {
			
			// scaling between pole and equator (start- and endPole) per hemisphere --> south is like north
			
			theta = sn * pi2 * g.scalePoleHSE( nji, nih, t );
			
		} else {
			
			// scaling of the sphere between south and north (start- and endPole) with decomposed function
			
			theta = sn * pi2 * ( 1 - ( sn === SOUTH ? g.scalePoleS( nji, nih, t ) : g.scalePoleN( nji, nih, t ) ) );
			
		}
		
		if ( g.style === "map" ) {
			
			r = pi2 * g.radius;
			
			x = r * nih * Math.cos( phi );
			y = sn * ( Math.sign( theta ) + Math.sign( Math.PI - phi ) ) * 0.01; // overlap
			z = -r * nih * Math.sin( phi ) + sn * r;
			
		}
		
		if ( g.style === "relief" ) {
			
			r0 = pi2 * g.radius;
			r1 = pi2 * g.radius * g.rAzimuthPole( nji, ni, t );
			
			x = r1 * Math.cos( theta ) * Math.cos( phi ) + pi2 * g.radius * g.moveX( nji, ni, t );
			
			y0 = r0 * Math.sin( theta );
			y1 = r1 * Math.sin( theta );
			y1 *= ( sn === SOUTH ? g.stretchSouth( nji, nih, t ) : g.stretchNorth( nji, nih, t ) );
			y1 += pi2 * g.radius * g.moveY( nji, ni, t ) ;
			y = y1 - y0 ;
			
			z = -r1 * Math.cos( theta ) * Math.sin( phi ) +  sn * r0 + pi2 * g.radius * g.moveZ( nji, ni, t );
			
		}
		
		if ( g.style === "complete" && g.squeezeDefault ) {
			
			r = g.radius * g.rAzimuthPole( nji, ni, t );
			
			x = r * Math.cos( theta ) * Math.cos( phi ) + g.radius * g.moveX( nji, ni, t );
			
			y =  r * Math.sin( theta );
			y *= ( sn === SOUTH ? g.stretchSouth( nji, nih, t ) : g.stretchNorth( nji, nih, t ) );
			y += g.radius * ( sn * g.equatorGap( nji, t ) / 2 + g.moveY( nji, ni, t ) );
			
			z = -r * Math.cos( theta ) * Math.sin( phi ) + g.radius * g.moveZ( nji, ni, t );
			
		} 
		
		if ( g.style === "complete" && !g.squeezeDefault ) {
			
			// squeeze
			
			r0 = g.radius;
			
			x0 = r0 * Math.cos( theta ) * Math.cos( phi );
			y0 = r0 * Math.sin( theta );
			z0 = -r0 * Math.cos( theta ) * Math.sin( phi );
			
			r1 = g.radius * g.rAzimuthPole( nji, ni, t );
			
			x1 = r1 * Math.cos( theta ) * Math.cos( phi ) + g.radius * g.moveX( nji, ni, t );
			
			y1 = r1 * Math.sin( theta );
			y1 *= ( sn === SOUTH ? g.stretchSouth( nji, nih, t ) : g.stretchNorth( nji, nih, t ) );
			y1 += g.radius * ( sn * g.equatorGap( nji, t ) / 2 + g.moveY( nji, ni, t ) );
			
			z1 = -r1 * Math.cos( theta ) * Math.sin( phi ) + g.radius * g.moveZ( nji, ni, t );
			
			dx = x1 - x0;
			dy = y1 - y0;
			dz = z1 - z0;
			
			qSq = 1 - g.squeeze( nji, t );
			
			if ( qSq === 0 ) qSq = 0.00001;			// prevent division by zero
			
			alphaSq = qSq * pi2;								// squeeze angle 
			rSq = 1 / qSq;										// radius squeeze circle 
			hSq = pi2 / alphaSq * ( 1 - Math.cos( alphaSq ) );	// height (squeezed)
			cSq = rSq - hSq;									// center(y)squeeze circle
			
			r2  = r0 * rSq;
			
			thetaSq = sn * (  pi2 - alphaSq ) +  alphaSq * theta / pi2 ;
			
			x2 = r2 * Math.cos( thetaSq ) * Math.cos( phi );
			y2 = r2 * Math.sin( thetaSq ) - sn * r0 * cSq;
			z2 = -r2 * Math.cos( thetaSq ) * Math.sin( phi );
			
			x = x2 + dx;
			y = y2 + dy;
			z = z2 + dz;
			
		}
		
	}
	
	// ...................................................................
	
	if ( g.isGeometry ) {
		
		function poleVertexSet( sn ) {
			
			if ( sn === SOUTH ) {
				
				if ( bottomS === 0 ) {
					
					nih = 0.0001; // number i hemisphere, 0 pole
					ni = 0.00005; // south pole 0
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( SOUTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomS / bottomSCount;
					y = yBottomS / bottomSCount;
					z = zBottomS / bottomSCount;
					
				}
				
			}
			
			if ( sn === NORTH ) {
				
				if ( bottomN  === 0 ) {
					
					nih = 0.0001; //  number i hemisphere, 0 pole
					ni = 0.99995;  // north pole 1
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( NORTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomN / bottomNCount;
					y = yBottomN / bottomNCount;
					z = zBottomN / bottomNCount;
					
				}
				
			}
			
			g.vertices[ vIdx ].set( x, y, z );
			vIdx ++;
			
		}
		
		function vertexSet( sn ) {
			
			sumBottomS = sn === SOUTH && i === bottomS && i > 0 && ( g.withBottom || !g.wedgeOpen);
			sumPlaneS = sn === SOUTH && i === topS && i <= eqt && ( g.withTop || !g.wedgeOpen );
			sumBottomN = sn === NORTH && i === bottomN && i > 0 && ( g.withTop || !g.wedgeOpen );
			sumPlaneN = sn === NORTH && i === topN && i <= eqt  && ( g.withBottom || !g.wedgeOpen );
			
			sumCircle = sumBottomS || sumPlaneS || sumBottomN || sumPlaneN;
			
			var jMax =  sumCircle ? i * wed + 1 : i * uWed + 1;
			
			nih = i / eqt; //  number i hemisphere, 0 pole to 1 equator
			
			ni = sn === SOUTH ? nih / 2 : 0.5 + ( 1 - nih ) / 2; //  south pole 0 to north pole 1
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				nji = j / ( i * uWed );
				
				xyzCalculation( sn );
				
				// saving the cumulative sum of positions
				
				if ( sumBottomS && j < jMax - 1 ) {
					
					xBottomS += x;
					yBottomS += y;
					zBottomS += z;
					
				}
				
				if ( sumPlaneS && j < jMax - 1 ) {
					
					xPlaneS += x;
					yPlaneS += y;
					zPlaneS += z;
					
				 }
				
				if ( sumBottomN && j < jMax - 1 ) {
					
					xBottomN += x;
					yBottomN += y;
					zBottomN += z;
					
				}
				
				if ( sumPlaneN && j < jMax - 1 ) {
					
					xPlaneN += x;
					yPlaneN += y;
					zPlaneN += z;
					
				}
				
				// store only the used wedges
				
				if ( j < i * uWed + 1 ) {
					
					g.vertices[ vIdx ].set( x, y, z );
					
					vIdx ++;
					
				} 
				
			}
			
		}
		
		function edgeVertexSet( sn ) {
			
			var jMax = sn === SOUTH ? g.top * uWed + 1 : topN * uWed + 1;
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				g.vertices[ vIdx ] = g.vertices[ vIdx - jMax ];
				vIdx ++;
				
			}
			
		}
		
		function planeCenterVertexSet( sn ) {
			
			if ( sn === SOUTH ) {
				
				x = xPlaneS / topSCount;
				y = yPlaneS / topSCount;
				z = zPlaneS / topSCount;
				
			}
			
			if ( sn === NORTH ) {
				
				x = xPlaneN / topNCount;
				y = yPlaneN / topNCount;
				z = zPlaneN / topNCount;
				
			}
			
			g.vertices[ vIdx ].set( x, y, z );
			vIdx ++;
			
		}
		
		function wedgeVertexSet( sn, startIdxArray, endIdxArray ) {
			
			planeCenterVertexSet( sn );
			
			for ( var wIdx = 0; wIdx < startIdxArray.length; wIdx ++ ) {
				
				g.vertices[ vIdx ] = g.vertices[ startIdxArray[ wIdx ] ];
				vIdx ++;
				
			}
			
			poleVertexSet( sn );
			
			for ( var wIdx = 0; wIdx < endIdxArray.length; wIdx ++ ) {
				
				g.vertices[ vIdx ] = g.vertices[ endIdxArray[ wIdx ] ];
				vIdx ++;
				
			}
			
		}
		
		g.verticesNeedUpdate  = true;
		
		// vertex positions south hemisphere
		
		if ( g.bottom < eqt ) {
			
			vIdx = g.southVertex;			// begin:  some values are stored for bottom
			
			for ( var i = ( bottomS === 0) ? 1 : bottomS; i <= topS; i ++ ) {
				
				vertexSet( SOUTH );
				
			}
			
			if ( bottomS === 0 || g.withBottom ) {
				
				vIdx = 0;
				poleVertexSet( SOUTH );		// uses values from setVertex()
				
			}
			
			if ( g.top <= eqt && g.withTop ) {
				
				vIdx = g.southTopVertex + 1;  // a, c, b face
				
				edgeVertexSet( SOUTH );
				planeCenterVertexSet( SOUTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				wedgeVertexSet( SOUTH, g.wedgeSouthStartIdx, g.wedgeSouthEndIdx );
				
			}
			
		}
		
		// vertex positions north hemisphere
		
		if ( g.top > eqt  ) {
			
			vIdx = g.northVertex;
			
			for ( var i = ( bottomN === 0 ) ? 1 : bottomN; i <= topN; i ++ ) {
				
				vertexSet( NORTH );
				
			}
			
			if ( bottomN === 0 || g.withTop ) { 
				
				vIdx = g.vertexNorthOffset;
				
				poleVertexSet( NORTH ); // north: from top to bottom! // uses values from setVertex()
				
			}
			
			if ( g.bottom >= eqt && g.withBottom ) {
				
				vIdx = g.northBottomVertex + 1; // a, c, b face
				
				edgeVertexSet( NORTH );
				planeCenterVertexSet( NORTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				wedgeVertexSet( NORTH, g.wedgeNorthStartIdx, g.wedgeNorthEndIdx );
				
			}
			
		}
		
		g.computeVertexNormals(); // in this case by three.js and then ... ( seams  ???  )
		
	}
	
	if ( g.isBufferGeometry && g.indexed ) {
		
		function storeVertex() {
			
			posIdx = vIdx * 3;
			
			g.vertices[ posIdx ] = x;
			g.vertices[ posIdx + 1 ] = y;
			g.vertices[ posIdx + 2 ] = z;
			
		}
		
		function setPoleVertex( sn ) {
			
			if ( sn === SOUTH ) {
				
				if ( bottomS === 0 ) {
					
					nih = 0.0001; // number i hemisphere, 0 pole
					ni = 0.00005; // south pole 0
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( SOUTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomS / bottomSCount;
					y = yBottomS / bottomSCount;
					z = zBottomS / bottomSCount;
					
				}
				
			}
			
			if ( sn === NORTH ) {
				
				if ( bottomN  === 0 ) {
					
					nih = 0.0001; // number i hemisphere, 0 pole
					ni = 0.99995;  // north pole 1
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( NORTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomN / bottomNCount;
					y = yBottomN / bottomNCount;
					z = zBottomN / bottomNCount;
					
				}
				
			}
			
			storeVertex();
			vIdx ++;
			
		}
		
		function setVertex( sn ) {
			
			sumBottomS = sn === SOUTH && i === bottomS && i > 0 && ( g.withBottom || !g.wedgeOpen);
			sumPlaneS = sn === SOUTH && i === topS && i <= eqt && ( g.withTop || !g.wedgeOpen );
			sumBottomN = sn === NORTH && i === bottomN && i > 0 && ( g.withTop || !g.wedgeOpen );
			sumPlaneN = sn === NORTH && i === topN && i <= eqt  && ( g.withBottom || !g.wedgeOpen );
			
			sumCircle = sumBottomS || sumPlaneS || sumBottomN || sumPlaneN;
			
			var jMax =  sumCircle ? i * wed + 1 : i * uWed + 1;
			
			nih = i / eqt; //  number i hemisphere, 0 pole to 1 equator
			
			ni = sn === SOUTH ? nih / 2 : 0.5 + ( 1 - nih ) / 2; //  south pole 0 to north pole 1 
			
			for ( var j = 0; j < jMax; j ++ ) { 
				
				nji = j / ( i * uWed );
				
				xyzCalculation( sn );
				
				// saving the cumulative sum of positions
				
				if ( sumBottomS && j < jMax - 1 ) {
					
					xBottomS += x;
					yBottomS += y;
					zBottomS += z;
					
				}
				
				if ( sumPlaneS && j < jMax - 1 ) {
					
					xPlaneS += x;
					yPlaneS += y;
					zPlaneS += z;
					
				}
				
				if ( sumBottomN && j < jMax - 1 ) {
					
					xBottomN += x;
					yBottomN += y;
					zBottomN += z;
					
				}
				
				if ( sumPlaneN && j < jMax - 1 ) {
					
					xPlaneN += x;
					yPlaneN += y;
					zPlaneN += z;
					
				}
				
				// store only the used wedges
				
				if ( j < i * uWed + 1 ) {
					
					storeVertex();
					vIdx ++;
					
				}
				
			}
			
		}
		
		function setEdgeVertex( sn ) {
			
			var jMax = sn === SOUTH ? g.top * uWed + 1 : topN * uWed + 1;
			var referencePos;
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				posIdx = vIdx * 3;
				referencePos = posIdx - jMax * 3;
				
				g.vertices[ posIdx ]  = g.vertices[ referencePos ];	 // x;
				g.vertices[ posIdx + 1 ]  = g.vertices[ referencePos + 1 ]; // y;
				g.vertices[ posIdx + 2 ]  = g.vertices[ referencePos + 2 ]; //z;
				
				vIdx ++;
				
			}
			
		}
		
		function setPlaneCenterVertex( sn ) {
			
			if ( sn === SOUTH ) {
				
				x = xPlaneS / topSCount;
				y = yPlaneS / topSCount;
				z = zPlaneS / topSCount;
				
			}
			
			if ( sn === NORTH ) {
				
				x = xPlaneN / topNCount;
				y = yPlaneN / topNCount;
				z = zPlaneN / topNCount;
				
			}
			
			storeVertex();
			vIdx ++;
			
		}
		
		function setWedgeVertex( sn, startIdxArray, endIdxArray ) {
			
			setPlaneCenterVertex( sn );
		
			for ( var wIdx = 0; wIdx < startIdxArray.length; wIdx ++ ) {
				
				posIdx =  vIdx * 3;
				
				g.vertices[ posIdx ]  = g.vertices[ startIdxArray[ wIdx ] ]; // x
				g.vertices[ posIdx + 1 ]  = g.vertices[ startIdxArray[ wIdx ] + 1 ]; //y
				g.vertices[ posIdx + 2 ]  = g.vertices[ startIdxArray[ wIdx ] + 2 ]; //z
				
				vIdx ++;
				
			}
			
			setPoleVertex( sn );
			
			for ( var wIdx = 0; wIdx < endIdxArray.length; wIdx ++ ) {
				
				posIdx =  vIdx * 3;
				
				g.vertices[ posIdx ]  = g.vertices[ endIdxArray[ wIdx ] ]; // x 
				g.vertices[ posIdx + 1 ]  = g.vertices[ endIdxArray[ wIdx ] + 1 ]; //y
				g.vertices[ posIdx + 2 ]  = g.vertices[ endIdxArray[ wIdx ] + 2 ]; //z
				
				vIdx ++;
				
			}
			
		}
		
		function preventTheWedgeSeam( sn ) {
			
			var d;
			var wEndIdx;
			var wStartIdx;
			
			if ( sn === SOUTH ) {
				
				wEndIdx	= g.wedgeSouthEndIdx;
				wStartIdx = g.wedgeSouthStartIdx;
				
			} else {
				
				wEndIdx	= g.wedgeNorthEndIdx;
				wStartIdx = g.wedgeNorthStartIdx;
				
			}
			
			for ( var wIdx = 0; wIdx < wL; wIdx ++ ) {
				
				x1 = g.vertices[ wEndIdx[ wIdx ] ];
				y1 = g.vertices[ wEndIdx[ wIdx ] + 1 ];
				z1 = g.vertices[ wEndIdx[ wIdx ] + 2 ];
				
				x2 = g.vertices[ wStartIdx[ wL - wIdx - 1 ] ];
				y2 = g.vertices[ wStartIdx[ wL - wIdx - 1 ] + 1 ];
				z2 = g.vertices[ wStartIdx[ wL - wIdx - 1 ] + 2 ];
				
				d = Math.sqrt( ( x2 - x1 ) * ( x2 - x1 ) + ( y2 - y1 ) * ( y2 - y1 ) + ( z2 - z1 ) * ( z2 - z1 ) );
				
				if ( d <  g.radius * 0.01 ) {
					
					nX1 = g.normals[ wEndIdx[ wIdx ] ];
					nY1 = g.normals[ wEndIdx[ wIdx ] + 1 ];
					nZ1 = g.normals[ wEndIdx[ wIdx ] + 2 ];
					
					nX2 = g.normals[ wStartIdx[ wL - wIdx - 1 ] ];
					nY2 = g.normals[ wStartIdx[ wL - wIdx - 1 ] + 1 ];
					nZ2 = g.normals[ wStartIdx[ wL - wIdx - 1 ] + 2 ];
					
					nX = ( nX1 + nX2 ) / 2;
					nY = ( nY1 + nY2 ) / 2;
					nZ = ( nZ1 + nZ2 ) / 2;
					
					g.normals[ wEndIdx[ wIdx ] ] = nX;
					g.normals[ wEndIdx[ wIdx ] + 1 ] = nY;
					g.normals[ wEndIdx[ wIdx ] + 2 ] = nZ;
					
					g.normals[ wStartIdx[ wL - wIdx - 1 ] ] = nX;
					g.normals[ wStartIdx[ wL - wIdx - 1 ] + 1 ] = nY;
					g.normals[ wStartIdx[ wL - wIdx - 1 ] + 2 ] = nZ;
					
				}
				
			}
			
		}
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		// vertex positions south hemisphere
		
		if ( g.bottom < eqt ) {
		
			vIdx = g.southVertex;			// begin:  some values are stored for bottom
			
			for ( var i = ( bottomS === 0) ? 1 : bottomS; i <= topS; i ++ ) {
				
				setVertex( SOUTH );
				
			}
			
			if ( bottomS === 0 || g.withBottom ) {
				
				vIdx = 0;
				setPoleVertex( SOUTH );		// uses values from setVertex()
				
			}
			
			if ( g.top <= eqt && g.withTop ) {
				
				vIdx = g.southTopVertex + 1; // a, c, b face
				
				setEdgeVertex( SOUTH );
				setPlaneCenterVertex( SOUTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				setWedgeVertex( SOUTH, g.wedgeSouthStartIdx, g.wedgeSouthEndIdx );
				
			}
			
		}
		
		// vertex positions north hemisphere
		
		if ( g.top > eqt ) {
			
			vIdx = g.northVertex;
			
			for ( var i = ( bottomN === 0 ) ? 1 : bottomN; i <= topN; i ++ ) {
				
				setVertex( NORTH );
				
			}
			
			if ( bottomN === 0  || g.withTop ) {
				
				vIdx = g.vertexNorthOffset;
				
				setPoleVertex( NORTH ); // north: from top to bottom! // uses values from setVertex()
				
			}
			
			if ( g.bottom >= eqt && g.withBottom ) {
				
				vIdx = g.northBottomVertex + 1; // a, c, b face
				
				setEdgeVertex( NORTH );
				setPlaneCenterVertex( NORTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				setWedgeVertex( NORTH, g.wedgeNorthStartIdx, g.wedgeNorthEndIdx );
				
			}
			
		}
		
		g.computeVertexNormals(); // in this case by three.js and then ...
		
		// ... edit normals: mean of equator normals, prevents a seam
		
		if ( g.bottom < eqt && g.top > eqt ) {
			
			for ( var vS = g.southTopVertex, vN = g.northBottomVertex; vS >= g.southTopVertex - eqt * uWed ; vS --, vN -- ) {
				
				nX = ( g.normals[ vS * 3 ] + g.normals[ vN * 3 ] ) / 2;
				nY = ( g.normals[ vS * 3 + 1 ] + g.normals[ vN * 3 + 1 ] ) / 2;
				nZ = ( g.normals[ vS * 3 + 2 ] + g.normals[ vN * 3 + 2 ] ) / 2;
				
				g.normals[ vS * 3 ]  = nX;
				g.normals[ vS * 3 + 1 ] = nY;
				g.normals[ vS * 3 + 2 ] = nZ;
				
				g.normals[ vN * 3 ] = nX;
				g.normals[ vN * 3 + 1 ] = nY;
				g.normals[ vN * 3 + 2 ] = nZ;
				
			}
			
		}
		
		// ... edit normals: sometimes mean value of the normals of start and end wedge, prevents a seam
		
		if ( wed === uWed ) {
			
			if ( g.bottom < eqt ) {
				
				wL = g.wedgeSouthEndIdx.length;
				
				preventTheWedgeSeam( SOUTH );
				
			}
			
			if ( g.top > eqt ) {
				
				wL = g.wedgeNorthEndIdx.length;
				
				preventTheWedgeSeam( NORTH );
				
			}
			
		}
		
	}
	
	if ( g.isBufferGeometry && !g.indexed ) {
		
		function storeVertexPositions() {
			
			for ( var p = 0; p < g.vertexPositions[ vIdx ].length; p ++ ) {
				
				g.positions[ g.vertexPositions[ vIdx ][ p ] ] = x;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 1 ] = y;
				g.positions[ g.vertexPositions[ vIdx ][ p ] + 2 ] = z;
				
			}
			
		}
		
		function setPoleVertexPositions( sn ) {
			
			if ( sn === SOUTH ) {
				
				if ( bottomS === 0 ) {
					
					nih = 0.0001; // number i hemisphere, 0 pole
					ni = 0.00005; // south pole 0
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( SOUTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomS / bottomSCount;
					y = yBottomS / bottomSCount;
					z = zBottomS / bottomSCount;
					
				}
				
			}
			
			if ( sn === NORTH ) {
				
				if ( bottomN  === 0 ) {
					
					nih = 0.0001; // number i hemisphere, 0 pole
					ni = 0.99995;  // north pole 1
					
					xPole = 0;
					zPole = 0;
					
					for ( var j = wed - 1; j >= 0; j -- ) {
						
						nji = j / wed ;
						xyzCalculation( NORTH );
						
						xPole += x;
						zPole += z;
						
					}
					
					x = xPole / wed;
					x = xPole / wed;
					
				} else {
					
					x = xBottomN / bottomNCount;
					y = yBottomN / bottomNCount;
					z = zBottomN / bottomNCount;
					
				}
				
			}
			
			storeVertexPositions();
			vIdx ++;
			
		}
			
		function setVertexPositions( sn ) {
			
			sumBottomS = sn === SOUTH && i === bottomS && ( g.withBottom || !g.wedgeOpen);
			sumPlaneS = sn === SOUTH && i === topS && ( g.withTop || !g.wedgeOpen );
			sumBottomN = sn === NORTH && i === bottomN && ( g.withTop || !g.wedgeOpen );
			sumPlaneN = sn === NORTH && i === topN && ( g.withBottom || !g.wedgeOpen );
			
			sumCircle = sumBottomS || sumPlaneS || sumBottomN || sumPlaneN;
			
			var jMax = sumCircle ? i * wed + 1 : i * uWed + 1;
			
			nih = i / eqt; // number i hemisphere, 0 pole to 1 equator
			
			ni = sn === SOUTH ? nih / 2 : 0.5 + ( 1 - nih ) / 2; // south pole 0 to north pole 1
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				nji = j / ( i * uWed );
				
				xyzCalculation( sn );
				
				// saving the cumulative sum of positions
				
				if ( sumBottomS && j < jMax - 1 ) {
					
					xBottomS += x;
					yBottomS += y;
					zBottomS += z;
					
				}
				
				if ( sumPlaneS&& j < jMax - 1 ) {
					
					xPlaneS += x;
					yPlaneS += y;
					zPlaneS += z;
					
				 }
				
				if ( sumBottomN&& j < jMax - 1 ) {
					
					xBottomN += x;
					yBottomN += y;
					zBottomN += z;
					
				}
				
				if ( sumPlaneN&& j < jMax - 1 ) {
					
					xPlaneN += x;
					yPlaneN += y;
					zPlaneN += z;
					
				}
				
				// store only the used wedges
				
				if ( j < i * uWed + 1 ) {
					
					storeVertexPositions();
					vIdx ++;
					
				}
				
			}
			
		}
		
		function setEdgeVertexPositions( sn ) {
			
			var jMax = sn === SOUTH ? g.top * uWed + 1 : topN * uWed + 1;
			var referenceIdx;
			
			for ( var j = 0; j < jMax; j ++ ) {
				
				referenceIdx = vIdx - jMax; // diffrence to edge
				
				x = g.positions[ g.vertexPositions[ referenceIdx ][ 0 ] ];
				y = g.positions[ g.vertexPositions[ referenceIdx ][ 0 ] + 1 ];
				z = g.positions[ g.vertexPositions[ referenceIdx ][ 0 ] + 2 ];
				
				storeVertexPositions();
				vIdx ++;
				
			}
			
		}
		
		function setPlaneCenterVertexPositions( sn ) {
			
			if ( sn === SOUTH ) {
				
				x = xPlaneS / topSCount;
				y = yPlaneS / topSCount;
				z = zPlaneS / topSCount;
				
			} else {
				
				x = xPlaneN / topNCount;
				y = yPlaneN / topNCount;
				z = zPlaneN / topNCount;
				
			}
			
			storeVertexPositions();
			vIdx ++;
			
		}
		
		function setWedgeVertexPositions( sn, startIdxArray, endIdxArray ) {
			
			setPlaneCenterVertexPositions( sn );
			
			for ( var wIdx = 0; wIdx < startIdxArray.length; wIdx ++ ) {
				
				x = g.positions[ g.vertexPositions[ startIdxArray[ wIdx ] ][ 0 ] ];
				y = g.positions[ g.vertexPositions[ startIdxArray[ wIdx ] ][ 0 ] + 1 ];
				z = g.positions[ g.vertexPositions[ startIdxArray[ wIdx ] ][ 0 ] + 2 ];
				
				storeVertexPositions();
				vIdx ++;
				
			}
			
			setPoleVertexPositions( sn );
			
			for ( var wIdx = 0; wIdx < endIdxArray.length; wIdx ++ ) {
				
				x = g.positions[ g.vertexPositions[ endIdxArray[ wIdx ] ][ 0 ] ];
				y = g.positions[ g.vertexPositions[ endIdxArray[ wIdx ] ][ 0 ] + 1 ];
				z = g.positions[ g.vertexPositions[ endIdxArray[ wIdx ] ][ 0 ] + 2 ];
				
				storeVertexPositions();
				vIdx ++;
				
			}
			
		}
		
		function preventWedgeSeam( sn ) {
			
			var d;
			var wEndIdx;
			var wStartIdx;
			
			if ( sn === SOUTH ) {
				
				wEndIdx	= g.wedgeSouthEndIdx;
				wStartIdx = g.wedgeSouthStartIdx;
				
			} else {
				
				wEndIdx	= g.wedgeNorthEndIdx;
				wStartIdx = g.wedgeNorthStartIdx;
				
			}
			
			for ( var wIdx = 0; wIdx < wL; wIdx ++ ) {
				
				x1 = g.positions[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] ];
				y1 = g.positions[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] + 1 ];
				z1 = g.positions[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] + 2 ];
				
				x2 = g.positions[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] ];
				y2 = g.positions[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] + 1 ];
				z2 = g.positions[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] + 2 ];
				
				d = Math.sqrt( ( x2 - x1 ) * ( x2 - x1 ) + ( y2 - y1 ) * ( y2 - y1 ) + ( z2 - z1 ) * ( z2 - z1 ) );
				
				if ( d <  g.radius * 0.01 ) {
					
					nX1 = g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] ];
					nY1 = g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] + 1 ];
					nZ1 = g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ 0 ] + 2 ];
					
					nX2 = g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] ];
					nY2 = g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] + 1 ];
					nZ2 = g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ 0 ] + 2 ];
					
					nX = ( nX1 + nX2 ) / 2;
					nY = ( nY1 + nY2 ) / 2;
					nZ = ( nZ1 + nZ2 ) / 2;
					
					for ( var f = 0; f < g.vertexFaces[ wEndIdx[ wIdx ] ].length; f ++ ) {
						
						g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ f ] ] = nX;
						g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ f ] + 1 ] = nY;
						g.normals[ g.vertexPositions[ wEndIdx[ wIdx ] ][ f ] + 2 ] = nZ;
						
						g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ f ] ] = nX;
						g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ f ] + 1 ] = nY;
						g.normals[ g.vertexPositions[ wStartIdx[ wL - wIdx - 1 ] ][ f ] + 2 ] = nZ;
						
					}
					
				}
				
			}
			
		}
		
		g.attributes.position.needsUpdate = true;
		g.attributes.normal.needsUpdate = true;
		
		// vertex positions south hemisphere
		
		if ( g.bottom < eqt ) {
			
			vIdx = g.southVertex;		// begin:  some values are stored for bottom
			
			for ( var i = ( bottomS === 0) ? 1 : bottomS; i <= topS; i ++ ) {
				
				setVertexPositions( SOUTH );
				
			}
			
			if ( bottomS === 0 || g.withBottom ) {
				
				vIdx = 0;
				setPoleVertexPositions( SOUTH ); // south: from 0 // uses values from setVertexPositions()
				
			}
			
			if ( g.top <= eqt && g.withTop ) {
				
				vIdx = g.southTopVertex + 1; // a, c, b face 
				
				setEdgeVertexPositions( SOUTH );
				setPlaneCenterVertexPositions( SOUTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.southWedgeVertex;
				
				setWedgeVertexPositions( SOUTH, g.wedgeSouthStartIdx, g.wedgeSouthEndIdx );
				
			}
			
		}
		
		// vertex positions north hemisphere
		
		if ( g.top > eqt  ) {
			
			vIdx = g.northVertex;
			
			for ( var i = ( bottomN === 0 ) ? 1 : bottomN; i <= topN; i ++ ) {
				
				setVertexPositions( NORTH );
				
			}
			
			if ( bottomN === 0  || g.withTop ) {
				
				vIdx = g.vertexNorthOffset;
				
				setPoleVertexPositions( NORTH );  // north: from top to bottom!  // uses values from setVertexPositions()
				
			}
			
			if ( g.bottom >= eqt && g.withBottom ) {
				
				vIdx = g.northBottomVertex + 1; // a, c, b face
				
				setEdgeVertexPositions( NORTH );
				setPlaneCenterVertexPositions( NORTH );
				
			}
			
			if( !g.wedgeOpen ) {
				
				vIdx = g.northWedgeVertex;
				
				setWedgeVertexPositions( NORTH, g.wedgeNorthStartIdx, g.wedgeNorthEndIdx );
				
			}
			
		}
		
		// face normals (needed for vertex normals)
		
		g.faceNormals = []; // clear face normals
		
		for ( var f = 0; f < g.faceCount ; f ++ ) {
			
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
			
			// add cross product
			
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
		
		// mean of equator normals, prevents a seam
		
		if ( g.bottom < eqt && g.top > eqt ) {
				
			for ( var vS = g.southTopVertex, vN = g.northBottomVertex; vS >= g.southTopVertex - eqt * uWed ; vS --, vN -- ) {
				
				nX = ( g.normals[ g.vertexPositions [ vS ][ 0 ] ] + g.normals[ g.vertexPositions [ vN ][ 0 ] ] ) / 2;
				nY = ( g.normals[ g.vertexPositions [ vS ][ 0 ] + 1 ] + g.normals[ g.vertexPositions [ vN ][ 0 ] + 1 ] ) / 2;
				nZ = ( g.normals[ g.vertexPositions [ vS ][ 0 ] + 2 ] + g.normals[ g.vertexPositions [ vN ][ 0 ] + 2 ] )  / 2;
				
				for ( var f = 0; f < g.vertexFaces[ vS ].length; f ++ ) {
					
					g.normals[ g.vertexPositions[ vS ][ f ] ] = nX;
					g.normals[ g.vertexPositions[ vS ][ f ] + 1 ] = nY;
					g.normals[ g.vertexPositions[ vS ][ f ] + 2 ] = nZ;
					
				}
				
				for ( var f = 0; f < g.vertexFaces[ vN ].length; f ++ ) {
					
					g.normals[ g.vertexPositions[ vN ][ f ] ] = nX;
					g.normals[ g.vertexPositions[ vN ][ f ] + 1 ] = nY;
					g.normals[ g.vertexPositions[ vN ][ f ] + 2 ] = nZ;
					
				}
				
			}
			
		}
		
		// sometimes mean value of the normals of start and end wedge, prevents a seam
		
		if ( wed === uWed ) {
		
			if ( g.bottom < eqt ) {
				
				wL = g.wedgeSouthEndIdx.length;
				
				preventWedgeSeam( SOUTH );
				
			}
			
			if ( g.top > eqt ) {
				
				wL = g.wedgeNorthEndIdx.length;
				
				preventWedgeSeam( NORTH );
				
			}
			
		}
		
		// explode (only available here for non-indexed BufferGeometry)
		
		if ( !g.explodeDefault ) {
			
			for ( var f = 0; f < g.faceCount; f ++ ) {
				
				for ( var p = 0; p < 3; p ++ ) {
					
					g.positions[ f * 9 + p * 3 ] = g.positions[ f * 9 + p * 3 ] + g.faceNormals[ f * 3 ] * g.radius *  g.explode( t );
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
		
		var eqt = g.equator;
		var eq2 = eqt * 2;
		var wed = g.wedges;
		var uWed = g.usedWedges;
		
		var wedgeFacesCount;
		
		var jMax;
		
		var bottomS = g.bottom; 					// bottom south	hemisphere
		var topS = Math.min( eqt, g.top ); 			// top south	hemisphere
		var bottomN = eq2 - g.top; 					// bottom north	hemisphere
		var topN = Math.min( eqt, eq2 - g.bottom);	// top north	hemisphere
		
		var fIdx = 0;		// face index
		
		var fixMatIdx = 0;	// fixed material Index
		
		if ( g.isGeometry ) {
		
			function overwriteMaterial( ) {
			
				if ( fixMatIdx < g.minFixed ) {
					
					if ( j < g.fixedMaterial[ fixMatIdx ].length ) {
						
						if ( g.fixedMaterial[ fixMatIdx ][ j ] !== "." ) {
							
							g.faces[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j ];
							
						}
						
					}
					
				}
				
			}
			
			g.groupsNeedUpdate = true; // to change materialIndex for multi material
			
			// south hemisphere
			
			if ( g.bottom < eqt  ) {
				
				if ( g.withBottom && ( !g.materialSouthDefault || !g.fixedMaterialDefault ) ) {
					
					for ( var j = 0; j < bottomS * uWed; j ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialSouth( ( j + 0.5 ) / ( bottomS * uWed ), bottomS / eqt, t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.materialSouthDefault || !g.fixedMaterialDefault ) {
					
					fIdx = g.southFace;
					
					for ( var i = bottomS; i < topS; i ++ ) {
						
						jMax = ( 2 * i + 1 ) * uWed;
						
						for ( var j = 0; j < jMax; j ++ ) {
							
							g.faces[ fIdx ].materialIndex = g.materialSouth( ( j + 0.5 ) / jMax , i / eqt, t ); // by function
							
							if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
							
							fIdx ++;
							
						}
						
						fixMatIdx ++;
						
					}
					
				}
				
				if ( g.top <= eqt && g.withTop && ( !g.materialPlaneDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.southTopFace;
					
					for ( var j = 0; j < g.top * uWed; j ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialPlane( ( j + 0.5 ) / ( g.top * uWed ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.wedgeOpen && ( !g.materialWedgeDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.southWedgeFace;
					
					wedgeFacesCount =  2 * ( topS - bottomS )  + ( bottomS > 0 ? 2 : 0 );
					
					for ( var j = 0, i = bottomS; j < wedgeFacesCount; j ++, i ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialWedge(  0.5 * ( 1 + i / ( topS * 2 ) ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
			}
			
			// north hemisphere
			
			if ( g.top > eqt ) {
				
				if ( g.withTop && ( !g.materialNorthDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.faceNorthOffset;
					
					for ( var j = 0; j < bottomN * uWed; j ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialNorth( ( j + 0.5 ) / ( bottomN * uWed ), bottomN / eqt, t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.materialNorthDefault || !g.fixedMaterialDefault ) {
					
					fIdx = g.northFace;
					
					for ( var i = bottomN; i < topN	; i ++ ) {
						
						jMax = ( 2 * i + 1 ) * uWed;
						
						for ( var j = 0; j < jMax; j ++ ) {
							
							g.faces[ fIdx ].materialIndex =  g.materialNorth( ( j + 0.5 ) / jMax, i / eqt, t ); // by function
							
							if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
							
							fIdx ++;
							
						}
						
						fixMatIdx ++;
						
					}
					
				}
				
				if ( g.bottom >= eqt && g.withBottom && ( !g.materialPlaneDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.northBottomFace;
					
					for ( var j = 0; j < topN * uWed; j ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialPlane( ( j + 0.5 ) / (  topN * uWed ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.wedgeOpen && ( !g.materialWedgeDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.northWedgeFace;
					
					wedgeFacesCount = 2 * ( topN - bottomN ) + ( bottomN > 0 ? 2 : 0 );
					
					for ( var j = 0, i = bottomN; j < wedgeFacesCount; j ++, i ++ ) {
						
						g.faces[ fIdx ].materialIndex = g.materialWedge( 0.5 * ( 1 + i / ( topN * 2 ) ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					// fixMatIdx ++;
					
				}
				
			}
			
		}
		
		// indexed and non-indexed BufferGeometry identical
		
		if ( g.isBufferGeometry ) {
		
			function overwriteGroupMaterial( ) {
				
				if ( fixMatIdx < g.minFixed ) {
					
					if ( j < g.fixedMaterial[ fixMatIdx ].length ) {
						
						if ( g.fixedMaterial[ fixMatIdx ][ j ] !== "." ) {
							
							g.groups[ fIdx ].materialIndex = g.fixedMaterial[ fixMatIdx ][ j ];
							
						}
						
					}
					
				}
				
			}
			
			// south hemisphere
			
			if ( g.bottom < eqt  ) {
				
				if ( g.withBottom && ( !g.materialSouthDefault || !g.fixedMaterialDefault ) ) {
					
					for ( var j = 0; j < bottomS * uWed; j ++ ) {
						
						g.groups[ fIdx ].materialIndex = g.materialSouth( ( j + 0.5 ) / ( bottomS * uWed ), bottomS / eqt, t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.materialSouthDefault || !g.fixedMaterialDefault ) {
					
					fIdx = g.southFace;
					
					for ( var i = bottomS; i < topS; i ++ ) {
						
						jMax = ( 2 * i + 1 ) * uWed;
						
						for ( var j = 0; j < jMax; j ++ ) { 
							
							g.groups[ fIdx ].materialIndex = g.materialSouth( ( j + 0.5 ) / jMax , i / eqt, t ); // by function
							
							if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
							
							fIdx ++;
							
						}
						
						fixMatIdx ++;
						
					}
					
				}
				
				if ( g.top <= eqt && g.withTop && ( !g.materialPlaneDefault || !g.fixedMaterialDefault ) ) {
										
					fIdx = g.southTopFace;
					
					for ( var j = 0; j < g.top * uWed; j ++ ) {
						
						g.groups[ fIdx ].materialIndex =  g.materialPlane( ( j + 0.5 ) / ( g.top * uWed ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.wedgeOpen && ( !g.materialWedgeDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.southWedgeFace;
					
					wedgeFacesCount = 2 * ( topS - bottomS )  + ( bottomS > 0 ? 2 : 0 );
					
					for ( var j = 0, i = bottomS; j < wedgeFacesCount; j ++, i ++ ) {
						
						g.groups[ fIdx ].materialIndex = g.materialWedge(  0.5 * ( 1 + i / ( topS * 2 ) ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
			}
			
			// north hemisphere
			
			if ( g.top > eqt ) {
				
				if ( g.withTop && ( !g.materialNorthDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.faceNorthOffset;
					
					for ( var j = 0; j < bottomN * uWed; j ++ ) {
						
						g.groups[ fIdx ].materialIndex =  g.materialNorth( ( j + 0.5 ) / ( bottomN * uWed ), bottomN / eqt, t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.materialNorthDefault || !g.fixedMaterialDefault ) {
					
					fIdx = g.northFace;
					
					for ( var i = bottomN; i < topN	; i ++ ) {
						
						jMax = ( 2 * i + 1 ) * uWed;
						
						for ( var j = 0; j < jMax; j ++ ) {
							
							g.groups[ fIdx ].materialIndex =  g.materialNorth( ( j + 0.5 ) / jMax, i / eqt, t ); // by function
							
							if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
							
							fIdx ++;
							
						}
						
						fixMatIdx ++;
						
					}
					
				}
				
				if ( g.bottom >= eqt && g.withBottom && ( !g.materialPlaneDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.northBottomFace;
					
					for ( var j = 0; j < topN * uWed; j ++ ) {
						
						g.groups[ fIdx ].materialIndex =  g.materialPlane( ( j + 0.5 ) / (  topN * uWed ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					fixMatIdx ++;
					
				}
				
				if ( !g.wedgeOpen && ( !g.materialWedgeDefault || !g.fixedMaterialDefault ) ) {
					
					fIdx = g.northWedgeFace;
					
					wedgeFacesCount =  2 * ( topN - bottomN ) + ( bottomN > 0 ? 2 : 0 );
					
					for ( var j = 0, i = bottomN; j < wedgeFacesCount; j ++, i ++ ) {
						
						g.groups[ fIdx ].materialIndex = g.materialWedge(  0.5 * ( 1 + i / ( topN * 2 ) ), t ); // by function
						
						if ( !g.fixedMaterialDefault ) overwriteGroupMaterial( ); // overwrite by array
						
						fIdx ++;
						
					}
					
					// fixMatIdx ++;
					
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
					vertexNumbers[ n ].quaternion.copy(camera.quaternion);
					
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
					faceNumbers[ n ].quaternion.copy(camera.quaternion);
					
				}
				
			}
			
		}
		
		// indexed BufferGeometry
		
		if ( mesh.geometry.isBufferGeometry && mesh.geometry.indexed ) {
			
			if ( mode === 1 || mode === 3 ) {
				
				for( var n = 0; n < vertexNumbers.length; n ++ ) {
					
					vertexNumbers[ n ].position.set( mesh.geometry.vertices[ 3 * n ], mesh.geometry.vertices[ 3 * n  + 1 ], mesh.geometry.vertices[ 3 * n  + 2 ] );
					vertexNumbers[ n ].quaternion.copy(camera.quaternion);
					
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
					faceNumbers[ n ].quaternion.copy(camera.quaternion);
					
				}
				
			}
			
		}
		
		// non indexed BufferGeometry
		
		if ( mesh.geometry.isBufferGeometry && !mesh.geometry.indexed ) {
			
			if ( mode === 1 || mode === 3 ) {
				
				for( var n = 0; n < vertexNumbers.length; n ++ ) { 
					
					vertexNumbers[ n ].position.set( mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] ], mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] + 1 ], mesh.geometry.positions[ mesh.geometry.vertexPositions[ n ][ 0 ] + 2] );
					vertexNumbers[ n ].quaternion.copy(camera.quaternion);
					
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
					faceNumbers[ n ].quaternion.copy(camera.quaternion);
					
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
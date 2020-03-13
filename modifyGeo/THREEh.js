// THREEh.js ( r88.0 )

/**
 * @author hofk / http://threejs.hofk.de/
*/

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.THREEh = global.THREEh || {})));
}(this, (function (exports) {

'use strict';

//var g;	//  THREE.BufferGeometry

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

	// indexed BufferGeometry
	
	if ( mesh.geometry.isBufferGeometry ) { 
			
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

	// update helper
	
	this.update = function ( mode ) {
	
		var x, y, z;

		// indexed BufferGeometry
		
		if ( mesh.geometry.isBufferGeometry ) {
			
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
		
	}
	
}



exports.vertexFaceNumbersHelper = vertexFaceNumbersHelper;

Object.defineProperty(exports, '__esModule', { value: true });

})));
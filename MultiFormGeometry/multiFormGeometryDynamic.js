// This function is exactly line by line comparable with multiFormGeometryStatic.js
// @author hofk

function multiFormGeometryDynamic( p ) {
    
    //   p = { radius, height, withBottom, withTop, translateX, translateY, translateZ, 
    //           scaleX, scaleY, scaleZ, shearX, shearZ, radialSegments, heightSegments, centerline, outline, torsion, rotateX, rotateY, rotateZ }
 
    const g = new THREE.BufferGeometry( );
    
    const p2i = Math.PI * 2;
    const φ = j => p2i * j / rs; // j === rs => full circle
    
    g.r = ( typeof p.radius === 'number' ? ( x => p.radius ) : p.radius ) || ( x => 0.5 );
    g.h = ( typeof p.height === 'number' ? ( x => p.height ) : p.height ) || ( x => 1.0 );
    
    const wb = p.withBottom !== undefined ? p.withBottom : true;
    const wt = p.withTop !== undefined ? p.withTop : true;
    
    g.trX = ( typeof p.translateX === 'number' ? ( x => p.translateX ) : p.translateX ) || ( x => 0 );
    g.trY = ( typeof p.translateY === 'number' ? ( x => p.translateY ) : p.translateY ) || ( x => 0 );
    g.trZ = ( typeof p.translateZ === 'number' ? ( x => p.translateZ ) : p.translateZ ) || ( x => 0 );
    
    g.scX = ( typeof p.scaleX === 'number' ? ( x => p.scaleX ) : p.scaleX ) || ( x => 1 );
    g.scY = ( typeof p.scaleY === 'number' ? ( x => p.scaleY ) : p.scaleY ) || ( x => 1 );
    g.scZ = ( typeof p.scaleZ === 'number' ? ( x => p.scaleZ ) : p.scaleZ ) || ( x => 1 );
    
    g.shX = ( typeof p.shearX === 'number' ? ( x => p.shearX ) : p.shearX ) || ( x => 0 );
    g.shZ = ( typeof p.shearZ === 'number' ? ( x => p.shearZ ) : p.shearZ ) || ( x => 0 ); 
    
    g.rotX = ( typeof p.rotateX === 'number' ? ( x => p.rotateX ) : p.rotateX ) || ( x => 0 );
    g.rotY = ( typeof p.rotateY === 'number' ? ( x => p.rotateY ) : p.rotateY ) || ( x => 0 );
    g.rotZ = ( typeof p.rotateZ === 'number' ? ( x => p.rotateZ ) : p.rotateZ ) || ( x => 0 );    
    
    const rs = p.radialSegments || 18;
    let hs = p.heightSegments || 18;
    
    const rss = rs + 1;
    let hss = hs + 1; // can be overwritten
    
    const centerline = p.centerline || function( h ) { return { x: 0, z: 0 } }
    const outline = p.outline || ( h => 1.0 );
    
    g.tor = ( typeof p.torsion === 'number' ? ( x => p.torsion ) : p.torsion ) || ( x => 0 ) ;
    
    // process outline ( arrays, functions )
    
    let fh = [];  // height factor
    let fx = [];  // factors for x per hight segment
    let fz = [];  // factors for z per hight segment
    
    if ( Array.isArray( outline ) ) {
        
        if (  Array.isArray( outline[ 0 ] ) ) {
            //  array of some arrays [ height, radius factor ] to calculate outline per CatmullRomCurve3, height [ 0 -> 1 ] with a possible overhang
        
            const ouVecs = new THREE.CatmullRomCurve3( outline.map( p => { return new THREE.Vector3( p[ 0 ], p[ 1 ], 0 ) } ) ).getSpacedPoints( hs );
            
            for ( let i = 0; i < hss; i ++ ) {
            
                fh.push( [] );
                fx.push( [] );
                fz.push( [] );
                
                for ( let j = 0 ; j < rss; j ++ ) {
                    
                    fh[ i ].push( ouVecs[ i ].x );
                    fx[ i ].push( ouVecs[ i ].y );
                    fz[ i ].push( ouVecs[ i ].y );
                    
                }
                
            }
                
        } else { // array of factors for radius per height,   heightSegments result from count - 1, deviating are overwritten
            
            hss = outline.length;  hs = hss - 1; // overwrite other values
            
            for ( let i = 0; i < hss; i ++  ) {
            
                fh.push( [] );
                fx.push( [] );
                fz.push( [] );
                
                for ( let j = 0 ; j < rss; j ++ ) {
                    
                    fh[ i ].push( i / hs );
                    fx[ i ].push( outline[ i ] );
                    fz[ i ].push( outline[ i ] );
                    
                }
            }
            
        }
        
    } else {    // functions ( two variants )
        
        if ( outline ( 0 ).y  === undefined ) { //  h [ 0 -> 1 ] for heightSegments  => factor for radius
            
            for ( let i = 0; i < hss; i ++ ) {
                
                fh.push( [] );
                fx.push( [] );
                fz.push( [] );
                
                const ihs = i / hs;
                
                for ( let j = 0; j < rss; j ++ ) {
                
                    fh[ i ].push( ihs );
                    fx[ i ].push( outline( ihs ) ); 
                    fz[ i ].push( outline( ihs ) );
                    
                }
                
            }
                       
        } else {    // function  h, φ => height segments of different heights  .y, factor for ( radius .r ) or ( .x and .z )        
            
            for ( let i = 0; i < hss; i ++ ) {
                
                fh.push( [] );
                fx.push( [] );
                fz.push( [] );
                
                const ihs = i / hs;           
                
                if ( outline ( 0 ).r  !== undefined ) {  // factor for radius  
                    
                    for ( let j = 0; j < rss; j ++ ) { //  j === rs => φ( j ) === 2*PI full circle
                    
                        fx[ i ].push( outline( ihs, φ( j ) ).r );
                        fh[ i ].push( outline( ihs, φ( j ) ).y );
                        fz[ i ].push( outline( ihs, φ( j ) ).r ); 
                 
                    }
                    
                } else  if ( outline ( 0 ).x  !== undefined  && outline ( 0 ).z  !== undefined ) {  // factor for x and z
                
                    for ( let j = 0; j < rss; j ++ ) { //  j === rs => φ( j ) === 2*PI full circle
                    
                        fx[ i ].push( outline( ihs, φ( j ) ).x );
                        fh[ i ].push( outline( ihs, φ( j ) ).y );
                        fz[ i ].push( outline( ihs, φ( j ) ).z );
                        
                    }
                    
                } else { 
                    
                    console.log( '  .r  or  ( .x  and/or  .z ) missing in outline function  ')
                    
                }
                
            }            
            
        }
        
    }
    
    let faceCount = rs * hs * 2 ;
    let positionCount = rss * hss;
    if( wb ) { faceCount += rs; positionCount += rss + 1 } 
    if( wt ) { faceCount += rs; positionCount += rss + 1 } 
    
    const indices = new Uint32Array( faceCount * 3 );
    const positions = new Float32Array( positionCount * 3 );  
    const uvs = new Float32Array( positionCount * 2 );
    
    g.setIndex( new THREE.BufferAttribute( indices, 1 ) );	
    g.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    g.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
     
    let a, b1, b2, c1, c2;
    let idxCount = 0;
    
    for ( let i = 0; i < hs; i ++ ) {
    
        for ( let j = 0; j < rs; j ++ ) {

            // 2 faces / segment,  3 vertex indices
            a =  rss * i + j;
            b1 = rss * ( i + 1 ) + j;
            c1 = b1 + 1;
         // b2 = b1 + 1;
            c2 = a + 1;
            
            indices[ idxCount     ] = a;
            indices[ idxCount + 1 ] = c1;
            indices[ idxCount + 2 ] = b1; 
            
            indices[ idxCount + 3 ] = a;
            indices[ idxCount + 4 ] = c2;
            indices[ idxCount + 5 ] = c1;   // = b2
            
            idxCount += 6;
            
        }
            
    }
    
    if( wb ) {
    
        a = c1 + 1; // center bottom
        b1 = a;
        c1 = b1 + 1;
        
        for ( let j = 0; j < rs; j ++ ) {
    
            indices[ idxCount     ] = a;
            indices[ idxCount + 1 ] = ++ c1; // circulation sense acb
            indices[ idxCount + 2 ] = ++ b1;
            
            idxCount += 3;
            
        }
        
    }
    
    if( wt ) {
        
        a  = c1 + 1; // center top
        b1 = a;
        c1 = b1 + 1;
        
        for ( let j = 0; j < rs; j ++ ) {
    
            indices[ idxCount     ] = a;
            indices[ idxCount + 1 ] = ++ b1; // circulation sense abc
            indices[ idxCount + 2 ] = ++ c1;
            
            idxCount += 3;
            
        }
        
    }
     
    let vIdx = 0;   // vertex index
    let posIdx;     // position index
    
    idxCount = 0;
    let u, v;
    
    for ( let i = 0; i < hss; i ++ ) {
        
        v = i / hs;
           
        for ( let j = 0; j < rss; j ++ ) {
            
            u = j / rs;
            
           uvs[ idxCount     ] = u;
           uvs[ idxCount + 1 ] = v;
           
           idxCount += 2; 
           
        }
        
    }
    
    if( wb ) {
        
        uvs[ idxCount     ] = 0.5; // center bottom
        uvs[ idxCount + 1 ] = 0.5;
            
        idxCount += 2;
        
        for ( let j = 0; j < rss; j ++ ) {
            
            uvs[ idxCount     ] = 1 - 0.5 * ( 1 + Math.sin( j / rs * p2i ) );
            uvs[ idxCount + 1 ] = 1 - 0.5 * ( 1 + Math.cos( j / rs * p2i ) );
            
            idxCount += 2; 
            
        }
        
    }
    
    if( wt ) {
    
        uvs[ idxCount     ] = 0.5; // center top
        uvs[ idxCount + 1 ] = 0.5;
            
        idxCount += 2;  
        
        for ( let j = 0; j < rss; j ++ ) {
                    
            uvs[ idxCount     ] = 0.5 * ( 1 + Math.sin( j / rs * p2i ) );
            uvs[ idxCount + 1 ] = 1 - 0.5 * ( 1 + Math.cos( j / rs * p2i ) );
            
            idxCount += 2;         
            
        }
        
    }
    
    g.calculatePositions = function( t ) {
    
        let rt, x, y, z;
        vIdx = 0;
        
        // calculate mantle positions
        
        for ( let i = 0; i < hss; i ++ ) { // height
            
            const ihs = i / hs;
            const cX = centerline( ihs ).x;
            const cZ = centerline( ihs ).z;
            
            for ( let j = 0; j < rss; j ++ ) { // radial
            
                x =  g.r( t ) * fx[ i ][ j ] * g.scX( t ) * Math.cos( φ( j ) );
                y =  g.h( t ) * fh[ i ][ j ] * g.scY( t ); 
                z = -g.r( t ) * fz[ i ][ j ] * g.scZ( t ) * Math.sin( φ( j ) );
                
                if ( g.tor( t ) !== 0 ) {
                    
                    rt = rotate( x, z, g.tor( t ) * ihs );
                    x = rt.ax1;
                    z = rt.ax2;   
                    
                }
                
                x += cX + ihs * g.shX( t );
                z += cZ + ihs * g.shZ( t );
                
                rotations( t );
                
                x += g.trX( t );
                y += g.trY( t );
                z += g.trZ( t );
                
                setPosition( );
    
            }
            
        }
        
        if( wb ) { // calculate bottom positions
            
            const cX = centerline( 0 ).x;
            const cZ = centerline( 0 ).z;
            
            x = cX; // center bottom
            y = fh[ 0 ][ 0 ];
            z = cZ;
            
            rotations( t );
            
            x += g.trX( t ); 
            y += g.trY( t ); 
            z += g.trZ( t );
            
            setPosition( );
            
            for ( let j = 0; j < rss; j ++ ) { // radial, bottom
                
                x = cX + g.r( t ) * fx[ 0 ][ j ] * g.scX( t ) * Math.cos( φ( j ) );
                y =                 fh[ 0 ][ j ];
                z = cZ - g.r( t ) * fz[ 0 ][ j ] * g.scZ( t ) * Math.sin( φ( j ) ); 
                
                rotations( t );
                
                x += g.trX( t );
                y += g.trY( t );
                z += g.trZ( t );
                
                setPosition( );
                
            }
            
        }
            
        if( wt ) { // calculate top positions
            
            const cX = centerline( 1 ).x;
            const cZ = centerline( 1 ).z;
                
            x = cX +  g.shX( t );        // center top
            y = g.h( t ) * fh[ hs ][ 0 ] * g.scY( t );
            z = cZ +  g.shZ( t );
            
            rotations( t );
            
            x += g.trX( t );
            y += g.trY( t );
            z += g.trZ( t );
                
            setPosition( );
            
            for ( let j = 0; j < rss; j ++ ) { // radial, top  
                
                x =  g.r( t ) * fx[ hs ][ j ] * g.scX( t ) * Math.cos( φ( j ) );
                y =  g.h( t ) * fh[ hs ][ j ] * g.scY( t );
                z = -g.r( t ) * fz[ hs ][ j ] * g.scZ( t ) * Math.sin( φ( j ) ); 
                
                if ( g.tor( t ) !== 0 ) {
                    
                    rt = rotate( x, z, g.tor( t ) );
                    x = rt.ax1;
                    z = rt.ax2;
                    
                }
                
                x += cX + g.shX( t );                 
                z += cZ + g.shZ( t );
                
                rotations( t );
                
                x += g.trX( t );
                y += g.trY( t );
                z += g.trZ( t );
                
                setPosition( );
        
            }
                
        }
        
        g.computeVertexNormals( );
        
        // calculate new average normals at seam ( smooth shading )
        
        for ( let i = 0; i < hss; i ++ ) { // height
            
            smoothEdge( rss * i, rss * i + rs );
            
        }
        
        if( wb ) {  // calculate new average normals at bottom  ( smooth shading )
        
            for( let j = 0; j < rss ; j ++ ) { // bottom
                
                smoothEdge( j, rss * hss + 1 + j );
                
            }
            
        }
        
        if( wt ) {  // calculate new average normals at top ( smooth shading )
        
            for( let j = 0; j < rss ; j ++ ) { // top
                
                smoothEdge( rss * hs + j, rss * hss + rss + 2 + j );
                
            }
        }
        
        g.attributes.normal.needsUpdate = true;
        g.attributes.position.needsUpdate = true;
        
        function setPosition( ) {
    
            posIdx = vIdx * 3;
                
            positions[ posIdx ] = x;
            positions[ posIdx + 1 ] = y;
            positions[ posIdx + 2 ] = z;
            
            vIdx ++;        
            
        }
        
        function rotate( axis1, axis2, φ ) {
    
            return { ax1: Math.cos( φ ) * axis1 + Math.sin( φ ) * axis2, ax2: -Math.sin( φ  ) * axis1 + Math.cos( φ  ) * axis2  }
            
        }
        
        function rotations( t ) {
        
            if ( g.rotX( t ) !== 0 ) {
                
                rt = rotate( z, y, g.rotX( t ) );
                z = rt.ax1;
                y = rt.ax2;
                
            }
            
            if ( g.rotY( t ) !== 0 ) {
                
                rt = rotate( x, z, g.rotY( t ) );
                x = rt.ax1;
                z = rt.ax2;
                
            }
            
            if ( g.rotZ( t ) !== 0 ) {
                
                rt = rotate( y, x, g.rotZ( t ) );
                y = rt.ax1;
                x = rt.ax2;
                
            }
            
        }
        
        function smoothEdge( idxa, idxb ) {
            
            const v3a = new THREE.Vector3( );
            const v3b = new THREE.Vector3( );
            const v3  = new THREE.Vector3( );
            
            v3a.set( g.attributes.normal.getX( idxa ), g.attributes.normal.getY( idxa ), g.attributes.normal.getZ( idxa ) );
            v3b.set( g.attributes.normal.getX( idxb ), g.attributes.normal.getY( idxb ), g.attributes.normal.getZ( idxb ) );
            
            v3.addVectors( v3a, v3b ).normalize( );
            
            g.attributes.normal.setXYZ( idxa, v3.x, v3.y, v3.z );
            g.attributes.normal.setXYZ( idxb, v3.x, v3.y, v3.z );
            
        }
        
    } 
        
    g.calculatePositions( 0 );
    
    return g;
    
}

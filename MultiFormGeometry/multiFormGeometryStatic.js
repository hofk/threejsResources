// This function is exactly line by line comparable with multiFormGeometryDynamic.
// @author hofk

function multiFormGeometryStatic( p ) {
    
    //  p = { geometry2D, radius or width, height, radialSegments or widthSegments, heightSegments, cover, withBottom, withTop, onTop, 
    //    centerline, outline, torsion, translateX, translateY, translateZ, scaleX, scaleY, scaleZ, shearX, shearZ, rotateX, rotateY, rotateZ }
 
    const g = new THREE.BufferGeometry( );
    
    const p2i = Math.PI * 2;
    const φ = j => p2i * j / rs; // j === rs => full circle
    const φc = j => -Math.PI + φ( j );
    
    const g2D = p.geometry2D || false;
    
    let r = p.radius || 0.5; // 3D
    
    if ( g2D ) { // 2D  w -> r
    
        r = p.width !== undefined ? p.width : 1.0;
        
    }
    
    const h = p.height || 1.0;
        
    let rs = p.radialSegments || 18;
    rs = p.widthSegments !== undefined ? p.widthSegments : rs;
    let hs = p.heightSegments || 18;
    
    const cover = p.cover || false;
    
    let wb = p.withBottom !== undefined && !cover && rs > 2 ? p.withBottom : ( !cover && rs > 2 ? true : false );
    let wt = p.withTop !== undefined && !cover && rs > 2 ? p.withTop : ( !cover && rs > 2 ? true : false );
    
    wb = g2D ? false : wb;
    wt = g2D ? false : wt;
    
    const onTop = p.onTop || false; // if true, bottom on xz plane
    
    const trX = p.translateX || 0.0;
    const trY = p.translateY || 0.0;
    const trZ = p.translateZ || 0.0;
    
    const scX = p.scaleX || 1;
    const scY = p.scaleY || 1;
    const scZ = p.scaleZ || 1;
    
    const shX = p.shearX || 0;
    const shZ = p.shearZ || 0;
    
    const rotX = p.rotateX || 0;
    const rotY = p.rotateY || 0;
    const rotZ = p.rotateZ || 0;
    
    const rss = rs + 1;
    let hss = hs + 1; // can be overwritten
    
    const centerline = p.centerline || function( h ) { return { x: 0, z: 0 } }
    const outline = p.outline || ( h => 1.0 );
    
    const tor = p.torsion || 0;     
    
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
                    
                } else  if  ( outline ( 0 ).w  !== undefined   )  {  //  factor for width  2D 
                
                    for ( let j = 0; j < rss; j ++ ) {
                    
                        fx[ i ].push( outline( ihs ).w );
                        fh[ i ].push( outline( ihs ).y );
                        
                    }
                
                } else  if ( outline ( 0 ).x  !== undefined  && outline ( 0 ).z  !== undefined ) {  // factor for x and z
                
                    for ( let j = 0; j < rss; j ++ ) { //  j === rs => φ( j ) === 2*PI full circle
                    
                        fx[ i ].push( outline( ihs, φ( j ) ).x );
                        fh[ i ].push( outline( ihs, φ( j ) ).y );
                        fz[ i ].push( outline( ihs, φ( j ) ).z );
                        
                    }
                    
                } else { 
                    
                    console.log( '  .r  or .w  or ( .x  and/or  .z ) missing in outline function  ')
                    
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
    
    function calculatePositions(  ) { 
 
        let rt, x, y, z;
        vIdx = 0;
        
        // calculate mantle positions
        
        for ( let i = 0; i < hss; i ++ ) { // height
            
            const ihs = i / hs;
            const cX = centerline( ihs ).x;
            const cZ = centerline( ihs ).z;
            
            for ( let j = 0; j < rss; j ++ ) { // radial / width
                
                if( g2D ) { // 2D Geometry
                    
                    x = r * fx[ i ][ j ] * ( j - rs / 2 ) / rs * scX; 
                    y = h * fh[ i ][ j ] * scY;
                    z = 0;                    
                    
                } else  { // 3D geometry
                
                    x =  r * fx[ i ][ j ] * scX * Math.cos( φ( j ) );
                    y =  h * fh[ i ][ j ] * scY;
                    z = -r * fz[ i ][ j ] * scZ * Math.sin( φ( j ) );
    
                    if ( cover ) { // unroll cover
                        
                        z = Math.sqrt( x * x + z * z ) - r * fx[ i ][ 0 ] * scX;
                        x = r * fx[ i ][ j ] * scX * φc( j ); // center x
                        
                    }
                    
                }
                
                if ( !onTop ) y -= h * fh[ hs ][ j ] * scY / 2; // center y
                
                if ( tor !== 0 ) {
                    
                    rt = rotate( x, z, tor * ihs );
                    x = rt.ax1;
                    z = rt.ax2;
                    
                }
                
                x += cX + ihs * shX;
                z += cZ + ihs * shZ; 
                
                rotations( );
                 
                x += trX;   
                y += trY;
                z += trZ;
                
                setPosition( );
    
            }
            
        }
        
        if( wb ) { // calculate bottom positions
            
            const cX = centerline( 0 ).x;
            const cZ = centerline( 0 ).z;
            
            x = cX; // center bottom
            y = fh[ 0 ][ 0 ] * scY;
            z = cZ;
            
            if ( !onTop ) y -= h * fh[ hs ][ 0 ] * scY / 2; // center y
            
            rotations( );
            
            x += trX;
            y += trY;
            z += trZ;
            
            setPosition( );
            
            for ( let j = 0; j < rss; j ++ ) { // radial, bottom
                
                x =  r * fx[ 0 ][ j ] * scX * Math.cos( φ( j ) );
                y =  h * fh[ 0 ][ j ] * scY;
                z = -r * fz[ 0 ][ j ] * scZ * Math.sin( φ( j ) );
                
                if ( !onTop ) y -= h * fh[ hs ][ j ] * scY / 2; //  center y
                
                if ( tor !== 0 ) {
                    
                    rt = rotate( x, z, 0 );
                    x = rt.ax1;
                    z = rt.ax2;
                    
                }
                
                x += cX;                 
                z += cZ;
                
                rotations( );
                
                x += trX;
                y += trY;
                z += trZ;
                
                setPosition( );
                
            }
            
        }
            
        if( wt ) { // calculate top position
            
            const cX = centerline( 1 ).x;
            const cZ = centerline( 1 ).z;
            
            x =  cX + shX;        // center top
            y =  h * fh[ hs ][ 0 ] * scY;
            z =  cZ + shZ;
            
            if ( !onTop ) y -= h * fh[ hs ][ 0 ] * scY / 2; // center y
            
            rotations( );
            
            x += trX;
            y += trY;
            z += trZ;
                
            setPosition( );
            
            for ( let j = 0; j < rss; j ++ ) { // radial, top
                
                x =  r * fx[ hs ][ j ] * scX * Math.cos( φ( j ) );
                y =  h * fh[ hs ][ j ] * scY;
                z = -r * fz[ hs ][ j ] * scZ * Math.sin( φ( j ) );
                
                if ( !onTop ) y -= h * fh[ hs ][ j ] * scY / 2; // center y
                
                if ( tor !== 0 ) {
                    
                    rt = rotate( x, z, tor );
                    x = rt.ax1;
                    z = rt.ax2;
                    
                }
                
                x += cX + shX;
                z += cZ + shZ;
                
                rotations( );
                 
                x += trX;
                y += trY;
                z += trZ;
                
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
        // position no update
    
        function setPosition( ) {
    
            posIdx = vIdx * 3;
                
            positions[ posIdx ]  = x;
            positions[ posIdx + 1 ]  = y;
            positions[ posIdx + 2 ]  = z;
            
            vIdx ++;        
            
        }
        
        function rotate( axis1, axis2, φ ) {
    
            return { ax1: Math.cos( φ ) * axis1 + Math.sin( φ ) * axis2, ax2: -Math.sin( φ  ) * axis1 + Math.cos( φ  ) * axis2  }
            
        }
        
        function rotations( ) {
        
            if ( rotX !== 0 ) {
                
                rt = rotate( z, y, rotX );
                z = rt.ax1;
                y = rt.ax2;
                
            }
            
            if ( rotY !== 0 ) {
                
                rt = rotate( x, z, rotY );
                x = rt.ax1;
                z = rt.ax2;
                
            }
            
            if ( rotZ !== 0 ) {
                
                rt = rotate( y, x, rotZ );
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
    
    calculatePositions(  );
        
    return g;
    
}

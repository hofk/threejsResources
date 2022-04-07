// Link static BufferGeometries from an array.
// Each geometry with its own material group.

// @author hofk

function link( geoms ) {

    const g = new THREE.BufferGeometry( );
    
    g.faceCounts = [];
    g.positionCounts = [];
    let faceCount = 0;
    let positionCount = 0;
    
    for ( let i = 0; i < geoms.length; i ++ ) {
        
        g.faceCounts[ i ] = geoms[ i ].index.array.length / 3;
        faceCount += g.faceCounts[ i ];
        
        g.positionCounts[ i ] = geoms[ i ].attributes.position.count;
        positionCount += g.positionCounts[ i ];
    
    }
    
    const indices = new Uint32Array( faceCount * 3 );
    const positions = new Float32Array( positionCount * 3 );
    const normals = new Float32Array( positionCount * 3 );
    const uvs = new Float32Array( positionCount * 2 );
    
    g.setIndex( new THREE.BufferAttribute( indices, 1 ) );	
    g.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    g.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
    g.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
     
    let indOffs = 0;
    let indVal  = 0;
    let posOffs = 0;
    let uvsOffs = 0;
    
    for ( let i = 0; i < geoms.length; i ++ ) {
        
        for ( let j = 0; j <= geoms[ i ].index.array.length; j ++ ) {
            
           indices[ j + indOffs ] = indVal + geoms[ i ].index.array[ j ] ;
            
        }
        
        for ( let j = 0; j < geoms[ i ].attributes.position.count * 3; j ++ ) {
            
            positions[ j + posOffs ] = geoms[ i ].attributes.position.array[ j ];

        }
        
        for ( let j = 0; j < geoms[ i ].attributes.normal.count * 3; j ++ ) {
            
            normals[ j + posOffs ] = geoms[ i ].attributes.normal.array[ j ];

        }
        
        for ( let j = 0; j < geoms[ i ].attributes.uv.count * 2;  j ++ ) {
            
            uvs[ j + uvsOffs ] = geoms[ i ].attributes.uv.array[ j ];
            
        }
     
        g.addGroup( indOffs, g.faceCounts[ i ] * 3, i ); // multi material groups
        
        indOffs += g.faceCounts[ i ] * 3;
        indVal  += g.positionCounts[ i ];
        posOffs += g.positionCounts[ i ] * 3;
        uvsOffs += g.positionCounts[ i ] * 2;
        
    }
    
    for ( let i = 0; i < geoms.length; i ++ ) {
        
        geoms[ i ].dispose( );  // Only if the individual geometries are not required.
        
    }
    
    return g;

}
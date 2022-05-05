// shapes for multiform geometries
// @author hofk

const pi = Math.PI;
const p2i = Math.PI * 2;

// centerlines 

// h =>  centerline .x and .z  

function centerline01( h ) { 
    
   return { x: 0.4 * Math.sin( h * p2i ), z: 2 * h };  
       
}

function centerline02( h ) { 
    
   return { x: 0.2 * Math.sin( 6 * h * p2i ), z: 0.2 * Math.cos( 6 * h * p2i ) };  
       
}

function centerline03( h ) { 
    
   return { x: 0.4 * Math.sin( h * p2i ) * Math.sqrt( h ), z: 0 };  
       
}

function centerline04( h ) { 
    
   return { x: 0.5 * Math.exp( -h * 5 ) , z: 0 };  
       
}

function  curvedCylinder( h ) { 
    
   return { x: Math.exp( -6 * h * h * h   ), z: 0 };  
       
}

function flatKnotCenterline( h ) { //various knots - http://www.mi.sanu.ac.rs/vismath/taylorapril2011/Taylor.pdf 
    
    return { x: Math.cos( 4*h *2*pi ) * ( 1 + 0.5 * ( Math.cos( 5*h *2*pi ) + 0.4 * Math.cos( 20*h *2*pi ))),
             z: 0.35 * Math.sin( 15*h *2*pi ) }
    
}
 
// outlines defined by  arrays

// array of some arrays [ height, radius factor ] to calculate outline per CatmullRomCurve3, height [ 0 -> 1 ] with a possible overhang

const aaOutline1 = [ 

    [ 0.00, 0.88 ],
    [ 0.20, 0.44 ],
    [ 0.40, 0.80 ],
    [ 0.50, 0.88 ],
    [ 0.61, 0.70 ],
    [ 1.00, 1.25 ],
];

const aaOutline2 = [

    [ 0.00, 0.88 ],
    [ 0.10, 0.44 ],
    [ 0.25, 1.00 ],
    [ 0.50, 0.88 ],
    [ 0.75, 0.86 ],
    [ 1.00, 1.25 ],
    
];

const aaOutline3 = [

    [ 0.00, 0.44 ],
    [-0.10, 0.64 ],
    [ 0.00, 0.78 ],
    [ 0.25, 1.00 ],
    [ 0.50, 0.68 ],
    [ 0.75, 0.86 ],
    [ 1.10, 1.10 ],
    [ 1.00, 1.00 ],
    
];

// array of factors for radius per height [ 0 -> 1 ],   heightSegments result from count - 1, deviating are overwritten

const aOutline = [ 1.45, 1.3, 1.2, 1.1, 1.1, 1.05, 1.0, 1.0, 1.0, 1.0, 0.0 ];
const aOutline1 = [ 0.3, 0.1, 0.1, 1.1, 1.1, 0.8, 0.8, 0.5, 0.3, 0.01 ]

// outlines defined by function ( normalized, with a possible overhang )  h [ 0 -> 1 ]  => [ 0 -> 1 ] 

//  h [ 0 -> 1 ] for heightSegments  => factor for radius / width 2D
const outline00 = h => h * h + 0.05;
const outlinel01 = h => Math.pow( h, 8 ) + 0.1;
const cylinderOutline = h => 1;
const coneOutline = h => 1 - h;
const paraboloidOutline = h => Math.sqrt( h );
const expOutline = h =>  Math.exp( h );  //     try      Math.exp( 1 - h );     1 - Math.exp( 1 - h ); 
const sqrt4Outline = h => Math.pow( h, 1 / 4 );


// h => height segments of different heights ( .y ), factor for radius  ( .r ) or  width ( .w ) 2D
 
function fyr1Outline( h ) { 
    
   return { y: 2.5 * h * h - 1.5 * h ,  r: h + 0.4 };  
       
}

function fyr2Outline( h ) { 
    
   return { y: 0.8 * ( 0.5 - 0.8 * Math.sin( 4 * h + 1.14 ) ), r: h };  
      
}

function fyr3Outline( h ) { 
    
   return { y: 0.5 * ( 1 - 0.5 * Math.sin( 2 * pi * h ) ), r: Math.sqrt( h ) < 0.5 ?  Math.sqrt( h ) : 1 - Math.sqrt( h ) };  
      
}

function fyw1Outline( h ) { 
    
   return { y: Math.sqrt( h ), w: Math.sin( pi * h )  };  // 2D
      
}
 
function sphereOutline( h ) {

    return { y: ( 1 - Math.cos( h * pi ) ) / 2, r: Math.sin( h * pi ) };

};

function flatKnotOutline( h ) {  //various knots - http://www.mi.sanu.ac.rs/vismath/taylorapril2011/Taylor.pdf 

    return { y: Math.sin( 4*h *2*pi ) * ( 1 + 0.5 * ( Math.cos( 5*h *2*pi ) + 0.4 * Math.cos( 20*h *2*pi ))), r: 0.16 };

};

// h, ( φ ) =>  height, φ [ 0 -> 1 ],  height segments of different heights ( .y ), radius ( .r ),   φ optional

function φOutline0( h, φ ) {
    
    return { y: h,  r: h + 0.4 + 0.2 * Math.sin( 4 * φ ) };   // full circle   φ = 2*PI
    
}

function φOutlineR( h, φ ) {

    return { y: h,  r: Math.sin( 4 * φ  ) };   // full circle  φ = 2*PI
}

function φOutlineR1( h, φ ) {

    return { y:  h + 0.3 * Math.sin( 4 * φ   ),  r: 1.5 + 0.4 * Math.sin( 2 * φ ) };   // full circle  φ = 2*PI
}

// h, ( φ ) =>  height, φ [ 0 -> 1 ], height segments of different heights ( .y ), factors for x and z,   φ optional

function φOutline1( h, φ ) {

    return { y:  h + 0.1 * Math.sin( φ / 2 ),  x: 0.2 * Math.sin( h + φ ),  z: 0.2 };   // full circle  φ = 2*PI
}

function fyxz1Outline( h ) { 
    
   return { y: 1.5 * h * h + 0.4 * h, x: 0.5 * h + 0.1, z: 0.1 * Math.sin( h * pi ) + 0.2, };  
       
}

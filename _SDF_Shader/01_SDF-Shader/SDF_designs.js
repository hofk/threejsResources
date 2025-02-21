//01_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line
 

  float angel =  0.9*PI; // radiant 0.0 .. 2.0*PI
  vec2 c = vec2(sin(0.5*angel),cos(0.5*angel));
  distCol dcCappedTor; 
  dcCappedTor.d = sdCappedTorus(translateY(rotateY(p, 0.7*PI), 0.8), c, 1.4, 0.3);
  dcCappedTor.c = vec4(0.9, 0.4, 0.2, 1.0);

 
  distCol dcTor; 
  dcTor.d = sdTorus( translateZ(p, -0.8), vec2(0.8, 0.3)); 
  dcTor.c = vec4(0.1, 0.4, 0.6, 1.0);
  vec4 w = opElongate( translateZ(p, 1.9), vec3(0.1,0.2,0.8) );
  dcTor.d = min( dcTor.d, w.w + sdTorus(w.xyz, vec2(0.5, 0.2) ) );
  
  dc = opUnion(dcCappedTor, dcTor); // apply to reserved dc
   
 
 `;  // don't change this line
///................................................................. 
 
export { SDF_designs } // don't change this line

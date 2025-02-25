// 01_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line 
    
 //vec4 color = vec4(getNormal(p), 1.0);

  distCol dcVertCapsule;
  dcVertCapsule.d = sdVerticalCapsule(mirrorXZ(rotateZ(translateX(p, 0.7), -0.74)), 1.2, 0.4); 
  dcVertCapsule.c = vec4(getNormal(p), 1.0);
   
  //---
  dc = dcVertCapsule; // apply to reserved dc
  
 `;  // don't change this line
 
SDF_designs[ 1 ] = `   // don't change this line
  
  distCol dcHexPrism;  
  
  dcHexPrism.d = opRound(sdHexPrism(rotateX(p, 0.44), vec2(1.0, 0.5)), 0.3) ;
  dcHexPrism.c = vec4(getNormal(p), 1.0);
  
  //---
  dc = dcHexPrism; // apply to reserved dc
   
  
 `;  // don't change this line 

SDF_designs[ 2 ] = `   // don't change this line
 
  distCol dcQuad;
  dcQuad.d = udQuad(rotateY(p, time), vec3(-2.0, -2.0, 0.0) , vec3(-2.0, 2.0, 0.0), vec3(2.0, 2.0, 0.0), vec3(2.0, -2.0, 0.0));
  dcQuad.c = vec4(getNormal(p), 1.0);
  
  distCol dcCappedCone;
  dcCappedCone.d = sdCappedCone(rotateX(translateZ(rotateY(p, time), 0.4), -0.5*PI), 0.3, 0.5, 0.25);
  dcCappedCone.c = vec4(getNormal(p), 1.0);
  
  //---
  dc = dcQuad;
  dc = opSmoothUnion(dcQuad, dcCappedCone, 0.25); // apply to reserved dc
  
 `;  // don't change this line 
 
 SDF_designs[ 3 ] = `   // don't change this line
   
  distCol dcRoundeCyl;
  dcRoundeCyl.d = sdRoundedCylinder(p, 1.0, 0.2, 0.8);
  dcRoundeCyl.c = vec4(getNormal(p), 1.0);
   
  distCol dcHexPrism1;  
  dcHexPrism1.d = sdHexPrism( translateY(p, 0.3), vec2(1.2, 1.2));
  dcHexPrism1.c = vec4(getNormal(p), 1.0);
   
  //---
  dc = dcHexPrism1;
  dc = opSmoothSubtraction(dc, dcRoundeCyl, 0.1); // apply to reserved dc
   
 `;  // don't change this line 
 
  SDF_designs[ 4 ] = `   // don't change this line
  
  distCol dcTriangle;
  dcTriangle.d = udTriangle(rotateY(p, time), vec3(-1.7, -1.6, 0.0), vec3(2.0, -1.6, 0.0), vec3(2.0, 1.6, -0.2));
  dcTriangle.c = vec4(getNormal(p), 1.0);
  
  //---
  dc = dcTriangle; // apply to reserved dc
  
 `;  // don't change this line 
 
///................................................................. 
 
export { SDF_designs } // don't change this line

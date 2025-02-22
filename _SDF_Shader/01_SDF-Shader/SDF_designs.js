// 01_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line
  
  distCol dcCappedTor;
  float angel =  0.9*PI; // radiant 0.0 .. 2.0*PI
  vec2 c = vec2(sin(0.5*angel),cos(0.5*angel));
  dcCappedTor.d = sdCappedTorus(translateY(rotateY(p, 0.7*PI), 0.8), c, 1.4, 0.3);
  dcCappedTor.c = vec4(0.9, 0.4, 0.2, 1.0);
  // ...
  distCol dcTor; 
  dcTor.d = sdTorus( translateZ(p, -0.8), vec2(0.8, 0.3)); 
  dcTor.c = vec4(0.1, 0.4, 0.6, 1.0);
  vec4 w = opElongate( translateZ(p, 1.9), vec3(0.1, 0.2, 0.8) );
  dcTor.d = min( dcTor.d, w.w + sdTorus(w.xyz, vec2(0.5, 0.2) ) );
  // ...
  distCol dcSphRep;
  float s = 1.01;
  vec3 n = vec3( 2.0, 3.0, 1.0);
  dcSphRep.d = sdSphere(opLimitedRepetition(rotateY(translateZ(p, -4.1), 0.25*PI), s, n), 0.5);
  dcSphRep.c = vec4(0.7, 0.8, 0.2, 1.0);
  // ...
  distCol dcBoxBend;
  dcBoxBend.d = sdBox( opCheapBend(translateX( p, -3.7), 0.07), vec3(3.0, 0.2, 0.5));
  dcBoxBend.c = vec4(0.2, 0.9, 0.3, 1.0);
  // ...
  distCol dcSphDispl;
  float displace = 1.5;
  float transX1 = 3.9;
  float transX2 = 4.4;
  vec3 dq1 = translateX(p, transX1);
  vec3 dq2 = translateX(p, transX2);
  dcSphDispl.d = sdSphere(dq1, 1.0) + opDisplaceSin(dq2, displace);
  dcSphDispl.c = vec4(0.9, 0.1, 0.9, 1.0);

  //---
  dc = opUnion(dcCappedTor, dcTor); // apply to reserved dc
  dc = opUnion(dc, dcSphRep);
  dc = opUnion(dc, dcBoxBend);
  dc = opUnion(dc, dcSphDispl);
  
 `;  // don't change this line
///................................................................. 
 
export { SDF_designs } // don't change this line

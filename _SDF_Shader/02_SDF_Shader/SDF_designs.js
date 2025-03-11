// 02_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line
   
  distCol dcHeartExtru;
  dcHeartExtru.d = opExtrusion(p, sdHeart(p.xy), 0.05 );
  dcHeartExtru.c = vec4(1.0, 0.1, 0.1, 1.0);
  
  // ...
  distCol dcCrossExtru;
  vec2 b = vec2(1.1, 0.25);
  vec3 q = translateX(p, 1.2);
  dcCrossExtru.d = opExtrusion(q, sdCross(q.xy, b, 0.2), 1.3 );
  dcCrossExtru.c = vec4(0.95, 0.9, 0.2, 1.0);
  
  //...
  distCol dcCrossRevolu;  
  dcCrossRevolu.d = sdCross(opRevolution(translateX(p, -2.8), 0.3), vec2(1.1, 0.25), 0.2);
  dcCrossRevolu.c = vec4(1.0, 0.4, 1.0, 1.0);
  
  // ...
  float tb = 0.33*PI;  // radiant
  vec2 sc = vec2(sin(tb),cos(tb));
  
  distCol dcArcExtru;
  dcArcExtru.d = opExtrusion(p, sdArc( p.xy, sc, 1.9, 0.2), 0.15 );   
  dcArcExtru.c = vec4(0.0, 0.1, 1.0, 1.0);
  // .
  distCol dcArcRevolu;
  dcArcRevolu.d = sdArc(opRevolution(rotateZ(translateY(p, -1.4), PI), 0.1), sc, 1.9, 0.1);
  dcArcRevolu.c = vec4(0.1, 1.0, 0.3, 1.0);
  
  //---
  dc = dcHeartExtru; // apply to reserved dc
  dc = opUnion( dc, dcCrossExtru);
  dc = opUnion( dc, dcCrossRevolu);
  dc = opUnion( dc, dcArcExtru);
  dc = opUnion( dc, dcArcRevolu);
   
  
 `;  // don't change this line
///................................................................. 
 
export { SDF_designs } // don't change this line

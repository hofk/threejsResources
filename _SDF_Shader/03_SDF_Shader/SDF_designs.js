// 01_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line
    
  vec4 col =  vec4(cos(-p.x) + sin(p.y), sin(-p.z) + sin(p.y), 0.3, 1.0); 
  distCol dcBoxFrame;
  vec3 pt = translateXYZ( p, vec3( 0.3, 0.3, -0.4));
  dcBoxFrame.d = sdBoxFrame(pt, vec3(0.7, 0.8, 1.0), 0.07);
  dcBoxFrame.c = col;
  
  distCol dcVertlCapsule;
  dcVertlCapsule.d = sdVerticalCapsule( p, 1.1, 0.2);
  dcVertlCapsule.c = col;
  
  //---
  dc = dcBoxFrame; // apply to reserved dc
  dc = opUnion(dc, dcVertlCapsule);
  
 `;  // don't change this line
 
SDF_designs[ 1 ] = `   // don't change this line 
  distCol dcHeartExtru;
  vec3 q = translateY(p, 3.2);
  dcHeartExtru.d = opExtrusion( q, sdHeart(p.xy), 0.5 );
  dcHeartExtru.c = vec4(cos(-p.x) + sin(p.y), sin(-p.z) + sin(p.y), 0.3, 1.0);
  
  //---
  dc = dcHeartExtru; // apply to reserved dc
   
 `;  // don't change this line

SDF_designs[ 2 ] = `   // don't change this line 

  distCol dcCutHollowSph;
  dcCutHollowSph.d = sdCutHollowSphere(p, 0.7+0.5*sin(time), 0.2, 0.06);
  dcCutHollowSph.c = vec4(abs(p.x+p.y), abs(p.y+p.z), abs(p.z+p.x), 1.0);

  //---
  dc = dcCutHollowSph; // apply to reserved dc
   
 `;  // don't change this line
 
 SDF_designs[ 3 ] = `   // don't change this line
 
  distCol dcVertCappedCyl;
  dcVertCappedCyl.d = sdVerticalCappedCylinder(p, 0.7, 0.5 );
  dcVertCappedCyl.c = vec4( sin(3.0*p.x*time), 1.5*time, 0.5, 1.0);
  
  //---
  dc = dcVertCappedCyl;
  
  `;  // don't change this line
  
  SDF_designs[ 4 ] = `   // don't change this line
  
  distCol dcSolidAngle;
  float angle = 0.71; // radiant
  
  vec2 c = vec2(sin(angle), cos(angle));
  dcSolidAngle.d = sdSolidAngle( rotateZ(p, -2.0*angle), c, 1.1);
  dcSolidAngle.c = vec4(0.9 +0.2*sin(time), 0.4, 0.4, 1.0);
  
  //---
  dc = dcSolidAngle;  
  
  `;  // don't change this line
  
  SDF_designs[ 5 ] = `   // don't change this line
  
  distCol dcBoxFrm;
  vec3 pf = translateXYZ(p, vec3(24.0*sin(0.1*time), 2.0 + sin(0.1*time), 4.0*cos(0.1*time)));
  dcBoxFrm.d = sdBoxFrame(pf, vec3(0.7, 0.8, 1.0), 0.07);
  dcBoxFrm.c = vec4( 5.0*cos(-p.x) + sin(p.y), 2.0*sin(-p.z) + sin(p.y), 0.3, 1.0);;
  //---
  dc = dcBoxFrm;  
  
  `;  // don't change this line
  
///................................................................. 
 
export { SDF_designs } // don't change this line

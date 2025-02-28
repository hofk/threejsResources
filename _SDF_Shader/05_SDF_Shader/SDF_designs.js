// 01_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line 
 /*
    vec3 e1 = vec3( 0.0, 0.0, 1.0); 
    vec3 e2 = vec3( 1.0, 0.0, 0.0);
    vec3 e3 = vec3( 0.0, 1.0, 0.0);
    
    quat qu = setFromBasis(e1, e2, e3); //  quaternion
 */ 
    vec3 tangent, normal, binormal;
    getFrenetFrame(tangent, normal, binormal);
    quat qu = setFromBasis(tangent, normal, binormal); //  quaternion
  
    distCol dcVertCapsule;
    vec3 posOnCurve = getMovingCapsulePos();
    dcVertCapsule.d = sdVerticalCapsule( rotate(qu,translateXYZ(p, posOnCurve)), 2.0, 0.5 );
    dcVertCapsule.c = vec4(0.5, 0.5, 0.5, 1.0);
    
    dc = dcVertCapsule; // apply to reserved dc

 `;  // don't change this line
 
 
 
///................................................................. 
 
export { SDF_designs } // don't change this line

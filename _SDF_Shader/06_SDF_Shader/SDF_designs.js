// 06_SDF_designs     designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line 
    
    // movement on curve with  position and quaternion
    float t = mod(time * 0.02, 1.0); // //float t = time * 0.02;
    float vStep = 1.0 / 5.0;
    vec3 dataPosition = texture(splineData, vec2(t, vStep * 0.5)).xyz;
    vec3 dataTangent  = texture(splineData, vec2(t, vStep * 1.5)).xyz;
    vec3 dataNormal   = texture(splineData, vec2(t, vStep * 2.5)).xyz;
    vec3 dataBinormal = texture(splineData, vec2(t, vStep * 3.5)).xyz;
    vec4 dataQuaternion = texture(splineData, vec2(t, vStep * 4.5)).xyzw;
    quat qu; 
    
    //... SDF ...
    
    qu.s = dataQuaternion.w;
    qu.v = dataQuaternion.xyz;    
    vec3 pmCy = rotate(invert(qu), translateXYZ(p, dataPosition)); // p move cylinder
    vec3 pmCo = translateY(pmCy, 0.6); // p move cone
    
    distCol dcCyl;
    dcCyl.d = sdVerticalCappedCylinder(pmCy, 1.2, 0.12 );
    dcCyl.c = vec4(1.0, 0.2, 1.0, 1.0);
    
    distCol dcCappedCone;
    dcCappedCone.d = sdCappedCone( pmCo, 0.6 , 0.4, 0.2 );
    dcCappedCone.c = vec4(1.0, 1.0, 0.5, 1.0);
    
    // apply to reserved dc
    dc = dcCyl;
    dc = opUnion(dc, dcCappedCone );
    // ...
    
    distCol dcSphere;
    dcSphere.d = sdSphere(p, 1.9);
    dcSphere.c = vec4(1.0, 0.4, 0.5, 1.0);
    
    distCol dcRoundBox;
    dcRoundBox.d = sdRoundBox(p, vec3(1.0, 1.8, 1.5), 0.3);
    dcRoundBox.c = vec4(1.0, 0.4, 0.5, 1.0);
    
    distCol dcSub;
    dcSub = opSmoothSubtraction( dcRoundBox, dcSphere, 0.7 );
    
    dc = opUnion(dc, dcSub);
    // ...
     
    /*
    //  visualization of tangent, normal, binormal
    float axesLength = 2.5;
    distCol dcCapsuleTangent;
    dcCapsuleTangent.d = sdCapsule(p, dataPosition, dataPosition + dataTangent * axesLength, 0.05);
    dcCapsuleTangent.c =  vec4(1.0, 1.0, 0.2, 1.0);
    distCol dcCapsuleNormal;
    dcCapsuleNormal.d = sdCapsule(p, dataPosition, dataPosition + dataNormal * axesLength, 0.05);
    dcCapsuleNormal.c =  vec4(0.2, 1.0, 0.2, 1.0);
    distCol dcCapsuleBinormal;
    dcCapsuleBinormal.d = sdCapsule(p, dataPosition, dataPosition + dataBinormal * axesLength, 0.05);    
    dcCapsuleBinormal.c =  vec4(0.2, 0.8, 1.0, 1.0);

    dc = opUnion(dc, dcCapsuleTangent); 
    dc = opUnion(dc, dcCapsuleNormal);
    dc = opUnion(dc, dcCapsuleBinormal);
    */

	return dc;
	
 `;  // don't change this line
 
 SDF_designs[ 1 ] = `   // don't change this line 
 
    //... SDF ...
    distCol dcOctahedron;
    dcOctahedron.d = sdOctahedron( p, 2.2 );
    dcOctahedron.c = vec4(0.4, 0.4, 1.0, 1.0);
    
    distCol dcCutSphere;
    dcCutSphere.d = sdCutSphere( translateXYZ(p,vec3(0.0, 0.5, 0.0)), 1.8, 0.4 );
    dcCutSphere.c = vec4(0.4, 1.0, 1.0, 1.0);   
    
    // apply to reserved dc
    dc = dcOctahedron;
    dc = opSmoothUnion(dc, dcCutSphere, 0.3 );
    
    return dc;
 `;  // don't change this line
 
///................................................................. 
 
export { SDF_designs } // don't change this line

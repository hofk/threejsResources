// designs of SDFs
// ....................................................
const SDF_designs = [];

SDF_designs[ 0 ] = `   // don't change this line

// Each SDF part consists of a distance function and a color.
// The distance functions are defined in define_3D_SDFs.js.

// Use the struct distCol (distance, color) to define a new SDF.
// Then assign the values .d and .c.

// Example: start with p
  vec3 pTransExample = p - vec3(0.4, -0.1, -0.3);                       // optional define a translation   
  vec3 pRotExample = rotateZ(rotateX(pTransExample, -0.4*PI), -0.6*PI); // optional define rotations X, Y, Z (-angle)
    
  distCol dcExample;                                     // define a new SDF (distance, color)
  dcExample.d = sdTorus(pRotExample, vec2(0.575, 0.14)); // assign distance, use a function from define_3D_SDFs.js (sdTorus)
  dcExample.c = vec4(1.0, 0.82, 0.1, 1.0);                  // assign color

// Finally, connect the individual SDFs with operations from SDF_operations.js and and assign it to dc  (dc is reserved)
// e.g. dc = opUnion(dcExample, dcSph); // if the Sphere dcSph was previously defined   
    
    
// make your first design:
//***************************************
// SDFs 3D
vec4 colSkin = vec4( 0.9725, 0.7059, 0.6941, 1.0 ); //rgb(248,180,177)
vec4 colEye  = vec4( 0.9887, 0.9887, 0.9887, 0.99 );
vec4 colHat  = vec4( 0.7777, 0.7777, 0.1546, 1.00 );
  
distCol dcHeadTop; 
vec3 pTransHeadTop = p - vec3(0.0, 0.6, 0.0);
dcHeadTop.d = sdEllipsoid( pTransHeadTop, vec3(0.8, 0.7, 0.8));

distCol dcHeadBtm; 
vec3 pTransHeadBtm = p - vec3(0.0, -0.2, 0.0);
dcHeadBtm.d = sdEllipsoid( pTransHeadBtm, vec3(0.6, 0.5, 0.6));

distCol dcNoise;
vec3 pTransNoise = p - vec3(0.0, 0.0, 0.9);
vec3 pRotNoise =  rotateX(pTransNoise, 0.08 * PI) ;
dcNoise.d = sdRoundCone( pRotNoise, 0.1, 0.02, 0.3 );

distCol dcEyeSocketLeft;
vec3 pTransEyeSocketLeft = p - vec3(0.35, 0.35, 0.8);
dcEyeSocketLeft.d = sdSphere(pTransEyeSocketLeft, 0.1);

distCol dcEyeSocketRight;
vec3 pTransEyeSocketRight = p - vec3(-0.35, 0.35, 0.8);
dcEyeSocketRight.d = sdSphere(pTransEyeSocketRight, 0.1);

distCol dcEyeLeft;
vec3 pTransEyeLeft = p - vec3(0.33, 0.35, 0.68);
dcEyeLeft.d = sdSphere(pTransEyeLeft, 0.12);
dcEyeLeft.c = colEye;

distCol dcEyeRight;
vec3 pTransEyeRight = p - vec3(-0.33, 0.35, 0.68);
dcEyeRight.d = sdSphere(pTransEyeRight, 0.12);
dcEyeRight.c = colEye;

distCol dcCustom;
vec3 pTransCustom = p - vec3(0.0, 1.1, 0.0);
dcCustom.d = sdCustom( pTransCustom, 0.71, 0.8, 0.3 ); // a custom SDF function
dcCustom.c = colHat;

dc = dcHeadTop;
dc = opSmoothUnion(dc, dcHeadBtm, 0.9);
dc = opSmoothUnion(dc, dcNoise,   0.1);
dc = opSmoothSubtraction(dcEyeSocketLeft  ,dc, 0.05);
dc = opSmoothSubtraction(dcEyeSocketRight ,dc, 0.05);
dc.c = colSkin;
dc = opUnion(dc, dcEyeLeft);
dc = opUnion(dc, dcEyeRight); 

dc = opUnion(dc, dcCustom);

 `;  // don't change this line
///................................................................. 

// make another design : index 1
//***************************************
SDF_designs[ 1 ] = `   // don't change this line
 
  distCol dcSph;
  dcSph.d = sdSphere(p, 0.25 );
  dcSph.c = vec4( 0.9, 0.8, 0.2, 1.0 );
  
  distCol dcTor;
  vec3 dcTorRotX = rotateX( p, 0.2*PI * time );
  dcTor.d = sdTorus(dcTorRotX, vec2(0.28, 0.08));
  dcTor.c = vec4( 0.4, 0.2, 0.7, 1.0 );
  
  dc = opUnion(dcSph, dcTor);

`;  // don't change this line
 
// ......................................................................

// make another design : index 2
//***************************************
SDF_designs[ 2 ] = `   // don't change this line

vec4 colSkin = vec4( 0.9294, 0.8745, 0.5059, 1.0 );
vec4 colHat  = vec4( 0.2110, 0.4256, 0.9849, 1.0 );
   
distCol dcBody;
vec3 pTransBody = p - vec3(0.0, 0.3, 0.0);
dcBody.d = sdEllipsoid(pTransBody, vec3(0.4, 0.5, 0.3));

distCol dcPelvis;
vec3 pTransPelvis = p - vec3(0.0, -0.3, -0.05);
dcPelvis.d = sdEllipsoid(pTransPelvis, vec3(0.4, 0.4, 0.4));

distCol dcNeck;
vec3 pTransNeck = p - vec3(0.0, 0.75, 0.0);
dcNeck.d = sdVerticalCapsule(pTransNeck, 0.1, 0.14);

distCol dcHead;
vec3 pTransHead = p - vec3(0.0, 1.12, 0.0);
dcHead.d = sdSphere(pTransHead, 0.27);

distCol dcShoulderLeft;
vec3 pTransShoulderLeft = p - vec3(0.22, 0.52, 0.03);
dcShoulderLeft.d = sdSphere(pTransShoulderLeft, 0.18);

distCol dcUpperarmLeft;
vec3 pTransUpperarmLeft = p - vec3(0.4, 0.5, 0.05);
vec3 pRotUpperarmLeft = rotateX( rotateZ(pTransUpperarmLeft, 0.75 * PI  ), -0.2 * PI );
dcUpperarmLeft.d = sdVerticalCapsule(pRotUpperarmLeft, 0.4, 0.13);

distCol dcLowerarmLeft;
vec3 pTransLowerarmLeft = p - vec3(0.6, 0.25, 0.3);
vec3 pRotLowerarmLeft = rotateX( rotateZ(pTransLowerarmLeft, 0.95 * PI * time), -0.3 * PI ); //rotateZPivot(vec3 p, float angle, vec3 pivot) 
dcLowerarmLeft.d = sdVerticalCapsule(pRotLowerarmLeft, 0.4, 0.13);

distCol dcShoulderRight;
vec3 pTransShoulderRight = p - vec3(-0.22, 0.52, 0.03);
dcShoulderRight.d = sdSphere(pTransShoulderRight, 0.18);

distCol dcUpperarmRight;
vec3 pTransUpperarmRight = p - vec3(-0.4, 0.5, 0.05);
vec3 pRotUpperarmRight = rotateX( rotateZ(pTransUpperarmRight, -0.75 * PI), -0.2 * PI );
dcUpperarmRight.d = sdVerticalCapsule(pRotUpperarmRight, 0.4, 0.13);

distCol dcLowerarmRight;
vec3 pTransLowerarmRight = p - vec3(-0.6, 0.25, 0.3);
vec3 pRotLowerarmRight = rotateX( rotateZ(pTransLowerarmRight, -0.95 * PI), -0.3 * PI );
dcLowerarmRight.d = sdVerticalCapsule(pRotLowerarmRight, 0.4, 0.13);

distCol dcHatbrim;
vec3 pTransHatbrim = p - vec3(0.0, 1.27, 0.0);
dcHatbrim.d = sdTorus( pTransHatbrim, vec2(0.27, 0.03 ) );
dcHatbrim.c = colHat;

distCol dcHat;
vec3 pTransHat = p - vec3(0.0, 1.4, 0.0);
dcHat.d = sdCappedCone( pTransHat, 0.1, 0.27, 0.24 );
dcHat.c = colHat;

dc = dcHead;
dc = opSmoothUnion(dc, dcNeck,         0.04);
dc = opSmoothUnion(dc, dcBody,         0.03);
dc = opSmoothUnion(dc, dcPelvis,       0.12);
dc = opSmoothUnion(dc, dcShoulderLeft, 0.01);
dc = opSmoothUnion(dc, dcUpperarmLeft, 0.07);
dc = opSmoothUnion(dc, dcLowerarmLeft, 0.07);
dc = opSmoothUnion(dc, dcShoulderRight,0.01);
dc = opSmoothUnion(dc, dcUpperarmRight,0.07);
dc = opSmoothUnion(dc, dcLowerarmRight,0.07);

dc.c = colSkin;

//dc = opSmoothUnion(dc, dcHat          ,0.00); 
//dc = opSmoothUnion(dc, dcHatbrim      ,0.00);

`;  // don't change this line
// ......................................................................

export { SDF_designs } // don't change this line

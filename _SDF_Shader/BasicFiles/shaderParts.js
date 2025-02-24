// shaderParts

import { define_2D_SDFs } from "./define_2D_SDFs.js";
import { define_3D_SDFs } from "./define_3D_SDFs.js";
import { SDF_operations } from "./SDF_operations.js";

const buildtSDFsTop = 
 SDF_operations
  +
  `
 distCol GetDist( vec3 p ) { 
  distCol dc;
 `;

const buildtSDFsBtm = `
  return dc;    
}`

// shader
const vShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
  	vPosition = position;
  	vUv = uv;
  	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

 
const fShaderTop = `
  uniform float time;
  uniform vec3 camPos;
  varying vec3 vPosition;
  varying vec2 vUv;
  #define MAX_STEPS 250
  #define MAX_DIST 100.
  #define SURF_DIST 1e-4
  #define PI 3.1415926
  
  struct distCol { // distance, color
    float d;
    vec4 c;
  };
  
  mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
  }
   
  vec2 opMin(vec2 a, vec2 b){
    return a.x < b.x ? a : b;
  } 
  ` 
  + define_3D_SDFs + define_2D_SDFs + buildtSDFsTop
  ;
  
 // in the middle SDF_design insertion

const fShaderBtm = 
    
  buildtSDFsBtm
  + 
  `
  distCol RayMarch(vec3 ro, vec3 rd) {
    distCol dc;
    float dO = 0.;
  	for(int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd*dO;
        dc = GetDist(p);
        dO += dc.d;
  		if(dO > MAX_DIST || dO < SURF_DIST) break;
  	}
    dc.d = dO;
  	return dc;
  }

  vec3 GetNormal(vec3 p) {
  	float d = GetDist(p).d;
  	vec2 e = vec2(SURF_DIST, 0);
    float d1 = GetDist(p-e.xyy).d;
    float d2 = GetDist(p-e.yxy).d;
    float d3 = GetDist(p-e.yyx).d;
  	vec3 n = d - vec3(d1, d2, d3);
  	return normalize(n);
  }
 
  float GetAo(vec3 p, vec3 n) {
  	float occ = 0.;
  	float sca = 1.;
  	for(int i = 0; i < 5; i++) {
  		float h = 0.001 + 0.15*float(i)/4.0;
  		float d = GetDist(p+h*n).d;
  		occ += (h-d)*sca;
  		sca *= 0.95;
  	}
  	return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );
  }

  float GetLight(vec3 p, vec3 lPos) {
  	vec3 l = normalize(lPos-p);
  	vec3 n = GetNormal(p);
  	float dif = clamp(dot(n, l), 0., 1.);
  	return dif;
  }

  void main() {
  	vec2 uv = vUv-.5;
  	vec3 ro = camPos;
  	vec3 rd = normalize(vPosition - ro);
    distCol dc = RayMarch(ro, rd);
    if(dc.d >= MAX_DIST) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // no hit
    } else {
        //vec3 col;
        vec3 p = ro + rd * dc.d;
        vec3 lightPos = vec3(2, 16, 3);
        vec3 dir = vec3(GetLight(p, lightPos));
        vec3 indir = vec3(.051*GetAo(p, GetNormal(p)));
        vec4 ct = dc.c;
        vec3 c = ct.rgb;
        float t = ct.a;
        vec3 col = 0.7*c + 0.5*dir + 0.2*indir; 
        
        gl_FragColor = vec4(col, t);
    }    
  }
  `;

export { buildtSDFsTop, buildtSDFsBtm, vShader, fShaderTop, fShaderBtm };
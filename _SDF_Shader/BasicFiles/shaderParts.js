// shaderParts

import { quaternions } from "./quaternions.js";
import { define_2D_SDFs } from "./define_2D_SDFs.js";
import { define_3D_SDFs } from "./define_3D_SDFs.js";
import { SDF_operations } from "./SDF_operations.js";

const buildtSDFsTop = 
  SDF_operations
  + `
  distCol GetDist( vec3 p ) { 
  distCol dc;
 `;

const buildtSDFsBtm = `
  return dc;    
}`

// Vertex Shader
const vShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
  	vPosition = position;
  	vUv = uv;
  	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

// Fragment Shader
const fShaderTop = `
  uniform float time;
  uniform vec3 camPos;
  uniform vec2 resolution;
  uniform sampler2D splineData;
  
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
  ` 
  + quaternions + define_3D_SDFs + define_2D_SDFs + buildtSDFsTop
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
  	vec2 e = vec2(SURF_DIST, 0.0);
    float d1 = GetDist(p-e.xyy).d;
    float d2 = GetDist(p-e.yxy).d;
    float d3 = GetDist(p-e.yyx).d;
  	vec3 n = d - vec3(d1, d2, d3);
  	return normalize(n);
  }
 
  float GetAo(vec3 p, vec3 n) {
  	float occ = 0.0;
  	float sca = 1.0;
  	for(int i = 0; i < 5; i++) {
  		float h = 0.001 + 0.15*float(i)/ 4.0;
  		float d = GetDist(p+h*n).d;
  		occ += (h-d)*sca;
  		sca *= 0.95;
  	}
  	return clamp( 1.0 - 1.5*occ, 0.0, 1.0 );
  }

  float GetLight(vec3 p, vec3 lPos) {
  	vec3 l = normalize(lPos-p);
  	vec3 n = GetNormal(p);
  	float dif = clamp(dot(n, l), 0.0, 1.0);
  	return dif;
  }

  void main() {
  	vec2 uv = vUv-.5;
  	vec3 ro = camPos;
  	vec3 rd = normalize(vPosition - ro);
    distCol dc = RayMarch(ro, rd);
    
    if(dc.d >= MAX_DIST) {
        gl_FragColor = vec4(0.0); // no hit
    } else {
        vec3 p = ro + rd * dc.d;
        vec3 lightPos = vec3(2.0, 16.0, 3.0);
        float diff = GetLight(p, lightPos);
        float ao = 0.051 * GetAo(p, GetNormal(p));
        vec4 ct = dc.c;
        vec3 c = ct.rgb;
        vec3 sceneColor = 0.7 * c + 0.5 * diff + 0.2 * ao;
        gl_FragColor = vec4(sceneColor, ct.a);  
     
    }    
  }
  `;

export { buildtSDFsTop, buildtSDFsBtm, vShader, fShaderTop, fShaderBtm };
//  operations
//  some adapted from Inigo Quilez  https://iquilezles.org/articles/distfunctions/
//  .d distance     .c color, transparency
const SDF_operations = `
 
 distCol opUnion(distCol dc1, distCol dc2) { 
  distCol dc;
  float d = min(dc1.d, dc2.d);
  vec4 c = d < dc2.d ? dc1.c : dc2.c; 
  dc.d = d;
  dc.c = c;     
  return dc;
}

distCol opSubtraction(distCol dc1, distCol dc2) { 
  distCol dc;
  float d = max(-dc1.d, dc2.d);
  vec4 c = d > dc2.d ? dc1.c : dc2.c; 
  dc.d = d;
  dc.c = c;     
  return dc;
}

distCol opIntersection(distCol dc1, distCol dc2){
  distCol dc;
  float d = max(dc1.d, dc2.d);
  vec4 c = d > dc2.d ? dc1.c : dc2.c;
  dc.d = d;
  dc.c = c;     
  return dc;
}

distCol opXor(distCol dc1, distCol dc2){
  distCol dc;
  float d1 = min(dc1.d, dc2.d);
  float d2 = max(dc1.d, dc2.d);
  float d = max(d1, -d2);
  //vec4 c = ( d1 < dc1.d ^^ d2 > dc2.d ) ?  dc2.c : dc1.c;
   vec4 c = d > dc2.d ? dc1.c : dc2.c; 
  dc.d = d;
  dc.c = c;     
  return dc;    
}

distCol opSmoothUnion( distCol dc1, distCol dc2, float k ){
  distCol dc;
  float h = clamp( 0.5 + 0.5*(dc2.d-dc1.d)/k, 0.0, 1.0 );
  float d = mix( dc2.d, dc1.d, h ) - k*h*(1.0-h);
  vec4 c = d < dc2.d ? dc1.c : dc2.c; 
  dc.d = d;
  dc.c = c;     
  return dc;
}

distCol opSmoothSubtraction( distCol dc1, distCol dc2, float k ){
  distCol dc;
  float h = clamp( 0.5 - 0.5*(dc2.d+dc1.d)/k, 0.0, 1.0 );
  float d = mix( dc2.d, -dc1.d, h ) + k*h*(1.0-h);
  vec4 c = d > dc2.d ? dc1.c : dc2.c; 
  dc.d = d;
  dc.c = c;     
  return dc;
}

distCol opSmoothIntersection( distCol dc1, distCol dc2, float k ){
  distCol dc;
  float h = clamp( 0.5 - 0.5*(dc2.d-dc1.d)/k, 0.0, 1.0 );
  float d = mix( dc2.d, dc1.d, h ) + k*h*(1.0-h);
  vec4 c = d > dc2.d ? dc1.c : dc2.c;
  dc.d = d;
  dc.c = c;     
  return dc;
}

// rotations and translations 

vec3 rotateX(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
        p.x,
        p.y * c - p.z * s,
        p.y * s + p.z * c
    );
}

vec3 rotateXPivot(vec3 p, float angle, vec3 pivot) {
    p -= pivot;
    float s = sin(angle);
    float c = cos(angle);
    vec3 rotated = vec3(
        p.x,
        p.y * c - p.z * s,
        p.y * s + p.z * c
        );
    return rotated + pivot;
}

vec3 rotateY(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
        p.x * c + p.z * s,
        p.y,
        -p.x * s + p.z * c
    );
}

vec3 rotateYPivot(vec3 p, float angle, vec3 pivot) {
    p -= pivot;
    float s = sin(angle);
    float c = cos(angle);
    vec3 rotated = vec3(
        p.x * c + p.z * s,
        p.y,
        -p.x * s + p.z * c
        );
    return rotated + pivot;
}

vec3 rotateZ(vec3 p, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec3(
        p.x * c - p.y * s,
        p.x * s + p.y * c,
        p.z
    );
}

vec3 rotateZPivot(vec3 p, float angle, vec3 pivot) {
    p -= pivot;
    float s = sin(angle);
    float c = cos(angle);
    vec3 rotated = vec3(
        p.x * c - p.y * s,
        p.x * s + p.y * c,
        p.z
        );
    return rotated + pivot;
}

 `;
  
export { SDF_operations }


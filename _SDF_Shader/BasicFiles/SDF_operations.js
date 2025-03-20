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
 
vec4 opElongate( vec3 p, vec3 h) {
    //return vec4( p-clamp(p,-h,h), 0.0 ); // faster, but produces zero in the interior elongated box
    
    vec3 q = abs(p)-h;
    return vec4( max(q,0.0), min(max(q.x,max(q.y,q.z)),0.0) );
}

vec3 opLimitedRepetition(vec3 p, float s, in vec3 n)
{
    vec3 q = p - s*clamp(round(p/s),-n,n);
    return q;
} 

vec3 opCheapBend(vec3 p, float k)
{
    float c = cos(k*p.x);
    float s = sin(k*p.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return q;
}
 
float opDisplaceSin(vec3 p, float displace)
{
    return sin(displace*p.x)*sin(displace*p.y)*sin(displace*p.z);
    
}

float opRound( float sdf3d, float rad )
{
    return sdf3d - rad;
}

float opOnion( float d,  float h )
{
    return abs(d)-h;
}
//..........................................................

// operations for 2D SDFs 
 
float opExtrusion(vec3 p, float sdf2D, float h)
{
    vec2 w = vec2( sdf2D, abs(p.z) - h );
  	return min(max(w.x,w.y),0.0) + length(max(w,0.0));
}

vec2 opRevolution( vec3 p, float w )
{
    return vec2( length(p.xz) - w, p.y );
}

//..................................................................


vec3 getNormal(vec3 p) {   // Note:   different from GetNormal in shaderParts.js
    vec2 e5 = vec2(1e-5, 0); // 
    float d1 = (p-e5.xyy).x;
    float d2 = (p-e5.yxy).y;
    float d3 = (p-e5.yyx).z;
    vec3 n = normalize(vec3(d1, d2, d3));
    return n;
}

//..................................................................

// rotations, translations, mirroring 

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

vec3 translateX(vec3 p, float x) {
    return p - vec3(x, 0.0, 0.0);
}

 vec3 translateY(vec3 p, float y) {
    return p - vec3(0.0, y, 0.0);
}

vec3 translateZ(vec3 p, float z) {
    return p - vec3(0.0, 0.0, z);
}

vec3 translateXYZ(vec3 p, vec3 q) {
    return p - q;
}

vec3 mirrorYZ(vec3 p) {
    return vec3(-p.x, p.y, p.z);
}

vec3 mirrorXZ(vec3 p) {
    return vec3(p.x, -p.y, p.z);
}

vec3 mirrorXY(vec3 p) {
    return vec3(p.x, p.y, -p.z);
}
 
//...............................................

// CatmullRomCurve3D

 const int NUM_POINTS = 5;
  
vec3 controlPoints[NUM_POINTS] = vec3[](
    vec3(-1.0,  0.0,  0.5),
    vec3(-0.5,  1.0, -0.5),
    vec3( 0.5,  1.0,  0.5),
    vec3( 1.0,  0.0, -0.5),
    vec3( 0.0, -1.0,  0.0)
);

vec3 catmullRom(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t) {
    float t2 = t * t;
    float t3 = t2 * t;
    return 0.5 * ((2.0 * p1) +
                (-p0 + p2) * t +
                (2.0*p0 - 5.0*p1 + 4.0*p2 - p3) * t2 +
                (-p0 + 3.0*p1 - 3.0*p2 + p3) * t3);
}

// Returns the point on the i-th segment, parameter t between 0 and 1
vec3 getCurvePoint(int i, float t ) {
    int i0 = (i - 1 + NUM_POINTS) % NUM_POINTS;
    int i1 = i;
    int i2 = (i + 1) % NUM_POINTS;
    int i3 = (i + 2) % NUM_POINTS;
    return catmullRom(controlPoints[i0], controlPoints[i1], controlPoints[i2], controlPoints[i3], t);
}

vec3 getTangent(int seg, float t, float eps) {
    return normalize(getCurvePoint(seg, t + eps) - getCurvePoint(seg, t - eps));
}

 
// FrenetFrame on pointt
void getFrenetFrame(int seg, float t, float eps,
                      out vec3 tangent, out vec3 normal, out vec3 binormal) {
    
    tangent = getTangent(seg, t, eps);
    
    vec3 up = abs(tangent.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    
    binormal = normalize(cross(tangent, up));
    normal = cross(binormal, tangent);
}

 `;
  
export { SDF_operations }


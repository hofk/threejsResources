// Movement along a CatmullRoom Curve3D

const curveMovement = ` 

const int NUM_POINTS = 5;
int numPoints = NUM_POINTS;
float eps = 0.001;

vec3 controlPoints[NUM_POINTS] = vec3[](
    vec3( 10.0,  0.0,  0.0),
    vec3( 15.0,  5.0, -5.0),
    vec3(  5.0, 15.0,  0.0),
    vec3( -5.0, 10.0,  5.0),
    vec3(-10.0,  0.0,  5.0)
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
vec3 getCurvePoint(int i, float t, int numPoints ) {
    
    int i0 = (i - 1 + numPoints) % numPoints;
    int i1 = i;
    int i2 = (i + 1) % numPoints;
    int i3 = (i + 2) % numPoints;
    return catmullRom(controlPoints[i0], controlPoints[i1], controlPoints[i2], controlPoints[i3], t);
}
vec3 getMovingCapsulePos() {
    float u = mod(0.05*time, 1.0); // globalparameter 0 .. 1
    float segFloat = u * float(numPoints);
    int seg = int(floor(segFloat));
    float tCurve = fract(segFloat);
    return getCurvePoint(seg, tCurve, numPoints);
}
vec3 getTangent() {
    float u = mod(0.05*time, 1.0); // globalparameter 0 .. 1
    float segFloat = u * float(numPoints);
    int seg = int(floor(segFloat));
    float tCurve = fract(segFloat);
    return normalize(getCurvePoint(seg, tCurve + eps, numPoints) - getCurvePoint(seg, tCurve - eps, numPoints));
}
void getFrenetFrame( out vec3 tangent, out vec3 normal, out vec3 binormal) {
    tangent = getTangent();
    vec3 up = abs(tangent.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    binormal = normalize(cross(tangent, up));
    normal = cross(binormal, tangent);
}


 `;
  
export { curveMovement }

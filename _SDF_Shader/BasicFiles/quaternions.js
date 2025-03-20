// quaternions

// adapted from source: https://www.shadertoy.com/view/fdtfWM   @author  jt 

// quat setFromBasis( vec3 e1, vec3 e2, vec3 e3 )  // added  @author hofk

//-------------------------------------------------------------------------

// https://www.shadertoy.com/view/fdtfWM
// example: using quaternions (2022 by jt)
// NOTE: See rotation-function comments for connection to Euler Rodrigues / Rodrigues Rotation Formula.

// Variants:
// https://www.shadertoy.com/view/fsdBDM example: using dual quaternions
// https://www.shadertoy.com/view/7dcBDj example: using rodrigues vectors

// tags: quaternion, rotation, quaternions, euler, rodrigues, formula

// https://en.wikipedia.org/wiki/Quaternion

// NOTE: using vec4 here would be more concise - but when quaternions have their own type,
//       the type-checking done by the glsl compiler can be used to detect errors
//       caused by accidentally confusing vec4 with quaternions
//       (e.g. accidentally multiplying a quaternion with an axis-angle, both stored in vec4).
//       Also in mathematical notation usually the real part is written first, followed by the imaginary part:
//       w + xi + yj + zk while the vec4 constructor expects x, y, z, w.
//       When defining a quaternion type the mathematical order can be chosen.
//       Last but not least using an own type for quaternions allows to overload functions, like norm
//       (this becomes increasingly valuable when introducing more systems,
//        like complex numbers, dual numbers, dual quaternions...)

const quaternions =  `

struct quat
{
    float s;
    vec3 v;
};

// NOTE: https://en.wikipedia.org/wiki/Quaternion#Quaternions_and_the_space_geometry
// NOTE: The cross-product of the vector-parts of any quaternions p, q can be expressed by (pq - qp)/2
//       (the scalar part of this expression always evaluates to zero)
//       (the expression pq - qp is apparently called "commutator")
// NOTE: The dot-product of all four components of quaternions p, q can be expressed by (pq* + qp*)/2
//       (where * denotes the quaternion conjugate, i.e. negation of the vector-part)
// NOTE: This is straight forward but cumbersome to check - use e.g. Maxima:
//       % quaternion-multiplication (in component form)
//       a_3(a_1, b_1, c_1, d_1, a_2, b_2, c_2, d_2) := a_1*a_2 - b_1*b_2 - c_1*c_2 - d_1*d_2;
//       b_3(a_1, b_1, c_1, d_1, a_2, b_2, c_2, d_2) := a_1*b_2 + b_1*a_2 + c_1*d_2 - d_1*c_2;
//       c_3(a_1, b_1, c_1, d_1, a_2, b_2, c_2, d_2) := a_1*c_2 - b_1*d_2 + c_1*a_2 + d_1*b_2;
//       d_3(a_1, b_1, c_1, d_1, a_2, b_2, c_2, d_2) :=a_1 * d_2 + b_1 * c_2 - c_1 * b_2 + d_1 * a_2;
//       % evaluate squared norm |q|^2 = qq* = a^2 + b^2 + c^2 + d^2
//       a_3(a,b,c,d,a,-b,-c,-d);b_3(a,b,c,d,a,-b,-c,-d);c_3(a,b,c,d,a,-b,-c,-d);d_3(a,b,c,d,a,-b,-c,-d);
//       % evaluate (pq - qp)
//       a_3(a,b,c,d,A,B,C,D)-a_3(A,B,C,D,a,b,c,d);b_3(a,b,c,d,A,B,C,D)-b_3(A,B,C,D,a,b,c,d);c_3(a,b,c,d,A,B,C,D)-c_3(A,B,C,D,a,b,c,d);d_3(a,b,c,d,A,B,C,D)-d_3(A,B,C,D,a,b,c,d);
//       % evaluate (pq* + qp*)
//       a_3(a,b,c,d,A,-B,-C,-D)+a_3(A,B,C,D,a,-b,-c,-d);b_3(a,b,c,d,A,-B,-C,-D)+b_3(A,B,C,D,a,-b,-c,-d);c_3(a,b,c,d,A,-B,-C,-D)+c_3(A,B,C,D,a,-b,-c,-d);d_3(a,b,c,d,A,-B,-C,-D)+d_3(A,B,C,D,a,-b,-c,-d);

quat conjugate(quat q)
{
    return quat(q.s,-q.v);
}

float norm_squared(quat q)
{
    return q.s * q.s + dot(q.v, q.v);
}

float norm(quat q)
{
    return sqrt(norm_squared(q));
}

quat mul(float s, quat q)
{
    return quat(s * q.s, s * q.v);
}

quat div(quat q, float s)
{
    return quat(q.s / s, q.v / s);
}

//quat normalize(quat q) // ERROR: "Name of a built-in function cannot be redeclared as function"
quat normalify(quat q) // NOTE: can't reuse function name normalize here
{
    return div(q, norm(q));
}

//quat normalize(quat q) // ERROR: "Name of a built-in function cannot be redeclared as function"
//quat inverse(quat q) // ERROR: "Name of a built-in function cannot be redeclared as function"
quat invert(quat q) // NOTE: can't reuse function name inverse here
{
    return div(conjugate(q), norm_squared(q));
}

quat neg(quat q)
{
    return quat(-q.s,-q.v);
}

quat add(quat a, quat b)
{
    return quat(a.s + b.s, a.v + b.v);
}

quat sub(quat a, quat b)
{
    return quat(a.s - b.s, a.v - b.v);
}

quat mul(quat a, quat b)
{
    return quat(a.s * b.s - dot(a.v, b.v), a.s * b.v + b.s * a.v + cross(a.v, b.v));
}

quat div(quat a, quat b)
{
    return mul(a, invert(b));
}

quat angle_axis(float angle, vec3 axis)
{
    return quat(cos(angle / 2.0), normalize(axis) * sin(angle / 2.0)); // NOTE: normalize can be omitted in case of unit-vector
}

quat axis_angle(vec3 axis, float angle)
{
    return quat(cos(angle / 2.0), normalize(axis) * sin(angle / 2.0)); // NOTE: normalize can be omitted in case of unit-vector
}

// Also this looks interesting: http://number-none.com/product/Understanding Slerp, Then Not Using It/
// "[...] there are 3 basic properties we often want when interpolating rotations:
//  commutativity, constant velocity, and minimal torque.
//  Unfortunately, it seems impossible to get all three at once."
//  Three methods of rotation interpolation:
//  quaternion SLERP: NOT commutative, constant velocity, torque-minimal
//  normalized quaternion linear interpolation: commutative, NOT constant velocity, torque-minimal
//  log-quaternion linear interpolation: commutative, constant velocity, NOT torque-minimal"
// Quaternion SLERP adapted from https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/index.htm
quat slerp(quat qa, quat qb, float t) // NOTE: qa, qb must be unit!
{
    // Calculate angle between them.
    float cosHalfTheta = qa.s * qb.s + dot(qa.v, qb.v);
    // Unfortunately every rotation can be represented by two quaternions: (++++) or (----)
    if (cosHalfTheta < 0.0) // avoid taking the longer way: choose one representation
    {
        qb = neg(qb); // NOTE: source appears to be missing a minus-sign applied to the z component!
        cosHalfTheta = -cosHalfTheta;
    }

    // if qa = qb or qa = -qb then theta = 0 and we can return qa
    if (abs(cosHalfTheta) >= 1.0) // greater-sign necessary for numerical stability
        return qa;

    // Calculate temporary values.
    float halfTheta = acos(cosHalfTheta);
    float sinHalfTheta = sqrt(1.0 - cosHalfTheta * cosHalfTheta); // NOTE: we checked above that |cosHalfTheta| < 1
    // if theta = pi then result is not fully defined
    // we could rotate around any axis normal to qa or qb
    if (abs(sinHalfTheta) < 0.001/*some epsilon*/)
        return add(mul(0.5, qa), mul(0.5, qb));

    float ratioA = sin((1.0 - t) * halfTheta) / sinHalfTheta;
    float ratioB = sin(t * halfTheta) / sinHalfTheta;

    return add(mul(ratioA, qa), mul(ratioB, qb));
}

/*
vec3 rotate(quat q, vec3 p) // NOTE: order of parameters copies order of applying rotation matrix: M v
{
    return p + 2.0 * cross(q.v, cross(q.v, p) + q.s * p); // suggested by mla, requires q to be unit (i.e. normalized)

    // Derive to https://en.wikipedia.org/wiki/Euler%E2%80%93Rodrigues_formula#Vector_formulation
    //return p + 2.0 * cross(q.v, cross(q.v, p)) + 2.0 * cross(q.v, q.s * p); // cross-product is distributive
    //return p + 2.0 * cross(q.v, q.s * p) + 2.0 * cross(q.v, cross(q.v, p)); // vector addition is commutative
    //return p + 2.0 * q.s * cross(q.v, p) + 2.0 * cross(q.v, cross(q.v, p)); // scalar can be factored-out
    // translate variable names
    vec3 x = p;
    float a = q.s;
    vec3 omega = q.v;
    return x + 2.0 * a * cross(omega, x) + 2.0 * cross(omega, cross(omega, x)); // Euler Rodrigues' Formula
}
*/
/*
vec3 rotate(quat q, vec3 p) // NOTE: order of parameters copies order of applying rotation matrix: M v
{
    return p + 2.0 * cross(q.v, cross(q.v, p) + q.s * p); // suggested by mla, requires q to be unit (i.e. normalized)

    // Derive to https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula#Statement
    // translate variable names
    vec3 v = p;
    float c = q.s;
    float s = length(q.v);
    vec3 k = q.v / s;
    //return v + 2.0 * cross(s*k, cross(s*k, v) + c * v); // distribute cross-product...
    //return v + 2.0 * cross(s*k, cross(s*k, v)) + 2.0 * cross(s*k, c * v); // factor-out scalar...
    //return v + 2.0 * s*s*cross(k, cross(k, v)) + 2.0 * s*c*cross(k, v); // rewrite perpendicular component...
    // NOTE: apply identity cross(k, cross(k, v)) == dot(v, k) * k - v, the perpendicular component of v with respect to k
    //return v + 2.0 * s*s*(dot(v, k) * k - v) + 2.0 * s*c*cross(k, v); // swap terms...
    //return v + 2.0 * s*c*cross(k, v) + 2.0 * s*s*(dot(v, k) * k - v); // distribute product...
    //return v - 2.0 * s*s*v + 2.0 * s*c*cross(k, v) + 2.0 * s*s*(dot(v, k) * k); // factor-out...
    //return (1.0 - 2.0 * s*s)*v + 2.0 * s*c*cross(k, v) + 2.0 * s*s*(dot(v, k) * k); // apply trigonometric identities...
    // NOTE: trigonometric identities
    // (sin phi)^2 == (1 - cos(2 phi)) / 2
    // (sin phi)(cos phi) == (sin(2 phi)) / 2
    // NOTE: this changes the angle by factor two, which cancels-out the half in the angle-axis quaternion definition!
    //       unfortunately this "glue-code" works only for half the angles (reset the timer when comparing both versions!)
    float S = sin(2.0 * asin(s));
    float C = cos(2.0 * acos(c));
    //return (1.0 - (1.0 - C))*v + S*cross(k, v) + (1.0 - C)*(dot(v, k) * k); // cleanup...
    return C*v + S*cross(k, v) + (1.0 - C)*(dot(v, k) * k); // Rodrigues' Rotation Formula
}
*/
// Rodrigues' Rotation Formula: can be used to rotate a point around an axis. However to combine rotations use quaternions!
vec3 rotate(float angle, vec3 axis, vec3 point) // NOTE: axis must be unit!
{
    float c = cos(angle);
    float s = sin(angle);
    return c * point + s * cross(axis, point) + (1.0 - c) * (dot(point, axis) * axis); // Rodrigues' Rotation Formula
}

vec3 rotate(quat q, vec3 p) // NOTE: order of parameters copies order of applying rotation matrix: M v
{
    return mul(mul(q, quat(0.0, p)), invert(q)).v; // NOTE: in case of unit-quaternion reciprocal can be replaced by conjugate
}
/*
vec3 rotate(vec3 p, quat q) // NOTE: using overload with swapped arguments for inverse rotation - is this practical or just confusing?
{
    return mul(mul(reciprocal(q), quat(0.0, p)), q).v; // NOTE: in case of unit-quaternion reciprocal can be replaced by conjugate
    // return 2.0 * (cross(q.v, p) * q.s + dot(q.v, p) * q.v) + (q.s * q.s - dot(q.v, q.v)) * p; // NOTE: multiplying-out & simplifying gives this equation after several steps - a different way to write the Rodrigues' Formula
}
*/

// source: https://www.xarg.org/proof/quaternion-from-two-vectors/
quat rotate_between(vec3 u, vec3 v)
{
    float d = dot(u, v);
    vec3 w = cross(u, v);

    return normalify(quat(d + sqrt(d * d + dot(w, w)), w));
}

mat3 quat_to_mat3(quat q)
{
    return
        mat3
        (
            rotate(q, vec3(1,0,0)),
            rotate(q, vec3(0,1,0)),
            rotate(q, vec3(0,0,1))
        );
}

mat4 quat_to_mat4(quat q)
{
    return
        mat4
        (
            vec4(rotate(q, vec3(1,0,0)), 0.0),
            vec4(rotate(q, vec3(0,1,0)), 0.0),
            vec4(rotate(q, vec3(0,0,1)), 0.0),
            vec4(0.0,    0.0,    0.0,    1.0)
        );
}


mat4 make_proj_mat(float focal_length)
{
    return
        mat4
        (
            vec4(focal_length, 0.0, 0.0, 0.0),
            vec4(0.0, focal_length, 0.0, 0.0),
            vec4(0.0, 0.0, 0.0, 1.0),
            vec4(0.0, 0.0, 0.0, 0.0)
        );
}


#define pi 3.1415926

vec2 project(mat4 projection, vec3 v)
{
    vec4 w = projection * vec4(v, 1.0);
    return vec2(w) / w.w;
}

quat yaw_pitch_roll(float Yaw, float Pitch, float Roll)
{
    return
        mul
        (
            angle_axis(Pitch, vec3(1,0,0)),
            mul
            (
                angle_axis(Yaw, vec3(0,1,0)),
                angle_axis(Roll, vec3(0,0,1))
            )
        );
}

quat get_camera_rotation()
{
    float Pitch = 0.05 * 2.0 * pi * time;
    float Yaw = 0.2 * 2.0 * pi * time;
    float Roll = 0.3 * 2.0 * pi * time;

    return yaw_pitch_roll(Yaw, Pitch, Roll);
}

vec3 get_camera_position()
{
    return vec3(0.5 * cos(0.3 * 2.0 * pi * time), 0.5 * sin(0.2 * 2.0 * pi * time), 1.0);
}

float draw_line(vec2 a, vec2 b, vec2 p)
{
    vec2 ba = b - a;
    vec2 pa = p - a;
    float h = clamp(dot(pa,ba) / dot(ba,ba), 0.0, 1.0);
    return length(pa - h * ba);
}

float draw_quad(vec2 A, vec2 B, vec2 C, vec2 D, vec2 p)
{
    return min(min(draw_line(A, B, p), draw_line(B, C, p)), min(draw_line(C, D, p), draw_line(D, A, p)));
}
/*
float draw_diagonals(vec2 A, vec2 B, vec2 C, vec2 D, vec2 p)
{
    return min(draw_line(A, C, p), draw_line(B, D, p));
}

float spot(float s, vec2 q, vec2 p)
{
    vec2 a = vec2( s, s);
    vec2 b = vec2(-s, s);
    return draw_diagonals(q - a, q - b, q + a, q + b, p);
}
*/

/*
float draw_cube(mat4 projection, quat camera_rotation, vec3 camera_translation, vec3 cube_position, float cube_size, vec2 p)
{
    vec3 v000 = cube_position + vec3(-1,-1,-1) * cube_size;
    vec3 v001 = cube_position + vec3(-1,-1,+1) * cube_size;
    vec3 v010 = cube_position + vec3(-1,+1,-1) * cube_size;
    vec3 v011 = cube_position + vec3(-1,+1,+1) * cube_size;
    vec3 v100 = cube_position + vec3(+1,-1,-1) * cube_size;
    vec3 v101 = cube_position + vec3(+1,-1,+1) * cube_size;
    vec3 v110 = cube_position + vec3(+1,+1,-1) * cube_size;
    vec3 v111 = cube_position + vec3(+1,+1,+1) * cube_size;

    vec2 V000 = project(projection, rotate(camera_rotation, v000) + camera_translation);
    vec2 V001 = project(projection, rotate(camera_rotation, v001) + camera_translation);
    vec2 V010 = project(projection, rotate(camera_rotation, v010) + camera_translation);
    vec2 V011 = project(projection, rotate(camera_rotation, v011) + camera_translation);
    vec2 V100 = project(projection, rotate(camera_rotation, v100) + camera_translation);
    vec2 V101 = project(projection, rotate(camera_rotation, v101) + camera_translation);
    vec2 V110 = project(projection, rotate(camera_rotation, v110) + camera_translation);
    vec2 V111 = project(projection, rotate(camera_rotation, v111) + camera_translation);

    return
        min
        (
            min
            (
                draw_quad(V000, V001, V011, V010, p),
                draw_quad(V100, V101, V111, V110, p)
            ),
            min
            (
                min(draw_line(V000, V100, p), draw_line(V001, V101, p)),
                min(draw_line(V011, V111, p), draw_line(V010, V110, p))
            )
        );
    / *
    return
        min
        (
            min
            (
                min(spot(0.02, V000, p), spot(0.02, V001, p)),
                min(spot(0.02, V010, p), spot(0.02, V011, p))
            ),
            min
            (
                min(spot(0.02, V100, p), spot(0.02, V101, p)),
                min(spot(0.02, V110, p), spot(0.02, V111, p))
            )
        );
        * /
}
*/

 /*
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    mat4 projection = make_proj_mat(1.0/ *focal length* /);
    //mat4 projection = make_proj_mat(1.0 + 0.5 * cos(time)/ *focal length* /);
    //o = projection * view * model * i

    quat camera_rotation = get_camera_rotation();
    vec3 camera_position = get_camera_position();

    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    float o = 1.0;
    o = min(o, draw_cube(projection, camera_rotation, camera_position, vec3(0,0,0)/ *cube_position* /, 0.25/ *cube_size* /, p));

    vec3 col = vec3(0.0);
    //col = max(col, mix(vec3(1.0), vec3(0.0), smoothstep(0.00, 0.01, o)));
    col = max(col, mix(vec3(1.0), vec3(0.0), smoothstep(0.00, 5./iResolution.y, o)));

    fragColor = vec4(col,1.0);
}
*/ 
 
quat setFromBasis( in vec3 e1, in vec3 e2, in vec3 e3 )  // added  @author hofk
{
    
    quat resultQuat;
    
    float x;
    float y;
    float z;
    float w;
    float dis;
    float nd;
    float trace = e1.x + e2.y + e3.z;
    
    if ( trace > 0.0 ) {
        
        dis = trace + 1.0;
        dis = dis > 0.0 ? dis : 1e5; 
        nd = 0.5 / sqrt( dis );
        
        w = 0.25 / nd;
        x = -( e3.y - e2.z ) * nd;
        y = -( e1.z - e3.x ) * nd;
        z = -( e2.x - e1.y ) * nd;
        
    }
    else
    {
        if ( e1.x > e2.y && e1.x > e3.z ) {
            
            dis = 1.0 + e1.x - e2.y - e3.z;
            dis = dis > 0.0 ? dis : 1e5; 
            nd = 2.0 * sqrt( dis );
            
            w = ( e3.y - e2.z ) / nd;
            x = -0.25 * nd;
            y = -( e1.y + e2.x ) / nd;
            z = -( e1.z + e3.x ) / nd;
            
        }
        else
        {
            if ( e2.y > e3.z ) {
                
                dis = 1.0 + e2.y - e1.x - e3.z;
                dis = dis > 0.0 ? dis : 1e5;
                nd = 2.0 * sqrt( dis );
                
                w = ( e1.z - e3.x ) / nd;
                x = -( e1.y + e2.x ) / nd;
                y = -0.25 * nd;
                z = -( e2.z + e3.y ) / nd;
                
            } 
            else
            {
                dis = 1.0 + e3.z - e1.x - e2.y;
                dis = dis > 0.0 ? dis : 1e5;
                nd = 2.0 * sqrt( dis );
                
                w = ( e2.x - e1.y ) / nd;
                x = -( e1.z + e3.x ) / nd;
                y = -( e2.z + e3.y ) / nd;
                z = -0.25 * nd;
               
            }
            
        }
        
    }
    
    resultQuat.s = w;
    resultQuat.v = vec3(x, y, z);
    
    return resultQuat;
    
}
 
 `;
 
export { quaternions }
// vertex shader
var BILIBILI_VERTEX_SHADER_SOURCE =
  `
attribute vec4 a_position;
attribute vec3 a_normal;
attribute vec4 a_color;
attribute vec2 a_texcoord;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;


varying vec4 v_color;
varying vec3 v_normal;
varying vec2 v_texcoord;

varying vec3 v_surfaceToLight; 
varying vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_color = a_color;
  v_texcoord = a_texcoord;

   
  // 计算表面的世界坐标
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;
  // 计算表面到光源的方向
  // 传递给片断着色器
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  v_surfaceToView = normalize(u_viewWorldPosition - surfaceWorldPosition);
}
`;
// fragment shader
var BILIBILI_FRAGMENT_SHADER_SOURCE =
  `
precision mediump float;

varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texcoord;

varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

uniform sampler2D u_texture1;


void main()
{
  // 由于 v_normal 是插值出来的，和有可能不是单位向量，
  // 可以用 normalize 将其单位化。
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float light = dot(normal, surfaceToLightDirection);
  float specular = 0.0;
  if (light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }

  gl_FragColor = v_color*(texture2D(u_texture1,v_texcoord));

  gl_FragColor.rgb *= light * u_lightColor;
  gl_FragColor.rgb += specular * u_specularColor;

}
`;
var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');
var program = createProgram(gl, BILIBILI_VERTEX_SHADER_SOURCE, BILIBILI_FRAGMENT_SHADER_SOURCE)
  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  var normalLocation = gl.getAttribLocation(program, "a_normal");
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

  // lookup uniforms
  var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
  var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
  var shininessLocation = gl.getUniformLocation(program, "u_shininess");
  var lightWorldPositionLocation =
      gl.getUniformLocation(program, "u_lightWorldPosition");
  var viewWorldPositionLocation =
      gl.getUniformLocation(program, "u_viewWorldPosition");
  var worldLocation =
      gl.getUniformLocation(program, "u_world");
  var lightColorLocation =
      gl.getUniformLocation(program, "u_lightColor");
  var specularColorLocation =
      gl.getUniformLocation(program, "u_specularColor");
  var textureLocation = gl.getUniformLocation(program, "u_texture1");


  gl.clearColor(1, 1,1, 1.0)

//camera
var cameraAngleRadians = degToRad(0);



var image = document.createElement("img")
image.src = jpg_123
//bilibili
var bilibili_obj = new Object();
bilibili_obj.vertexBuffer = gl.createBuffer();
bilibili_obj.colorBuffer = gl.createBuffer();
bilibili_obj.normalBuffer = gl.createBuffer();
bilibili_obj.texcoordBuffer = gl.createBuffer();
bilibili_obj.texture = gl.createTexture();


var bilibili_center = [150,110,50];
var bilibili_directZ = [0, 0, 1, 1];
var bilibili_directXR = [1, 0, 0, 1];
var bilibili_directYR = [0, 1, 0, 1];
var bilibili_directZR = [0, 0, 1, 1];
var bilibili_translation = [100, 0, -600];
var bilibili_rotation = [degToRad(0), degToRad(0), degToRad(0)];
var bilibili_scale = [1, 1, 1];
var bilibili_fieldOfViewRadians = degToRad(100);

bilibili_colors = [];
bilibili_vertices = [];
bilibili_faces = [];
bilibili_texcoord =[] // TODO 写texcoord
drawbilibili();
bilibili_array = []
bilibili_array_colors = []
bilibili_normal = []
bilibili_array = getArray(bilibili_vertices, bilibili_faces)
bilibili_array_colors = getArrayColors(bilibili_colors,bilibili_faces)
bilibili_normal = computeNormalVector(bilibili_vertices, bilibili_faces)
bilibili_texcoord = getOriginTex(bilibili_array.length/9) 

bilibili_convertData()
console.log(bilibili_obj)

//bilibili2
var bilibili2_obj = new Object();
bilibili2_obj.vertexBuffer = gl.createBuffer();
bilibili2_obj.indexBuffer = gl.createBuffer();
bilibili2_obj.colorBuffer = gl.createBuffer();
bilibili2_obj.normalBuffer = gl.createBuffer();
bilibili2_obj.texture = gl.createTexture();
//  160,146,100
var bilibili2_center = [0,0,0];
var bilibili2_directZ = [1, 0, 0, 1];
var bilibili2_directXR = [1, 0, 0, 1];
var bilibili2_directYR = [0, 1, 0, 1];
var bilibili2_directZR = [0, 0, 1, 1];
var bilibili2_translation = [-300, 75, -600];
var bilibili2_rotation = [degToRad(0), degToRad(0), degToRad(0)];
var bilibili2_scale = [1, 1, 1];
var bilibili2_fieldOfViewRadians = degToRad(60);

bilibili2_colors = [];
bilibili2_vertices = [];
bilibili2_faces = [];
drawbilibili2()
bilibili2_normal = computeAvgNormalVector(bilibili2_vertices,bilibili2_faces)
bilibili2_convertData()

//地图和天空
var ground_obj = new Object();
ground_obj.vertexBuffer = gl.createBuffer()
// ground_obj.indexBuffer = gl.createBuffer()
ground_obj.colorBuffer = gl.createBuffer()
ground_obj.normalBuffer = gl.createBuffer()
ground_obj.texcoordBuffer = gl.createBuffer();
ground_obj.texture = gl.createTexture();

var ground_center = [0,0,0];
var ground_directZ = [1, 0, 0, 1];
var ground_directXR = [1, 0, 0, 1];
var ground_directYR = [0, 1, 0, 1];
var ground_directZR = [0, 0, 1, 1];
var ground_translation = [0, 0, -600];
var ground_rotation = [degToRad(0), degToRad(0), degToRad(0)];
var ground_scale = [1, 1, 1];
var ground_fieldOfViewRadians = degToRad(60);

ground_colors = [];
ground_vertices = [];
ground_faces = [];
ground_texcoord = [];
drawground()
ground_array = []
ground_array_colors = []
ground_normal = []
ground_array = getArray(ground_vertices, ground_faces)
ground_array_colors = getArrayColors(ground_colors,ground_faces)
ground_normal = computeNormalVector(ground_vertices, ground_faces)
  for( var j = 0  ; j< ground_array.length/ 18 ; j++)
  {
    ground_texcoord.push(0.28)
    ground_texcoord.push(0)
    ground_texcoord.push(0.45)
    ground_texcoord.push(0)
    ground_texcoord.push(0.28)
    ground_texcoord.push(1)
    ground_texcoord.push(0.28)
    ground_texcoord.push(1)
    ground_texcoord.push(0.45)
    ground_texcoord.push(0)
    ground_texcoord.push(0.45)
    ground_texcoord.push(1)
  }
ground_convertDate()

//馆长
var guanzhang_obj = new Object();
guanzhang_obj.vertexBuffer = gl.createBuffer()
guanzhang_obj.colorBuffer = gl.createBuffer()
guanzhang_obj.normalBuffer = gl.createBuffer()
guanzhang_obj.texcoordBuffer = gl.createBuffer();
guanzhang_obj.texture = gl.createTexture();

var guanzhang_center = [0,0,0];
var guanzhang_directZ = [1, 0, 0, 1];
var guanzhang_directXR = [1, 0, 0, 1];
var guanzhang_directYR = [0, 1, 0, 1];
var guanzhang_directZR = [0, 0, 1, 1];
var guanzhang_translation = [0, 75, -600];
var guanzhang_rotation = [degToRad(0), degToRad(0), degToRad(0)];
var guanzhang_scale = [1, 1, 1];
var guanzhang_fieldOfViewRadians = degToRad(60);

guanzhang_colors = [];
guanzhang_vertices = [];
guanzhang_faces = [];
guanzhang_texcoord = [];
drawguanzhang()
console.log(guanzhang_vertices)
guanzhang_array = []
guanzhang_array_colors = []
guanzhang_normal = []
guanzhang_array = getArray(guanzhang_vertices, guanzhang_faces)
guanzhang_array_colors = getArrayColors(guanzhang_colors,guanzhang_faces)
guanzhang_normal = computeNormalVector(guanzhang_vertices, guanzhang_faces)
guanzhang_texcoord.push(0.25) ;guanzhang_texcoord.push(1)
guanzhang_texcoord.push(0);guanzhang_texcoord.push(1)
guanzhang_texcoord.push(0);guanzhang_texcoord.push(0)
guanzhang_texcoord.push(0.25);guanzhang_texcoord.push(1)
guanzhang_texcoord.push(0);guanzhang_texcoord.push(0)
guanzhang_texcoord.push(0.25);guanzhang_texcoord.push(0)
  for( var j = 0  ; j< 4; j++)
  {
    guanzhang_texcoord.push(0.5) ;guanzhang_texcoord.push(1)
   guanzhang_texcoord.push(0.5);guanzhang_texcoord.push(0)
   guanzhang_texcoord.push(0.75);guanzhang_texcoord.push(0)
   guanzhang_texcoord.push(0.5);guanzhang_texcoord.push(1)
     guanzhang_texcoord.push(0.75);guanzhang_texcoord.push(0)
    guanzhang_texcoord.push(0.75);guanzhang_texcoord.push(1)
  }
  guanzhang_texcoord.push(0.75) ;guanzhang_texcoord.push(0)
  guanzhang_texcoord.push(1);guanzhang_texcoord.push(0)
  guanzhang_texcoord.push(1);guanzhang_texcoord.push(1)
  guanzhang_texcoord.push(0.75);guanzhang_texcoord.push(0)
    guanzhang_texcoord.push(1);guanzhang_texcoord.push(1)
   guanzhang_texcoord.push(0.75);guanzhang_texcoord.push(1)
guanzhang_convertDate()


// 光线
var light_obj = new Object()
light_obj.vertexBuffer = gl.createBuffer()
light_obj.colorBuffer = gl.createBuffer()
light_obj.normalBuffer = gl.createBuffer()
light_obj.texture = gl.createTexture();
// light_transfer 用 light_pos
var light_fieldOfViewRadians = degToRad(60);
light_colors = [];
light_vertices = [];
light_faces = [];
drawlight()
light_array = []
light_array_colors = []
light_normal = []
light_array = getArray(light_vertices, light_faces)
light_array_colors = getArrayColors(light_colors,light_faces)
light_normal = computeNormalVector(light_vertices, light_faces)
light_convertDate()





// drawSceneIndex();
 // Start drawing
 var g_last = Date.now();
 var ANGLE_STEP = 45.0;
 var JUMP_STEP = 10000000.0;
 var isup = true;
 var isdown = false;
 var isup2 = true;
 var isdown2 = false;
 var isup3 = true;
 var isdown3 = false;
 var requestAnimationid = 1;  // 用来删除相机
 var requestAnimationid2 = 1;  // 用来删除动画
 var isAlive = true;  // 是否在动
 var forward = true; //向前跳
 var light_pos =[-289,300,-120]
 var shininess = 150;
 



 var tick1 = function () {
  cameraAngleRadians = animateCamera(cameraAngleRadians);  // Update the rotation angle
  requestAnimationid = requestAnimationFrame(tick1, canvas); // Request that the 
  drawSceneIndex();
};

var tick2 = function () {
  animateBilibili()
  requestAnimationid2 = requestAnimationFrame(tick2, canvas); // Request that the 
  drawSceneIndex(); // Draw the trianglebrowser ?calls tick
};
tick1();
tick2();
// drawSceneIndex()

function animateCamera(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 100000.0;
  return newAngle %= 360;
}

function animateBilibili(){
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // xfj 轴跳跃
  if(isup)
  {
    bilibili2_translation[1] = bilibili2_translation[1]+(JUMP_STEP*1)/1000000.0
  }
  if(isdown)
  {
    bilibili2_translation[1] = bilibili2_translation[1]-(JUMP_STEP*1)/1000000.0
  }
  if(bilibili2_translation[1]<=75)
  {
    isup = true;
    isdown = false;
  }
  if(bilibili2_translation[1]>=300)
  {
    isup = false;
    isdown = true;
  }


  if(isup2)
  {
    var angleInDegrees = 20;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    bilibili_rotation[1] += angleInRadians % 360;
    bilibili_translation[1] = bilibili_translation[1]+(JUMP_STEP*0.1)/1000000.0
  }
  if(isdown2)
  {
    bilibili_translation[1] = bilibili_translation[1]-(JUMP_STEP*0.5)/1000000.0
  }
  if(bilibili_translation[1]<=75)
  {
    isup2 = true;
    isdown2 = false;
  }
  if(bilibili_translation[1]>=600)
  {
    isup2 = false;
    isdown2 = true;
  }

 
  if(isup3)
  {
    var angleInDegrees = 20;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    guanzhang_rotation[2] -= 0.1*angleInRadians % 360;
    guanzhang_translation[0] = guanzhang_translation[0]+(JUMP_STEP*0.1)/500000.0
  }
  if(isdown3)
  {
    var angleInDegrees = 20;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    guanzhang_rotation[2] += 0.1*angleInRadians % 360;
    guanzhang_translation[0] = guanzhang_translation[0]-(JUMP_STEP*0.1)/500000.0
  }
  if(guanzhang_translation[0]<=-500)
  {
    isup3 = true;
    isdown3 = false;
  }
  if(guanzhang_translation[0]>=500)
  {
    isup3 = false;
    isdown3 = true;
  }


  if(forward){
  bilibili2_translation[0] += 7 * bilibili2_directZ[0];
  bilibili2_translation[1] += 7 * bilibili2_directZ[1];
  bilibili2_translation[2] += 7 * bilibili2_directZ[2];
  }else{
  bilibili2_translation[0] += 7 * bilibili2_directZ[0];
  bilibili2_translation[1] += 7 * bilibili2_directZ[1];
  bilibili2_translation[2] += 7 * bilibili2_directZ[2];
  }
  if(bilibili2_translation[2]>=-200)
  {
    forward = true;
    var angleInDegrees = 180
    var angleInRadians = angleInDegrees * Math.PI / 180;
    bilibili2_rotation[1] = angleInRadians;
  }
  if(bilibili2_translation[2]<=-1000)
  {
    forward = false;
    var angleInDegrees = 0
    var angleInRadians = angleInDegrees * Math.PI / 180;
    bilibili2_rotation[1] = angleInRadians;
  }
}  

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
function bilibili_convertData() {
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili_array), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili_array_colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili_normal), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili_texcoord),gl.STATIC_DRAW);

}
function bilibili2_convertData() {
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili2_vertices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bilibili2_obj.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bilibili2_faces), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili2_colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bilibili2_normal), gl.STATIC_DRAW)
}
function ground_convertDate() {
  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ground_array), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ground_array_colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ground_normal), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ground_texcoord),gl.STATIC_DRAW);
}

function guanzhang_convertDate() {
  gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(guanzhang_array), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(guanzhang_array_colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(guanzhang_normal), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.texcoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(guanzhang_texcoord),gl.STATIC_DRAW);
}

function light_convertDate() {
  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(light_array), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(light_array_colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(light_normal), gl.STATIC_DRAW)
}


function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}



function drawSceneIndex() {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);
  gl.clearColor(0.5, 0.5,0.5, 1.0)


  // set the light direction.
  // gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));
  gl.uniform3fv(lightWorldPositionLocation, light_pos);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.vertexBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // 顶点normalbuffer
  gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.normalBuffer);
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        normalLocation, size, type, normalize, stride, offset);

  // 顶点颜色buffer
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.colorBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;         // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  
  gl.bindTexture(gl.TEXTURE_2D, bilibili_obj.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([255, 255, 255, 255])); // 白色色填充
  // 纹理坐标
   gl.enableVertexAttribArray(texcoordLocation);
   gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.texcoordBuffer);
   var size = 2;          // 2 components per iteration
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer
   gl.vertexAttribPointer(
       texcoordLocation, size, type, normalize, stride, offset);

  // 计算图像转换
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 2000;
  var perMatrix = m4.perspective(bilibili_fieldOfViewRadians, aspect, zNear, zFar);
  
  // 相机
  var radius = 250;
  var fPosition = [radius, 0, 0];
  camera_translation = [-150, 0 , -600];

  camerachangeMatrix = m4.translation(camera_translation[0],camera_translation[1],camera_translation[2])
  var cameraMatrix = m4.yRotation(cameraAngleRadians);
  cameraMatrix = m4.translate(cameraMatrix, 250, 200, radius * 1.5);
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];
  var up = [0, 1, 0];
  var cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
  cameraunchangeMatrix = m4.translation(-camera_translation[0],-camera_translation[1],-camera_translation[2])
  cameraMatrix = m4.multiply(m4.multiply(camerachangeMatrix,cameraMatrix),cameraunchangeMatrix);
  var viewMatrix = m4.inverse(cameraMatrix);
  var viewProjectionMatrix = m4.multiply(perMatrix, viewMatrix);


  changeMatrix = m4.translation(bilibili_center[0],bilibili_center[1],bilibili_center[2])
  var T = m4.translation(bilibili_translation[0], bilibili_translation[1], bilibili_translation[2]);
  var Rx = m4.axisRotation([1,0,0,1],bilibili_rotation[0]);
  var Ry = m4.axisRotation([0,1,0,1],bilibili_rotation[1]);
  var Rz = m4.axisRotation([0,0,1,1],bilibili_rotation[2]);
  var S = m4.scaling(bilibili_scale[0], bilibili_scale[1], bilibili_scale[2]);
  unchangeMatrix = m4.translation(-bilibili_center[0],-bilibili_center[1],-bilibili_center[2])
  mvMatrix =  m4.multiply(m4.multiply( m4.multiply( m4.multiply( m4.multiply(m4.multiply(changeMatrix,T),Rx),Ry),Rz),S),unchangeMatrix);

  matrix = m4.multiply(viewProjectionMatrix,mvMatrix);
  var worldInverseMatrix = m4.inverse(matrix)
  var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

      // Set the matrices
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
  gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(worldLocation,false, mvMatrix)

    // set the camera/view position
    gl.uniform3fv(viewWorldPositionLocation, cameraPosition);
    // set the shininess
    gl.uniform1f(shininessLocation, shininess);
    // set the light color    
    gl.uniform3fv(lightColorLocation, m4.normalize([1, 1, 1]));  // red light
    // set the specular color
    gl.uniform3fv(specularColorLocation, m4.normalize([1, 1, 1]));  // red light



  bilibili_directZ = [0,0,1,1];
  bilibili_directZ = m4.transformNormal(mvMatrix,bilibili_directZ);

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bilibili_obj.indexBuffer);
  // gl.drawElements(gl.TRIANGLES, bilibili_faces.length, gl.UNSIGNED_SHORT, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili_obj.vertexBuffer)


  count = bilibili_array.length / 3 

  gl.uniform1i(textureLocation, 0);

  
  gl.drawArrays(gl.TRIANGLES,0,count)


  // 绘制 bilibili2
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.vertexBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
  // 顶点颜色buffer
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.colorBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;         // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

 // 顶点颜色buffer
 gl.enableVertexAttribArray(normalLocation);
 gl.bindBuffer(gl.ARRAY_BUFFER, bilibili2_obj.normalBuffer);
 var size = 3;          // 3 components per iteration
 var type = gl.FLOAT;   // the data is 32bit floating point values
 var normalize = false; // normalize the data (convert from 0-255 to 0-1)
 var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
 var offset = 0;        // start at the beginning of the buffer
 gl.vertexAttribPointer(
     normalLocation, size, type, normalize, stride, offset);


  changeMatrix = m4.translation(bilibili2_center[0],bilibili2_center[1],bilibili2_center[2])
  var T = m4.translation(bilibili2_translation[0], bilibili2_translation[1], bilibili2_translation[2]);
  var Rx = m4.axisRotation([1,0,0,1],bilibili2_rotation[0]);
  var Ry = m4.axisRotation([0,1,0,1],bilibili2_rotation[1]);
  var Rz = m4.axisRotation([0,0,1,1],bilibili2_rotation[2]);
  var S = m4.scaling(bilibili2_scale[0], bilibili2_scale[1], bilibili2_scale[2]);
  unchangeMatrix = m4.translation(-bilibili2_center[0],-bilibili2_center[1],-bilibili2_center[2])

  mvMatrix =  m4.multiply(m4.multiply( m4.multiply( m4.multiply( m4.multiply(m4.multiply(changeMatrix,T),Rx),Ry),Rz),S),unchangeMatrix);
	matrix = m4.multiply(viewProjectionMatrix,mvMatrix);

  bilibili2_directZ = [0,0,1,1];
  bilibili2_directZ = m4.transformNormal(mvMatrix,bilibili2_directZ);

  matrix = m4.multiply(viewProjectionMatrix,mvMatrix);
  var worldInverseMatrix = m4.inverse(matrix)
  var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

      // Set the matrices
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
  gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(worldLocation,false, mvMatrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bilibili2_obj.indexBuffer);
  gl.bindTexture(gl.TEXTURE_2D, bilibili2_obj.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([255, 255, 255, 255])); // lan色填充
  // // // 绘制
  gl.drawElements(gl.TRIANGLES, bilibili2_faces.length, gl.UNSIGNED_SHORT, 0);


  // ground
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.vertexBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
  // 顶点颜色buffer
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.colorBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;         // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.normalBuffer);
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        normalLocation, size, type, normalize, stride, offset);
        
  
  
        gl.bindTexture(gl.TEXTURE_2D, ground_obj.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([0, 0, 255, 255])); // lan色填充
      
        // var image = document.getElementById("texImage");

        gl.bindTexture(gl.TEXTURE_2D, ground_obj.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
          // 是 2 的幂，一般用贴图
          gl.generateMipmap(gl.TEXTURE_2D);
       } else {
          // 不是 2 的幂，关闭贴图并设置包裹模式为到边缘
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       }

  // 纹理坐标
  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.texcoordBuffer);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      texcoordLocation, size, type, normalize, stride, offset);

  changeMatrix = m4.translation(ground_center[0],ground_center[1],ground_center[2])
  var T = m4.translation(ground_translation[0], ground_translation[1], ground_translation[2]);
  var Rx = m4.axisRotation([1,0,0,1],ground_rotation[0]);
  var Ry = m4.axisRotation([0,1,0,1],ground_rotation[1]);
  var Rz = m4.axisRotation([0,0,1,1],ground_rotation[2]);
  var S = m4.scaling(ground_scale[0], ground_scale[1], ground_scale[2]);
  unchangeMatrix = m4.translation(-ground_center[0],-ground_center[1],-ground_center[2])

  mvMatrix =  m4.multiply(m4.multiply( m4.multiply( m4.multiply( m4.multiply(m4.multiply(changeMatrix,T),Rx),Ry),Rz),S),unchangeMatrix);
	matrix = m4.multiply(viewProjectionMatrix,mvMatrix);

  ground_directZ = [0,0,1,1];
  ground_directZ = m4.transformNormal(mvMatrix,ground_directZ);

  matrix = m4.multiply(viewProjectionMatrix,mvMatrix);
  var worldInverseMatrix = m4.inverse(matrix)
  var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

      // Set the matrices
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
  gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(worldLocation,false, mvMatrix)

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ground_obj.indexBuffer);
  // // // 绘制
  // gl.drawElements(gl.TRIANGLES, ground_faces.length, gl.UNSIGNED_SHORT, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, ground_obj.vertexBuffer)
  gl.uniform1i(textureLocation, 0);
  count = ground_array.length / 3 

  gl.drawArrays(gl.TRIANGLES,0,count)
//馆长
// guanzhang
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.vertexBuffer);
var size = 3;
var type = gl.FLOAT;
var normalize = false;
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
// 顶点颜色buffer
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.colorBuffer);
var size = 3;
var type = gl.FLOAT;
var normalize = false;         // normalize the data (convert from 0-255 to 0-1)
var stride = 0;
var offset = 0;
gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

gl.enableVertexAttribArray(normalLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.normalBuffer);
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floating point values
  var normalize = false; // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      normalLocation, size, type, normalize, stride, offset);
      


      gl.bindTexture(gl.TEXTURE_2D, guanzhang_obj.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
     } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
     }

// 纹理坐标
gl.enableVertexAttribArray(texcoordLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.texcoordBuffer);
var size = 2;          // 2 components per iteration
var type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
    texcoordLocation, size, type, normalize, stride, offset);

changeMatrix = m4.translation(guanzhang_center[0],guanzhang_center[1],guanzhang_center[2])
var T = m4.translation(guanzhang_translation[0], guanzhang_translation[1], guanzhang_translation[2]);
var Rx = m4.axisRotation([1,0,0,1],guanzhang_rotation[0]);
var Ry = m4.axisRotation([0,1,0,1],guanzhang_rotation[1]);
var Rz = m4.axisRotation([0,0,1,1],guanzhang_rotation[2]);
var S = m4.scaling(guanzhang_scale[0], guanzhang_scale[1], guanzhang_scale[2]);
unchangeMatrix = m4.translation(-guanzhang_center[0],-guanzhang_center[1],-guanzhang_center[2])

mvMatrix =  m4.multiply(m4.multiply( m4.multiply( m4.multiply( m4.multiply(m4.multiply(changeMatrix,T),Rx),Ry),Rz),S),unchangeMatrix);
matrix = m4.multiply(viewProjectionMatrix,mvMatrix);

guanzhang_directZ = [0,0,1,1];
guanzhang_directZ = m4.transformNormal(mvMatrix,guanzhang_directZ);

matrix = m4.multiply(viewProjectionMatrix,mvMatrix);
var worldInverseMatrix = m4.inverse(matrix)
var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

    // Set the matrices
gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
gl.uniformMatrix4fv(worldLocation,false, mvMatrix)

// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, guanzhang_obj.indexBuffer);
// // // 绘制
// gl.drawElements(gl.TRIANGLES, guanzhang_faces.length, gl.UNSIGNED_SHORT, 0);
gl.bindBuffer(gl.ARRAY_BUFFER, guanzhang_obj.vertexBuffer)
gl.uniform1i(textureLocation, 0);
count = guanzhang_array.length / 3 
// console.log(guanzhang_array)
gl.drawArrays(gl.TRIANGLES,0,count)



  // light
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.vertexBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
  // 顶点颜色buffer
  gl.enableVertexAttribArray(colorLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.colorBuffer);
  var size = 3;
  var type = gl.FLOAT;
  var normalize = false;         // normalize the data (convert from 0-255 to 0-1)
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.normalBuffer);
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floating point values
    var normalize = false; // normalize the data (convert from 0-255 to 0-1)
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        normalLocation, size, type, normalize, stride, offset);
        

  var T = m4.translation(light_pos[0], light_pos[1], light_pos[2]);

  mvMatrix =  T
	matrix = m4.multiply(viewProjectionMatrix,mvMatrix);
  var worldInverseMatrix = m4.inverse(matrix)
  var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix)

      // Set the matrices
  gl.uniformMatrix4fv(worldViewProjectionLocation, false, matrix);
  gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix);
  gl.uniformMatrix4fv(worldLocation,false, mvMatrix)

  // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, light_obj.indexBuffer);
  // // // 绘制
  // gl.drawElements(gl.TRIANGLES, light_faces.length, gl.UNSIGNED_SHORT, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, light_obj.vertexBuffer)

  gl.bindTexture(gl.TEXTURE_2D, light_obj.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,new Uint8Array([255, 255, 255, 255])); // lan色填充
  // // // 绘制
  
  count = light_array.length / 3 
  gl.drawArrays(gl.TRIANGLES,0,count)
}

function computeAvgNormalVector(vertice, indexs)
{
   normal_temp = []
   normal_vector = []
   
   for(i=0; i<indexs.length ; i+=3)
   {
      // 获得了一个三角形的索引， 所以我找顶点
      a = indexs[i]
      b = indexs[i+1]
      c = indexs[i+2]
      // 得到三角形的三个顶点
      va = [ vertice[a*3], vertice[a*3+1], vertice[a*3+2] ] 
      vb = [ vertice[b*3], vertice[b*3+1], vertice[b*3+2] ]
      vc = [ vertice[c*3], vertice[c*3+1], vertice[c*3+2] ]
      // 构造normal 
      t1 = m4.subtractVectors(vb,va)
      t2 = m4.subtractVectors(vc,va)
      normal = m4.normalize(m4.cross(t2,t1))
      // 把normal放到三角形里面去
      if(normal_temp.length<=a)
      {
        normal_temp.push([normal]) 
      }
      else{
        normal_temp[a].push(normal)
      }
      if(normal_temp.length<=b)
      {
        normal_temp.push([normal]) 
      }
      else{
        normal_temp[b].push(normal)
      }
      if(normal_temp.length<=c)
      {
        normal_temp.push([normal]) 
      }
      else{
        normal_temp[c].push(normal)
      }
   }
   // noraml 是一个 下标是顶点索引 normal[i] 是此顶点含有的法向量的合集
   // 进行法向量的求平均
   for(i=0; i<normal_temp.length ; i++)
   {
      sum = [0,0,0]
      for(j=0 ; j<normal_temp[i].length ; j++)
      {
         sum = m4.addVectors(normal_temp[i][j],sum)     
      }
      sum[0] = sum[0]/normal_temp[i].length
      sum[1] = sum[1]/normal_temp[i].length
      sum[2] = sum[2]/normal_temp[i].length
      sum = m4.normalize(sum)
      normal_vector.push(sum[0])
      normal_vector.push(sum[1])
      normal_vector.push(sum[2])
   }
   return normal_vector
}

function getArray(vertice, indexs)
{
  array = []
  for(i=0; i<indexs.length ; i+=3)
  {
     // 获得了一个三角形的索引， 所以我找顶点
     a = indexs[i]
     b = indexs[i+1]
     c = indexs[i+2]
     // 把顶点添加到array里 重新排列
     array.push(vertice[a*3])
     array.push(vertice[a*3+1])
     array.push(vertice[a*3+2])
     array.push(vertice[b*3])
     array.push(vertice[b*3+1])
     array.push(vertice[b*3+2])
     array.push(vertice[c*3])
     array.push(vertice[c*3+1])
     array.push(vertice[c*3+2])
  }
  return array
}
function getArrayColors(colors, indexs)
{
  new_colors = []
  for(i=0; i<indexs.length ; i+=3)
  {
     // 获得了一个三角形的索引， 所以我找顶点
     a = indexs[i]
     b = indexs[i+1]
     c = indexs[i+2]
     // 把顶点添加到array里 重新排列
     new_colors.push(colors[a*3])
     new_colors.push(colors[a*3+1])
     new_colors.push(colors[a*3+2])
     new_colors.push(colors[b*3])
     new_colors.push(colors[b*3+1])
     new_colors.push(colors[b*3+2])
     new_colors.push(colors[c*3])
     new_colors.push(colors[c*3+1])
     new_colors.push(colors[c*3+2])
  }
  return new_colors
}

function getOriginTex(tri_length)
{
  texcoord = []
  for( i = 0 ; i < tri_length; i++)
  {
    texcoord.push(0.5);
    texcoord.push(0);
    texcoord.push(0.75);
    texcoord.push(0);
    texcoord.push(0.5);
    texcoord.push(1);
  }
  return texcoord;
}


function computeNormalVector(vertice, indexs)
{
  normal_array = []
  for(i=0; i<indexs.length ; i+=3)
  {
     // 获得了一个三角形的索引， 所以我找顶点
     a = indexs[i]
     b = indexs[i+1]
     c = indexs[i+2]
     // 得到三角形的三个顶点
     va = [ vertice[a*3], vertice[a*3+1], vertice[a*3+2] ] 
     vb = [ vertice[b*3], vertice[b*3+1], vertice[b*3+2] ]
     vc = [ vertice[c*3], vertice[c*3+1], vertice[c*3+2] ]
     //构造normal 
     t1 = m4.subtractVectors(vb,va)
     t2 = m4.subtractVectors(vc,va)
     normal = m4.normalize(m4.cross(t2,t1))
     for(h = 0 ;h<3 ;h++){
      normal_array.push(normal[0])
      normal_array.push(normal[1])
      normal_array.push(normal[2])
    }
  }
  return normal_array
}





//  设置UI
webglLessonsUI.setupSlider("#cameraAngle", {value: radToDeg(cameraAngleRadians), slide: updateCameraAngle, min: -360, max: 360});
webglLessonsUI.setupSlider("#light_posx", { value: light_pos[0], slide: light_updatePosition(0), min: -1000, max: 400 });
webglLessonsUI.setupSlider("#light_posy", { value: light_pos[1], slide: light_updatePosition(1), min: -1000, max: 800 });
webglLessonsUI.setupSlider("#light_posz", { value: light_pos[2], slide: light_updatePosition(2), min: -1000, max: 600 });
// 设置UI
webglLessonsUI.setupSlider("#bilibili_fieldOfView", { value: radToDeg(bilibili_fieldOfViewRadians), slide: bilibili_updateFieldOfView, min: 30, max: 120 });
webglLessonsUI.setupSlider("#shininess", {value: shininess, slide: updateShininess, min: 1, max: 300});

function updateShininess(event, ui) {
  shininess = ui.value;
  drawSceneIndex();1
}


function light_updatePosition(index) {
  return function (event, ui) {
    light_pos[index] = ui.value;
    drawSceneIndex();
  };
}

function updateCameraAngle(event, ui) {
  cameraAngleRadians = degToRad(ui.value);
  drawSceneIndex();
}

document.getElementById("camerapause").onclick = function () {
  console.log("pause")
    console.log("pausealive")
    window.cancelAnimationFrame(requestAnimationid)
}
document.getElementById("objectpause").onclick = function () {
  console.log("pause")
    console.log("pausealive")
    window.cancelAnimationFrame(requestAnimationid2)
}
document.getElementById("gocamera").onclick = function () {
  console.log("go")
    console.log("goalive")
    tick1()
}
document.getElementById("goobject").onclick = function () {
  console.log("go")
    console.log("goalive")
    tick2()
}



// // 设置滑块滑动
function bilibili_updatePosition(index) {
  return function (event, ui) {
    bilibili_translation[index] = ui.value;
    drawSceneIndex();
  };
}
function bilibili_updateRotation(index) {
  return function (event, ui) {
    var angleInDegrees = ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    bilibili_rotation[index] = angleInRadians;
    drawSceneIndex();
  };
}
function bilibili_updateScale(index) {
  return function (event, ui) {
    bilibili_scale[index] = ui.value;
    bilibili_scale[index + 1] = ui.value;
    bilibili_scale[index + 2] = ui.value;
    drawSceneIndex();
  };
}
function bilibili_updateFieldOfView(event, ui) {
  bilibili_fieldOfViewRadians = degToRad(ui.value);
  drawSceneIndex();
}

// bilibili2
function bilibili2_updatePosition(index) {
  return function (event, ui) {
    bilibili2_translation[index] = ui.value;
    drawSceneIndex();
  };
}
function bilibili2_updateRotation(index) {
  return function (event, ui) {

    var angleInDegrees = ui.value;
    var angleInRadians = angleInDegrees * Math.PI / 180;
    bilibili2_rotation[index] = angleInRadians;
    drawSceneIndex();
  };
}
function bilibili2_updateScale(index) {
  return function (event, ui) {
    bilibili2_scale[index] = ui.value;
    bilibili2_scale[index + 1] = ui.value;
    bilibili2_scale[index + 2] = ui.value;
    drawSceneIndex();
  };
}
function bilibili2_updateFieldOfView(event, ui) {
  bilibili2_fieldOfViewRadians = degToRad(ui.value);
  drawSceneIndex();
}

function drawbilibili() {
  bilibili_vertices = [62.29, 281.2, 60.0, 133.0, 210.49, 60.0, 133.0, 210.49, 40.0,
    62.29, 281.2, 40.0, 48.150000000000006, 267.06, 40.0, 118.85999999999999, 196.35000000000002, 40.0,
    118.85999999999999, 196.35000000000002, 60.0, 48.150000000000006, 267.06, 60.0, 247.75, 267.06, 60.0,
    177.04000000000002, 196.35000000000002, 60.0, 177.04000000000002, 196.35000000000002, 40.0, 247.75, 267.06, 40.0,
    233.61, 281.2, 40.0, 162.89999999999998, 210.49, 40.0, 162.89999999999998, 210.49, 60.0,
    233.61, 281.2, 60.0, 300.0, 220.03, 100.0, 300.0, 0.03, 100.0,
    300.0, 0.03, 0.0, 300.0, 220.03, 0.0, 0.0, 220.03, 0.0,
    0.0, 220.03, 100.0, 0.0, 0.03, 0.0, 0.0, 0.03, 100.0,
    108.16000000000001, 150.92000000000002, 112.5, 51.78, 130.39999999999998, 112.5, 58.620000000000005, 111.61, 112.5,
    115.0, 132.13, 112.5, 108.16000000000001, 150.92000000000002, 102.5, 51.78, 130.39999999999998, 102.5,
    58.620000000000005, 111.61, 102.5, 115.0, 132.13, 102.5, 235.27, 111.6, 115.0,
    235.27, 111.6, 105.0, 242.10999999999999, 130.39999999999998, 105.0, 242.10999999999999, 130.39999999999998, 115.0,
    185.73000000000002, 150.92000000000002, 115.0, 185.73000000000002, 150.92000000000002, 105.0, 178.89, 132.13, 105.0,
    178.89, 132.13, 115.0, 268.0, 30.03, 102.5, 268.0, 30.03, 97.5,
    268.0, 190.03, 97.5, 268.0, 190.03, 102.5, 28.0, 190.03, 102.5,
    28.0, 30.03, 102.5, 28.0, 190.03, 97.5, 28.0, 30.03, 97.5,
    69.98, -12.350000000000001, 55.949999999999996, 69.12, -13.38, 55.23, 52.05, -4.5, 33.36,
    68.08, -15.129999999999999, 52.370000000000005, 54.720000000000006, -4.5, 32.120000000000005, 67.2, -15.129999999999999, 53.620000000000005,
    51.879999999999995, -3.01, 33.07, 69.93, -14.31, 51.43, 54.61, -3.01, 31.810000000000002,
    69.19, -14.31, 53.019999999999996, 51.78, -1.5, 32.9, 54.54, -1.5, 31.619999999999997,
    71.07000000000001, -13.38, 51.849999999999994, 70.24, -13.38, 53.620000000000005, 58.010000000000005, -10.009999999999998, 33.879999999999995,
    60.5, -10.009999999999998, 33.660000000000004, 67.9, -15.83, 48.0, 67.78, -15.83, 49.28,
    66.9, -15.83, 51.7, 57.87, -8.72, 33.07, 64.96000000000001, -16.88, 48.78999999999999,
    60.5, -8.72, 32.839999999999996, 64.76, -16.88, 49.55, 66.12, -15.129999999999999, 54.699999999999996,
    64.88000000000001, -15.129999999999999, 55.58, 57.75, -7.37, 32.38, 64.42, -16.88, 50.26,
    63.49, -15.129999999999999, 56.22, 66.39, -16.419999999999998, 49.04, 60.5, -7.37, 32.14,
    66.12, -16.419999999999998, 50.05, 57.64, -5.96, 31.810000000000002, 65.67999999999999, -16.419999999999998, 50.99,
    60.5, -5.96, 31.560000000000002, 61.54, -16.419999999999998, 53.89, 64.2, -15.83, 54.400000000000006,
    63.03, -15.83, 54.95, 62.830000000000005, -17.21, 49.95, 61.78, -15.83, 55.279999999999994,
    62.45, -17.21, 50.330000000000005, 62.019999999999996, -17.21, 50.629999999999995, 53.33, -10.009999999999998, 35.59,
    61.54, -17.21, 50.86, 55.599999999999994, -10.009999999999998, 34.53, 63.97, -16.88, 50.910000000000004,
    52.92, -8.72, 34.870000000000005, 55.32, -8.72, 33.76, 65.09, -16.419999999999998, 51.849999999999994,
    52.56999999999999, -7.37, 34.260000000000005, 61.82000000000001, -17.41, 48.760000000000005, 64.35, -16.419999999999998, 52.59,
    61.67, -17.41, 48.98, 61.48, -17.41, 49.17, 69.25, 0.03, 63.16,
    63.54, 0.03, 65.22999999999999, 66.49, 0.03, 64.44, 63.36, -17.21, 49.04,
    71.75, 0.03, 61.41, 73.91, 0.03, 59.25, 75.66, 0.03, 56.75,
    76.94, 0.03, 53.99, 66.17, -15.83, 52.75, 77.72999999999999, 0.03, 44.96000000000001,
    76.94, 0.03, 42.01, 77.72999999999999, 0.03, 51.04, 78.0, 0.03, 48.0,
    57.46000000000001, 0.03, 65.22999999999999, 60.5, 0.03, 65.5, 65.25, -15.83, 53.67,
    51.75, 0.03, 63.16, 54.51, 0.03, 64.44, 63.129999999999995, -17.21, 49.519999999999996,
    45.339999999999996, 0.03, 56.75, 47.089999999999996, 0.03, 59.25, 44.059999999999995, 0.03, 53.99,
    49.25, 0.03, 61.41, 43.0, 0.03, 48.0, 43.269999999999996, 0.03, 44.96000000000001,
    43.269999999999996, 0.03, 51.04, 47.38, -8.72, 55.58, 44.059999999999995, 0.03, 42.01,
    63.410000000000004, -16.88, 51.47, 63.54, 0.03, 30.77, 75.66, 0.03, 39.25,
    73.91, 0.03, 36.75, 71.75, 0.03, 34.59, 69.25, 0.03, 32.839999999999996,
    66.49, 0.03, 31.560000000000002, 62.76, -16.88, 51.92, 46.260000000000005, -8.72, 53.17999999999999,
    51.75, 0.03, 32.839999999999996, 57.46000000000001, 0.03, 30.77, 54.51, 0.03, 31.560000000000002,
    60.5, 0.03, 30.5, 49.25, 0.03, 34.59, 47.089999999999996, 0.03, 36.75,
    45.339999999999996, 0.03, 39.25, 47.03, -10.009999999999998, 52.9, 62.05, -16.88, 52.26,
    46.760000000000005, -7.37, 55.93, 68.94999999999999, -4.5, 62.64, 45.599999999999994, -7.37, 53.419999999999995,
    64.76, -16.88, 46.449999999999996, 63.49, -16.419999999999998, 53.17999999999999, 69.12, -3.01, 62.93,
    64.96000000000001, -16.88, 47.21, 62.55, -16.419999999999998, 53.620000000000005, 49.42, -13.38, 46.050000000000004,
    48.87, -12.350000000000001, 43.769999999999996, 46.260000000000005, -5.96, 56.22, 65.03, -16.88, 48.0,
    69.22, -1.5, 63.099999999999994, 47.300000000000004, -11.22, 45.67, 45.05, -5.96, 53.620000000000005,
    66.39, -16.419999999999998, 46.959999999999994, 66.28, -4.5, 63.879999999999995, 66.49, -16.419999999999998, 48.0,
    63.440000000000005, -4.5, 64.65, 50.76, -13.38, 42.38, 50.23, -11.22, 56.62,
    77.4, -4.5, 48.0, 66.39, -3.01, 64.19, 49.78, -12.350000000000001, 41.81,
    77.15, -4.5, 50.940000000000005, 51.07, -14.31, 51.43, 55.08, -7.37, 33.1,
    77.72999999999999, -3.01, 48.0, 77.47, -3.01, 50.99, 77.93, -1.5, 48.0,
    52.28, -5.96, 33.76, 77.67, -1.5, 51.03, 54.88, -5.96, 32.55,
    74.84, -10.009999999999998, 48.0, 60.5, -1.5, 30.57, 74.62, -10.009999999999998, 50.49,
    57.510000000000005, -15.129999999999999, 39.78, 50.76, -13.38, 53.620000000000005, 63.49, -3.01, 64.97,
    58.98, -15.129999999999999, 39.38, 49.93000000000001, -13.38, 51.849999999999994, 59.97, -17.21, 45.010000000000005,
    60.5, -17.21, 44.96000000000001, 66.46, -1.5, 64.38, 61.03, -17.21, 45.010000000000005,
    63.53, -1.5, 65.17, 51.02, -12.350000000000001, 55.949999999999996, 49.78, -12.350000000000001, 54.19,
    48.87, -12.350000000000001, 52.23, 58.98, -17.21, 45.37, 68.43, -7.37, 61.74,
    48.89, -11.22, 54.699999999999996, 47.9, -11.22, 52.59, 68.72, -5.96, 62.24,
    58.949999999999996, -16.88, 43.739999999999995, 59.71, -16.88, 43.54, 65.4, -10.009999999999998, 61.47,
    62.99, -10.009999999999998, 62.12, 65.67999999999999, -8.72, 62.24, 61.28999999999999, -16.88, 43.54,
    63.129999999999995, -8.72, 62.93, 61.03, -17.21, 50.99, 60.5, -17.21, 51.04,
    65.92, -7.37, 62.9, 59.97, -17.21, 50.99, 63.25, -7.37, 63.620000000000005,
    59.459999999999994, -17.21, 50.86, 58.98, -17.21, 50.629999999999995, 58.17, -17.21, 46.050000000000004,
    58.550000000000004, -17.21, 45.67, 66.12, -5.96, 63.449999999999996, 56.580000000000005, -16.88, 45.739999999999995,
    57.03, -16.88, 45.09, 63.36, -5.96, 64.19, 57.59, -16.88, 44.53,
    58.239999999999995, -16.88, 44.080000000000005, 75.14, -4.5, 56.449999999999996, 61.260000000000005, -17.41, 49.32000000000001,
    60.5, -16.88, 43.470000000000006, 61.02, -17.41, 49.42999999999999, 60.76, -17.41, 49.5,
    73.45, -4.5, 58.87, 59.459999999999994, -16.419999999999998, 42.11, 60.5, -17.41, 49.53,
    60.24, -17.41, 49.5, 60.5, -16.419999999999998, 42.01, 75.43, -3.01, 56.62,
    73.7, -3.01, 59.080000000000005, 75.6, -1.5, 56.72, 73.85, -1.5, 59.21,
    71.71000000000001, -1.5, 61.349999999999994, 59.980000000000004, -17.41, 49.42999999999999, 59.74, -17.41, 49.32000000000001,
    56.65, -16.419999999999998, 43.410000000000004, 59.519999999999996, -17.41, 49.17, 59.33, -17.41, 48.98,
    57.510000000000005, -16.419999999999998, 42.82, 59.18, -17.41, 48.760000000000005, 72.11, -8.72, 57.74,
    58.449999999999996, -16.419999999999998, 42.38, 72.64999999999999, -7.37, 58.19, 73.1, -5.96, 58.57,
    56.8, -15.83, 41.6, 57.97, -15.83, 41.050000000000004, 58.550000000000004, -17.21, 50.330000000000005,
    58.17, -17.21, 49.95, 76.38, -4.5, 53.78, 57.87, -17.21, 49.519999999999996,
    57.64, -17.21, 49.04, 76.69, -3.01, 53.89, 52.28, -15.129999999999999, 45.010000000000005,
    76.88, -1.5, 53.96, 57.03, -16.88, 50.910000000000004, 52.92, -15.129999999999999, 43.620000000000005,
    56.580000000000005, -16.88, 50.26, 53.8, -15.129999999999999, 42.38, 73.97, -10.009999999999998, 52.9,
    54.88, -15.129999999999999, 41.3, 72.91, -10.009999999999998, 55.17, 74.74000000000001, -8.72, 53.17999999999999,
    51.81, -14.31, 42.980000000000004, 73.63000000000001, -8.72, 55.58, 52.809999999999995, -14.31, 41.550000000000004,
    75.4, -7.37, 53.419999999999995, 57.64, -5.96, 64.19, 60.5, -17.470000000000002, 48.0,
    47.9, -11.22, 43.410000000000004, 48.89, -11.22, 41.3, 55.599999999999994, -10.009999999999998, 61.47,
    55.32, -8.72, 62.24, 55.08, -7.37, 62.9, 52.56999999999999, -7.37, 61.74,
    54.88, -5.96, 63.449999999999996, 52.28, -5.96, 62.24, 73.45, -4.5, 37.13,
    75.14, -4.5, 39.55, 73.7, -3.01, 36.92, 75.43, -3.01, 39.38,
    73.85, -1.5, 36.79, 75.6, -1.5, 39.28, 72.91, -10.009999999999998, 40.83,
    53.33, -10.009999999999998, 60.410000000000004, 72.11, -8.72, 38.26, 73.63000000000001, -8.72, 40.42,
    51.28999999999999, -10.009999999999998, 58.98, 61.92999999999999, -17.41, 47.480000000000004, 52.92, -8.72, 61.120000000000005,
    62.0, -17.41, 47.74, 62.03, -17.41, 48.0, 72.64999999999999, -7.37, 37.81,
    62.0, -17.41, 48.26, 74.24000000000001, -7.37, 40.06999999999999, 61.92999999999999, -17.41, 48.52,
    63.49, -17.21, 47.47, 60.5, -13.38, 59.25, 75.66, -8.72, 48.0,
    73.1, -5.96, 37.43, 75.43, -8.72, 50.629999999999995, 58.550000000000004, -13.38, 59.080000000000005,
    74.74000000000001, -5.96, 39.78, 60.5, -12.350000000000001, 60.37, 58.35, -12.350000000000001, 60.19,
    76.36, -7.37, 48.0, 76.12, -7.37, 50.75, 76.94, -5.96, 48.0,
    71.71000000000001, -1.5, 34.65, 60.5, -11.22, 61.41, 76.69, -5.96, 50.86,
    69.71000000000001, -10.009999999999998, 37.019999999999996, 58.17, -11.22, 61.2, 71.47999999999999, -10.009999999999998, 38.79,
    70.24, -8.72, 36.39, 70.69, -7.37, 35.85, 60.5, -15.129999999999999, 56.75,
    76.38, -4.5, 42.220000000000006, 68.94999999999999, -4.5, 33.36, 58.98, -15.129999999999999, 56.62,
    77.15, -4.5, 45.06, 60.5, -14.31, 58.040000000000006, 71.36999999999999, -4.5, 35.05,
    76.69, -3.01, 42.11, 58.760000000000005, -14.31, 57.89, 77.47, -3.01, 45.010000000000005,
    69.12, -3.01, 33.07, 57.07, -14.31, 57.43000000000001, 71.58, -3.01, 34.8,
    54.88, -16.419999999999998, 45.949999999999996, 76.88, -1.5, 42.04, 77.67, -1.5, 44.97,
    55.32, -16.419999999999998, 45.010000000000005, 60.5, -15.129999999999999, 39.25, 55.910000000000004, -16.419999999999998, 44.15,
    53.550000000000004, -15.83, 45.47, 57.07, -14.31, 38.57, 54.1, -15.83, 44.3,
    54.83, -15.83, 43.25, 73.97, -10.009999999999998, 43.099999999999994, 56.65, -13.38, 58.57,
    74.62, -10.009999999999998, 45.510000000000005, 55.75, -15.83, 42.33, 58.760000000000005, -14.31, 38.11,
    74.74000000000001, -8.72, 42.82, 60.5, -14.31, 37.96, 75.43, -8.72, 45.37,
    56.65, -13.38, 37.43, 56.269999999999996, -12.350000000000001, 59.63, 58.550000000000004, -13.38, 36.92,
    55.910000000000004, -11.22, 60.599999999999994, 75.4, -7.37, 42.58, 60.5, -13.38, 36.75,
    53.8, -11.22, 59.61, 76.12, -7.37, 45.25, 43.6, -4.5, 48.0,
    43.849999999999994, -4.5, 50.940000000000005, 55.480000000000004, -14.31, 56.69, 75.95, -5.96, 42.38,
    54.88, -13.38, 57.74, 76.69, -5.96, 45.14, 53.269999999999996, -13.38, 56.62,
    43.269999999999996, -3.01, 48.0, 59.22, -15.83, 40.72, 54.31, -12.350000000000001, 58.72,
    60.5, -15.83, 40.599999999999994, 43.53, -3.01, 50.99, 52.55, -12.350000000000001, 57.480000000000004,
    43.07000000000001, -1.5, 48.0, 51.879999999999995, -11.22, 58.269999999999996, 43.33, -1.5, 51.03,
    71.75, -13.38, 48.0, 74.24000000000001, -7.37, 55.93, 72.87, -12.350000000000001, 48.0,
    75.95, -5.96, 53.620000000000005, 72.69, -12.350000000000001, 50.15, 56.13, -15.129999999999999, 40.42,
    74.74000000000001, -5.96, 56.22, 54.050000000000004, -14.31, 40.309999999999995, 73.91, -11.22, 48.0,
    55.480000000000004, -14.31, 39.31, 46.16, -10.009999999999998, 48.0, 46.379999999999995, -10.009999999999998, 50.49,
    73.7, -11.22, 50.330000000000005, 51.879999999999995, -13.38, 40.769999999999996, 71.36999999999999, -4.5, 60.949999999999996,
    71.58, -3.01, 61.2, 45.339999999999996, -8.72, 48.0, 45.57000000000001, -8.72, 50.629999999999995,
    63.54, -17.21, 48.0, 53.269999999999996, -13.38, 39.38, 63.49, -17.21, 48.53,
    71.47999999999999, -10.009999999999998, 57.21, 44.64, -7.37, 48.0, 44.88, -7.37, 50.75,
    52.55, -12.350000000000001, 38.519999999999996, 57.510000000000005, -15.129999999999999, 56.22, 44.059999999999995, -5.96, 48.0,
    72.13, -12.350000000000001, 43.769999999999996, 72.69, -12.350000000000001, 45.85, 54.88, -13.38, 38.26,
    44.31, -5.96, 50.86, 72.11, -11.22, 41.3, 60.5, -16.419999999999998, 53.99,
    73.1, -11.22, 43.410000000000004, 54.31, -12.350000000000001, 37.28, 59.459999999999994, -16.419999999999998, 53.89,
    73.7, -11.22, 45.67, 56.269999999999996, -12.350000000000001, 36.37, 60.5, -15.83, 55.4,
    51.879999999999995, -11.22, 37.730000000000004, 58.97, -17.41, 48.0, 59.0, -17.41, 47.74,
    43.849999999999994, -4.5, 45.06, 59.07, -17.41, 47.480000000000004, 53.8, -11.22, 36.39,
    59.22, -15.83, 55.279999999999994, 61.48, -17.41, 46.83, 61.67, -17.41, 47.019999999999996,
    57.97, -15.83, 54.95, 61.82000000000001, -17.41, 47.24, 44.62, -4.5, 42.220000000000006,
    56.8, -15.83, 54.400000000000006, 43.53, -3.01, 45.010000000000005, 44.31, -3.01, 42.11,
    63.129999999999995, -17.21, 46.48, 63.36, -17.21, 46.959999999999994, 59.07, -17.41, 48.52,
    43.33, -1.5, 44.97, 59.0, -17.41, 48.26, 44.12, -1.5, 42.04,
    68.08, -15.129999999999999, 43.620000000000005, 61.28999999999999, -16.88, 52.46000000000001, 68.72, -15.129999999999999, 45.010000000000005,
    60.5, -16.88, 52.53, 46.379999999999995, -10.009999999999998, 45.510000000000005, 69.93, -14.31, 44.57,
    59.71, -16.88, 52.46000000000001, 60.24, -17.41, 46.5, 47.03, -10.009999999999998, 43.099999999999994,
    71.07000000000001, -13.38, 44.15, 60.5, -17.41, 46.47, 58.949999999999996, -16.88, 52.26,
    60.76, -17.41, 46.5, 61.02, -17.41, 46.57, 61.260000000000005, -17.41, 46.68,
    71.58, -13.38, 46.050000000000004, 45.57000000000001, -8.72, 45.37, 46.260000000000005, -8.72, 42.82,
    67.2, -15.129999999999999, 42.38, 44.88, -7.37, 45.25, 68.19, -14.31, 41.550000000000004,
    45.599999999999994, -7.37, 42.58, 69.19, -14.31, 42.980000000000004, 58.239999999999995, -16.88, 51.92,
    57.59, -16.88, 51.47, 59.18, -17.41, 47.24, 44.31, -5.96, 45.14,
    59.33, -17.41, 47.019999999999996, 59.519999999999996, -17.41, 46.83, 58.449999999999996, -16.419999999999998, 53.620000000000005,
    59.74, -17.41, 46.68, 45.05, -5.96, 42.38, 59.980000000000004, -17.41, 46.57,
    70.24, -13.38, 42.38, 57.510000000000005, -16.419999999999998, 53.17999999999999, 56.65, -16.419999999999998, 52.59,
    71.22, -12.350000000000001, 41.81, 56.13, -15.129999999999999, 55.58, 66.9, -15.83, 44.3,
    58.35, -12.350000000000001, 35.81, 67.45, -15.83, 45.47, 60.5, -12.350000000000001, 35.63,
    55.910000000000004, -11.22, 35.4, 58.17, -11.22, 34.8, 66.12, -15.129999999999999, 41.3,
    60.5, -11.22, 34.59, 64.42, -16.88, 45.739999999999995, 65.09, -16.419999999999998, 44.15,
    65.67999999999999, -16.419999999999998, 45.010000000000005, 69.71000000000001, -10.009999999999998, 58.98, 67.67, -10.009999999999998, 60.410000000000004,
    66.12, -16.419999999999998, 45.949999999999996, 57.510000000000005, -17.21, 47.47, 57.46000000000001, -17.21, 48.0,
    57.64, -17.21, 46.959999999999994, 70.24, -8.72, 59.61, 68.08, -8.72, 61.120000000000005,
    57.87, -17.21, 46.48, 61.54, -17.21, 45.14, 62.019999999999996, -17.21, 45.37,
    70.69, -7.37, 60.15, 62.45, -17.21, 45.67, 71.07000000000001, -5.96, 60.599999999999994,
    62.830000000000005, -17.21, 46.050000000000004, 62.05, -16.88, 43.739999999999995, 62.76, -16.88, 44.080000000000005,
    72.13, -12.350000000000001, 52.23, 63.410000000000004, -16.88, 44.53, 63.97, -16.88, 45.09,
    73.1, -11.22, 52.59, 72.11, -11.22, 54.699999999999996, 50.61, -14.31, 49.74,
    49.42, -13.38, 49.95, 67.72999999999999, -13.38, 56.62, 48.31, -12.350000000000001, 50.15,
    68.45, -12.350000000000001, 57.480000000000004, 66.69, -12.350000000000001, 58.72, 61.54, -16.419999999999998, 42.11,
    47.300000000000004, -11.22, 50.330000000000005, 70.77, -11.22, 56.62, 69.12, -11.22, 58.269999999999996,
    62.55, -16.419999999999998, 42.38, 67.2, -11.22, 59.61, 63.49, -16.419999999999998, 42.82,
    64.35, -16.419999999999998, 43.410000000000004, 50.46, -14.31, 48.0, 50.61, -14.31, 46.260000000000005,
    63.03, -15.83, 41.050000000000004, 62.45, -13.38, 59.080000000000005, 64.2, -15.83, 41.6,
    64.73, -12.350000000000001, 59.63, 62.65, -12.350000000000001, 60.19, 65.25, -15.83, 42.33,
    66.17, -15.83, 43.25, 65.09, -11.22, 60.599999999999994, 62.830000000000005, -11.22, 61.2,
    62.019999999999996, -15.129999999999999, 56.62, 60.5, -4.5, 64.9, 65.52, -14.31, 56.69,
    57.56, -4.5, 64.65, 63.93, -14.31, 57.43000000000001, 60.5, -3.01, 65.22999999999999,
    62.24, -14.31, 57.89, 69.12, -15.129999999999999, 49.519999999999996, 57.510000000000005, -3.01, 64.97,
    66.12, -13.38, 57.74, 68.72, -15.129999999999999, 50.99, 60.5, -1.5, 65.43,
    64.35, -13.38, 58.57, 57.47, -1.5, 65.17, 54.720000000000006, -4.5, 63.879999999999995,
    52.05, -4.5, 62.64, 68.19, -14.31, 54.45, 54.61, -3.01, 64.19,
    51.879999999999995, -3.01, 62.93, 66.95, -14.31, 55.69, 57.510000000000005, -17.21, 48.53,
    54.54, -1.5, 64.38, 71.22, -12.350000000000001, 54.19, 51.78, -1.5, 63.099999999999994,
    54.88, -15.129999999999999, 54.699999999999996, 60.5, -10.009999999999998, 62.34, 58.010000000000005, -10.009999999999998, 62.12,
    60.5, -8.72, 63.16, 54.050000000000004, -14.31, 55.69, 49.25, -13.38, 48.0,
    57.87, -8.72, 62.93, 52.809999999999995, -14.31, 54.45, 51.879999999999995, -13.38, 55.23,
    60.5, -7.37, 63.86, 48.129999999999995, -12.350000000000001, 48.0, 57.75, -7.37, 63.620000000000005,
    47.089999999999996, -11.22, 48.0, 60.5, -5.96, 64.44, 53.8, -15.129999999999999, 53.620000000000005,
    52.92, -15.129999999999999, 52.370000000000005, 51.81, -14.31, 53.019999999999996, 70.39, -14.31, 49.74,
    55.910000000000004, -16.419999999999998, 51.849999999999994, 55.75, -15.83, 53.67, 54.83, -15.83, 52.75,
    45.86, -4.5, 39.55, 54.1, -15.83, 51.7, 47.55, -4.5, 37.13,
    45.57000000000001, -3.01, 39.38, 47.300000000000004, -3.01, 36.92, 51.879999999999995, -15.129999999999999, 46.48,
    51.75, -15.129999999999999, 48.0, 49.63, -4.5, 60.949999999999996, 45.4, -1.5, 39.28,
    52.28, -15.129999999999999, 50.99, 47.55, -4.5, 58.87, 47.15, -1.5, 36.79,
    45.86, -4.5, 56.449999999999996, 51.879999999999995, -15.129999999999999, 49.519999999999996, 49.42, -3.01, 61.2,
    48.09, -10.009999999999998, 40.83, 47.300000000000004, -3.01, 59.080000000000005, 45.57000000000001, -3.01, 56.62,
    49.519999999999996, -10.009999999999998, 38.79, 49.290000000000006, -1.5, 61.349999999999994, 47.38, -8.72, 40.42,
    47.15, -1.5, 59.21, 45.4, -1.5, 56.72, 56.239999999999995, -16.88, 49.55,
    46.760000000000005, -7.37, 40.06999999999999, 56.04, -16.88, 48.78999999999999, 55.32, -16.419999999999998, 50.99,
    46.260000000000005, -5.96, 39.78, 54.88, -16.419999999999998, 50.05, 49.519999999999996, -10.009999999999998, 57.21,
    54.61, -16.419999999999998, 49.04, 50.76, -8.72, 59.61, 48.89, -8.72, 57.74,
    48.89, -8.72, 38.26, 53.550000000000004, -15.83, 50.53, 50.76, -8.72, 36.39,
    48.35, -7.37, 37.81, 50.309999999999995, -7.37, 60.15, 53.22, -15.83, 49.28,
    50.309999999999995, -7.37, 35.85, 48.35, -7.37, 58.19, 49.93000000000001, -5.96, 60.599999999999994,
    47.9, -5.96, 37.43, 47.9, -5.96, 58.57, 56.04, -16.88, 47.21,
    55.970000000000006, -16.88, 48.0, 44.62, -4.5, 53.78, 56.239999999999995, -16.88, 46.449999999999996,
    49.93000000000001, -5.96, 35.4, 44.31, -3.01, 53.89, 54.51, -16.419999999999998, 48.0,
    54.61, -16.419999999999998, 46.959999999999994, 49.63, -4.5, 35.05, 49.42, -3.01, 34.8,
    44.12, -1.5, 53.96, 49.290000000000006, -1.5, 34.65, 48.09, -10.009999999999998, 55.17,
    51.02, -12.350000000000001, 40.05, 53.22, -15.83, 46.72, 53.099999999999994, -15.83, 48.0,
    50.23, -11.22, 39.38, 51.07, -14.31, 44.57, 69.22, -1.5, 32.9,
    49.93000000000001, -13.38, 44.15, 63.440000000000005, -4.5, 31.349999999999998, 59.459999999999994, -17.21, 45.14,
    48.31, -12.350000000000001, 45.85, 66.28, -4.5, 32.120000000000005, 63.49, -3.01, 31.03,
    66.39, -3.01, 31.810000000000002, 63.53, -1.5, 30.830000000000002, 71.58, -13.38, 49.95,
    66.46, -1.5, 31.619999999999997, 69.12, -15.129999999999999, 46.48, 69.25, -15.129999999999999, 48.0,
    67.67, -10.009999999999998, 35.59, 70.39, -14.31, 46.260000000000005, 68.08, -8.72, 34.870000000000005,
    70.54, -14.31, 48.0, 68.43, -7.37, 34.260000000000005, 68.72, -5.96, 33.76,
    71.07000000000001, -5.96, 35.4, 67.78, -15.83, 46.72, 62.99, -10.009999999999998, 33.879999999999995,
    67.45, -15.83, 50.53, 65.4, -10.009999999999998, 34.53, 63.129999999999995, -8.72, 33.07,
    65.67999999999999, -8.72, 33.76, 63.25, -7.37, 32.38, 65.92, -7.37, 33.1,
    63.36, -5.96, 31.810000000000002, 66.12, -5.96, 32.55, 66.95, -14.31, 40.309999999999995,
    67.72999999999999, -13.38, 39.38, 69.12, -13.38, 40.769999999999996, 68.45, -12.350000000000001, 38.519999999999996,
    69.98, -12.350000000000001, 40.05, 70.77, -11.22, 39.38, 66.69, -12.350000000000001, 37.28,
    67.2, -11.22, 36.39, 69.12, -11.22, 37.730000000000004, 62.019999999999996, -15.129999999999999, 39.38,
    63.49, -15.129999999999999, 39.78, 64.88000000000001, -15.129999999999999, 40.42, 63.93, -14.31, 38.57,
    65.52, -14.31, 39.31, 62.24, -14.31, 38.11, 62.45, -13.38, 36.92,
    64.35, -13.38, 37.43, 66.12, -13.38, 38.26, 64.73, -12.350000000000001, 36.37,
    61.78, -15.83, 40.72, 62.65, -12.350000000000001, 35.81, 62.830000000000005, -11.22, 34.8,
    65.09, -11.22, 35.4, 51.28999999999999, -10.009999999999998, 37.019999999999996, 57.56, -4.5, 31.349999999999998,
    60.5, -4.5, 31.099999999999998, 57.510000000000005, -3.01, 31.03, 60.5, -3.01, 30.77,
    57.47, -1.5, 30.830000000000002, 246.91, 0.03, 59.25, 248.66, 0.03, 56.75,
    249.94, 0.03, 53.99, 227.51000000000002, 0.03, 64.44, 250.73000000000002, 0.03, 44.96000000000001,
    249.94, 0.03, 42.01, 250.73000000000002, 0.03, 51.04, 251.0, 0.03, 48.0,
    239.39, -16.419999999999998, 46.959999999999994, 231.55, -13.38, 59.080000000000005, 233.5, -4.5, 64.9,
    242.25, 0.03, 63.16, 234.02, -17.41, 46.57, 221.31, -12.350000000000001, 45.85,
    221.87, -12.350000000000001, 43.769999999999996, 222.42000000000002, -13.38, 46.050000000000004, 222.29, -1.5, 61.349999999999994,
    231.97, -17.41, 48.0, 232.0, -17.41, 47.74, 232.07, -17.41, 47.480000000000004,
    239.49, -16.419999999999998, 48.0, 236.54, 0.03, 65.22999999999999, 239.49, 0.03, 64.44,
    227.54000000000002, -1.5, 31.619999999999997, 220.3, -11.22, 45.67, 230.45999999999998, 0.03, 65.22999999999999,
    233.5, 0.03, 65.5, 235.45000000000002, -13.38, 59.080000000000005, 231.01, -10.009999999999998, 33.879999999999995,
    230.56, -4.5, 64.65, 233.5, -12.350000000000001, 60.37, 218.4, -1.5, 56.72,
    233.5, -3.01, 65.22999999999999, 231.35000000000002, -12.350000000000001, 60.19, 224.29, -10.009999999999998, 58.98,
    230.51, -3.01, 64.97, 233.5, -10.009999999999998, 33.660000000000004, 224.81, -14.31, 42.980000000000004,
    233.5, -1.5, 65.43, 233.5, -11.22, 61.41, 236.49, -17.21, 47.47,
    223.76000000000002, -13.38, 42.38, 230.47, -1.5, 65.17, 230.87, -8.72, 33.07,
    231.17000000000002, -11.22, 61.2, 236.54, -17.21, 48.0, 233.5, -8.72, 32.839999999999996,
    222.77999999999997, -12.350000000000001, 41.81, 236.49, -17.21, 48.53, 222.51999999999998, -10.009999999999998, 57.21,
    223.76000000000002, -8.72, 59.61, 221.89, -8.72, 57.74, 220.9, -11.22, 43.410000000000004,
    238.03, -16.88, 48.0, 235.01999999999998, -15.129999999999999, 56.62, 227.71999999999997, -4.5, 63.879999999999995,
    221.89, -11.22, 41.3, 223.31, -7.37, 60.15, 233.5, -15.129999999999999, 56.75,
    227.60999999999999, -3.01, 64.19, 221.35000000000002, -7.37, 58.19, 231.98000000000002, -15.129999999999999, 56.62,
    227.54000000000002, -1.5, 64.38, 222.93, -5.96, 60.599999999999994, 220.9, -5.96, 58.57,
    236.13, -17.21, 46.48, 235.24, -14.31, 57.89, 233.5, -14.31, 58.040000000000006,
    236.35999999999999, -17.21, 46.959999999999994, 231.76, -14.31, 57.89, 233.5, -10.009999999999998, 62.34,
    231.01, -10.009999999999998, 62.12, 230.75, -7.37, 32.38, 217.62, -4.5, 53.78,
    233.5, -8.72, 63.16, 233.5, -7.37, 32.14, 230.87, -8.72, 62.93,
    217.31, -3.01, 53.89, 246.91, 0.03, 36.75, 248.66, 0.03, 39.25,
    246.45, -4.5, 37.13, 248.14, -4.5, 39.55, 230.64, -5.96, 31.810000000000002,
    233.5, -7.37, 63.86, 217.12, -1.5, 53.96, 246.70000000000002, -3.01, 36.92,
    233.5, -5.96, 31.560000000000002, 248.43, -3.01, 39.38, 230.75, -7.37, 63.620000000000005,
    233.5, -5.96, 64.44, 229.26999999999998, -12.350000000000001, 59.63, 221.09000000000003, -10.009999999999998, 55.17,
    246.85, -1.5, 36.79, 248.6, -1.5, 39.28, 228.90999999999997, -11.22, 60.599999999999994,
    220.03, -10.009999999999998, 52.9, 230.64, -5.96, 64.19, 226.8, -11.22, 59.61,
    220.38, -8.72, 55.58, 226.32999999999998, -10.009999999999998, 35.59, 219.26, -8.72, 53.17999999999999,
    245.91000000000003, -10.009999999999998, 40.83, 228.6, -10.009999999999998, 34.53, 246.63, -8.72, 40.42,
    230.07000000000002, -14.31, 57.43000000000001, 228.6, -10.009999999999998, 61.47, 237.76, -16.88, 46.449999999999996,
    219.76, -7.37, 55.93, 228.32, -8.72, 62.24, 228.48, -14.31, 56.69,
    237.95999999999998, -16.88, 47.21, 218.6, -7.37, 53.419999999999995, 247.24, -7.37, 40.06999999999999,
    225.92, -8.72, 34.870000000000005, 228.07999999999998, -7.37, 62.9, 229.65, -13.38, 58.57,
    225.57, -7.37, 61.74, 228.32, -8.72, 33.76, 227.88, -5.96, 63.449999999999996,
    227.88, -13.38, 57.74, 219.26, -5.96, 56.22, 246.1, -5.96, 37.43,
    225.27999999999997, -5.96, 62.24, 247.74, -5.96, 39.78, 226.26999999999998, -13.38, 56.62,
    225.57, -7.37, 34.260000000000005, 218.05, -5.96, 53.620000000000005, 227.31, -12.350000000000001, 58.72,
    228.07999999999998, -7.37, 33.1, 244.75, 0.03, 61.41, 232.07, -17.41, 48.52,
    241.08, -15.129999999999999, 43.620000000000005, 232.0, -17.41, 48.26, 225.27999999999997, -5.96, 33.76,
    227.88, -5.96, 32.55, 230.51, -17.21, 47.47, 224.88, -11.22, 58.269999999999996,
    241.72, -15.129999999999999, 45.010000000000005, 230.45999999999998, -17.21, 48.0, 223.23000000000002, -11.22, 56.62,
    242.93, -14.31, 44.57, 236.54, 0.03, 30.77, 224.88, -13.38, 55.23,
    239.49, 0.03, 31.560000000000002, 242.25, 0.03, 32.839999999999996, 230.51, -17.21, 48.53,
    244.75, 0.03, 34.59, 233.5, -1.5, 30.57, 242.71, -10.009999999999998, 37.019999999999996,
    225.55, -12.350000000000001, 57.480000000000004, 224.02, -12.350000000000001, 55.949999999999996, 222.77999999999997, -12.350000000000001, 54.19,
    244.48000000000002, -10.009999999999998, 38.79, 230.51, -15.129999999999999, 39.78, 221.89, -11.22, 54.699999999999996,
    243.24, -8.72, 36.39, 231.98000000000002, -15.129999999999999, 39.38, 245.10999999999999, -8.72, 38.26,
    233.5, -15.129999999999999, 39.25, 243.69, -7.37, 35.85, 245.65, -7.37, 37.81,
    224.81, -14.31, 53.019999999999996, 235.01999999999998, -15.129999999999999, 39.38, 224.07, -14.31, 51.43,
    232.18, -17.41, 47.24, 232.33, -17.41, 47.019999999999996, 223.76000000000002, -13.38, 53.620000000000005,
    232.51999999999998, -17.41, 46.83, 230.51, -15.129999999999999, 56.22, 232.74, -17.41, 46.68,
    222.93, -13.38, 51.849999999999994, 230.64, -17.21, 46.959999999999994, 234.54000000000002, -16.419999999999998, 53.89,
    230.87, -17.21, 46.48, 244.37, -4.5, 60.949999999999996, 233.5, -16.419999999999998, 53.99,
    224.75, 0.03, 63.16, 241.95, -4.5, 33.36, 218.34, 0.03, 56.75,
    220.09, 0.03, 59.25, 244.57999999999998, -3.01, 61.2, 217.06, 0.03, 53.99,
    222.25, 0.03, 61.41, 216.0, 0.03, 48.0, 216.26999999999998, 0.03, 44.96000000000001,
    216.26999999999998, 0.03, 51.04, 244.71, -1.5, 61.349999999999994, 244.37, -4.5, 35.05,
    217.06, 0.03, 42.01, 232.45999999999998, -16.419999999999998, 53.89, 230.45999999999998, 0.03, 30.77,
    227.51000000000002, 0.03, 31.560000000000002, 233.5, 0.03, 30.5, 224.75, 0.03, 32.839999999999996,
    222.25, 0.03, 34.59, 220.09, 0.03, 36.75, 242.12, -3.01, 33.07,
    218.34, 0.03, 39.25, 234.78000000000003, -15.83, 55.279999999999994, 244.57999999999998, -3.01, 34.8,
    233.5, -15.83, 55.4, 242.71, -10.009999999999998, 58.98, 244.07, -13.38, 44.15,
    240.67000000000002, -10.009999999999998, 60.410000000000004, 242.22000000000003, -1.5, 32.9, 243.24, -8.72, 59.61,
    244.57999999999998, -13.38, 46.050000000000004, 246.1, -5.96, 58.57, 241.08, -8.72, 61.120000000000005,
    244.71, -1.5, 34.65, 248.14, -4.5, 56.449999999999996, 245.13000000000002, -12.350000000000001, 43.769999999999996,
    246.45, -4.5, 58.87, 236.44, -4.5, 31.349999999999998, 245.69, -12.350000000000001, 45.85,
    225.27999999999997, -15.129999999999999, 50.99, 243.69, -7.37, 60.15, 239.28, -4.5, 32.120000000000005,
    248.43, -3.01, 56.62, 230.03, -16.88, 50.910000000000004, 246.70000000000002, -3.01, 59.080000000000005,
    244.07, -5.96, 60.599999999999994, 229.57999999999998, -16.88, 50.26, 232.22000000000003, -15.83, 55.279999999999994,
    230.97000000000003, -15.83, 54.95, 248.6, -1.5, 56.72, 229.24, -16.88, 49.55,
    246.85, -1.5, 59.21, 241.19, -14.31, 41.550000000000004, 244.48000000000002, -10.009999999999998, 57.21,
    242.19, -14.31, 42.980000000000004, 229.04, -16.88, 48.78999999999999, 221.87, -12.350000000000001, 52.23,
    245.10999999999999, -8.72, 57.74, 220.9, -11.22, 52.59, 245.65, -7.37, 58.19,
    228.32, -16.419999999999998, 50.99, 243.24, -13.38, 42.38, 236.49, -3.01, 31.03,
    227.88, -16.419999999999998, 50.05, 244.22, -12.350000000000001, 41.81, 227.60999999999999, -16.419999999999998, 49.04,
    231.76, -14.31, 38.11, 233.5, -14.31, 37.96, 226.55, -15.83, 50.53,
    235.24, -14.31, 38.11, 245.10999999999999, -11.22, 41.3, 226.22, -15.83, 49.28,
    231.55, -13.38, 36.92, 235.04999999999998, -16.88, 52.26, 233.5, -13.38, 36.75,
    234.29, -16.88, 52.46000000000001, 249.38, -4.5, 53.78, 235.45000000000002, -13.38, 36.92,
    233.5, -16.88, 52.53, 249.69, -3.01, 53.89, 239.12, -15.129999999999999, 41.3,
    249.88, -1.5, 53.96, 240.2, -15.129999999999999, 42.38, 229.04, -16.88, 47.21,
    246.97, -10.009999999999998, 52.9, 228.96999999999997, -16.88, 48.0, 238.09, -16.419999999999998, 44.15,
    229.24, -16.88, 46.449999999999996, 245.91000000000003, -10.009999999999998, 55.17, 238.67999999999998, -16.419999999999998, 45.010000000000005,
    247.74, -8.72, 53.17999999999999, 232.71, -16.88, 52.46000000000001, 239.39, -3.01, 31.810000000000002,
    232.22000000000003, -15.83, 40.72, 246.63, -8.72, 55.58, 236.52999999999997, -1.5, 30.830000000000002,
    231.95, -16.88, 52.26, 233.5, -15.83, 40.599999999999994, 239.46, -1.5, 31.619999999999997,
    234.78000000000003, -15.83, 40.72, 231.23999999999998, -16.88, 51.92, 248.4, -7.37, 53.419999999999995,
    230.59, -16.88, 51.47, 227.51000000000002, -16.419999999999998, 48.0, 227.60999999999999, -16.419999999999998, 46.959999999999994,
    247.24, -7.37, 55.93, 248.95, -5.96, 53.620000000000005, 231.45, -16.419999999999998, 53.620000000000005,
    247.74, -5.96, 56.22, 230.51, -16.419999999999998, 53.17999999999999, 240.67000000000002, -10.009999999999998, 35.59,
    229.13, -15.129999999999999, 40.42, 241.08, -8.72, 34.870000000000005, 226.22, -15.83, 46.72,
    227.04999999999998, -14.31, 40.309999999999995, 226.1, -15.83, 48.0, 241.43, -7.37, 34.260000000000005,
    246.1, -11.22, 52.59, 241.72, -5.96, 33.76, 229.13, -15.129999999999999, 55.58,
    244.07, -5.96, 35.4, 227.88, -15.129999999999999, 54.699999999999996, 240.73000000000002, -13.38, 56.62,
    250.39999999999998, -4.5, 48.0, 241.45, -12.350000000000001, 57.480000000000004, 232.97, -17.21, 45.010000000000005,
    226.8, -15.129999999999999, 53.620000000000005, 235.99, -10.009999999999998, 33.879999999999995, 225.92, -15.129999999999999, 52.370000000000005,
    250.15, -4.5, 50.940000000000005, 243.76999999999998, -11.22, 56.62, 242.12, -11.22, 58.269999999999996,
    233.5, -17.21, 44.96000000000001, 250.73000000000002, -3.01, 48.0, 238.4, -10.009999999999998, 34.53,
    250.47, -3.01, 50.99, 234.02999999999997, -17.21, 45.010000000000005, 234.54000000000002, -17.21, 45.14,
    227.04999999999998, -14.31, 55.69, 250.93, -1.5, 48.0, 236.13, -8.72, 33.07,
    225.81, -14.31, 54.45, 250.67000000000002, -1.5, 51.03, 235.01999999999998, -17.21, 45.37,
    237.73, -12.350000000000001, 59.63, 238.67999999999998, -8.72, 33.76, 235.65, -12.350000000000001, 60.19,
    235.45000000000002, -17.21, 45.67, 240.2, -11.22, 59.61, 236.25, -7.37, 32.38,
    238.09, -11.22, 60.599999999999994, 238.92, -7.37, 33.1, 247.83999999999997, -10.009999999999998, 48.0,
    235.82999999999998, -11.22, 61.2, 236.35999999999999, -5.96, 31.810000000000002, 247.62, -10.009999999999998, 50.49,
    229.65, -16.419999999999998, 52.59, 239.12, -5.96, 32.55, 248.66, -8.72, 48.0,
    228.90999999999997, -16.419999999999998, 51.849999999999994, 248.43, -8.72, 50.629999999999995, 229.8, -15.83, 54.400000000000006,
    228.75, -15.83, 53.67, 249.36, -7.37, 48.0, 234.29, -16.88, 43.54,
    238.52, -14.31, 56.69, 227.83, -15.83, 52.75, 227.10000000000002, -15.83, 51.7,
    249.12, -7.37, 50.75, 236.93, -14.31, 57.43000000000001, 235.04999999999998, -16.88, 43.739999999999995,
    240.73000000000002, -13.38, 39.38, 249.94, -5.96, 48.0, 242.12, -13.38, 40.769999999999996,
    249.69, -5.96, 50.86, 239.12, -13.38, 57.74, 241.45, -12.350000000000001, 38.519999999999996,
    237.35, -13.38, 58.57, 242.98, -12.350000000000001, 40.05, 242.12, -11.22, 37.730000000000004,
    242.12, -15.129999999999999, 49.519999999999996, 231.17000000000002, -17.21, 46.050000000000004, 239.12, -16.419999999999998, 45.949999999999996,
    231.55, -17.21, 45.67, 239.69, -12.350000000000001, 58.72, 231.98000000000002, -17.21, 45.37,
    243.76999999999998, -11.22, 39.38, 232.45999999999998, -17.21, 45.14, 216.6, -4.5, 48.0,
    239.91, -15.83, 44.3, 216.85, -4.5, 50.940000000000005, 230.59, -16.88, 44.53,
    240.45000000000002, -15.83, 45.47, 231.23999999999998, -16.88, 44.080000000000005, 216.26999999999998, -3.01, 48.0,
    236.49, -15.129999999999999, 39.78, 241.19, -14.31, 54.45, 231.95, -16.88, 43.739999999999995,
    237.88, -15.129999999999999, 40.42, 216.52999999999997, -3.01, 50.99, 242.12, -13.38, 55.23,
    236.93, -14.31, 38.57, 244.22, -12.350000000000001, 54.19, 232.71, -16.88, 43.54,
    216.07, -1.5, 48.0, 238.52, -14.31, 39.31, 216.32999999999998, -1.5, 51.03,
    235.82999999999998, -17.21, 46.050000000000004, 242.98, -12.350000000000001, 55.949999999999996, 235.76, -16.88, 44.080000000000005,
    239.95000000000002, -14.31, 40.309999999999995, 236.40999999999997, -16.88, 44.53, 245.10999999999999, -11.22, 54.699999999999996,
    236.97, -16.88, 45.09, 237.42000000000002, -16.88, 45.739999999999995, 219.16, -10.009999999999998, 48.0,
    233.5, -16.88, 43.470000000000006, 241.08, -15.129999999999999, 52.370000000000005, 219.38, -10.009999999999998, 50.49,
    237.35, -13.38, 37.43, 233.5, -16.419999999999998, 42.01, 242.93, -14.31, 51.43,
    241.72, -15.129999999999999, 50.99, 239.12, -13.38, 38.26, 234.54000000000002, -16.419999999999998, 42.11,
    242.19, -14.31, 53.019999999999996, 243.39, -14.31, 49.74, 235.55, -16.419999999999998, 42.38,
    237.73, -12.350000000000001, 36.37, 236.49, -16.419999999999998, 42.82, 244.07, -13.38, 51.849999999999994,
    239.69, -12.350000000000001, 37.28, 237.35, -16.419999999999998, 43.410000000000004, 243.24, -13.38, 53.620000000000005,
    236.03000000000003, -15.83, 41.050000000000004, 244.57999999999998, -13.38, 49.95, 237.2, -15.83, 41.6,
    245.13000000000002, -12.350000000000001, 52.23, 245.69, -12.350000000000001, 50.15, 240.2, -11.22, 36.39,
    230.51, -16.419999999999998, 42.82, 231.45, -16.419999999999998, 42.38, 249.38, -4.5, 42.220000000000006,
    232.45999999999998, -16.419999999999998, 42.11, 250.15, -4.5, 45.06, 242.12, -15.129999999999999, 46.48,
    249.69, -3.01, 42.11, 230.97000000000003, -15.83, 41.050000000000004, 235.65, -12.350000000000001, 35.81,
    228.48, -14.31, 39.31, 250.47, -3.01, 45.010000000000005, 242.25, -15.129999999999999, 48.0,
    230.07000000000002, -14.31, 38.57, 249.88, -1.5, 42.04, 243.39, -14.31, 46.260000000000005,
    250.67000000000002, -1.5, 44.97, 243.54, -14.31, 48.0, 226.26999999999998, -13.38, 39.38,
    218.34, -8.72, 48.0, 218.57, -8.72, 50.629999999999995, 244.75, -13.38, 48.0,
    225.55, -12.350000000000001, 38.519999999999996, 246.97, -10.009999999999998, 43.099999999999994, 247.62, -10.009999999999998, 45.510000000000005,
    217.64, -7.37, 48.0, 217.88, -7.37, 50.75, 247.74, -8.72, 42.82,
    227.88, -13.38, 38.26, 248.43, -8.72, 45.37, 229.65, -13.38, 37.43,
    240.78, -15.83, 46.72, 248.4, -7.37, 42.58, 227.31, -12.350000000000001, 37.28,
    240.9, -15.83, 48.0, 225.27999999999997, -15.129999999999999, 45.010000000000005, 249.12, -7.37, 45.25,
    229.26999999999998, -12.350000000000001, 36.37, 240.78, -15.83, 49.28, 225.92, -15.129999999999999, 43.620000000000005,
    235.82999999999998, -11.22, 34.8, 238.09, -11.22, 35.4, 226.8, -15.129999999999999, 42.38,
    227.88, -15.129999999999999, 41.3, 226.8, -11.22, 36.39, 248.95, -5.96, 42.38,
    225.81, -14.31, 41.550000000000004, 249.69, -5.96, 45.14, 217.06, -5.96, 48.0,
    239.39, -16.419999999999998, 49.04, 230.56, -4.5, 31.349999999999998, 239.12, -16.419999999999998, 50.05,
    217.31, -5.96, 50.86, 233.5, -4.5, 31.099999999999998, 238.67999999999998, -16.419999999999998, 50.99,
    231.35000000000002, -12.350000000000001, 35.81, 245.87, -12.350000000000001, 48.0, 233.5, -12.350000000000001, 35.63,
    230.51, -3.01, 31.03, 240.45000000000002, -15.83, 50.53, 246.1, -11.22, 43.410000000000004,
    233.5, -3.01, 30.77, 228.90999999999997, -11.22, 35.4, 216.85, -4.5, 45.06,
    246.70000000000002, -11.22, 45.67, 231.17000000000002, -11.22, 34.8, 246.91, -11.22, 48.0,
    217.62, -4.5, 42.220000000000006, 230.47, -1.5, 30.830000000000002, 233.5, -11.22, 34.59,
    236.35999999999999, -17.21, 49.04, 246.70000000000002, -11.22, 50.330000000000005, 216.52999999999997, -3.01, 45.010000000000005,
    236.13, -17.21, 49.519999999999996, 217.31, -3.01, 42.11, 216.32999999999998, -1.5, 44.97,
    235.82999999999998, -17.21, 49.95, 217.12, -1.5, 42.04, 237.95999999999998, -16.88, 48.78999999999999,
    227.71999999999997, -4.5, 32.120000000000005, 237.76, -16.88, 49.55, 227.60999999999999, -3.01, 31.810000000000002,
    241.95, -4.5, 62.64, 237.42000000000002, -16.88, 50.26, 218.85999999999999, -4.5, 39.55,
    219.38, -10.009999999999998, 45.510000000000005, 238.25, -15.83, 42.33, 236.97, -16.88, 50.910000000000004,
    220.55, -4.5, 37.13, 220.03, -10.009999999999998, 43.099999999999994, 239.17000000000002, -15.83, 43.25,
    218.57, -3.01, 39.38, 240.2, -15.129999999999999, 53.620000000000005, 220.3, -3.01, 36.92,
    218.57, -8.72, 45.37, 239.12, -15.129999999999999, 54.699999999999996, 237.88, -15.129999999999999, 55.58,
    219.26, -8.72, 42.82, 218.4, -1.5, 39.28, 236.49, -15.129999999999999, 56.22,
    220.15, -1.5, 36.79, 235.45000000000002, -17.21, 50.330000000000005, 235.01999999999998, -17.21, 50.629999999999995,
    217.88, -7.37, 45.25, 234.54000000000002, -17.21, 50.86, 218.6, -7.37, 42.58,
    239.95000000000002, -14.31, 55.69, 221.09000000000003, -10.009999999999998, 40.83, 217.31, -5.96, 45.14,
    234.02999999999997, -17.21, 50.99, 218.05, -5.96, 42.38, 222.51999999999998, -10.009999999999998, 38.79,
    229.57999999999998, -16.88, 45.739999999999995, 233.5, -17.21, 51.04, 230.03, -16.88, 45.09,
    220.38, -8.72, 40.42, 239.28, -4.5, 63.879999999999995, 227.88, -16.419999999999998, 45.949999999999996,
    237.2, -15.83, 54.400000000000006, 228.32, -16.419999999999998, 45.010000000000005, 236.03000000000003, -15.83, 54.95,
    236.44, -4.5, 64.65, 228.90999999999997, -16.419999999999998, 44.15, 224.88, -15.129999999999999, 49.519999999999996,
    242.12, -3.01, 62.93, 224.29, -10.009999999999998, 37.019999999999996, 226.55, -15.83, 45.47,
    221.89, -8.72, 38.26, 239.39, -3.01, 64.19, 223.61, -14.31, 49.74,
    223.76000000000002, -8.72, 36.39, 227.10000000000002, -15.83, 44.3, 238.09, -16.419999999999998, 51.849999999999994,
    221.35000000000002, -7.37, 37.81, 222.42000000000002, -13.38, 49.95, 236.49, -3.01, 64.97,
    239.91, -15.83, 51.7, 223.31, -7.37, 35.85, 239.17000000000002, -15.83, 52.75,
    221.31, -12.350000000000001, 50.15, 242.22000000000003, -1.5, 63.099999999999994, 220.9, -5.96, 37.43,
    238.25, -15.83, 53.67, 239.46, -1.5, 64.38, 236.52999999999997, -1.5, 65.17,
    220.3, -11.22, 50.330000000000005, 236.40999999999997, -16.88, 51.47, 219.76, -7.37, 40.06999999999999,
    235.76, -16.88, 51.92, 229.65, -16.419999999999998, 43.410000000000004, 219.26, -5.96, 39.78,
    227.83, -15.83, 43.25, 224.88, -15.129999999999999, 46.48, 228.75, -15.83, 42.33,
    224.75, -15.129999999999999, 48.0, 229.8, -15.83, 41.6, 232.97, -17.21, 50.99,
    237.35, -16.419999999999998, 52.59, 222.63000000000002, -4.5, 35.05, 223.46, -14.31, 48.0,
    223.61, -14.31, 46.260000000000005, 225.04999999999998, -4.5, 33.36, 236.49, -16.419999999999998, 53.17999999999999,
    222.42000000000002, -3.01, 34.8, 224.88, -3.01, 33.07, 241.43, -7.37, 61.74,
    235.55, -16.419999999999998, 53.620000000000005, 225.04999999999998, -4.5, 62.64, 222.29, -1.5, 34.65,
    241.72, -5.96, 62.24, 224.78000000000003, -1.5, 32.9, 222.25, -13.38, 48.0,
    224.88, -3.01, 62.93, 226.32999999999998, -10.009999999999998, 60.410000000000004, 225.92, -8.72, 61.120000000000005,
    224.78000000000003, -1.5, 63.099999999999994, 221.13, -12.350000000000001, 48.0, 222.93, -5.96, 35.4,
    234.82, -17.41, 48.760000000000005, 234.67, -17.41, 48.98, 234.48000000000002, -17.41, 49.17,
    234.26, -17.41, 49.32000000000001, 222.63000000000002, -4.5, 60.949999999999996, 224.88, -13.38, 40.769999999999996,
    220.55, -4.5, 58.87, 224.02, -12.350000000000001, 40.05, 218.85999999999999, -4.5, 56.449999999999996,
    220.09, -11.22, 48.0, 222.42000000000002, -3.01, 61.2, 220.3, -3.01, 59.080000000000005,
    233.5, -13.38, 59.25, 218.57, -3.01, 56.62, 238.4, -10.009999999999998, 61.47,
    235.99, -10.009999999999998, 62.12, 223.23000000000002, -11.22, 39.38, 238.67999999999998, -8.72, 62.24,
    224.07, -14.31, 44.57, 224.88, -11.22, 37.730000000000004, 236.13, -8.72, 62.93,
    220.15, -1.5, 59.21, 238.92, -7.37, 62.9, 222.93, -13.38, 44.15,
    236.25, -7.37, 63.620000000000005, 239.12, -5.96, 63.449999999999996, 236.35999999999999, -5.96, 64.19,
    234.02, -17.41, 49.42999999999999, 233.76000000000002, -17.41, 49.5, 233.5, -17.41, 49.53,
    233.24, -17.41, 49.5, 232.98, -17.41, 49.42999999999999, 232.45999999999998, -17.21, 50.86,
    231.98000000000002, -17.21, 50.629999999999995, 231.55, -17.21, 50.330000000000005, 231.17000000000002, -17.21, 49.95,
    232.74, -17.41, 49.32000000000001, 232.51999999999998, -17.41, 49.17, 232.33, -17.41, 48.98,
    232.18, -17.41, 48.760000000000005, 230.87, -17.21, 49.519999999999996, 230.64, -17.21, 49.04,
    234.92999999999998, -17.41, 47.480000000000004, 235.0, -17.41, 47.74, 235.03, -17.41, 48.0,
    235.0, -17.41, 48.26, 234.92999999999998, -17.41, 48.52, 233.5, -17.470000000000002, 48.0,
    234.26, -17.41, 46.68, 234.48000000000002, -17.41, 46.83, 234.67, -17.41, 47.019999999999996,
    234.82, -17.41, 47.24, 232.98, -17.41, 46.57, 233.24, -17.41, 46.5,
    233.5, -17.41, 46.47, 233.76000000000002, -17.41, 46.5, 179.21099999999998, 69.646, 112.5,
    139.32999999999998, 67.247, 112.5, 137.23000000000002, 64.707, 112.5, 154.52, 70.217, 112.5,
    155.92000000000002, 67.247, 112.5, 155.92000000000002, 67.247, 102.5, 154.52, 70.217, 102.5,
    121.92999999999999, 62.777, 102.5, 124.99000000000001, 61.567, 102.5, 103.25, 68.187, 112.5,
    102.887, 68.233, 112.5, 124.99000000000001, 61.567, 112.5, 119.27, 64.707, 102.5,
    178.07999999999998, 67.247, 112.5, 154.255, 71.60300000000001, 112.5, 139.32999999999998, 67.247, 102.5,
    179.21099999999998, 69.646, 102.5, 137.23000000000002, 64.707, 102.5, 154.45, 72.627, 112.5,
    154.277, 75.39699999999999, 112.5, 178.07999999999998, 67.247, 102.5, 134.57, 62.777, 112.5,
    134.57, 62.777, 102.5, 160.47, 48.857, 102.5, 154.255, 71.60300000000001, 102.5,
    160.47, 48.857, 112.5, 167.0, 48.027, 112.5, 167.0, 48.027, 102.5,
    154.45, 72.627, 102.5, 175.98, 64.707, 102.5, 140.995, 71.60300000000001, 102.5,
    154.277, 75.39699999999999, 102.5, 175.98, 64.707, 112.5, 140.8, 72.627, 102.5,
    140.973, 75.39699999999999, 102.5, 131.51, 61.567, 112.5, 131.51, 61.567, 102.5,
    121.92999999999999, 62.777, 112.5, 103.28, 66.167, 112.5, 173.32, 62.777, 112.5,
    173.32, 62.777, 102.5, 119.27, 64.707, 112.5, 128.25, 61.157000000000004, 102.5,
    128.25, 61.157000000000004, 112.5, 117.17, 67.247, 112.5, 117.17, 67.247, 102.5,
    121.72, 48.857, 112.5, 154.35, 51.277, 102.5, 154.35, 51.277, 112.5,
    115.969, 69.795, 102.5, 170.26, 61.567, 112.5, 115.969, 69.795, 112.5,
    106.09, 60.206999999999994, 112.5, 170.26, 61.567, 102.5, 110.28, 55.147000000000006, 112.5,
    115.60000000000001, 51.277, 112.5, 140.73000000000002, 70.217, 102.5, 134.78, 48.857, 102.5,
    191.97, 66.167, 102.5, 134.78, 48.857, 112.5, 191.97, 66.167, 112.5,
    128.25, 48.027, 112.5, 128.25, 48.027, 102.5, 192.394, 68.395, 102.5,
    192.394, 68.395, 112.5, 140.9, 51.277, 102.5, 140.9, 51.277, 112.5,
    149.03, 55.147000000000006, 102.5, 149.03, 55.147000000000006, 112.5, 190.75, 68.187, 112.5,
    190.75, 68.187, 102.5, 146.22, 55.147000000000006, 102.5, 146.22, 55.147000000000006, 112.5,
    147.625, 56.844, 112.5, 147.625, 56.844, 102.5, 102.887, 68.233, 102.5,
    167.0, 61.157000000000004, 112.5, 167.0, 61.157000000000004, 102.5, 103.28, 66.167, 102.5,
    173.53000000000003, 48.857, 102.5, 173.53000000000003, 48.857, 112.5, 103.25, 68.187, 102.5,
    179.65, 51.277, 102.5, 179.65, 51.277, 112.5, 184.97, 55.147000000000006, 102.5,
    184.97, 55.147000000000006, 112.5, 189.16, 60.206999999999994, 102.5, 189.16, 60.206999999999994, 112.5,
    106.09, 60.206999999999994, 102.5, 110.28, 55.147000000000006, 102.5, 115.60000000000001, 51.277, 102.5,
    163.73999999999998, 61.567, 102.5, 163.73999999999998, 61.567, 112.5, 121.72, 48.857, 102.5,
    160.68, 62.777, 102.5, 160.68, 62.777, 112.5, 158.01999999999998, 64.707, 102.5,
    158.01999999999998, 64.707, 112.5, 140.973, 75.39699999999999, 112.5, 140.8, 72.627, 112.5,
    140.995, 71.60300000000001, 112.5, 140.73000000000002, 70.217, 112.5,];
  bilibili_faces = [0, 1, 2, 0, 2, 3, 4, 5, 6,
    4, 6, 7, 3, 4, 7, 3, 7, 0,
    1, 6, 5, 1, 5, 2, 5, 4, 2,
    3, 2, 4, 7, 6, 1, 7, 1, 0,
    8, 9, 10, 8, 10, 11, 12, 13, 14,
    12, 14, 15, 15, 8, 11, 15, 11, 12,
    13, 10, 9, 13, 9, 14, 9, 8, 14,
    15, 14, 8, 11, 10, 13, 11, 13, 12,
    16, 17, 18, 16, 18, 19, 19, 20, 21,
    19, 21, 16, 20, 22, 23, 20, 23, 21,
    17, 23, 22, 17, 22, 18, 19, 18, 22,
    19, 22, 20, 21, 23, 17, 21, 17, 16,
    24, 25, 26, 24, 26, 27, 24, 28, 29,
    24, 29, 25, 26, 30, 31, 26, 31, 27,
    27, 31, 28, 27, 28, 24, 25, 29, 30,
    25, 30, 26, 29, 28, 30, 31, 30, 28,
    32, 33, 34, 32, 34, 35, 36, 37, 38,
    36, 38, 39, 35, 36, 39, 35, 39, 32,
    37, 34, 38, 33, 38, 34, 35, 34, 37,
    35, 37, 36, 39, 38, 33, 39, 33, 32,
    40, 41, 42, 40, 42, 43, 43, 44, 45,
    43, 45, 40, 44, 46, 47, 44, 47, 45,
    41, 47, 46, 41, 46, 42, 45, 47, 41,
    45, 41, 40, 43, 42, 46, 43, 46, 44,
    514, 510, 48, 54, 56, 50, 50, 56, 52,
    628, 54, 50, 60, 61, 55, 55, 61, 57,
    51, 547, 53, 57, 547, 51, 54, 59, 56,
    58, 59, 54, 58, 140, 59, 138, 140, 58,
    49, 57, 61, 67, 69, 62, 62, 69, 63,
    61, 48, 49, 66, 660, 51, 51, 53, 66,
    73, 77, 67, 67, 77, 69, 76, 78, 68,
    68, 78, 70, 67, 94, 73, 73, 81, 77,
    79, 81, 73, 77, 664, 69, 533, 71, 550,
    70, 80, 74, 78, 80, 70, 533, 72, 71,
    80, 95, 74, 75, 72, 535, 535, 537, 75,
    78, 66, 80, 692, 693, 79, 79, 693, 81,
    83, 116, 72, 87, 85, 92, 116, 71, 72,
    129, 136, 87, 72, 75, 83, 83, 75, 84,
    87, 136, 88, 93, 94, 89, 88, 146, 90,
    531, 86, 84, 93, 173, 94, 75, 531, 84,
    89, 94, 91, 91, 67, 62, 74, 95, 92,
    94, 67, 91, 101, 125, 103, 118, 114, 125,
    108, 142, 107, 106, 107, 142, 112, 142, 108,
    105, 125, 101, 80, 66, 109, 110, 142, 113,
    80, 109, 95, 111, 139, 110, 113, 142, 112,
    114, 115, 125, 109, 116, 98, 109, 98, 95,
    102, 125, 115, 103, 125, 102, 83, 98, 116,
    66, 53, 109, 123, 122, 121, 117, 122, 123,
    120, 121, 122, 143, 144, 105, 105, 106, 142,
    109, 53, 116, 71, 116, 53, 117, 118, 122,
    119, 85, 97, 126, 122, 118, 128, 125, 105,
    125, 124, 118, 124, 126, 118, 119, 92, 85,
    129, 87, 92, 127, 632, 605, 134, 135, 133,
    132, 133, 135, 131, 132, 135, 131, 135, 111,
    130, 111, 135, 97, 85, 99, 98, 129, 92,
    99, 85, 100, 87, 100, 85, 130, 141, 111,
    111, 141, 139, 140, 110, 139, 138, 110, 140,
    142, 110, 138, 129, 151, 136, 143, 105, 142,
    128, 105, 144, 100, 88, 224, 87, 88, 100,
    136, 146, 88, 395, 70, 104, 119, 104, 74,
    70, 74, 104, 147, 149, 127, 436, 90, 146,
    147, 161, 149, 119, 74, 92, 152, 148, 389,
    92, 95, 98, 127, 149, 137, 151, 129, 98,
    390, 152, 389, 151, 154, 136, 430, 150, 153,
    151, 84, 154, 83, 84, 151, 136, 154, 146,
    153, 164, 158, 154, 82, 146, 159, 152, 390,
    395, 393, 68, 159, 190, 152, 161, 147, 157,
    158, 68, 393, 151, 98, 83, 190, 159, 103,
    153, 150, 162, 84, 86, 154, 154, 86, 82,
    164, 153, 162, 158, 164, 76, 158, 76, 68,
    152, 169, 148, 190, 169, 152, 93, 611, 96,
    162, 64, 164, 96, 173, 93, 166, 170, 633,
    96, 179, 173, 177, 179, 96, 174, 175, 168,
    173, 73, 94, 168, 175, 171, 171, 256, 253,
    173, 79, 73, 175, 256, 171, 176, 174, 329,
    174, 178, 175, 174, 176, 178, 179, 79, 173,
    113, 112, 176, 50, 52, 177, 176, 112, 178,
    177, 52, 179, 52, 692, 179, 148, 169, 163,
    169, 185, 163, 163, 185, 165, 169, 192, 185,
    190, 192, 169, 192, 542, 185, 194, 195, 184,
    101, 103, 159, 103, 102, 190, 190, 102, 192,
    184, 195, 187, 102, 115, 192, 195, 509, 187,
    167, 198, 193, 193, 198, 194, 194, 199, 195,
    225, 189, 188, 198, 199, 194, 199, 513, 195,
    191, 499, 493, 148, 163, 200, 188, 202, 225,
    202, 232, 225, 206, 191, 189, 88, 90, 224,
    203, 207, 204, 208, 226, 90, 206, 189, 225,
    205, 207, 203, 191, 206, 499, 436, 438, 208,
    208, 438, 209, 210, 212, 205, 212, 207, 205,
    220, 212, 210, 197, 217, 210, 214, 459, 251,
    200, 217, 197, 458, 459, 214, 217, 220, 210,
    216, 215, 221, 219, 221, 215, 208, 90, 436,
    216, 221, 222, 163, 217, 200, 196, 216, 222,
    222, 201, 196, 217, 165, 220, 209, 441, 211,
    163, 165, 217, 165, 532, 220, 219, 240, 221,
    458, 214, 213, 530, 204, 556, 178, 112, 108,
    222, 246, 201, 246, 229, 201, 202, 201, 229,
    233, 234, 223, 223, 234, 228, 232, 202, 229,
    90, 226, 224, 227, 226, 208, 208, 209, 227,
    234, 390, 228, 230, 227, 209, 211, 231, 230,
    209, 211, 230, 233, 236, 234, 231, 213, 238,
    235, 236, 233, 231, 211, 213, 390, 234, 237,
    236, 237, 234, 232, 369, 687, 239, 272, 238,
    235, 106, 236, 107, 106, 235, 243, 221, 240,
    236, 106, 237, 105, 237, 106, 105, 101, 237,
    221, 243, 222, 243, 246, 222, 213, 214, 238,
    238, 214, 239, 214, 251, 239, 239, 251, 241,
    248, 247, 376, 243, 240, 249, 241, 251, 242,
    242, 254, 244, 248, 497, 247, 243, 250, 246,
    254, 255, 244, 243, 249, 250, 223, 228, 381,
    381, 228, 248, 228, 497, 248, 242, 251, 252,
    252, 254, 242, 253, 233, 223, 256, 233, 253,
    175, 178, 258, 258, 256, 175, 258, 235, 256,
    252, 251, 259, 459, 259, 251, 259, 261, 252,
    256, 235, 233, 178, 108, 258, 260, 269, 262,
    267, 269, 260, 258, 108, 235, 107, 235, 108,
    252, 261, 254, 599, 254, 261, 637, 267, 257,
    257, 267, 260, 263, 268, 265, 266, 268, 263,
    268, 245, 265, 262, 269, 264, 382, 264, 269,
    261, 259, 602, 264, 384, 380, 245, 396, 265,
    97, 99, 272, 156, 273, 274, 99, 100, 272,
    100, 224, 272, 224, 226, 272, 274, 170, 156,
    226, 227, 272, 636, 633, 170, 227, 230, 272,
    274, 636, 170, 230, 231, 272, 231, 238, 272,
    277, 278, 276, 433, 415, 272, 415, 416, 272,
    279, 280, 277, 416, 418, 272, 277, 280, 278,
    462, 463, 272, 465, 272, 463, 545, 279, 271,
    279, 546, 280, 281, 284, 282, 283, 284, 281,
    285, 286, 283, 283, 286, 284, 312, 133, 285,
    132, 285, 133, 132, 131, 285, 285, 131, 286,
    293, 607, 288, 290, 348, 287, 293, 288, 275,
    275, 276, 293, 287, 348, 343, 272, 294, 295,
    288, 607, 291, 295, 297, 272, 296, 298, 289,
    608, 605, 607, 272, 297, 299, 276, 278, 293,
    272, 299, 97, 298, 290, 289, 303, 306, 296,
    180, 304, 182, 301, 308, 305, 307, 308, 301,
    302, 304, 180, 304, 266, 182, 296, 306, 298,
    182, 266, 263, 303, 282, 306, 281, 282, 303,
    302, 310, 304, 308, 352, 305, 282, 321, 306,
    309, 310, 302, 304, 270, 266, 281, 303, 326,
    310, 270, 304, 332, 283, 326, 283, 312, 285,
    311, 314, 309, 313, 316, 307, 309, 314, 310,
    314, 378, 310, 307, 316, 308, 317, 315, 289,
    318, 289, 315, 317, 290, 287, 289, 290, 317,
    311, 171, 314, 168, 171, 311, 289, 318, 296,
    319, 296, 318, 253, 314, 171, 253, 378, 314,
    303, 296, 657, 319, 657, 296, 657, 326, 303,
    282, 284, 327, 330, 332, 322, 322, 332, 326,
    325, 328, 320, 327, 321, 282, 327, 329, 321,
    267, 388, 269, 166, 388, 267, 321, 329, 324,
    320, 328, 323, 324, 174, 168, 328, 331, 323,
    329, 174, 324, 327, 284, 334, 284, 286, 334,
    327, 335, 329, 218, 338, 219, 334, 335, 327,
    336, 338, 218, 335, 176, 329, 338, 240, 219,
    325, 537, 301, 334, 286, 111, 183, 347, 186,
    131, 111, 286, 339, 341, 333, 183, 340, 347,
    111, 110, 334, 334, 110, 335, 186, 349, 337,
    335, 113, 176, 325, 301, 305, 186, 347, 349,
    333, 341, 336, 110, 113, 335, 328, 325, 305,
    341, 342, 336, 331, 328, 344, 341, 262, 342,
    336, 342, 338, 305, 344, 328, 342, 346, 240,
    342, 240, 338, 240, 346, 249, 339, 634, 257,
    343, 350, 345, 305, 352, 344, 341, 339, 260,
    348, 350, 343, 350, 302, 345, 339, 257, 260,
    352, 368, 344, 260, 262, 341, 340, 351, 353,
    262, 264, 346, 262, 346, 342, 351, 474, 353,
    345, 302, 180, 290, 298, 355, 308, 354, 352,
    347, 340, 353, 380, 346, 264, 316, 354, 308,
    347, 356, 349, 354, 357, 352, 290, 355, 348,
    347, 353, 356, 354, 288, 357, 355, 358, 348,
    557, 275, 316, 350, 348, 358, 316, 275, 354,
    358, 309, 350, 275, 288, 354, 288, 291, 357,
    357, 291, 373, 350, 309, 302, 355, 298, 362,
    353, 476, 356, 331, 344, 363, 298, 306, 362,
    362, 364, 355, 361, 331, 363, 361, 365, 559,
    363, 365, 361, 358, 355, 364, 367, 246, 250,
    358, 311, 309, 344, 368, 363, 229, 246, 367,
    364, 311, 358, 229, 367, 369, 368, 371, 363,
    362, 306, 321, 368, 373, 371, 357, 373, 368,
    232, 229, 369, 360, 366, 359, 363, 371, 365,
    362, 324, 364, 370, 366, 360, 321, 324, 362,
    249, 346, 380, 368, 352, 357, 324, 168, 364,
    364, 168, 311, 183, 250, 249, 266, 376, 268,
    270, 376, 266, 268, 247, 245, 186, 367, 250,
    374, 372, 370, 186, 250, 183, 268, 376, 247,
    367, 186, 337, 367, 337, 369, 310, 378, 270,
    370, 372, 366, 372, 124, 125, 377, 379, 375,
    378, 381, 270, 378, 223, 381, 249, 380, 183,
    270, 381, 376, 374, 124, 372, 126, 124, 374,
    264, 382, 384, 381, 248, 376, 383, 387, 377,
    380, 340, 183, 377, 387, 379, 380, 384, 340,
    253, 223, 378, 383, 411, 180, 228, 389, 497,
    148, 497, 389, 390, 389, 228, 292, 300, 294,
    294, 300, 393, 145, 392, 386, 159, 390, 237,
    153, 300, 430, 145, 137, 392, 392, 391, 386,
    294, 393, 295, 295, 395, 297, 159, 237, 101,
    295, 393, 395, 382, 388, 394, 269, 388, 382,
    299, 297, 104, 382, 394, 404, 386, 391, 385,
    395, 104, 297, 299, 104, 119, 193, 371, 167,
    137, 149, 398, 299, 119, 97, 382, 404, 384,
    373, 291, 167, 605, 167, 291, 340, 384, 351,
    384, 404, 351, 531, 320, 86, 137, 398, 392,
    153, 158, 300, 398, 397, 392, 394, 633, 399,
    633, 394, 388, 383, 182, 387, 383, 180, 182,
    320, 323, 413, 392, 397, 391, 420, 323, 400,
    387, 182, 263, 461, 397, 401, 387, 263, 504,
    633, 636, 399, 400, 323, 331, 331, 361, 400,
    149, 161, 405, 445, 272, 442, 400, 361, 472,
    445, 447, 272, 405, 398, 149, 447, 448, 272,
    398, 401, 397, 409, 404, 394, 448, 449, 272,
    405, 401, 398, 449, 421, 272, 421, 422, 272,
    408, 411, 402, 399, 409, 394, 404, 409, 412,
    422, 424, 272, 393, 300, 158, 424, 292, 272,
    161, 360, 405, 292, 294, 272, 351, 404, 412,
    360, 359, 405, 474, 351, 412, 82, 86, 413,
    405, 359, 401, 395, 68, 70, 413, 407, 82,
    414, 419, 399, 407, 420, 410, 413, 420, 407,
    417, 401, 359, 409, 399, 419, 417, 428, 425,
    420, 423, 410, 419, 477, 409, 366, 427, 359,
    239, 241, 272, 417, 359, 427, 496, 422, 421,
    272, 241, 242, 422, 429, 424, 427, 428, 417,
    89, 419, 414, 272, 242, 244, 691, 89, 414,
    86, 320, 413, 424, 430, 292, 431, 272, 244,
    424, 429, 430, 413, 323, 420, 366, 432, 427,
    300, 292, 430, 431, 433, 272, 372, 432, 366,
    432, 434, 427, 420, 400, 423, 487, 416, 415,
    415, 488, 487, 429, 150, 430, 427, 434, 428,
    128, 434, 432, 426, 555, 574, 125, 432, 372,
    435, 440, 437, 125, 128, 432, 436, 407, 438,
    453, 457, 435, 488, 415, 433, 435, 457, 440,
    441, 209, 438, 439, 443, 160, 441, 446, 211,
    451, 452, 439, 439, 452, 443, 443, 273, 160,
    440, 444, 450, 213, 211, 446, 652, 440, 450,
    82, 436, 146, 439, 385, 451, 391, 451, 385,
    442, 188, 189, 444, 403, 450, 436, 82, 407,
    445, 442, 189, 402, 403, 444, 407, 410, 438,
    445, 191, 447, 403, 377, 450, 445, 189, 191,
    441, 438, 410, 493, 448, 447, 447, 191, 493,
    391, 454, 451, 391, 397, 454, 453, 668, 455,
    451, 456, 452, 453, 455, 457, 464, 410, 423,
    454, 456, 451, 449, 494, 496, 446, 458, 213,
    449, 496, 421, 418, 460, 272, 272, 460, 462,
    410, 464, 441, 461, 454, 397, 441, 464, 446,
    454, 466, 456, 465, 467, 272, 446, 469, 458,
    467, 442, 272, 461, 466, 454, 455, 468, 457,
    464, 469, 446, 458, 470, 459, 457, 444, 440,
    469, 470, 458, 457, 468, 444, 259, 459, 573,
    470, 573, 459, 215, 462, 460, 215, 463, 462,
    402, 468, 471, 423, 426, 464, 471, 408, 402,
    464, 426, 469, 402, 444, 468, 426, 574, 469,
    469, 574, 470, 672, 406, 471, 406, 408, 471,
    476, 353, 474, 528, 453, 435, 477, 412, 409,
    473, 435, 437, 473, 437, 475, 477, 478, 412,
    477, 62, 478, 474, 412, 478, 474, 480, 476,
    668, 453, 479, 474, 478, 480, 480, 689, 476,
    89, 91, 419, 91, 477, 419, 481, 483, 486,
    481, 486, 150, 486, 162, 150, 527, 528, 482,
    482, 473, 483, 416, 489, 418, 490, 484, 245,
    484, 396, 245, 473, 482, 528, 490, 491, 484,
    483, 475, 486, 487, 489, 416, 489, 492, 418,
    483, 473, 475, 485, 484, 491, 486, 475, 658,
    486, 658, 162, 491, 205, 485, 492, 460, 418,
    492, 215, 460, 485, 205, 203, 494, 448, 493,
    492, 219, 215, 247, 495, 245, 490, 245, 495,
    490, 197, 491, 494, 449, 448, 495, 197, 490,
    197, 210, 491, 491, 210, 205, 497, 495, 247,
    497, 200, 495, 422, 496, 498, 498, 429, 422,
    495, 200, 197, 497, 148, 200, 494, 493, 500,
    493, 499, 500, 494, 502, 496, 494, 500, 502,
    461, 401, 417, 417, 425, 461, 504, 501, 379,
    498, 496, 503, 502, 503, 496, 461, 425, 466,
    498, 503, 481, 379, 387, 504, 504, 505, 501,
    585, 172, 506, 429, 498, 481, 481, 150, 429,
    172, 187, 507, 504, 265, 505, 516, 499, 206,
    263, 265, 504, 499, 518, 500, 507, 506, 172,
    265, 396, 505, 499, 516, 518, 187, 509, 507,
    502, 482, 503, 510, 511, 508, 503, 482, 483,
    508, 49, 510, 49, 48, 510, 503, 483, 481,
    512, 225, 232, 512, 206, 225, 553, 505, 514,
    206, 512, 516, 195, 513, 509, 510, 514, 515,
    515, 517, 510, 510, 517, 511, 386, 513, 199,
    500, 519, 502, 386, 385, 513, 505, 396, 514,
    500, 518, 519, 396, 484, 515, 396, 515, 514,
    482, 502, 519, 515, 485, 517, 512, 232, 687,
    484, 485, 515, 485, 203, 517, 512, 522, 516,
    512, 687, 522, 516, 522, 524, 516, 524, 518,
    518, 524, 527, 526, 307, 523, 526, 313, 307,
    518, 527, 519, 530, 313, 526, 527, 482, 519,
    523, 307, 301, 529, 530, 525, 679, 479, 524,
    525, 530, 526, 479, 527, 524, 528, 527, 453,
    479, 453, 527, 473, 528, 435, 203, 529, 517,
    529, 204, 530, 529, 203, 204, 402, 411, 403,
    530, 556, 313, 117, 554, 118, 403, 383, 377,
    411, 383, 403, 408, 406, 343, 532, 534, 568,
    411, 408, 345, 72, 533, 535, 343, 345, 408,
    536, 532, 165, 75, 537, 531, 345, 180, 411,
    165, 185, 536, 65, 64, 538, 536, 539, 532,
    531, 325, 320, 537, 325, 531, 550, 508, 540,
    532, 539, 534, 65, 538, 541, 539, 548, 534,
    533, 550, 540, 533, 543, 535, 185, 542, 536,
    540, 543, 533, 536, 544, 539, 523, 535, 543,
    542, 544, 536, 535, 523, 537, 523, 301, 537,
    511, 540, 508, 115, 542, 192, 115, 114, 542,
    540, 511, 525, 542, 114, 544, 540, 525, 543,
    526, 523, 543, 534, 545, 271, 534, 548, 545,
    525, 526, 543, 529, 525, 511, 511, 517, 529,
    546, 279, 545, 545, 549, 546, 71, 53, 550,
    547, 550, 53, 548, 549, 545, 57, 49, 547,
    255, 431, 244, 550, 547, 508, 431, 255, 551,
    547, 49, 508, 544, 552, 539, 433, 431, 551,
    539, 552, 548, 433, 551, 488, 60, 553, 61,
    552, 554, 548, 60, 501, 553, 548, 554, 549,
    551, 621, 488, 553, 48, 61, 505, 553, 501,
    514, 48, 553, 118, 552, 544, 114, 118, 544,
    472, 426, 423, 552, 118, 554, 423, 400, 472,
    117, 123, 554, 555, 426, 472, 316, 313, 557,
    313, 556, 557, 204, 207, 558, 472, 559, 555,
    361, 559, 472, 558, 556, 204, 507, 560, 506,
    569, 555, 562, 559, 562, 555, 556, 561, 557,
    558, 561, 556, 561, 276, 557, 365, 563, 562,
    562, 559, 365, 276, 561, 277, 184, 562, 563,
    557, 276, 275, 560, 520, 506, 207, 212, 564,
    558, 207, 564, 558, 566, 561, 563, 365, 193,
    371, 193, 365, 507, 509, 565, 564, 566, 558,
    194, 184, 563, 193, 194, 563, 507, 565, 560,
    566, 277, 561, 373, 167, 371, 565, 567, 160,
    568, 564, 212, 160, 567, 439, 220, 568, 212,
    568, 271, 564, 569, 570, 575, 568, 534, 271,
    567, 565, 509, 564, 271, 566, 509, 513, 567,
    566, 279, 277, 271, 279, 566, 439, 567, 385,
    220, 532, 568, 571, 569, 562, 65, 541, 660,
    570, 569, 571, 51, 660, 541, 385, 567, 513,
    172, 585, 570, 571, 172, 570, 477, 91, 62,
    62, 63, 478, 571, 562, 184, 571, 187, 172,
    478, 63, 480, 184, 187, 571, 602, 259, 573,
    470, 574, 573, 575, 573, 574, 575, 577, 573,
    489, 487, 623, 576, 466, 425, 489, 218, 492,
    623, 218, 489, 579, 580, 576, 574, 555, 575,
    569, 575, 555, 576, 580, 578, 575, 570, 577,
    492, 218, 219, 570, 585, 577, 579, 576, 425,
    428, 579, 425, 597, 595, 121, 579, 587, 580,
    629, 628, 580, 280, 546, 583, 428, 434, 584,
    257, 634, 581, 144, 584, 128, 583, 617, 280,
    584, 579, 428, 584, 587, 579, 631, 629, 587,
    580, 587, 629, 434, 128, 584, 584, 143, 587,
    546, 549, 590, 144, 143, 584, 142, 631, 143,
    590, 583, 546, 589, 520, 582, 590, 592, 586,
    590, 586, 583, 591, 274, 273, 586, 593, 588,
    582, 520, 521, 273, 443, 591, 592, 593, 586,
    582, 521, 581, 506, 589, 585, 595, 590, 549,
    591, 443, 596, 549, 554, 595, 443, 452, 596,
    592, 590, 597, 595, 597, 590, 597, 598, 592,
    506, 520, 589, 599, 255, 254, 600, 596, 452,
    255, 601, 551, 592, 598, 593, 452, 456, 600,
    599, 601, 255, 600, 612, 596, 601, 621, 551,
    595, 554, 123, 123, 121, 595, 121, 120, 597,
    261, 602, 604, 597, 120, 598, 603, 600, 456,
    600, 603, 618, 599, 261, 604, 632, 167, 605,
    599, 606, 601, 604, 606, 599, 603, 576, 578,
    603, 578, 618, 291, 607, 605, 573, 577, 602,
    591, 609, 594, 596, 609, 591, 602, 610, 604,
    611, 691, 594, 609, 611, 594, 577, 610, 602,
    293, 278, 613, 610, 614, 604, 617, 613, 278,
    596, 612, 609, 613, 607, 293, 611, 609, 615,
    612, 615, 609, 613, 616, 608, 613, 608, 607,
    604, 614, 606, 96, 611, 615, 616, 147, 608,
    610, 589, 614, 278, 280, 617, 600, 618, 612,
    616, 613, 619, 617, 619, 613, 619, 157, 616,
    577, 585, 610, 618, 624, 612, 615, 612, 624,
    616, 157, 147, 585, 589, 610, 589, 582, 614,
    578, 628, 618, 617, 583, 619, 586, 619, 583,
    603, 456, 466, 620, 487, 488, 588, 157, 619,
    586, 588, 619, 603, 466, 576, 488, 621, 620,
    157, 588, 622, 620, 623, 487, 161, 157, 622,
    622, 360, 161, 624, 177, 615, 593, 625, 588,
    177, 624, 50, 588, 625, 622, 177, 96, 615,
    625, 370, 622, 621, 626, 627, 624, 618, 628,
    370, 625, 374, 622, 370, 360, 628, 50, 624,
    578, 580, 628, 625, 593, 630, 598, 630, 593,
    629, 54, 628, 627, 620, 621, 630, 374, 625,
    627, 333, 620, 631, 58, 629, 627, 626, 634,
    598, 120, 122, 630, 598, 122, 122, 126, 630,
    142, 138, 631, 126, 374, 630, 58, 631, 138,
    620, 333, 623, 632, 198, 167, 629, 58, 54,
    623, 336, 218, 587, 143, 631, 333, 336, 623,
    626, 621, 601, 632, 145, 198, 601, 606, 626,
    127, 137, 632, 388, 166, 633, 632, 137, 145,
    635, 634, 626, 198, 145, 199, 627, 339, 333,
    145, 386, 199, 634, 339, 627, 414, 399, 636,
    605, 608, 127, 606, 614, 635, 608, 147, 127,
    581, 521, 637, 606, 635, 626, 637, 257, 581,
    281, 326, 283, 635, 581, 634, 520, 560, 155,
    635, 582, 581, 155, 521, 520, 330, 645, 638,
    330, 312, 332, 637, 521, 639, 638, 312, 330,
    312, 283, 332, 614, 582, 635, 639, 521, 155,
    639, 166, 637, 638, 133, 312, 463, 215, 216,
    156, 639, 155, 134, 133, 638, 196, 465, 463,
    639, 170, 166, 156, 170, 639, 463, 216, 196,
    166, 267, 637, 641, 467, 465, 642, 155, 560,
    465, 196, 641, 560, 565, 642, 642, 156, 155,
    188, 467, 641, 565, 160, 642, 201, 641, 196,
    642, 273, 156, 641, 202, 188, 160, 273, 642,
    641, 201, 202, 594, 274, 591, 188, 442, 467,
    538, 650, 572, 274, 594, 636, 640, 693, 644,
    572, 55, 538, 414, 636, 594, 640, 645, 643,
    647, 572, 654, 644, 645, 640, 60, 55, 572,
    643, 330, 322, 541, 538, 55, 645, 330, 643,
    55, 57, 541, 541, 57, 51, 646, 648, 644,
    135, 648, 646, 130, 135, 646, 647, 60, 572,
    644, 648, 645, 375, 379, 647, 648, 638, 645,
    379, 501, 647, 501, 60, 647, 475, 437, 649,
    648, 135, 638, 134, 638, 135, 650, 538, 64,
    652, 649, 437, 437, 440, 652, 649, 654, 650,
    653, 651, 661, 652, 654, 649, 663, 653, 661,
    654, 572, 650, 653, 318, 651, 651, 318, 315,
    653, 663, 655, 375, 654, 652, 319, 318, 653,
    450, 375, 652, 653, 655, 319, 375, 647, 654,
    655, 657, 319, 377, 375, 450, 656, 657, 655,
    64, 162, 658, 322, 326, 656, 658, 650, 64,
    656, 326, 657, 76, 164, 65, 164, 64, 65,
    660, 78, 76, 65, 660, 76, 659, 63, 662,
    660, 66, 78, 662, 663, 659, 659, 663, 661,
    658, 475, 649, 650, 658, 649, 662, 63, 69,
    662, 665, 663, 664, 665, 662, 662, 69, 664,
    665, 655, 663, 77, 81, 666, 666, 664, 77,
    664, 667, 665, 666, 667, 664, 667, 656, 665,
    665, 656, 655, 666, 81, 640, 640, 81, 693,
    640, 643, 666, 666, 643, 667, 667, 322, 656,
    322, 667, 643, 181, 141, 130, 130, 646, 181,
    287, 406, 673, 343, 406, 287, 681, 669, 668,
    455, 668, 670, 669, 670, 668, 670, 468, 455,
    671, 672, 670, 671, 670, 669, 670, 471, 468,
    670, 672, 471, 671, 676, 672, 673, 672, 676,
    672, 673, 406, 315, 317, 676, 317, 287, 673,
    685, 674, 671, 676, 671, 674, 674, 675, 676,
    674, 686, 675, 675, 651, 315, 675, 315, 676,
    673, 676, 317, 522, 678, 679, 337, 682, 677,
    677, 680, 678, 678, 680, 681, 678, 681, 679,
    679, 668, 479, 679, 681, 668, 680, 684, 685,
    680, 685, 681, 337, 349, 682, 680, 677, 682,
    349, 356, 683, 683, 682, 349, 682, 684, 680,
    682, 683, 684, 684, 674, 685, 685, 669, 681,
    688, 683, 356, 683, 686, 684, 674, 684, 686,
    685, 671, 669, 686, 690, 675, 369, 677, 687,
    369, 337, 677, 687, 677, 678, 522, 687, 678,
    679, 524, 522, 688, 356, 476, 688, 686, 683,
    476, 689, 688, 688, 690, 686, 689, 690, 688,
    659, 689, 480, 63, 659, 480, 659, 661, 689,
    689, 661, 690, 675, 690, 651, 661, 651, 690,
    140, 139, 59, 59, 139, 696, 139, 141, 696,
    414, 594, 691, 691, 93, 89, 691, 611, 93,
    692, 79, 179, 692, 695, 693, 56, 694, 52,
    52, 694, 692, 694, 695, 692, 695, 644, 693,
    644, 695, 646, 181, 646, 695, 696, 694, 56,
    59, 696, 56, 696, 181, 694, 141, 181, 696,
    694, 181, 695, 826, 697, 699, 701, 826, 704,
    702, 826, 701, 703, 704, 826, 708, 887, 719,
    723, 718, 722, 717, 807, 705, 719, 722, 718,
    722, 719, 700, 749, 711, 710, 1233, 729, 707,
    729, 732, 707, 705, 1143, 1146, 707, 732, 726,
    717, 705, 1146, 729, 739, 732, 736, 741, 727,
    799, 740, 725, 729, 735, 739, 814, 740, 799,
    738, 1295, 734, 740, 743, 725, 737, 750, 742,
    727, 741, 730, 738, 744, 1297, 1026, 767, 736,
    768, 741, 736, 731, 747, 746, 748, 746, 747,
    738, 1297, 1295, 750, 737, 807, 710, 721, 749,
    742, 1190, 745, 711, 749, 753, 1190, 742, 750,
    726, 756, 752, 748, 747, 757, 754, 757, 747,
    732, 756, 726, 711, 753, 744, 756, 1284, 752,
    739, 759, 732, 744, 753, 1306, 721, 1201, 749,
    732, 759, 756, 759, 1287, 756, 757, 754, 761,
    760, 761, 754, 761, 817, 757, 751, 764, 755,
    763, 764, 751, 764, 766, 755, 873, 1287, 700,
    725, 743, 733, 761, 760, 1296, 1294, 1296, 760,
    755, 766, 758, 769, 740, 814, 1197, 1201, 721,
    769, 772, 740, 767, 773, 768, 771, 773, 767,
    740, 772, 743, 1302, 706, 764, 766, 764, 706,
    777, 784, 778, 769, 783, 772, 781, 1079, 774,
    771, 785, 773, 782, 784, 777, 780, 785, 771,
    779, 783, 769, 785, 811, 773, 730, 787, 706,
    789, 790, 782, 786, 793, 780, 730, 791, 787,
    795, 797, 788, 741, 791, 730, 1162, 1165, 779,
    788, 797, 792, 791, 794, 787, 782, 790, 784,
    780, 793, 785, 779, 1165, 783, 746, 748, 795,
    1316, 1233, 707, 775, 789, 843, 788, 746, 795,
    775, 776, 789, 786, 1316, 707, 789, 776, 790,
    786, 726, 793, 804, 795, 748, 786, 707, 726,
    758, 766, 801, 1080, 1087, 762, 768, 802, 741,
    800, 1139, 798, 762, 803, 765, 773, 805, 768,
    804, 748, 757, 802, 768, 805, 804, 808, 795,
    805, 1286, 802, 811, 805, 773, 795, 808, 797,
    805, 813, 1286, 811, 813, 805, 812, 801, 766,
    810, 814, 796, 823, 808, 804, 812, 766, 706,
    812, 816, 801, 815, 811, 785, 796, 814, 799,
    815, 785, 793, 815, 819, 811, 801, 816, 806,
    757, 817, 804, 806, 821, 1011, 816, 821, 806,
    811, 819, 813, 810, 1242, 822, 706, 787, 812,
    817, 823, 804, 726, 752, 793, 822, 825, 810,
    698, 699, 697, 765, 807, 737, 752, 815, 793,
    765, 803, 807, 810, 825, 814, 705, 807, 803,
    825, 769, 814, 717, 750, 807, 767, 768, 736,
    825, 779, 769, 817, 770, 823, 770, 1063, 823,
    714, 832, 715, 822, 831, 825, 714, 835, 832,
    818, 778, 820, 828, 837, 834, 830, 831, 822,
    777, 778, 818, 847, 846, 836, 828, 927, 837,
    868, 716, 715, 778, 1115, 820, 831, 779, 825,
    820, 1115, 1157, 782, 896, 789, 906, 843, 789,
    731, 746, 836, 731, 836, 833, 746, 788, 836,
    831, 830, 1191, 834, 837, 1127, 812, 824, 816,
    847, 848, 839, 827, 842, 829, 812, 787, 824,
    842, 835, 829, 824, 846, 816, 824, 833, 846,
    816, 846, 821, 829, 835, 714, 821, 846, 839,
    836, 851, 847, 787, 794, 824, 847, 851, 848,
    833, 824, 794, 849, 845, 854, 852, 854, 845,
    833, 836, 846, 849, 800, 798, 794, 731, 833,
    836, 788, 851, 854, 800, 849, 788, 792, 851,
    852, 856, 854, 857, 854, 856, 857, 809, 854,
    850, 939, 853, 854, 809, 800, 850, 1125, 939,
    758, 865, 920, 856, 993, 857, 758, 801, 865,
    818, 857, 993, 858, 867, 860, 818, 820, 857,
    863, 867, 858, 857, 820, 809, 801, 806, 865,
    993, 884, 818, 777, 818, 884, 868, 715, 832,
    826, 887, 708, 700, 719, 873, 884, 782, 777,
    868, 870, 716, 699, 703, 826, 702, 776, 826,
    906, 789, 896, 879, 719, 876, 876, 719, 875,
    873, 719, 879, 875, 719, 878, 878, 719, 882,
    716, 870, 861, 880, 719, 881, 881, 719, 885,
    891, 719, 890, 882, 719, 880, 924, 883, 877,
    843, 826, 775, 883, 1252, 877, 872, 920, 886,
    775, 826, 776, 841, 826, 843, 840, 838, 826,
    838, 889, 826, 888, 719, 887, 841, 840, 826,
    897, 920, 872, 887, 826, 889, 890, 719, 888,
    892, 719, 891, 894, 719, 892, 885, 719, 894,
    864, 862, 1056, 864, 1058, 866, 864, 1056, 1058,
    698, 697, 922, 893, 896, 874, 697, 826, 924,
    895, 897, 869, 893, 906, 896, 901, 906, 893,
    874, 896, 884, 896, 782, 884, 837, 899, 903,
    902, 905, 898, 837, 903, 1127, 898, 905, 900,
    906, 901, 843, 841, 843, 901, 899, 911, 903,
    909, 904, 981, 908, 911, 899, 1277, 905, 902,
    918, 904, 871, 910, 965, 914, 902, 913, 1277,
    949, 915, 907, 1277, 1312, 905, 751, 755, 895,
    915, 917, 907, 895, 755, 897, 869, 897, 872,
    913, 932, 918, 915, 924, 917, 907, 917, 909,
    917, 877, 871, 917, 871, 909, 1176, 911, 908,
    886, 921, 980, 909, 871, 904, 920, 921, 886,
    919, 936, 923, 955, 925, 927, 848, 863, 839,
    848, 929, 863, 751, 895, 1232, 955, 927, 828,
    863, 929, 867, 926, 930, 898, 902, 898, 930,
    848, 931, 929, 925, 1046, 934, 932, 913, 930,
    902, 930, 913, 851, 931, 848, 925, 934, 927,
    927, 899, 837, 931, 1257, 929, 904, 918, 932,
    919, 916, 933, 910, 1165, 935, 934, 899, 927,
    933, 936, 919, 933, 941, 936, 859, 1074, 1068,
    937, 934, 1046, 923, 938, 928, 936, 938, 923,
    934, 937, 908, 792, 931, 851, 853, 940, 855,
    897, 758, 920, 755, 758, 897, 853, 939, 940,
    934, 908, 899, 855, 940, 942, 865, 921, 920,
    940, 947, 950, 940, 950, 942, 865, 992, 921,
    941, 944, 936, 855, 942, 859, 922, 924, 915,
    1172, 908, 937, 924, 877, 917, 943, 1172, 937,
    697, 924, 922, 936, 944, 938, 883, 924, 826,
    939, 947, 940, 945, 947, 939, 1062, 828, 834,
    948, 1216, 946, 948, 872, 951, 1040, 912, 941,
    949, 952, 915, 954, 922, 952, 869, 948, 946,
    1266, 944, 1235, 922, 915, 952, 1278, 869, 946,
    1083, 925, 953, 945, 1169, 947, 698, 922, 699,
    954, 699, 922, 956, 832, 835, 869, 872, 948,
    872, 886, 951, 956, 835, 958, 956, 960, 832,
    1278, 895, 869, 868, 832, 960, 935, 965, 910,
    914, 893, 874, 868, 1224, 870, 1116, 1114, 966,
    965, 893, 914, 957, 967, 961, 960, 1224, 868,
    963, 967, 957, 967, 930, 961, 964, 980, 969,
    968, 971, 935, 932, 930, 967, 840, 971, 968,
    838, 840, 968, 842, 928, 958, 935, 971, 965,
    842, 958, 835, 971, 901, 965, 958, 976, 977,
    963, 978, 967, 974, 978, 963, 965, 901, 893,
    978, 932, 967, 966, 853, 855, 968, 844, 838,
    966, 855, 970, 886, 964, 951, 886, 980, 964,
    970, 859, 972, 977, 956, 958, 970, 855, 859,
    977, 1229, 956, 841, 901, 840, 971, 840, 901,
    979, 981, 974, 972, 859, 1068, 977, 976, 986,
    969, 982, 973, 980, 982, 969, 973, 1029, 975,
    974, 981, 978, 956, 1229, 960, 904, 932, 978,
    904, 978, 981, 985, 983, 1007, 1229, 1231, 960,
    976, 958, 928, 985, 852, 983, 949, 979, 1047,
    938, 976, 928, 979, 907, 981, 856, 852, 985,
    976, 988, 986, 983, 852, 845, 949, 907, 979,
    907, 909, 981, 986, 1238, 977, 938, 944, 988,
    944, 1266, 988, 989, 856, 985, 905, 1307, 900,
    938, 988, 976, 989, 993, 856, 957, 961, 990,
    991, 993, 989, 926, 1085, 961, 874, 991, 1030,
    986, 1264, 1147, 961, 930, 926, 874, 884, 991,
    991, 884, 993, 1001, 1040, 1039, 999, 1001, 1039,
    1081, 1003, 997, 1001, 912, 1040, 1004, 1021, 997,
    900, 1021, 1004, 1006, 1008, 996, 898, 900, 1004,
    1006, 1015, 1008, 996, 1008, 1002, 1003, 1085, 926,
    1002, 952, 949, 865, 806, 992, 1008, 952, 1002,
    926, 898, 1003, 1004, 1003, 898, 992, 1011, 994,
    806, 1011, 992, 994, 1011, 999, 1014, 999, 1011,
    1000, 733, 1013, 1014, 858, 999, 733, 743, 1013,
    1012, 1015, 1006, 1013, 1018, 1000, 1015, 954, 1008,
    1013, 1024, 1018, 999, 858, 1001, 1008, 954, 952,
    1000, 1018, 1007, 860, 912, 1001, 858, 860, 1001,
    1019, 727, 724, 1018, 985, 1007, 704, 703, 1012,
    1013, 743, 1022, 821, 839, 1011, 1012, 703, 1015,
    1023, 1017, 1057, 743, 772, 1022, 1015, 699, 954,
    1014, 1011, 839, 703, 699, 1015, 1022, 1024, 1013,
    839, 863, 1014, 1018, 989, 985, 1014, 863, 858,
    1024, 989, 1018, 1023, 1026, 1017, 847, 839, 846,
    772, 783, 1027, 916, 1325, 975, 1017, 1026, 1019,
    1027, 1022, 772, 973, 982, 1029, 1019, 736, 727,
    1026, 736, 1019, 1022, 1030, 1024, 1009, 1043, 1010,
    916, 975, 1032, 1029, 1032, 975, 1032, 933, 916,
    1027, 1030, 1022, 1034, 980, 921, 1025, 1033, 1028,
    1030, 991, 1024, 1034, 982, 980, 1020, 1016, 1084,
    1031, 1033, 1025, 1033, 963, 1028, 1034, 1035, 982,
    1024, 991, 989, 1084, 1080, 1020, 1028, 963, 957,
    1027, 783, 910, 910, 914, 1027, 1029, 982, 1035,
    1037, 1009, 1005, 1032, 1029, 1039, 1035, 1039, 1029,
    1027, 914, 1030, 1040, 933, 1032, 1031, 1041, 1033,
    1005, 1089, 1037, 1039, 1040, 1032, 1036, 1041, 1031,
    1009, 1037, 1043, 1040, 941, 933, 1033, 974, 963,
    874, 1030, 914, 844, 889, 838, 1034, 921, 992,
    1041, 974, 1033, 1211, 763, 751, 1042, 763, 1211,
    992, 994, 1034, 925, 1083, 1046, 1082, 1010, 1043,
    1045, 1047, 1036, 1035, 1034, 994, 1039, 1035, 999,
    994, 999, 1035, 1037, 1089, 1097, 1036, 1047, 1041,
    1049, 1051, 1046, 1049, 1046, 1044, 1041, 979, 974,
    1038, 1050, 1042, 1047, 979, 1041, 937, 1046, 1051,
    1048, 1050, 1038, 861, 870, 1054, 870, 1226, 1054,
    1050, 1019, 724, 1054, 862, 861, 1055, 1087, 962,
    1062, 962, 959, 1054, 1056, 862, 962, 1062, 1065,
    962, 1065, 1055, 1057, 1048, 995, 1051, 1049, 1059,
    1052, 1059, 1049, 1087, 1055, 803, 866, 1060, 1342,
    1051, 1059, 943, 1055, 705, 803, 995, 997, 1057,
    866, 1058, 1060, 1048, 1057, 1017, 998, 1342, 1060,
    1051, 943, 937, 1048, 1017, 1050, 1056, 1054, 1064,
    1112, 845, 1052, 1017, 1019, 1050, 1059, 1052, 849,
    845, 849, 1052, 1226, 1064, 1054, 1063, 1067, 1061,
    1056, 1064, 1066, 798, 943, 1059, 849, 798, 1059,
    997, 1021, 1057, 1055, 1065, 1143, 1021, 1023, 1057,
    1056, 1066, 1058, 1055, 1143, 705, 1058, 1066, 1070,
    770, 774, 1072, 1072, 1063, 770, 1058, 1070, 1060,
    1062, 834, 1065, 1072, 1067, 1063, 1060, 1076, 998,
    1060, 1070, 1076, 1068, 1074, 1078, 1339, 1020, 1080,
    774, 1079, 1072, 1068, 1078, 1071, 1082, 1016, 1010,
    953, 1071, 1083, 1079, 1077, 1072, 1071, 1078, 1083,
    995, 1073, 997, 1081, 997, 1073, 955, 953, 925,
    1082, 1084, 1016, 1072, 1077, 1067, 1080, 1084, 1086,
    1113, 1066, 1064, 1077, 880, 881, 1074, 1092, 1096,
    1080, 1086, 1087, 1075, 1003, 1081, 1074, 1096, 1078,
    1085, 1003, 1075, 1066, 1114, 1070, 1078, 1044, 1083,
    1004, 997, 1003, 1078, 1096, 1044, 1079, 781, 882,
    1044, 1046, 1083, 1079, 880, 1077, 1087, 803, 762,
    882, 880, 1079, 1096, 1049, 1044, 859, 942, 1074,
    998, 1089, 1005, 942, 1092, 1074, 1084, 1105, 959,
    1086, 1084, 959, 950, 1092, 942, 1086, 959, 962,
    959, 1105, 1202, 1097, 1089, 1093, 962, 1087, 1086,
    1094, 1098, 1095, 1198, 1202, 1105, 1090, 1095, 1098,
    1037, 1097, 1100, 1098, 1069, 1090, 1099, 1094, 1053,
    1037, 1100, 1043, 1092, 950, 1101, 1102, 1043, 1100,
    1099, 1103, 1094, 1043, 1102, 1082, 1082, 1105, 1084,
    1092, 1104, 1096, 1082, 1102, 1105, 1053, 1094, 1095,
    1092, 1101, 1104, 1103, 1106, 1094, 1096, 1104, 1049,
    1103, 1075, 1106, 1110, 1075, 1103, 1097, 1093, 972,
    1094, 1106, 1098, 1052, 1049, 1104, 1093, 970, 972,
    1107, 1097, 972, 1098, 1073, 1069, 1097, 1107, 1100,
    1100, 1107, 1109, 1098, 1106, 1073, 1103, 1099, 1108,
    1089, 998, 1076, 1101, 1153, 1112, 1108, 1110, 1103,
    1101, 1112, 1104, 1002, 1047, 1045, 1104, 1112, 1052,
    996, 1002, 1045, 1113, 1114, 1066, 1111, 1110, 1108,
    1075, 1081, 1106, 1106, 1081, 1073, 1002, 949, 1047,
    1113, 1120, 1114, 990, 1110, 1111, 1070, 1116, 1076,
    990, 1085, 1110, 1070, 1114, 1116, 990, 961, 1085,
    972, 1068, 1107, 1089, 1076, 1093, 1085, 1075, 1110,
    1076, 1116, 1093, 778, 784, 1119, 950, 947, 1121,
    1119, 1115, 778, 834, 1118, 1065, 1119, 1123, 1115,
    1118, 1129, 1124, 1114, 1120, 966, 1115, 1123, 1117,
    1117, 1006, 996, 1120, 853, 966, 1123, 1006, 1117,
    984, 1125, 850, 984, 1122, 1125, 1119, 784, 1126,
    1118, 834, 1127, 1091, 931, 792, 784, 790, 1126,
    1119, 1128, 1123, 1132, 1131, 1091, 1130, 987, 1295,
    1158, 1295, 987, 1126, 1128, 1119, 1091, 1131, 1088,
    1127, 1129, 1118, 1128, 1012, 1123, 1129, 1099, 1124,
    704, 1012, 1128, 1133, 1108, 1129, 1123, 1012, 1006,
    1140, 1122, 987, 1126, 790, 702, 1129, 1108, 1099,
    1132, 1091, 792, 1124, 1099, 1053, 790, 776, 702,
    702, 701, 1126, 792, 797, 1132, 1126, 701, 1128,
    1127, 1133, 1129, 939, 1125, 945, 701, 704, 1128,
    1297, 1134, 1295, 1127, 903, 1133, 798, 1139, 1135,
    1130, 1134, 1145, 1133, 1111, 1108, 797, 808, 1138,
    1168, 1111, 1133, 1130, 1140, 987, 1138, 1132, 797,
    1135, 1141, 1136, 1138, 1137, 1132, 903, 1168, 1133,
    1142, 1125, 1122, 1138, 1160, 1137, 1139, 1141, 1135,
    1164, 1160, 1138, 1141, 1031, 1136, 1122, 1140, 1142,
    1142, 945, 1125, 1116, 966, 970, 1031, 1141, 1036,
    1116, 970, 1093, 1065, 1118, 1143, 1136, 1031, 1025,
    1120, 1267, 850, 800, 809, 1144, 853, 1120, 850,
    1145, 1140, 1130, 1144, 1139, 800, 1143, 1124, 1146,
    1144, 1148, 1139, 1121, 947, 1169, 1121, 1101, 950,
    1140, 1145, 1149, 1150, 717, 1146, 1169, 1152, 1121,
    1140, 1149, 1142, 1121, 1153, 1101, 1148, 1141, 1139,
    1152, 1153, 1121, 1148, 1036, 1141, 1000, 1152, 1181,
    1124, 1143, 1118, 1000, 1007, 1152, 1153, 1152, 1007,
    1146, 1053, 1150, 983, 1112, 1153, 1007, 983, 1153,
    1124, 1053, 1146, 1144, 809, 1157, 984, 1265, 1155,
    1156, 1145, 1134, 1053, 1095, 1150, 983, 845, 1112,
    1150, 1095, 1171, 809, 820, 1157, 1151, 1158, 1154,
    1149, 1145, 1174, 1157, 1159, 1144, 720, 1282, 888,
    1132, 1137, 1131, 1174, 1145, 1156, 887, 720, 888,
    1090, 1171, 1095, 1148, 1144, 1159, 750, 717, 1161,
    1148, 1045, 1036, 1159, 1045, 1148, 1237, 810, 796,
    808, 823, 1164, 831, 1162, 779, 823, 1063, 1164,
    1267, 1265, 984, 1191, 1162, 831, 1159, 1157, 1117,
    1164, 1138, 808, 984, 850, 1267, 1157, 1115, 1117,
    1142, 1167, 945, 1117, 996, 1159, 1149, 1167, 1142,
    996, 1045, 1159, 903, 911, 1168, 1169, 945, 1167,
    717, 1150, 1161, 1165, 910, 783, 1161, 1171, 1163,
    1150, 1171, 1161, 1063, 1061, 1164, 1191, 1170, 1162,
    1160, 1164, 1061, 1162, 1173, 1165, 1172, 1176, 908,
    1175, 1220, 1160, 1170, 1173, 1162, 1173, 935, 1165,
    1174, 1177, 1149, 1160, 1061, 1175, 1178, 1168, 911,
    1174, 725, 1177, 935, 1173, 968, 1175, 1186, 1179,
    1167, 1149, 1177, 1176, 1178, 911, 1178, 1183, 1168,
    1167, 1181, 1169, 1178, 1028, 1183, 1067, 1184, 1061,
    1167, 1177, 1181, 1181, 1152, 1169, 1183, 1111, 1168,
    1170, 1180, 844, 1061, 1184, 1175, 1180, 889, 844,
    1183, 990, 1111, 1184, 1186, 1175, 1182, 1195, 1185,
    943, 798, 1135, 1170, 844, 1173, 1192, 1195, 1182,
    1187, 1184, 1067, 1172, 943, 1135, 1173, 844, 968,
    1176, 1172, 1136, 796, 799, 1156, 799, 1174, 1156,
    1077, 1187, 1067, 1135, 1136, 1172, 1180, 720, 887,
    1187, 1189, 1184, 1136, 1025, 1176, 1178, 1176, 1025,
    887, 889, 1180, 799, 725, 1174, 725, 733, 1177,
    1184, 1189, 1186, 830, 1273, 1191, 1025, 1028, 1178,
    1177, 733, 1181, 885, 1189, 1187, 1183, 1028, 957,
    1183, 957, 990, 883, 826, 708, 733, 1000, 1181,
    745, 1190, 1192, 1252, 708, 719, 1191, 1273, 1193,
    881, 1187, 1077, 1193, 1170, 1191, 881, 885, 1187,
    745, 1192, 1182, 1100, 1109, 1102, 1102, 1109, 1198,
    1185, 1199, 1188, 720, 1193, 1276, 1195, 1199, 1185,
    1193, 1180, 1170, 1109, 1071, 953, 720, 1180, 1193,
    1203, 1205, 1196, 1102, 1198, 1105, 1196, 1205, 1200,
    959, 1202, 1062, 1196, 1179, 1203, 749, 1201, 1219,
    1186, 1203, 1179, 1109, 1107, 1071, 1161, 1190, 750,
    1107, 1068, 1071, 1190, 1161, 1163, 1203, 1212, 1205,
    1204, 1207, 1254, 1197, 1088, 1206, 1190, 1163, 1192,
    1198, 1109, 953, 1192, 1166, 1195, 1131, 1206, 1088,
    1275, 1270, 1205, 1163, 1166, 1192, 953, 955, 1198,
    1202, 1198, 955, 1206, 1209, 1197, 1186, 1189, 1210,
    1207, 1208, 1254, 1189, 885, 1210, 1202, 828, 1062,
    1195, 1244, 1199, 1202, 955, 828, 1186, 1210, 1203,
    1208, 1042, 1211, 1213, 1292, 1188, 1197, 1209, 1201,
    1210, 1212, 1203, 1201, 1227, 1219, 1212, 1280, 1205,
    1209, 1227, 1201, 885, 894, 1210, 1215, 1206, 1131,
    1210, 892, 1212, 1131, 1137, 1215, 1069, 1204, 1090,
    1206, 1217, 1209, 894, 892, 1210, 1206, 1215, 1217,
    891, 1280, 892, 1204, 1069, 1207, 1218, 1207, 1069,
    1158, 1151, 734, 1137, 1160, 1220, 1214, 1216, 1293,
    1218, 1038, 1207, 1219, 753, 749, 1154, 1158, 987,
    1155, 1154, 987, 1220, 1215, 1137, 1155, 987, 1122,
    1218, 1048, 1038, 1222, 1217, 1215, 1155, 1122, 984,
    734, 1295, 1158, 1207, 1038, 1208, 1227, 1239, 1219,
    1220, 1222, 1215, 1038, 1042, 1208, 1224, 1226, 870,
    1223, 1219, 1239, 995, 1218, 1073, 1069, 1073, 1218,
    1218, 995, 1048, 1259, 1227, 1209, 1175, 1179, 1220,
    1231, 1224, 960, 1179, 1222, 1220, 1274, 1230, 1232,
    1227, 1245, 1239, 1224, 1234, 1226, 1231, 1234, 1224,
    1179, 1196, 1222, 1235, 944, 941, 1234, 1064, 1226,
    941, 912, 1235, 1208, 1230, 1254, 1223, 1237, 1309,
    871, 1236, 1194, 1208, 1211, 1230, 871, 877, 1236,
    1238, 1229, 977, 1230, 1211, 1232, 912, 1241, 1235,
    1236, 1240, 1194, 1239, 1242, 1223, 1237, 1223, 1242,
    860, 1241, 912, 1236, 1255, 1240, 751, 1232, 1211,
    1238, 1243, 1229, 810, 1237, 1242, 1194, 1240, 1228,
    860, 867, 1246, 1240, 1247, 1228, 1246, 1241, 860,
    1248, 1166, 1163, 1229, 1243, 1231, 1239, 1245, 1242,
    1249, 1242, 1245, 1228, 1247, 1233, 1163, 1171, 1248,
    1248, 1250, 1166, 1247, 729, 1233, 1251, 1246, 867,
    1244, 1166, 1250, 867, 929, 1251, 1236, 877, 1252,
    1254, 1269, 1250, 1252, 1255, 1236, 1256, 1247, 1240,
    1248, 1171, 1090, 1253, 1249, 1245, 1250, 1248, 1204,
    1238, 986, 1147, 1090, 1204, 1248, 1255, 1256, 1240,
    1256, 735, 1247, 1200, 1253, 1262, 1204, 1254, 1250,
    1151, 1243, 1238, 929, 1257, 1251, 1238, 1147, 1151,
    1188, 1199, 1258, 1151, 1154, 1243, 1247, 735, 729,
    1251, 1257, 1299, 1209, 1217, 1259, 1259, 1245, 1227,
    1234, 1261, 1064, 1217, 1222, 1262, 708, 1252, 883,
    1261, 1113, 1064, 1222, 1196, 1262, 1269, 1274, 1258,
    1243, 1263, 1231, 1258, 1274, 1260, 1262, 1259, 1217,
    1255, 1252, 719, 1259, 1253, 1245, 1231, 1263, 1234,
    719, 718, 1255, 988, 1264, 986, 1253, 1259, 1262,
    1260, 946, 1214, 1234, 1263, 1261, 1265, 1261, 1263,
    1266, 1264, 988, 1261, 1267, 1113, 1261, 1265, 1267,
    1244, 1195, 1166, 1196, 1200, 1262, 1267, 1120, 1113,
    1263, 1243, 1154, 1266, 1271, 1272, 1269, 1258, 1244,
    1199, 1244, 1258, 1263, 1154, 1265, 1155, 1265, 1154,
    1255, 718, 1256, 1200, 1205, 1270, 1276, 1273, 1270,
    1274, 1278, 1260, 1266, 1272, 1264, 1275, 1276, 1270,
    1193, 1273, 1276, 754, 813, 760, 1260, 1278, 946,
    819, 760, 813, 819, 815, 1279, 1250, 1269, 1244,
    913, 918, 1281, 1275, 1205, 1280, 1271, 1266, 1235,
    752, 1279, 815, 1230, 1274, 1269, 1280, 1282, 1275,
    1235, 1241, 1271, 1230, 1269, 1254, 1283, 712, 1271,
    1188, 1258, 1213, 1280, 890, 1282, 1232, 1278, 1274,
    1258, 1260, 1213, 1275, 1282, 1276, 1232, 895, 1278,
    1282, 720, 1276, 1284, 1279, 752, 1213, 1260, 1214,
    1212, 892, 1280, 802, 791, 741, 1284, 1300, 1279,
    1271, 712, 1272, 791, 1285, 794, 891, 890, 1280,
    946, 1216, 1214, 1285, 791, 802, 1216, 948, 1221,
    890, 888, 1282, 1285, 731, 794, 802, 1286, 1285,
    1283, 1271, 1241, 1285, 747, 731, 1241, 1246, 1283,
    1242, 1249, 822, 1287, 1284, 756, 1286, 747, 1285,
    1221, 948, 951, 1221, 951, 1225, 1287, 713, 1284,
    1288, 710, 1283, 813, 754, 1286, 759, 700, 1287,
    1246, 1251, 1288, 1253, 1289, 1249, 1286, 754, 747,
    1268, 1225, 964, 1289, 830, 1249, 951, 964, 1225,
    1246, 1288, 1283, 873, 879, 1287, 1288, 1299, 721,
    822, 1249, 830, 1270, 1289, 1200, 1253, 1200, 1289,
    721, 1299, 1197, 1289, 1273, 830, 781, 728, 878,
    875, 878, 728, 1270, 1273, 1289, 1288, 721, 710,
    882, 781, 878, 819, 1279, 1294, 1299, 1288, 1251,
    1294, 760, 819, 1335, 1182, 1336, 761, 1298, 817,
    1277, 913, 1281, 1296, 1298, 761, 1130, 1295, 1134,
    770, 817, 1298, 1042, 1050, 724, 1194, 1281, 918,
    1300, 1294, 1279, 763, 1042, 724, 918, 871, 1194,
    1296, 1294, 1301, 1300, 1301, 1294, 1194, 1228, 1281,
    764, 763, 1302, 1197, 1299, 1088, 1296, 1303, 1298,
    900, 1304, 1021, 763, 724, 1302, 1021, 1304, 1023,
    1091, 1257, 931, 1301, 1303, 1296, 1303, 774, 1298,
    727, 1302, 724, 1091, 1088, 1257, 1305, 1023, 1304,
    1302, 730, 706, 727, 730, 1302, 1257, 1088, 1299,
    1297, 744, 1306, 1298, 774, 770, 905, 1312, 1307,
    1264, 1272, 1308, 1284, 713, 1300, 1304, 900, 1307,
    1306, 1309, 1134, 1306, 1134, 1297, 1309, 1156, 1134,
    713, 1311, 1301, 1304, 1310, 1305, 1308, 1147, 1264,
    1301, 1300, 713, 1308, 734, 1147, 1311, 728, 1301,
    1307, 1310, 1304, 879, 876, 713, 1310, 771, 1305,
    1223, 753, 1219, 1311, 713, 876, 876, 875, 1311,
    1306, 753, 1223, 1311, 875, 728, 1223, 1309, 1306,
    1147, 734, 1151, 1301, 728, 1303, 1309, 796, 1156,
    1303, 781, 774, 1305, 771, 767, 1309, 1237, 796,
    728, 781, 1303, 879, 713, 1287, 1313, 1308, 1272,
    1272, 712, 1313, 1312, 1314, 1307, 1308, 1313, 738,
    711, 1313, 712, 1313, 744, 738, 711, 744, 1313,
    1308, 738, 734, 1182, 1185, 1336, 710, 712, 1283,
    710, 711, 712, 1314, 1310, 1307, 1336, 1185, 1290,
    1314, 780, 1310, 1185, 1188, 1290, 1188, 1291, 1290,
    1314, 786, 780, 1291, 1188, 1292, 1310, 780, 771,
    1292, 1214, 1293, 1213, 1214, 1292, 1277, 1315, 1312,
    1277, 1281, 1315, 1315, 1316, 1312, 1337, 1292, 1293,
    1317, 1337, 1293, 1312, 1316, 1314, 1316, 786, 1314,
    1228, 1315, 1281, 1315, 1233, 1316, 1228, 1233, 1315,
    1293, 1216, 1317, 1026, 1023, 1305, 1216, 1221, 1317,
    1026, 1305, 767, 735, 1256, 723, 1317, 1221, 1318,
    1221, 1225, 1318, 718, 723, 1256, 1319, 1318, 1225,
    723, 722, 735, 735, 722, 739, 1319, 1268, 1320,
    739, 700, 759, 1225, 1268, 1319, 700, 739, 722,
    1268, 1322, 1320, 1323, 975, 1324, 1328, 1324, 1325,
    964, 969, 1268, 969, 1322, 1268, 973, 1323, 1322,
    973, 1322, 969, 1323, 973, 975, 1324, 975, 1325,
    916, 919, 1325, 1322, 1321, 1320, 1323, 1321, 1322,
    1321, 1323, 1326, 1323, 1324, 1326, 1326, 1324, 1327,
    1327, 1324, 1328, 1328, 1330, 1329, 1328, 1325, 1330,
    1329, 1331, 827, 1330, 1331, 1329, 1331, 842, 827,
    1325, 919, 1330, 919, 923, 1330, 1330, 923, 1331,
    928, 842, 1331, 923, 928, 1331, 1337, 1335, 1336,
    1290, 1337, 1336, 1290, 1291, 1337, 765, 1332, 1341,
    765, 737, 1332, 1332, 737, 1333, 1333, 737, 742,
    1333, 742, 1334, 1334, 745, 1335, 1334, 742, 745,
    745, 1182, 1335, 1335, 1337, 1334, 1291, 1292, 1337,
    1317, 1318, 1337, 1318, 1319, 1337, 1319, 1320, 1337,
    1320, 1321, 1337, 1321, 1326, 1337, 1326, 1327, 1337,
    1327, 1328, 1337, 1328, 1329, 1337, 1329, 827, 1337,
    827, 829, 1337, 829, 714, 1337, 714, 715, 1337,
    715, 716, 1337, 716, 861, 1337, 861, 862, 1337,
    862, 864, 1337, 864, 866, 1337, 866, 1342, 1337,
    1342, 1343, 1337, 1343, 1344, 1337, 1344, 1345, 1337,
    1341, 1332, 1337, 1332, 1333, 1337, 1333, 1334, 1337,
    1340, 1337, 1339, 1340, 1341, 1337, 709, 1016, 1338,
    1338, 1016, 1020, 1338, 1020, 1339, 1340, 1339, 1080,
    1340, 762, 1341, 1340, 1080, 762, 1341, 762, 765,
    1345, 709, 1337, 709, 1338, 1337, 1338, 1339, 1337,
    998, 1343, 1342, 1343, 998, 1005, 1343, 1005, 1344,
    1344, 1009, 1345, 1344, 1005, 1009, 709, 1345, 1010,
    1009, 1010, 1345, 1016, 709, 1010, 1349, 1350, 1351,
    1349, 1351, 1352, 1347, 1361, 1363, 1347, 1363, 1348,
    1346, 1362, 1366, 1346, 1366, 1359, 1365, 1446, 1364,
    1367, 1412, 1348, 1364, 1446, 1360, 1367, 1348, 1363,
    1367, 1363, 1368, 1372, 1371, 1369, 1372, 1369, 1373,
    1374, 1364, 1360, 1374, 1360, 1370, 1359, 1366, 1375,
    1359, 1375, 1378, 1377, 1365, 1364, 1377, 1364, 1374,
    1415, 1416, 1346, 1381, 1367, 1368, 1381, 1368, 1382,
    1357, 1354, 1353, 1357, 1353, 1383, 1356, 1384, 1355,
    1370, 1360, 1349, 1370, 1349, 1352, 1385, 1378, 1375,
    1385, 1375, 1386, 1383, 1353, 1358, 1383, 1358, 1387,
    1388, 1389, 1381, 1388, 1381, 1382, 1382, 1368, 1403,
    1390, 1387, 1358, 1390, 1358, 1391, 1362, 1346, 1416,
    1395, 1397, 1391, 1396, 1385, 1386, 1396, 1386, 1399,
    1369, 1371, 1394, 1369, 1394, 1393, 1400, 1387, 1398,
    1357, 1383, 1392, 1376, 1379, 1377, 1377, 1379, 1380,
    1403, 1405, 1407, 1403, 1407, 1408, 1391, 1397, 1390,
    1377, 1374, 1376, 1414, 1393, 1394, 1360, 1446, 1349,
    1348, 1419, 1347, 1405, 1403, 1412, 1411, 1412, 1403,
    1409, 1410, 1406, 1409, 1406, 1404, 1395, 1427, 1397,
    1381, 1405, 1367, 1424, 1434, 1384, 1393, 1414, 1413,
    1355, 1397, 1427, 1416, 1415, 1410, 1416, 1410, 1409,
    1417, 1418, 1412, 1417, 1412, 1411, 1389, 1357, 1407,
    1389, 1407, 1381, 1414, 1394, 1443, 1413, 1414, 1420,
    1419, 1420, 1414, 1422, 1396, 1399, 1422, 1399, 1423,
    1358, 1434, 1391, 1424, 1384, 1421, 1356, 1421, 1384,
    1406, 1433, 1404, 1418, 1417, 1419, 1420, 1419, 1417,
    1425, 1426, 1372, 1425, 1372, 1373, 1407, 1392, 1439,
    1407, 1439, 1408, 1391, 1434, 1395, 1355, 1427, 1421,
    1355, 1421, 1356, 1428, 1429, 1426, 1428, 1426, 1425,
    1434, 1424, 1395, 1430, 1431, 1429, 1430, 1429, 1428,
    1432, 1433, 1431, 1432, 1431, 1430, 1398, 1384, 1434,
    1433, 1432, 1404, 1434, 1435, 1400, 1434, 1400, 1398,
    1421, 1427, 1424, 1436, 1401, 1400, 1436, 1400, 1435,
    1423, 1437, 1438, 1423, 1438, 1422, 1439, 1392, 1401,
    1439, 1401, 1436, 1419, 1348, 1418, 1418, 1348, 1412,
    1405, 1381, 1407, 1412, 1367, 1405, 1438, 1437, 1440,
    1438, 1440, 1441, 1435, 1358, 1436, 1434, 1358, 1435,
    1358, 1353, 1436, 1427, 1395, 1424, 1439, 1436, 1353,
    1353, 1354, 1439, 1388, 1408, 1354, 1441, 1440, 1442,
    1441, 1442, 1443, 1444, 1380, 1379, 1444, 1379, 1445,
    1350, 1443, 1442, 1350, 1442, 1351, 1383, 1387, 1401,
    1445, 1379, 1376, 1445, 1376, 1446, 1400, 1401, 1387,
    1401, 1392, 1383, 1357, 1389, 1354, 1388, 1354, 1389,
    1447, 1376, 1402, 1446, 1376, 1447, 1380, 1444, 1377,
    1365, 1377, 1444, 1390, 1398, 1387, 1447, 1402, 1361,
    1447, 1361, 1347, 1398, 1390, 1397, 1366, 1362, 1416,
    1355, 1384, 1397, 1416, 1404, 1366, 1404, 1432, 1366,
    1398, 1397, 1384, 1409, 1404, 1416, 1432, 1430, 1375,
    1375, 1366, 1432, 1370, 1352, 1376, 1374, 1370, 1376,
    1428, 1425, 1386, 1430, 1428, 1375, 1386, 1375, 1428,
    1425, 1373, 1399, 1399, 1386, 1425, 1437, 1423, 1373,
    1361, 1402, 1352, 1402, 1376, 1352, 1373, 1369, 1437,
    1440, 1437, 1369, 1433, 1346, 1359, 1378, 1433, 1359,
    1442, 1420, 1351, 1415, 1346, 1433, 1361, 1351, 1420,
    1351, 1361, 1352, 1385, 1429, 1378, 1423, 1399, 1373,
    1369, 1393, 1440, 1433, 1406, 1415, 1363, 1361, 1420,
    1406, 1410, 1415, 1396, 1426, 1385, 1411, 1403, 1368,
    1368, 1363, 1411, 1417, 1411, 1363, 1420, 1417, 1363,
    1422, 1372, 1396, 1433, 1378, 1431, 1429, 1431, 1378,
    1429, 1385, 1426, 1393, 1413, 1442, 1420, 1442, 1413,
    1440, 1393, 1442, 1350, 1347, 1419, 1349, 1347, 1350,
    1419, 1414, 1443, 1443, 1350, 1419, 1403, 1408, 1382,
    1388, 1382, 1408, 1439, 1354, 1408, 1426, 1396, 1372,
    1422, 1438, 1372, 1371, 1372, 1438, 1371, 1438, 1441,
    1441, 1443, 1394, 1371, 1441, 1394, 1446, 1365, 1445,
    1392, 1407, 1357, 1365, 1444, 1445, 1447, 1349, 1446,
    1347, 1349, 1447,];
  bilibili_color_type = [
    [0.16862745098039217, 0.1803921568627451, 0.19215686274509805], // 黑色
    [1, 1, 1],//白色
    [0.8784313725490196, 0.984313725490196, 1], //蓝色
    [0.8666666666666667, 0.8862745098039215, 0.8941176470588236], //灰色
  ]
  bilibili_colors = []
  //触手
  for (var i = 0; i <= 15; i++) {
    bilibili_colors.push(bilibili_color_type[0][0]);
    bilibili_colors.push(bilibili_color_type[0][1]);
    bilibili_colors.push(bilibili_color_type[0][2]);
  }
  //白色身体
  for (var i = 16; i <= 23; i++) {
    bilibili_colors.push(bilibili_color_type[1][0]);
    bilibili_colors.push(bilibili_color_type[1][1]);
    bilibili_colors.push(bilibili_color_type[1][2]);
  }
  //眼睛
  for (var i = 24; i <= 39; i++) {
    bilibili_colors.push(bilibili_color_type[0][0]);
    bilibili_colors.push(bilibili_color_type[0][1]);
    bilibili_colors.push(bilibili_color_type[0][2]);
  }
  //脸
  for (var i = 40; i <= 47; i++) {
    bilibili_colors.push(bilibili_color_type[2][0]);
    bilibili_colors.push(bilibili_color_type[2][1]);
    bilibili_colors.push(bilibili_color_type[2][2]);
  }
  //foot
  for (var i = 48; i <= 1346; i++) {
    bilibili_colors.push(bilibili_color_type[3][0]);
    bilibili_colors.push(bilibili_color_type[3][1]);
    bilibili_colors.push(bilibili_color_type[3][2]);
  }
  // mouth
  for (var i = 1346; i <= 1447; i++) {
    bilibili_colors.push(bilibili_color_type[0][0]);
    bilibili_colors.push(bilibili_color_type[0][1]);
    bilibili_colors.push(bilibili_color_type[0][2]);
  }
}
function drawbilibili2() {
  bilibili2_vertices =  [15.04,50.0,85.28999999999999,17.11,75.65,3.02,-64.28,0.0,76.6,
    0.0,50.0,86.6,-63.3,17.36,75.44,-76.6,0.0,64.28,
    50.0,86.6,0.0,16.32,75.65,5.9399999999999995,15.04,75.65,8.68,
    -75.44,17.36,63.3,26.200000000000003,-93.97,21.98,21.98,-93.97,26.200000000000003,
    29.62,50.0,-81.38,26.200000000000003,64.28,-71.98,5.9399999999999995,-93.97,-33.68,
    -32.14,76.6,-55.67,38.3,64.28,-66.34,0.0,34.2,93.97,
    16.32,34.2,92.53999999999999,49.24,86.6,-8.68,48.975,87.063,-0.377,
    5.9399999999999995,-93.97,33.68,49.008,87.063,0.0,48.296,87.063,-8.135,
    48.263,87.063,-8.508,48.263,87.063,-8.506,0.0,-93.97,-34.2,
    -64.28,76.6,0.0,-63.3,76.6,11.16,13.309999999999999,75.65,11.16,
    0.0,-93.97,34.2,32.14,34.2,88.3,11.7,-93.97,32.14,
    26.200000000000003,-93.97,-21.98,-13.3,64.28,-75.44,21.98,-93.97,-26.200000000000003,
    -11.16,76.6,-63.3,0.0,17.36,98.48,17.1,17.36,96.98,
    11.16,75.65,13.309999999999999,-60.4,76.6,21.98,17.1,-93.97,29.62,
    17.1,-93.97,-29.62,46.150000000000006,87.06,-16.403000000000002,48.166000000000004,87.063,-8.872,
    33.68,17.36,92.53999999999999,-55.67,76.6,32.14,0.0,64.28,-76.6,
    49.24,17.36,85.28999999999999,46.980000000000004,86.6,-17.1,8.68,75.65,15.04,
    -26.200000000000003,64.28,-71.98,17.36,0.0,98.48,-21.98,76.6,-60.4,
    5.9399999999999995,75.65,16.32,0.0,0.0,100.0,-38.3,64.28,-66.34,
    34.2,0.0,93.97,46.054,87.06,-16.762999999999998,50.0,0.0,86.6,
    81.38,34.2,-46.980000000000004,3.02,75.65,17.11,42.443,87.06200000000001,-24.505,
    42.601000000000006,87.06200000000001,-24.167,25.0,-86.6,-43.3,43.3,86.6,-25.0,
    -75.44,64.28,13.3,0.377,87.063,48.975,0.0,87.063,49.008,
    71.98,34.2,-60.4,29.62,-93.97,17.1,8.135,87.063,48.296,
    17.1,-86.6,-46.980000000000004,32.14,-93.97,11.7,0.0,86.6,50.0,
    8.68,86.6,49.24,0.0,75.65,17.37,45.891999999999996,87.06,-17.11,
    46.053,87.06,-16.765,8.68,-86.6,-49.24,-29.62,50.0,-81.38,
    60.4,34.2,-71.98,-76.6,64.28,0.0,33.68,-93.97,5.9399999999999995,
    46.980000000000004,34.2,-81.38,-71.98,64.28,26.200000000000003,8.508,87.063,48.263,
    8.506,87.063,48.263,0.0,-86.6,-50.0,34.21,80.16,0.0,
    34.2,-93.97,0.0,42.224000000000004,87.06200000000001,-24.817999999999998,42.441,87.06200000000001,-24.508000000000003,
    75.44,17.36,-63.3,16.403000000000002,87.06,46.150000000000006,8.872,87.063,48.166000000000004,
    32.15,80.16,11.7,-66.34,64.28,38.3,17.1,86.6,46.980000000000004,
    63.3,17.36,-75.44,76.6,0.0,-64.28,49.24,-17.36,-85.28999999999999,
    50.0,0.0,-86.6,16.762999999999998,87.06,46.054,-41.31999999999999,76.6,-49.24,
    64.28,0.0,-76.6,33.68,-17.36,-92.53999999999999,24.505,87.06200000000001,42.443,
    24.167,87.06200000000001,42.601000000000006,-81.38,50.0,29.62,25.0,86.6,43.3,
    -49.24,76.6,-41.31999999999999,15.04,50.0,-85.28999999999999,17.11,87.06,45.891999999999996,
    16.765,87.06,46.053,34.2,0.0,-93.97,17.1,-17.36,-96.98,
    -49.24,64.28,-58.68000000000001,33.690000000000005,80.16,5.9399999999999995,0.0,50.0,-86.6,
    -58.68000000000001,64.28,-49.24,3.02,-98.48,17.1,17.36,0.0,-98.48,
    0.0,-17.36,-98.48,0.0,-98.48,17.36,0.0,0.0,-100.0,
    5.9399999999999995,-98.48,16.32,24.817999999999998,87.06200000000001,42.224000000000004,24.508000000000003,87.06200000000001,42.441,
    32.14,34.2,-88.3,32.14,-34.2,-88.3,16.32,-34.2,-92.53999999999999,
    -43.3,50.0,-75.0,16.32,34.2,-92.53999999999999,8.68,-98.48,15.04,
    0.0,-34.2,-93.97,-55.67,50.0,-66.34,0.0,34.2,-93.97,
    11.16,-98.48,13.3,-66.34,50.0,-55.67,29.630000000000003,80.16,17.11,
    -29.630000000000003,80.16,17.11,49.24,17.36,-85.28999999999999,-75.0,50.0,-43.3,
    15.04,-50.0,-85.28999999999999,13.3,-98.48,11.16,15.04,-98.48,8.68,
    -32.15,80.16,11.7,33.68,17.36,-92.53999999999999,16.32,-98.48,5.9399999999999995,
    0.0,-50.0,-86.6,17.1,17.36,-96.98,17.1,-98.48,3.02,
    26.21,80.16,21.99,-34.21,80.16,0.0,0.0,17.36,-98.48,
    21.99,80.16,26.21,-81.38,-50.0,-29.62,17.36,-98.48,0.0,
    -46.980000000000004,34.2,-81.38,-66.34,-64.28,-38.3,0.0,-100.0,0.0,
    11.7,80.16,32.15,-60.4,34.2,-71.98,-71.98,-64.28,-26.200000000000003,
    -33.690000000000005,80.16,5.9399999999999995,-71.98,34.2,-60.4,-75.44,-64.28,-13.3,
    0.0,80.16,34.21,-81.38,34.2,-46.980000000000004,-76.6,-64.28,0.0,
    -49.24,-17.36,85.28999999999999,-50.0,0.0,86.6,-55.67,-76.6,-32.14,
    -33.68,-17.36,92.53999999999999,-63.3,17.36,-75.44,0.0,74.13,0.0,
    -60.4,-76.6,-21.98,-75.44,17.36,-63.3,-34.2,0.0,93.97,
    -17.1,-17.36,96.98,-5.9399999999999995,75.65,16.32,17.11,80.16,29.630000000000003,
    -8.68,75.65,15.04,-17.36,0.0,98.48,-63.3,-76.6,-11.16,
    -31.503,87.06200000000001,-37.542,-31.198,87.06200000000001,-37.756,0.0,-17.36,98.48,
    -64.28,0.0,-76.6,-32.14,86.6,-38.3,-13.309999999999999,75.65,11.16,
    -32.14,-34.2,88.3,-76.6,0.0,-64.28,-15.04,75.65,8.68,
    -64.28,-76.6,0.0,-16.32,-34.2,92.53999999999999,42.229,87.06200000000001,24.811,
    0.0,-34.2,93.97,43.3,86.6,25.0,-37.542,87.06200000000001,-31.503,
    -37.541000000000004,87.06200000000001,-31.503999999999998,-17.37,75.65,0.0,42.443,87.06200000000001,24.505,
    42.441,87.06200000000001,24.508000000000003,-38.3,86.6,-32.14,-3.02,75.65,17.11,
    5.9399999999999995,80.16,33.690000000000005,37.542,87.06200000000001,-31.503,-15.04,-50.0,85.28999999999999,
    37.756,87.06200000000001,-31.198,-31.503999999999998,87.06200000000001,-37.541000000000004,38.3,86.6,-32.14,
    0.0,-50.0,86.6,45.896,87.06,17.1,31.503,87.06200000000001,-37.542,
    31.503999999999998,87.06200000000001,-37.541000000000004,46.980000000000004,86.6,17.1,-37.757999999999996,87.06200000000001,-31.194000000000003,
    42.601000000000006,87.06200000000001,24.165,-63.3,-17.36,-75.44,32.14,86.6,-38.3,
    -75.44,-17.36,63.3,37.541000000000004,87.06200000000001,-31.503999999999998,-75.44,-17.36,-63.3,
    -15.04,50.0,85.28999999999999,-11.16,75.65,13.309999999999999,-63.3,-17.36,75.44,
    -46.980000000000004,-34.2,-81.38,31.194000000000003,87.06200000000001,-37.757999999999996,-81.38,-34.2,46.980000000000004,
    -60.4,-34.2,-71.98,-32.14,34.2,88.3,46.054,87.06,16.762999999999998,
    46.053,87.06,16.765,-71.98,-34.2,60.4,-71.98,-34.2,-60.4,
    -81.38,-34.2,-46.980000000000004,-60.4,-34.2,71.98,-16.32,34.2,92.53999999999999,
    -46.980000000000004,-34.2,81.38,-16.32,75.65,5.9399999999999995,48.263,87.063,8.508,
    48.166000000000004,87.063,8.870000000000001,49.24,86.6,8.68,46.150999999999996,87.06,16.398,
    -49.24,17.36,85.28999999999999,-17.11,75.65,3.02,-33.68,17.36,92.53999999999999,
    48.975,87.063,0.373,48.296,87.063,8.129999999999999,48.263,87.063,8.506,
    -17.1,17.36,96.98,-29.62,-50.0,-81.38,-29.62,-50.0,81.38,
    -85.28999999999999,50.0,-15.04,-38.3,-64.28,66.34,-86.6,50.0,0.0,
    -11.7,80.16,32.15,-26.200000000000003,-64.28,71.98,-88.3,34.2,-32.14,
    0.0,-64.28,-76.6,-13.3,-64.28,-75.44,-92.53999999999999,34.2,-16.32,
    -26.200000000000003,-64.28,-71.98,-13.3,-64.28,75.44,0.0,-64.28,76.6,
    -21.99,80.16,26.21,-93.97,34.2,0.0,-32.14,-76.6,55.67,
    -85.28999999999999,17.36,-49.24,-38.3,-64.28,-66.34,-26.21,80.16,21.99,
    0.0,-76.6,-64.28,-11.16,-76.6,-63.3,-92.53999999999999,17.36,-33.68,
    -21.98,-76.6,60.4,-5.9399999999999995,80.16,33.690000000000005,-42.229,87.06200000000001,-24.811,
    -21.98,-76.6,-60.4,-43.3,86.6,-25.0,-32.14,-76.6,-55.67,
    -96.98,17.36,-17.1,-11.16,-76.6,63.3,-42.443,87.06200000000001,-24.505,
    -42.441,87.06200000000001,-24.508000000000003,-98.48,17.36,0.0,0.0,-76.6,64.28,
    -86.6,0.0,-50.0,24.811,87.06200000000001,-42.229,-93.97,0.0,-34.2,
    25.0,86.6,-43.3,-42.601000000000006,87.06200000000001,-24.165,-98.48,0.0,-17.36,
    -17.11,80.16,29.630000000000003,-45.896,87.06,-17.1,24.505,87.06200000000001,-42.443,
    24.508000000000003,87.06200000000001,-42.441,-100.0,0.0,0.0,-46.980000000000004,86.6,-17.1,
    -15.04,50.0,-85.28999999999999,17.1,87.06,-45.896,24.165,87.06200000000001,-42.601000000000006,
    -16.32,34.2,-92.53999999999999,17.1,86.6,-46.980000000000004,-43.3,-50.0,-75.0,
    -75.0,-50.0,43.3,-32.14,34.2,-88.3,-46.054,87.06,-16.762999999999998,
    -46.053,87.06,-16.765,-55.67,-50.0,-66.34,-17.1,17.36,-96.98,
    -66.34,-50.0,55.67,-66.34,-50.0,-55.67,31.503,87.06200000000001,37.542,
    -85.28999999999999,50.0,15.04,31.198,87.06200000000001,37.756,-33.68,17.36,-92.53999999999999,
    -55.67,-50.0,66.34,-75.0,-50.0,-43.3,16.762999999999998,87.06,-46.054,
    16.765,87.06,-46.053,32.14,86.6,38.3,-49.24,17.36,-85.28999999999999,
    -48.263,87.063,-8.508,-92.53999999999999,34.2,16.32,-48.166000000000004,87.063,-8.870000000000001,
    -43.3,-50.0,75.0,-49.24,86.6,-8.68,-17.36,0.0,-98.48,
    -88.3,34.2,32.14,37.542,87.06200000000001,31.503,37.541000000000004,87.06200000000001,31.503999999999998,
    -96.98,17.36,17.1,-34.2,0.0,-93.97,-49.24,-64.28,-58.68000000000001,
    8.508,87.063,-48.263,8.870000000000001,87.063,-48.166000000000004,8.68,86.6,-49.24,
    -50.0,0.0,-86.6,-58.68000000000001,-64.28,49.24,16.398,87.06,-46.150999999999996,
    -92.53999999999999,17.36,33.68,-58.68000000000001,-64.28,-49.24,38.3,86.6,32.14,
    -85.28999999999999,17.36,49.24,-49.24,-64.28,58.68000000000001,31.503999999999998,87.06200000000001,37.541000000000004,
    100.0,0.0,0.0,98.48,-17.36,0.0,-98.48,0.0,17.36,
    96.98,-17.36,-17.1,-46.150999999999996,87.06,-16.398,98.48,0.0,-17.36,
    0.0,87.063,-49.008,0.373,87.063,-48.975,-41.31999999999999,-76.6,-49.24,
    92.53999999999999,-17.36,-33.68,93.97,0.0,-34.2,-93.97,0.0,34.2,
    37.757999999999996,87.06200000000001,31.194000000000003,85.28999999999999,-17.36,-49.24,86.6,0.0,-50.0,
    -49.24,-76.6,41.31999999999999,0.0,86.6,-50.0,-49.24,-76.6,-41.31999999999999,
    -86.6,0.0,50.0,8.129999999999999,87.063,-48.296,8.506,87.063,-48.263,
    -41.31999999999999,-76.6,49.24,-49.008,87.063,0.0,17.1,-17.36,96.98,
    -48.975,87.063,-0.373,33.68,-17.36,92.53999999999999,49.24,-17.36,85.28999999999999,
    -50.0,86.6,0.0,92.53999999999999,-34.2,-16.32,-48.296,87.063,-8.129999999999999,
    -48.263,87.063,-8.506,-85.28999999999999,-17.36,-49.24,16.32,-34.2,92.53999999999999,
    93.97,-34.2,0.0,88.3,-34.2,-32.14,32.14,-34.2,88.3,
    -81.38,-50.0,29.62,-92.53999999999999,-17.36,-33.68,-96.98,-17.36,-17.1,
    15.04,-50.0,85.28999999999999,-98.48,-17.36,0.0,-75.44,-64.28,13.3,
    85.28999999999999,-50.0,-15.04,-88.3,-34.2,-32.14,-92.53999999999999,-34.2,-16.32,
    86.6,-50.0,0.0,-71.98,-64.28,26.200000000000003,85.28999999999999,-17.36,49.24,
    86.6,0.0,50.0,-93.97,-34.2,0.0,-66.34,-64.28,38.3,
    92.53999999999999,-17.36,33.68,93.97,0.0,34.2,-24.811,87.06200000000001,42.229,
    96.98,-17.36,17.1,-63.3,-76.6,11.16,-25.0,86.6,43.3,
    98.48,0.0,17.36,-85.28999999999999,-50.0,-15.04,-60.4,-76.6,21.98,
    88.3,-34.2,32.14,-24.505,87.06200000000001,42.443,-24.508000000000003,87.06200000000001,42.441,
    92.53999999999999,-34.2,16.32,-55.67,-76.6,32.14,-86.6,-50.0,0.0,
    81.38,-50.0,-29.62,85.28999999999999,-50.0,15.04,-3.02,-98.48,-17.1,
    0.0,-98.48,-17.36,76.6,-64.28,0.0,63.3,-17.36,75.44,
    75.44,-64.28,-13.3,64.28,0.0,76.6,-5.9399999999999995,-98.48,-16.32,
    75.44,-17.36,63.3,76.6,0.0,64.28,46.980000000000004,-34.2,81.38,
    60.4,-34.2,71.98,71.98,-64.28,-26.200000000000003,-8.68,-98.48,-15.04,
    71.98,-34.2,60.4,81.38,-34.2,46.980000000000004,66.34,-64.28,-38.3,
    -11.16,-98.48,-13.3,-96.98,-17.36,17.1,64.28,-76.6,0.0,
    63.3,-76.6,-11.16,-13.3,-98.48,-11.16,-92.53999999999999,-17.36,33.68,
    43.3,-50.0,75.0,-17.1,87.06,45.896,-24.165,87.06200000000001,42.601000000000006,
    -15.04,-98.48,-8.68,-85.28999999999999,-17.36,49.24,55.67,-50.0,66.34,
    60.4,-76.6,-21.98,66.34,-50.0,55.67,-17.1,86.6,46.980000000000004,
    -16.32,-98.48,-5.9399999999999995,55.67,-76.6,-32.14,75.0,-50.0,43.3,
    85.28999999999999,50.0,-15.04,86.6,50.0,0.0,93.97,34.2,0.0,
    92.53999999999999,34.2,-16.32,49.24,-64.28,58.68000000000001,-17.1,-98.48,-3.02,
    58.68000000000001,-64.28,49.24,-92.53999999999999,-34.2,16.32,88.3,34.2,-32.14,
    -16.762999999999998,87.06,46.054,-16.765,87.06,46.053,41.31999999999999,-76.6,49.24,
    -88.3,-34.2,32.14,-17.36,-98.48,0.0,98.48,17.36,0.0,
    96.98,17.36,-17.1,49.24,-76.6,41.31999999999999,92.53999999999999,17.36,-33.68,
    29.62,-50.0,81.38,85.28999999999999,17.36,-49.24,-8.508,87.063,48.263,
    -8.870000000000001,87.063,48.166000000000004,-8.68,86.6,49.24,-16.398,87.06,46.150999999999996,
    13.3,-64.28,75.44,75.44,-17.36,-63.3,-85.28999999999999,-50.0,15.04,
    26.200000000000003,-64.28,71.98,-29.62,-93.97,-17.1,85.28999999999999,50.0,15.04,
    38.3,-64.28,66.34,-0.373,87.063,48.975,63.3,-17.36,-75.44,
    -32.14,-93.97,-11.7,11.16,-76.6,63.3,21.98,-76.6,60.4,
    -8.129999999999999,87.063,48.296,81.38,-34.2,-46.980000000000004,-8.506,87.063,48.263,
    64.28,76.6,0.0,32.14,-76.6,55.67,63.3,76.6,-11.16,
    -33.68,-93.97,-5.9399999999999995,71.98,-34.2,-60.4,88.3,34.2,32.14,
    60.4,-34.2,-71.98,60.4,76.6,-21.98,46.980000000000004,-34.2,-81.38,
    -34.2,-93.97,0.0,55.67,76.6,-32.14,92.53999999999999,34.2,16.32,
    81.38,-50.0,29.62,66.34,-64.28,38.3,85.28999999999999,17.36,49.24,
    -25.0,-86.6,43.3,71.98,-64.28,26.200000000000003,-0.377,87.063,-48.975,
    -8.135,87.063,-48.296,-17.1,-86.6,46.980000000000004,92.53999999999999,17.36,33.68,
    75.44,-64.28,13.3,-8.68,86.6,-49.24,75.44,64.28,-13.3,
    -8.68,-86.6,49.24,55.67,-76.6,32.14,75.0,-50.0,-43.3,
    60.4,-76.6,21.98,0.0,-86.6,50.0,96.98,17.36,17.1,
    -5.9399999999999995,-93.97,-33.68,76.6,64.28,0.0,66.34,-50.0,-55.67,
    71.98,64.28,-26.200000000000003,63.3,-76.6,11.16,-11.7,-93.97,-32.14,
    55.67,-50.0,-66.34,43.3,-50.0,-75.0,-17.1,-93.97,-29.62,
    -8.508,87.063,-48.263,-8.506,87.063,-48.263,66.34,64.28,-38.3,
    8.68,-86.6,49.24,-38.3,-86.6,32.14,-16.403000000000002,87.06,-46.150000000000006,
    -8.872,87.063,-48.166000000000004,58.68000000000001,-64.28,-49.24,17.1,-86.6,46.980000000000004,
    -32.14,-86.6,38.3,-17.1,86.6,-46.980000000000004,49.24,-64.28,-58.68000000000001,
    41.31999999999999,76.6,49.24,25.0,-86.6,43.3,49.24,76.6,41.31999999999999,
    -26.200000000000003,-93.97,21.98,49.24,64.28,58.68000000000001,81.38,50.0,-29.62,
    49.24,-76.6,-41.31999999999999,-21.98,-93.97,26.200000000000003,-16.762999999999998,87.06,-46.054,
    58.68000000000001,64.28,49.24,-17.1,-93.97,29.62,-32.14,-86.6,-38.3,
    41.31999999999999,-76.6,-49.24,-11.7,-93.97,32.14,-38.3,-86.6,-32.14,
    -24.505,87.06200000000001,-42.443,-24.167,87.06200000000001,-42.601000000000006,-25.0,86.6,-43.3,
    -17.11,87.06,-45.891999999999996,-5.9399999999999995,-93.97,33.68,-16.765,87.06,-46.053,
    -21.98,-93.97,-26.200000000000003,43.3,50.0,75.0,29.62,-50.0,-81.38,
    -26.200000000000003,-93.97,-21.98,55.67,50.0,66.34,43.3,-86.6,25.0,
    66.34,50.0,55.67,-24.817999999999998,87.06200000000001,-42.224000000000004,-24.508000000000003,87.06200000000001,-42.441,
    46.980000000000004,-86.6,17.1,38.3,-64.28,-66.34,75.0,50.0,43.3,
    49.24,-86.6,8.68,0.0,80.16,-34.21,26.200000000000003,-64.28,-71.98,
    50.0,-86.6,0.0,11.7,80.16,-32.15,-43.3,-86.6,-25.0,
    13.3,-64.28,-75.44,-46.980000000000004,-86.6,-17.1,-49.24,-86.6,-8.68,
    32.14,-76.6,-55.67,21.99,80.16,-26.21,-50.0,-86.6,0.0,
    21.98,-76.6,-60.4,0.0,76.6,64.28,11.16,76.6,63.3,
    26.21,80.16,-21.99,32.14,-86.6,38.3,-17.1,-98.48,3.02,
    21.98,76.6,60.4,38.3,-86.6,32.14,-16.32,-98.48,5.9399999999999995,
    11.16,-76.6,-63.3,32.14,76.6,55.67,5.9399999999999995,80.16,-33.690000000000005,
    -15.04,-98.48,8.68,-8.68,-86.6,-49.24,-17.1,-86.6,-46.980000000000004,
    -13.3,-98.48,11.16,13.3,64.28,75.44,-11.16,-98.48,13.3,
    -8.68,-98.48,15.04,-25.0,-86.6,-43.3,0.0,64.28,76.6,
    17.11,80.16,-29.630000000000003,26.200000000000003,64.28,71.98,-5.9399999999999995,-98.48,16.32,
    38.3,64.28,66.34,-3.02,-98.48,17.1,49.24,-86.6,-8.68,
    -55.67,76.6,-32.14,46.980000000000004,-86.6,-17.1,-60.4,76.6,-21.98,
    -63.3,76.6,-11.16,43.3,-86.6,-25.0,-37.542,87.06200000000001,31.503,
    -37.756,87.06200000000001,31.198,29.62,50.0,81.38,-17.1,-17.36,-96.98,
    -66.34,64.28,-38.3,-38.3,86.6,32.14,0.0,75.65,-17.37,
    -33.68,-17.36,-92.53999999999999,-71.98,64.28,-26.200000000000003,5.9399999999999995,75.65,-16.32,
    -49.24,-17.36,-85.28999999999999,-75.44,64.28,-13.3,-31.503,87.06200000000001,37.542,
    -31.503999999999998,87.06200000000001,37.541000000000004,8.68,75.65,-15.04,-33.68,-93.97,5.9399999999999995,
    13.309999999999999,75.65,-11.16,-32.14,86.6,38.3,-37.541000000000004,87.06200000000001,31.503999999999998,
    -81.38,50.0,-29.62,-32.14,-93.97,11.7,-16.32,-34.2,-92.53999999999999,
    15.04,75.65,-8.68,-32.14,-34.2,-88.3,33.68,-93.97,-5.9399999999999995,
    46.980000000000004,34.2,81.38,-29.62,-93.97,17.1,17.37,75.65,0.0,
    -31.194000000000003,87.06200000000001,37.757999999999996,32.14,-93.97,-11.7,3.02,75.65,-17.11,
    60.4,34.2,71.98,29.62,-93.97,-17.1,-26.21,80.16,-21.99,
    -21.99,80.16,-26.21,71.98,34.2,60.4,81.38,34.2,46.980000000000004,
    -11.7,80.16,-32.15,-15.04,-50.0,-85.28999999999999,63.3,17.36,75.44,
    -49.24,-86.6,8.68,75.44,17.36,63.3,11.16,75.65,-13.309999999999999,
    -17.11,80.16,-29.630000000000003,-46.980000000000004,-86.6,17.1,17.1,-98.48,-3.02,
    16.32,-98.48,-5.9399999999999995,-43.3,-86.6,25.0,-5.9399999999999995,80.16,-33.690000000000005,
    15.04,-98.48,-8.68,16.32,75.65,-5.9399999999999995,13.3,-98.48,-11.16,
    55.67,76.6,32.14,-32.15,80.16,-11.7,11.16,-98.48,-13.3,
    60.4,76.6,21.98,8.68,-98.48,-15.04,17.11,75.65,-3.02,
    5.9399999999999995,-98.48,-16.32,-33.690000000000005,80.16,-5.9399999999999995,63.3,76.6,11.16,
    3.02,-98.48,-17.1,66.34,64.28,38.3,-29.630000000000003,80.16,-17.11,
    29.630000000000003,80.16,-17.11,71.98,64.28,26.200000000000003,32.15,80.16,-11.7,
    -16.32,75.65,-5.9399999999999995,-48.975,87.063,0.377,-15.04,75.65,-8.68,
    -48.296,87.063,8.135,75.44,64.28,13.3,-11.16,75.65,-13.309999999999999,
    -49.24,86.6,8.68,-8.68,75.65,-15.04,-48.263,87.063,8.508,
    -48.263,87.063,8.506,38.3,-86.6,-32.14,-17.11,75.65,-3.02,
    32.14,-86.6,-38.3,-46.150000000000006,87.06,16.403000000000002,-48.166000000000004,87.063,8.872,
    81.38,50.0,29.62,-13.309999999999999,75.65,-11.16,-46.980000000000004,86.6,17.1,
    33.690000000000005,80.16,-5.9399999999999995,11.7,-93.97,-32.14,-5.9399999999999995,75.65,-16.32,
    -46.054,87.06,16.762999999999998,-3.02,75.65,-17.11,-42.443,87.06200000000001,24.505,
    -42.601000000000006,87.06200000000001,24.167,-43.3,86.6,25.0,-45.891999999999996,87.06,17.11,
    -46.053,87.06,16.765,0.0,76.6,-64.28,49.24,76.6,-41.31999999999999,
    41.31999999999999,76.6,-49.24,-42.224000000000004,87.06200000000001,24.817999999999998,-42.441,87.06200000000001,24.508000000000003,
    58.68000000000001,64.28,-49.24,49.24,64.28,-58.68000000000001,75.0,50.0,-43.3,
    66.34,50.0,-55.67,55.67,50.0,-66.34,43.3,50.0,-75.0,
    32.14,76.6,-55.67,21.98,76.6,-60.4,-32.14,76.6,55.67,
    11.16,76.6,-63.3,-21.98,76.6,60.4,-11.16,76.6,63.3,
    13.3,64.28,-75.44,-38.3,64.28,66.34,-26.200000000000003,64.28,71.98,
    -13.3,64.28,75.44,-29.62,50.0,81.38,-49.24,76.6,41.31999999999999,
    -41.31999999999999,76.6,49.24,-58.68000000000001,64.28,49.24,-49.24,64.28,58.68000000000001,
    -75.0,50.0,43.3,-66.34,50.0,55.67,-55.67,50.0,66.34,
    -43.3,50.0,75.0,-81.38,34.2,46.980000000000004,-71.98,34.2,60.4,
    -60.4,34.2,71.98,-46.980000000000004,34.2,81.38,1.23,102.62,5.81,
    5.48,101.32,0.0,-1.7999999999999998,110.35,3.14,-20.419999999999998,108.71000000000001,7.59,
    5.3500000000000005,101.09,1.3,-18.85,111.44,8.209999999999999,-22.25,118.53,-4.44,
    -29.8,114.13,1.3,-1.49,110.89,0.0,-2.88,95.51,-2.41,
    -3.12,95.09,0.0,-8.120000000000001,114.72,3.4000000000000004,-7.78,115.31,0.0,
    2.25,104.39,4.44,-5.590000000000001,103.78,8.209999999999999,-2.2,96.69,-4.44,
    -24.47,114.68,-6.29,2.9299999999999997,105.57000000000001,2.41,-10.52,110.55,-8.209999999999999,
    5.1,97.60999999999999,0.0,2.21,95.64999999999999,1.3,-26.520000000000003,119.78999999999999,0.0,
    -26.65,119.57000000000001,-1.3,-29.540000000000003,117.60999999999999,0.0,-27.02,118.93,-2.41,
    -27.57,117.97,-3.14,-13.919999999999998,104.66,8.209999999999999,3.17,105.98,0.0,
    -13.919999999999998,104.66,-8.209999999999999,4.43,99.5,3.14,-28.22,116.85000000000001,-3.4000000000000004,
    -28.88,115.72,-3.14,-12.219999999999999,107.60999999999999,8.89,-29.43,114.76,-2.41,
    -29.8,114.13,-1.3,2.9299999999999997,105.57000000000001,-2.41,-29.93,113.9,0.0,
    0.03,100.54,-6.29,-10.52,110.55,8.209999999999999,-9.389999999999999,97.21000000000001,3.14,
    -9.7,96.67,0.0,2.25,104.39,-4.44,-8.120000000000001,114.72,-3.4000000000000004,
    5.3500000000000005,101.09,-1.3,-9.08,113.05,-6.29,4.98,100.45,-2.41,
    -29.43,114.76,2.41,-1.7999999999999998,110.35,-3.14,-28.88,115.72,3.14,
    1.23,102.62,-5.81,-2.6900000000000004,108.81,-5.81,-28.22,116.85000000000001,3.4000000000000004,
    -4.0200000000000005,106.5,-7.59,-16.67,99.91,0.0,-27.57,117.97,3.14,
    -16.33,100.5,3.4000000000000004,-5.590000000000001,103.78,-8.209999999999999,-14.74,118.55000000000001,0.0,
    -15.06,118.01,-3.14,-27.02,118.93,2.41,-15.36,102.17,6.29,
    -26.65,119.57000000000001,1.3,-15.95,116.46000000000001,-5.81,-15.36,102.17,-6.29,
    -17.28,114.16,-7.59,-25.67,112.6,-5.81,-27.37,109.65,2.41,
    -16.33,100.5,-3.4000000000000004,-26.69,110.83,-4.44,-27.61,109.24,0.0,
    -26.69,110.83,4.44,-8.5,98.75,5.81,-27.37,109.65,-2.41,
    -7.17,101.06,7.59,-25.67,112.6,5.81,0.03,100.54,6.29,
    -2.88,95.51,2.41,-22.959999999999997,104.32000000000001,0.0,-22.639999999999997,104.86000000000001,3.14,
    2.08,95.42,0.0,4.43,99.5,-3.14,-21.75,106.41,5.81,
    -2.2,96.69,4.44,2.58,96.28999999999999,2.41,3.7800000000000002,98.37,-3.4000000000000004,
    -21.75,106.41,-5.81,-18.85,111.44,-8.209999999999999,3.13,97.24000000000001,3.14,
    3.13,97.24000000000001,-3.14,-20.419999999999998,108.71000000000001,-7.59,-22.639999999999997,104.86000000000001,-3.14,
    2.58,96.28999999999999,-2.41,3.7800000000000002,98.37,3.4000000000000004,-17.28,114.16,7.59,
    2.21,95.64999999999999,-1.3,-12.219999999999999,107.60999999999999,-8.89,-15.95,116.46000000000001,5.81,
    -15.06,118.01,3.14,4.98,100.45,2.41,-21.33,120.12,0.0,
    -21.57,119.71000000000001,-2.41,-9.08,113.05,6.29,-23.27,116.76,-5.81,
    -1.18,98.45,5.81,-24.47,114.68,6.29,-23.27,116.76,5.81,
    -22.25,118.53,4.44,-4.0200000000000005,106.5,7.59,-7.17,101.06,-7.59,
    -21.57,119.71000000000001,2.41,-8.5,98.75,-5.81,-2.6900000000000004,108.81,5.81,
    -9.389999999999999,97.21000000000001,-3.14,-1.18,98.45,-5.81,0.0,133.48000000000002,3.4000000000000004,
    1.3,133.48000000000002,3.14,0.0,135.0,0.0,3.14,133.48000000000002,-1.3,
    2.41,133.48000000000002,-2.41,2.41,133.48000000000002,2.41,-6.29,115.0,6.29,
    3.14,133.48000000000002,1.3,-3.4000000000000004,115.0,8.209999999999999,1.3,133.48000000000002,-3.14,
    5.81,122.65,5.81,3.4000000000000004,133.48000000000002,0.0,0.0,133.48000000000002,-3.4000000000000004,
    2.41,129.14,5.81,5.81,129.14,-2.41,3.14,122.65,7.59,
    -7.59,107.35,3.14,7.59,122.65,3.14,0.0,107.35,-8.209999999999999,
    -5.81,107.35,5.81,0.0,95.0,0.0,0.0,115.0,8.89,
    -3.14,96.52,1.3,6.29,129.14,0.0,0.0,122.65,8.209999999999999,
    -1.3,96.52,3.14,-3.14,107.35,7.59,0.0,129.14,6.29,
    4.44,129.14,-4.44,0.0,96.52,3.4000000000000004,-8.209999999999999,115.0,3.4000000000000004,
    4.44,129.14,4.44,2.41,129.14,-5.81,5.81,129.14,2.41,
    -5.81,122.65,-5.81,-7.59,122.65,-3.14,6.29,100.86,0.0,
    5.81,100.86,-2.41,0.0,107.35,8.209999999999999,-8.209999999999999,122.65,0.0,
    8.209999999999999,122.65,0.0,4.44,100.86,-4.44,-8.209999999999999,107.35,0.0,
    2.41,100.86,-5.81,-5.81,107.35,-5.81,3.4000000000000004,115.0,8.209999999999999,
    0.0,129.14,-6.29,0.0,100.86,-6.29,7.59,122.65,-3.14,
    3.4000000000000004,96.52,0.0,3.14,96.52,-1.3,6.29,115.0,6.29,
    5.81,122.65,-5.81,2.41,96.52,-2.41,0.0,100.86,6.29,
    2.41,100.86,5.81,8.209999999999999,115.0,3.4000000000000004,4.44,100.86,4.44,
    3.14,122.65,-7.59,0.0,115.0,-8.89,-3.4000000000000004,115.0,-8.209999999999999,
    0.0,122.65,-8.209999999999999,5.81,100.86,2.41,1.3,96.52,-3.14,
    8.89,115.0,0.0,-3.4000000000000004,133.48000000000002,0.0,-3.14,133.48000000000002,1.3,
    -2.41,133.48000000000002,2.41,-1.3,133.48000000000002,3.14,-1.3,133.48000000000002,-3.14,
    -3.14,122.65,-7.59,-2.41,133.48000000000002,-2.41,-6.29,115.0,-6.29,
    -5.81,129.14,2.41,-3.14,133.48000000000002,-1.3,8.209999999999999,115.0,-3.4000000000000004,
    -2.41,129.14,-5.81,-6.29,129.14,0.0,1.3,96.52,3.14,
    -4.44,129.14,4.44,-8.209999999999999,115.0,-3.4000000000000004,0.0,96.52,-3.4000000000000004,
    6.29,115.0,-6.29,-2.41,129.14,5.81,7.59,107.35,-3.14,
    -8.89,115.0,0.0,3.4000000000000004,115.0,-8.209999999999999,-2.41,100.86,-5.81,
    8.209999999999999,107.35,0.0,-7.59,122.65,3.14,5.81,107.35,-5.81,
    -5.81,122.65,5.81,-4.44,100.86,-4.44,3.14,107.35,-7.59,
    -5.81,100.86,-2.41,-3.14,122.65,7.59,-6.29,100.86,0.0,
    3.14,107.35,7.59,-1.3,96.52,-3.14,-2.41,96.52,-2.41,
    5.81,107.35,5.81,-3.14,96.52,-1.3,7.59,107.35,3.14,
    2.41,96.52,2.41,-3.4000000000000004,96.52,0.0,-3.14,107.35,-7.59,
    3.14,96.52,1.3,-4.44,129.14,-4.44,-7.59,107.35,-3.14,
    -5.81,129.14,-2.41,-5.81,100.86,2.41,-4.44,100.86,4.44,
    -2.41,100.86,5.81,-2.41,96.52,2.41,31.21,117.60999999999999,0.0,
    29.04,109.65,2.41,29.28,109.24,0.0,10.75,113.05,6.29,
    23.91,118.53,-4.44,12.190000000000001,110.55,8.209999999999999,12.190000000000001,110.55,-8.209999999999999,
    31.09,114.76,2.41,-0.5800000000000001,104.39,-4.44,20.52,111.44,8.209999999999999,
    10.16,98.75,5.81,4.54,95.51,2.41,31.46,114.13,1.3,
    31.589999999999996,113.9,0.0,3.8600000000000003,96.69,4.44,23.23,119.71000000000001,-2.41,
    4.779999999999999,95.09,0.0,22.09,108.71000000000001,7.59,22.99,120.12,0.0,
    9.44,115.31,0.0,9.78,114.72,3.4000000000000004,23.42,106.41,5.81,
    28.36,110.83,4.44,-1.5,105.98,0.0,29.04,109.65,-2.41,
    3.15,110.89,0.0,-3.81,101.32,0.0,-3.6799999999999997,101.09,1.3,
    28.189999999999998,119.78999999999999,0.0,28.32,119.57000000000001,1.3,3.4699999999999998,110.35,3.14,
    28.69,118.93,2.41,24.310000000000002,104.86000000000001,3.14,28.36,110.83,-4.44,
    4.36,108.81,5.81,29.24,117.97,3.14,-3.3200000000000003,100.45,2.41,
    29.89,116.85000000000001,3.4000000000000004,17.03,102.17,6.29,5.6899999999999995,106.5,7.59,
    30.54,115.72,3.14,27.34,112.6,-5.81,-2.7600000000000002,99.5,3.14,
    24.62,104.32000000000001,0.0,18.0,100.5,3.4000000000000004,24.310000000000002,104.86000000000001,-3.14,
    7.26,103.78,8.209999999999999,-2.11,98.37,3.4000000000000004,18.33,99.91,0.0,
    23.42,106.41,-5.81,10.16,98.75,-5.81,-1.46,97.24000000000001,3.14,
    8.83,101.06,-7.59,22.09,108.71000000000001,-7.59,18.95,114.16,7.59,
    13.89,107.60999999999999,8.89,-0.9099999999999999,96.28999999999999,2.41,4.54,95.51,-2.41,
    11.05,97.21000000000001,3.14,20.52,111.44,-8.209999999999999,0.43999999999999995,102.62,5.81,
    11.370000000000001,96.67,0.0,31.46,114.13,-1.3,-0.54,95.64999999999999,1.3,
    15.59,104.66,8.209999999999999,31.09,114.76,-2.41,3.8600000000000003,96.69,-4.44,
    -0.41000000000000003,95.42,0.0,18.0,100.5,-3.4000000000000004,-3.43,97.60999999999999,0.0,
    2.84,98.45,-5.81,17.03,102.17,-6.29,1.6400000000000001,100.54,-6.29,
    11.05,97.21000000000001,-3.14,9.78,114.72,-3.4000000000000004,-0.54,95.64999999999999,-1.3,
    30.54,115.72,-3.14,29.89,116.85000000000001,-3.4000000000000004,-0.9099999999999999,96.28999999999999,-2.41,
    26.14,114.68,6.29,29.24,117.97,-3.14,28.69,118.93,-2.41,
    28.32,119.57000000000001,-1.3,-1.46,97.24000000000001,-3.14,-2.11,98.37,-3.4000000000000004,
    8.83,101.06,7.59,18.95,114.16,-7.59,16.41,118.55000000000001,0.0,
    16.72,118.01,3.14,17.61,116.46000000000001,-5.81,-1.26,105.57000000000001,2.41,
    -2.7600000000000002,99.5,-3.14,17.61,116.46000000000001,5.81,-3.3200000000000003,100.45,-2.41,
    16.72,118.01,-3.14,-0.5800000000000001,104.39,4.44,26.14,114.68,-6.29,
    1.6400000000000001,100.54,6.29,23.23,119.71000000000001,2.41,24.93,116.76,-5.81,
    -3.6799999999999997,101.09,-1.3,-1.26,105.57000000000001,-2.41,2.84,98.45,5.81,
    10.75,113.05,-6.29,23.91,118.53,4.44,24.93,116.76,5.81,
    7.26,103.78,-8.209999999999999,5.6899999999999995,106.5,-7.59,4.36,108.81,-5.81,
    3.4699999999999998,110.35,-3.14,27.34,112.6,5.81,15.59,104.66,-8.209999999999999,
    0.43999999999999995,102.62,-5.81,13.89,107.60999999999999,-8.89,0.6900000000000001,35.0,86.06,
    -64.5,0.0,77.0,-62.809999999999995,18.12,75.31,0.6900000000000001,-35.0,86.06,
    50.309999999999995,18.12,10.0,2.5,18.12,92.81,-50.0,-49.5,62.5,
    55.0,0.0,27.5,2.5,60.620000000000005,-2.8100000000000005,2.5,-18.12,92.81,
    18.81,18.12,86.06,0.6900000000000001,-67.61,18.44,-75.62,0.0,62.5,
    -45.309999999999995,-60.620000000000005,45.0,15.309999999999999,-60.620000000000005,10.0,43.56,-18.12,-6.3100000000000005,
    32.81,-18.12,-20.310000000000002,45.620000000000005,0.0,-7.5,9.75,-60.620000000000005,2.75,
    52.61,0.0,9.379999999999999,20.0,49.5,-7.5,3.12,0.0,95.10999999999999,
    -2.19,-67.61,40.309999999999995,9.75,49.5,-15.37,34.5,0.0,-22.0,
    20.0,0.0,88.11999999999999,-15.0,70.0,27.5,18.81,-18.12,-31.06,
    20.0,0.0,-33.12,-30.689999999999998,35.0,86.06,-15.0,-70.0,27.5,
    -48.81,-18.12,86.06,2.5,-18.12,-37.81,-50.0,0.0,88.11999999999999,
    2.5,60.620000000000005,57.809999999999995,32.81,-18.12,75.31,9.75,60.620000000000005,52.25,
    34.5,0.0,77.0,-15.0,35.0,88.11999999999999,3.12,0.0,-40.11,
    43.56,-18.12,61.31,45.620000000000005,0.0,62.5,-32.5,-18.12,92.81,
    -2.19,67.61,40.309999999999995,15.309999999999999,60.620000000000005,45.0,-33.12,0.0,95.10999999999999,
    50.309999999999995,-18.12,45.0,-15.0,-18.12,95.10999999999999,-48.81,18.12,86.06,
    52.61,0.0,45.620000000000005,37.5,-35.0,-2.8100000000000005,9.75,49.5,70.37,
    37.5,35.0,-2.8100000000000005,27.869999999999997,-35.0,-15.37,-15.0,0.0,97.5,
    27.869999999999997,35.0,-15.37,-32.5,18.12,92.81,20.0,49.5,62.5,
    15.309999999999999,-35.0,80.0,15.309999999999999,-35.0,-25.0,-30.689999999999998,-35.0,86.06,
    27.869999999999997,-35.0,70.37,15.309999999999999,35.0,-25.0,-15.0,18.12,95.10999999999999,
    27.869999999999997,49.5,52.25,0.6900000000000001,-35.0,-31.06,-15.0,-35.0,88.11999999999999,
    37.5,-35.0,57.809999999999995,0.6900000000000001,35.0,-31.06,43.56,18.12,-6.3100000000000005,
    43.56,-35.0,43.19,32.81,18.12,-20.310000000000002,-33.12,67.61,27.5,
    -33.12,-67.61,27.5,-32.5,67.61,32.19,-32.5,-67.61,32.19,
    -30.689999999999998,67.61,36.56,-27.810000000000002,67.61,40.309999999999995,18.81,18.12,-31.06,
    -30.689999999999998,-67.61,36.56,2.5,18.12,-37.81,-15.0,60.620000000000005,62.5,
    15.309999999999999,35.0,80.0,-32.5,67.61,22.810000000000002,-39.75,-49.5,70.37,
    -27.810000000000002,-67.61,40.309999999999995,-39.75,49.5,70.37,27.869999999999997,35.0,70.37,
    -27.810000000000002,-49.5,75.31,20.0,-49.5,-7.5,-32.5,-67.61,22.810000000000002,
    37.5,35.0,57.809999999999995,-27.810000000000002,49.5,75.31,9.75,-49.5,-15.37,
    -15.0,-49.5,77.0,9.75,-49.5,70.37,43.56,35.0,43.19,
    -15.0,49.5,77.0,-2.19,-49.5,75.31,20.0,-49.5,62.5,
    -2.19,49.5,75.31,32.81,18.12,75.31,2.5,-60.620000000000005,-2.8100000000000005,
    -5.9399999999999995,60.620000000000005,-6.3100000000000005,27.869999999999997,-49.5,52.25,43.56,18.12,61.31,
    -2.19,67.61,14.690000000000001,-5.9399999999999995,67.61,11.81,-10.309999999999999,67.61,10.0,
    50.309999999999995,18.12,45.0,-15.0,60.620000000000005,-7.5,-15.0,-60.620000000000005,62.5,
    -15.0,67.61,9.379999999999999,-19.69,67.61,10.0,-2.19,-67.61,14.690000000000001,
    -15.0,-18.12,-40.11,-24.060000000000002,60.620000000000005,-6.3100000000000005,-15.0,0.0,-42.5,
    -5.9399999999999995,-67.61,11.81,2.5,-60.620000000000005,57.809999999999995,-32.5,-18.12,-37.81,
    -33.12,0.0,-40.11,9.75,-60.620000000000005,52.25,-32.5,60.620000000000005,-2.8100000000000005,
    -10.309999999999999,-67.61,10.0,-15.0,-35.0,-33.12,-5.9399999999999995,-60.620000000000005,61.31,
    -30.689999999999998,-35.0,-31.06,15.309999999999999,-60.620000000000005,45.0,-19.69,67.61,45.0,
    -2.19,49.5,-20.310000000000002,-15.0,-67.61,9.379999999999999,-15.0,67.61,45.620000000000005,
    -19.69,-67.61,45.0,-10.309999999999999,67.61,45.0,-15.0,49.5,-22.0,
    -5.9399999999999995,67.61,43.19,-15.0,-67.61,45.620000000000005,0.6900000000000001,67.61,36.56,
    -19.69,-67.61,10.0,2.5,67.61,32.19,-27.810000000000002,49.5,-20.310000000000002,
    3.12,67.61,27.5,-24.060000000000002,67.61,11.81,2.5,67.61,22.810000000000002,
    -27.810000000000002,67.61,14.690000000000001,-10.309999999999999,-67.61,45.0,-5.9399999999999995,60.620000000000005,61.31,
    -30.689999999999998,67.61,18.44,-39.75,49.5,-15.37,-5.9399999999999995,-67.61,43.19,
    18.81,60.620000000000005,36.56,52.61,-18.12,27.5,-2.19,-49.5,-20.310000000000002,
    -39.75,60.620000000000005,2.75,50.309999999999995,-18.12,10.0,-15.0,-49.5,-22.0,
    20.0,60.620000000000005,27.5,45.620000000000005,-35.0,27.5,-39.75,-60.620000000000005,2.75,
    -27.810000000000002,-49.5,-20.310000000000002,43.56,-35.0,11.81,-24.060000000000002,-67.61,11.81,
    -24.060000000000002,67.61,43.19,-39.75,-49.5,-15.37,32.81,49.5,40.309999999999995,
    -39.75,60.620000000000005,52.25,-39.75,-60.620000000000005,52.25,-5.9399999999999995,-60.620000000000005,-6.3100000000000005,
    -27.810000000000002,-67.61,14.690000000000001,-48.81,60.620000000000005,36.56,34.5,49.5,27.5,
    -32.5,-60.620000000000005,57.809999999999995,-15.0,35.0,-33.12,-15.0,-60.620000000000005,-7.5,
    -32.5,60.620000000000005,57.809999999999995,-30.689999999999998,-67.61,18.44,-50.0,60.620000000000005,27.5,
    -30.689999999999998,35.0,-31.06,-24.060000000000002,-60.620000000000005,61.31,-24.060000000000002,-60.620000000000005,-6.3100000000000005,
    -24.060000000000002,60.620000000000005,61.31,-45.309999999999995,60.620000000000005,10.0,32.81,-49.5,40.309999999999995,
    -32.5,-60.620000000000005,-2.8100000000000005,-48.81,60.620000000000005,18.44,34.5,-49.5,27.5,
    -15.0,18.12,-40.11,-24.060000000000002,-67.61,43.19,-32.5,18.12,-37.81,
    0.6900000000000001,67.61,18.44,-80.31,-18.12,10.0,18.81,60.620000000000005,18.44,
    -64.5,49.5,27.5,-62.809999999999995,49.5,40.309999999999995,18.81,-60.620000000000005,36.56,
    -75.62,-35.0,27.5,15.309999999999999,60.620000000000005,10.0,-73.56,-35.0,11.81,
    -45.309999999999995,60.620000000000005,45.0,20.0,-60.620000000000005,27.5,-80.31,-18.12,45.0,
    9.75,60.620000000000005,2.75,-57.87,49.5,52.25,-73.56,-18.12,61.31,
    -50.0,49.5,-7.5,-57.87,49.5,2.75,-50.0,49.5,62.5,
    -48.81,-18.12,-31.06,-50.0,0.0,-33.12,0.6900000000000001,-67.61,36.56,
    -62.809999999999995,-18.12,75.31,-45.309999999999995,35.0,-25.0,-62.809999999999995,49.5,14.690000000000001,
    -62.809999999999995,-18.12,-20.310000000000002,-57.87,35.0,-15.37,2.5,-67.61,32.19,
    32.81,49.5,14.690000000000001,-64.5,-49.5,27.5,-62.809999999999995,-49.5,40.309999999999995,
    -64.5,0.0,-22.0,-73.56,-18.12,-6.3100000000000005,-73.56,-35.0,43.19,
    -75.62,0.0,-7.5,-67.5,35.0,-2.8100000000000005,27.869999999999997,49.5,2.75,
    3.12,-67.61,27.5,-67.5,-35.0,57.809999999999995,2.5,-67.61,22.810000000000002,
    -48.81,18.12,-31.06,-57.87,-49.5,2.75,-73.56,35.0,43.19,
    -45.309999999999995,-35.0,-25.0,-57.87,-35.0,70.37,-62.809999999999995,18.12,-20.310000000000002,
    -57.87,-35.0,-15.37,-62.809999999999995,-49.5,14.690000000000001,-67.5,35.0,57.809999999999995,
    -45.309999999999995,-35.0,80.0,-73.56,18.12,-6.3100000000000005,-67.5,-35.0,-2.8100000000000005,
    -57.87,35.0,70.37,32.81,-49.5,14.690000000000001,-48.81,-60.620000000000005,36.56,
    -75.62,35.0,27.5,-73.56,35.0,11.81,-45.309999999999995,35.0,80.0,
    27.869999999999997,-49.5,2.75,45.620000000000005,35.0,27.5,-50.0,-60.620000000000005,27.5,
    -50.0,-49.5,-7.5,43.56,35.0,11.81,18.81,-60.620000000000005,18.44,
    -80.31,18.12,45.0,-73.56,18.12,61.31,-45.309999999999995,-60.620000000000005,10.0,
    52.61,18.12,27.5,-80.31,18.12,10.0,-57.87,-49.5,52.25,
    -48.81,-60.620000000000005,18.44,-82.60999999999999,18.12,27.5,-85.0,0.0,27.5,
    -82.60999999999999,0.0,45.620000000000005,-82.60999999999999,0.0,9.379999999999999,18.81,-18.12,86.06,
    -82.60999999999999,-18.12,27.5,-2.5,60.620000000000005,57.809999999999995,15.0,-18.12,95.10999999999999,
    15.0,-35.0,88.11999999999999,48.81,60.620000000000005,36.56,-43.56,-18.12,61.31,
    73.56,-18.12,-6.3100000000000005,62.809999999999995,-18.12,-20.310000000000002,75.62,0.0,-7.5,
    -27.869999999999997,49.5,52.25,-15.309999999999999,60.620000000000005,45.0,73.56,-35.0,11.81,
    15.0,35.0,88.11999999999999,-45.620000000000005,0.0,62.5,-32.81,-18.12,75.31,
    -34.5,0.0,77.0,80.31,-18.12,10.0,64.5,0.0,-22.0,
    75.62,-35.0,27.5,48.81,-18.12,-31.06,50.0,0.0,-33.12,
    30.689999999999998,35.0,86.06,-43.56,-35.0,43.19,-50.309999999999995,-18.12,45.0,
    -20.0,49.5,62.5,50.0,60.620000000000005,27.5,15.0,18.12,95.10999999999999,
    67.5,35.0,-2.8100000000000005,-37.5,-35.0,57.809999999999995,-9.75,49.5,70.37,
    57.87,35.0,-15.37,50.0,49.5,-7.5,32.5,18.12,92.81,
    67.5,-35.0,-2.8100000000000005,62.809999999999995,-49.5,40.309999999999995,-27.869999999999997,-35.0,70.37,
    45.309999999999995,35.0,-25.0,48.81,18.12,86.06,64.5,-49.5,27.5,
    32.5,-18.12,92.81,30.689999999999998,-35.0,86.06,57.87,-35.0,-15.37,
    15.0,0.0,97.5,73.56,18.12,-6.3100000000000005,45.309999999999995,-35.0,-25.0,
    62.809999999999995,-49.5,14.690000000000001,33.12,0.0,95.10999999999999,62.809999999999995,18.12,-20.310000000000002,
    50.0,0.0,88.11999999999999,57.87,-49.5,2.75,48.81,18.12,-31.06,
    82.60999999999999,18.12,27.5,50.0,-49.5,-7.5,48.81,-60.620000000000005,36.56,
    48.81,60.620000000000005,18.44,82.60999999999999,0.0,45.620000000000005,-43.56,35.0,43.19,
    85.0,0.0,27.5,50.0,-60.620000000000005,27.5,82.60999999999999,-18.12,27.5,
    45.309999999999995,60.620000000000005,10.0,82.60999999999999,0.0,9.379999999999999,-37.5,35.0,57.809999999999995,
    48.81,-60.620000000000005,18.44,45.309999999999995,60.620000000000005,45.0,-27.869999999999997,35.0,70.37,
    62.809999999999995,49.5,40.309999999999995,62.809999999999995,-18.12,75.31,45.309999999999995,-60.620000000000005,10.0,
    32.5,-18.12,-37.81,50.0,49.5,62.5,64.5,0.0,77.0,
    33.12,0.0,-40.11,64.5,49.5,27.5,73.56,-18.12,61.31,
    75.62,0.0,62.5,-15.309999999999999,35.0,80.0,57.87,49.5,52.25,
    15.0,-18.12,-40.11,62.809999999999995,49.5,14.690000000000001,80.31,-18.12,45.0,
    15.0,0.0,-42.5,-50.309999999999995,18.12,45.0,30.689999999999998,-35.0,-31.06,
    57.87,49.5,2.75,45.309999999999995,-35.0,80.0,-43.56,18.12,61.31,
    57.87,-35.0,70.37,15.0,-35.0,-33.12,-32.81,18.12,75.31,
    67.5,-35.0,57.809999999999995,45.309999999999995,35.0,80.0,73.56,-35.0,43.19,
    27.810000000000002,-67.61,40.309999999999995,57.87,35.0,70.37,30.689999999999998,-67.61,36.56,
    -52.61,0.0,45.620000000000005,39.75,-49.5,-15.37,67.5,35.0,57.809999999999995,
    32.5,-67.61,32.19,27.810000000000002,-49.5,-20.310000000000002,73.56,35.0,43.19,
    33.12,-67.61,27.5,75.62,35.0,27.5,15.0,-49.5,-22.0,
    -3.12,67.61,27.5,-2.5,67.61,32.19,32.5,-67.61,22.810000000000002,
    73.56,35.0,11.81,-0.6900000000000001,67.61,36.56,62.809999999999995,18.12,75.31,
    2.19,-49.5,-20.310000000000002,-2.5,67.61,22.810000000000002,73.56,18.12,61.31,
    -18.81,60.620000000000005,36.56,80.31,18.12,45.0,50.0,-49.5,62.5,
    32.5,-60.620000000000005,-2.8100000000000005,-20.0,60.620000000000005,27.5,57.87,-49.5,52.25,
    24.060000000000002,-60.620000000000005,-6.3100000000000005,80.31,18.12,10.0,15.0,-60.620000000000005,-7.5,
    2.19,-67.61,40.309999999999995,5.9399999999999995,-60.620000000000005,-6.3100000000000005,45.309999999999995,-60.620000000000005,45.0,
    -34.5,49.5,27.5,-32.81,49.5,40.309999999999995,15.0,-70.0,27.5,
    27.810000000000002,67.61,40.309999999999995,15.0,60.620000000000005,62.5,30.689999999999998,67.61,36.56,
    32.5,67.61,32.19,33.12,67.61,27.5,2.19,49.5,75.31,
    32.5,67.61,22.810000000000002,15.0,49.5,77.0,-15.309999999999999,-35.0,80.0,
    27.810000000000002,49.5,75.31,2.19,-49.5,75.31,39.75,49.5,70.37,
    15.0,-49.5,77.0,-2.5,-18.12,-37.81,-3.12,0.0,-40.11,
    -18.81,-18.12,-31.06,-20.0,0.0,-33.12,-0.6900000000000001,67.61,18.44,
    -32.81,-18.12,-20.310000000000002,-9.75,60.620000000000005,2.75,-34.5,0.0,-22.0,
    -43.56,-18.12,-6.3100000000000005,-45.620000000000005,0.0,-7.5,-15.309999999999999,60.620000000000005,10.0,
    24.060000000000002,67.61,43.19,-18.81,60.620000000000005,18.44,-0.6900000000000001,-35.0,-31.06,
    32.5,60.620000000000005,-2.8100000000000005,24.060000000000002,60.620000000000005,61.31,24.060000000000002,60.620000000000005,-6.3100000000000005,
    -27.869999999999997,49.5,2.75,-15.309999999999999,-35.0,-25.0,32.5,60.620000000000005,57.809999999999995,
    15.0,70.0,27.5,39.75,-60.620000000000005,2.75,15.0,60.620000000000005,-7.5,
    -27.869999999999997,-35.0,-15.37,-32.81,49.5,14.690000000000001,2.19,67.61,40.309999999999995,
    39.75,60.620000000000005,52.25,30.689999999999998,-67.61,18.44,-37.5,-35.0,-2.8100000000000005,
    5.9399999999999995,60.620000000000005,-6.3100000000000005,27.810000000000002,-67.61,14.690000000000001,24.060000000000002,-67.61,11.81,
    39.75,49.5,-15.37,-45.620000000000005,35.0,27.5,-43.56,35.0,11.81,
    27.810000000000002,49.5,-20.310000000000002,5.9399999999999995,67.61,43.19,10.309999999999999,67.61,45.0,
    15.0,49.5,-22.0,15.0,67.61,45.620000000000005,-9.75,-49.5,-15.37,
    19.69,-67.61,10.0,19.69,67.61,45.0,-52.61,18.12,27.5,
    2.19,49.5,-20.310000000000002,15.0,-67.61,9.379999999999999,-20.0,-49.5,-7.5,
    10.309999999999999,-67.61,10.0,30.689999999999998,67.61,18.44,-50.309999999999995,18.12,10.0,
    5.9399999999999995,60.620000000000005,61.31,27.810000000000002,67.61,14.690000000000001,-2.5,-60.620000000000005,-2.8100000000000005,
    24.060000000000002,67.61,11.81,5.9399999999999995,-67.61,11.81,-55.0,0.0,27.5,
    39.75,60.620000000000005,2.75,2.19,-67.61,14.690000000000001,-52.61,0.0,9.379999999999999,
    30.689999999999998,35.0,-31.06,27.810000000000002,-49.5,75.31,48.81,-18.12,86.06,
    39.75,-49.5,70.37,19.69,67.61,10.0,15.0,-60.620000000000005,62.5,
    15.0,67.61,9.379999999999999,-27.869999999999997,-49.5,52.25,10.309999999999999,67.61,10.0,
    5.9399999999999995,67.61,11.81,2.19,67.61,14.690000000000001,-20.0,-49.5,62.5,
    -9.75,-49.5,70.37,-0.6900000000000001,35.0,86.06,15.0,35.0,-33.12,
    -18.81,18.12,86.06,24.060000000000002,-60.620000000000005,61.31,-2.5,18.12,92.81,
    -15.309999999999999,-60.620000000000005,45.0,32.5,-60.620000000000005,57.809999999999995,-20.0,0.0,88.11999999999999,
    -3.12,0.0,95.10999999999999,-9.75,-60.620000000000005,52.25,32.5,18.12,-37.81,
    39.75,-60.620000000000005,52.25,-9.75,60.620000000000005,52.25,-2.5,-60.620000000000005,57.809999999999995,
    15.0,18.12,-40.11,24.060000000000002,-67.61,43.19,-2.5,60.620000000000005,-2.8100000000000005,
    -9.75,49.5,-15.37,-20.0,49.5,-7.5,5.9399999999999995,-60.620000000000005,61.31,
    -52.61,-18.12,27.5,-50.309999999999995,-18.12,10.0,5.9399999999999995,-67.61,43.19,
    -0.6900000000000001,35.0,-31.06,-15.309999999999999,35.0,-25.0,-27.869999999999997,35.0,-15.37,
    10.309999999999999,-67.61,45.0,-45.620000000000005,-35.0,27.5,-37.5,35.0,-2.8100000000000005,
    -43.56,-35.0,11.81,-2.5,18.12,-37.81,15.0,-67.61,45.620000000000005,
    -18.81,18.12,-31.06,-18.81,-18.12,86.06,-32.81,18.12,-20.310000000000002,
    19.69,-67.61,45.0,-2.5,-18.12,92.81,-43.56,18.12,-6.3100000000000005,
    -0.6900000000000001,-35.0,86.06,-34.5,-49.5,27.5,-32.81,-49.5,40.309999999999995,
    -18.81,-60.620000000000005,36.56,-20.0,-60.620000000000005,27.5,-3.12,-67.61,27.5,
    -2.5,-67.61,32.19,-0.6900000000000001,-67.61,36.56,-2.5,-67.61,22.810000000000002,
    -27.869999999999997,-49.5,2.75,-32.81,-49.5,14.690000000000001,-9.75,-60.620000000000005,2.75,
    -15.309999999999999,-60.620000000000005,10.0,-18.81,-60.620000000000005,18.44,-0.6900000000000001,-67.61,18.44,
    -34.41,35.0,94.12,-34.27,33.09,93.77000000000001,-32.5,33.09,94.12,
    -30.0,38.54,87.0,-28.96,35.0,85.96000000000001,-35.769999999999996,31.46,90.85000000000001,
    -29.23,36.91,92.77,-33.849999999999994,39.620000000000005,88.14999999999999,-34.27,39.620000000000005,88.77000000000001,
    -34.27,30.38,90.22999999999999,-29.23,36.91,86.22999999999999,-34.41,39.620000000000005,89.5,
    -32.5,35.0,84.5,-30.590000000000003,35.0,84.88,-34.41,35.0,84.88,
    -35.0,31.46,92.0,-30.590000000000003,35.0,94.12,-30.73,33.09,93.77000000000001,
    -33.849999999999994,30.38,90.85000000000001,-28.96,35.0,93.04,-33.23,30.38,91.27000000000001,
    -29.23,33.09,86.22999999999999,-35.769999999999996,33.09,92.77,-33.849999999999994,31.46,92.77,
    -35.769999999999996,38.54,88.14999999999999,-32.5,30.38,91.41,-32.5,31.46,93.04,
    -27.88,35.0,91.41,-30.0,31.46,87.0,-31.77,30.38,91.27000000000001,
    -31.150000000000002,31.46,92.77,-30.73,33.09,85.22999999999999,-29.23,33.09,92.77,
    -28.23,33.09,91.27000000000001,-31.150000000000002,30.38,90.85000000000001,-36.04,38.54,89.5,
    -32.5,33.09,84.88,-34.27,39.620000000000005,90.22999999999999,-33.849999999999994,39.620000000000005,90.85000000000001,
    -30.73,30.38,90.22999999999999,-36.77,36.91,91.27000000000001,-37.120000000000005,36.91,89.5,
    -33.23,39.620000000000005,91.27000000000001,-34.27,33.09,85.22999999999999,-32.5,39.620000000000005,91.41,
    -36.77,36.91,87.72999999999999,-31.77,39.620000000000005,91.27000000000001,-33.849999999999994,38.54,92.77,
    -30.0,31.46,92.0,-35.769999999999996,31.46,88.14999999999999,-31.150000000000002,39.620000000000005,90.85000000000001,
    -35.769999999999996,33.09,86.22999999999999,-30.73,39.620000000000005,90.22999999999999,-29.23,31.46,90.85000000000001,
    -32.5,38.54,93.04,-35.769999999999996,38.54,90.85000000000001,-31.150000000000002,38.54,92.77,
    -35.0,38.54,92.0,-31.150000000000002,31.46,86.22999999999999,-30.73,30.38,88.77000000000001,
    -36.04,35.0,93.04,-32.5,31.46,85.96000000000001,-35.769999999999996,36.91,92.77,
    -31.150000000000002,30.38,88.14999999999999,-27.5,35.0,89.5,-33.849999999999994,31.46,86.22999999999999,
    -31.150000000000002,38.54,86.22999999999999,-31.77,30.38,87.72999999999999,-27.88,35.0,87.59,
    -34.27,36.91,93.77000000000001,-32.5,38.54,85.96000000000001,-32.5,30.38,87.59,
    -30.590000000000003,39.620000000000005,89.5,-35.0,31.46,87.0,-27.88,33.09,89.5,
    -33.849999999999994,38.54,86.22999999999999,-30.0,38.54,92.0,-32.5,36.91,94.12,
    -33.23,30.38,87.72999999999999,-28.23,33.09,87.72999999999999,-30.73,36.91,93.77000000000001,
    -35.0,38.54,87.0,-37.5,35.0,89.5,-37.120000000000005,35.0,91.41,
    -29.23,38.54,90.85000000000001,-32.5,30.0,89.5,-30.73,36.91,85.22999999999999,
    -28.96,38.54,89.5,-28.96,31.46,89.5,-32.5,36.91,84.88,
    -37.120000000000005,35.0,87.59,-29.23,31.46,88.14999999999999,-29.23,38.54,88.14999999999999,
    -34.27,36.91,85.22999999999999,-36.77,33.09,91.27000000000001,-35.769999999999996,36.91,86.22999999999999,
    -37.120000000000005,33.09,89.5,-32.5,40.0,89.5,-36.04,35.0,85.96000000000001,
    -34.41,30.38,89.5,-36.77,33.09,87.72999999999999,-32.5,35.0,94.5,
    -28.23,36.91,91.27000000000001,-33.849999999999994,30.38,88.14999999999999,-30.73,39.620000000000005,88.77000000000001,
    -34.27,30.38,88.77000000000001,-27.88,36.91,89.5,-31.150000000000002,39.620000000000005,88.14999999999999,
    -31.77,39.620000000000005,87.72999999999999,-32.5,39.620000000000005,87.59,-33.23,39.620000000000005,87.72999999999999,
    -36.04,31.46,89.5,-28.23,36.91,87.72999999999999,-30.590000000000003,30.38,89.5,
    33.35,31.46,93.27,34.5,31.46,92.5,32.0,38.54,93.53999999999999,
    36.269999999999996,36.91,91.77,36.62,36.91,90.0,35.27,33.09,93.27,
    35.27,31.46,91.35,35.54,31.46,90.0,31.269999999999996,39.620000000000005,88.23,
    30.65,39.620000000000005,91.35,31.269999999999996,30.38,91.77,27.38,33.09,90.0,
    30.09,39.620000000000005,90.0,35.27,38.54,88.65,28.46,38.54,90.0,
    28.730000000000004,38.54,91.35,32.0,30.38,91.91000000000001,36.269999999999996,36.91,88.23,
    32.730000000000004,30.38,91.77,33.35,38.54,93.27,28.46,31.46,90.0,
    28.730000000000004,31.46,91.35,30.23,39.620000000000005,90.73,33.35,30.38,91.35,
    34.5,38.54,92.5,33.35,38.54,86.73,33.769999999999996,30.38,90.73,
    32.0,36.91,94.62,32.0,38.54,86.46000000000001,29.5,38.54,92.5,
    27.73,36.91,91.77,33.91,30.38,90.0,33.769999999999996,36.91,94.27,
    27.38,36.91,90.0,33.35,39.620000000000005,91.35,33.769999999999996,39.620000000000005,90.73,
    35.27,36.91,93.27,30.65,38.54,93.27,33.91,39.620000000000005,90.0,
    35.27,31.46,88.65,32.0,30.0,90.0,35.27,36.91,86.73,
    28.730000000000004,36.91,93.27,34.5,31.46,87.5,35.27,38.54,91.35,
    33.769999999999996,36.91,85.73,30.23,36.91,94.27,35.54,38.54,90.0,
    30.65,39.620000000000005,88.65,30.23,39.620000000000005,89.27,29.5,38.54,87.5,
    32.0,36.91,85.38,27.38,35.0,88.08999999999999,28.730000000000004,38.54,88.65,
    33.769999999999996,30.38,89.27,27.73,33.09,88.23,33.35,30.38,88.65,
    32.730000000000004,30.38,88.23,32.0,40.0,90.0,28.46,35.0,93.53999999999999,
    27.73,36.91,88.23,32.0,35.0,95.0,35.54,35.0,86.46000000000001,
    31.269999999999996,39.620000000000005,91.77,32.0,30.38,88.08999999999999,32.0,39.620000000000005,91.91000000000001,
    33.91,35.0,94.62,33.91,35.0,85.38,29.5,31.46,87.5,
    30.09,35.0,94.62,32.730000000000004,39.620000000000005,91.77,36.62,35.0,91.91000000000001,
    35.54,35.0,93.53999999999999,28.730000000000004,31.46,88.65,31.269999999999996,30.38,88.23,
    37.0,35.0,90.0,32.0,35.0,85.0,28.730000000000004,33.09,93.27,
    36.62,35.0,88.08999999999999,30.23,33.09,94.27,30.65,38.54,86.73,
    30.23,36.91,85.73,32.0,33.09,94.62,35.27,33.09,86.73,
    30.09,35.0,85.38,28.730000000000004,36.91,86.73,36.269999999999996,33.09,91.77,
    33.769999999999996,33.09,94.27,28.46,35.0,86.46000000000001,33.769999999999996,33.09,85.73,
    29.5,31.46,92.5,36.62,33.09,90.0,30.23,30.38,90.73,
    30.23,33.09,85.73,30.65,31.46,93.27,32.0,33.09,85.38,
    30.09,30.38,90.0,36.269999999999996,33.09,88.23,27.0,35.0,90.0,
    27.38,35.0,91.91000000000001,30.65,30.38,91.35,28.730000000000004,33.09,86.73,
    33.769999999999996,39.620000000000005,89.27,33.35,39.620000000000005,88.65,32.730000000000004,39.620000000000005,88.23,
    32.0,39.620000000000005,88.08999999999999,30.65,30.38,88.65,32.0,31.46,93.53999999999999,
    30.65,31.46,86.73,33.35,31.46,86.73,30.23,30.38,89.27,
    32.0,31.46,86.46000000000001,27.73,33.09,91.77,34.5,38.54,87.5,
    -45.769999999999996,-73.16,-1.25,-46.65,-73.03,-2.17,-47.86,-72.86,-2.5,
    -49.95,-72.55,1.25,-47.86,-72.86,0.0,-46.65,-73.03,2.17,
    -45.769999999999996,-73.16,1.25,-62.14,-102.14,0.0,-45.45,-73.21,0.0,
    -50.279999999999994,-72.5,0.0,-62.14,-102.14,2.5,-49.95,-72.55,-1.25,
    -47.86,-72.86,2.5,-49.07,-72.67999999999999,-2.17,-60.93,-102.32,-2.17,
    -60.93,-102.32,2.17,-60.929,-102.31899999999999,-2.17,-63.35,-101.97,2.17,
    -60.929,-102.31899999999999,-2.17,-63.35,-101.97,-2.17,-62.14,-102.14,-2.5,
    -64.23,-101.83999999999999,1.25,-60.929,-102.31899999999999,-2.17,-60.929,-102.31899999999999,-2.17,
    -60.929,-102.31899999999999,-2.17,-59.720000000000006,-102.5,0.0,-60.05,-102.44999999999999,1.25,
    -60.929,-102.31899999999999,-2.17,-60.05,-102.44999999999999,-1.25,-64.23,-101.83999999999999,-1.25,
    -49.07,-72.67999999999999,2.17,-64.55,-101.79,0.0,47.01,-70.05,-1.25,
    46.120000000000005,-70.17999999999999,-2.17,44.91,-70.36,0.0,42.5,-70.71,0.0,
    42.82,-70.66,1.25,61.28,-99.33999999999999,1.25,44.91,-70.36,2.5,
    43.71000000000001,-70.53,2.17,59.19,-99.64,2.5,57.99,-99.82,2.17,
    57.1,-99.94999999999999,1.25,61.28,-99.33999999999999,-1.25,59.19,-99.64,0.0,
    61.61,-99.29,0.0,44.91,-70.36,-2.5,46.120000000000005,-70.17999999999999,2.17,
    60.4,-99.47,-2.17,47.33,-70.0,0.0,59.19,-99.64,-2.5,
    47.01,-70.05,1.25,43.71000000000001,-70.53,-2.17,42.82,-70.66,-1.25,
    57.99,-99.82,-2.17,60.4,-99.47,2.17,56.78,-100.0,0.0,
    57.1,-99.94999999999999,-1.25,14.990000000000002,49.900000000000006,85.12,33.59,-17.330000000000002,92.36000000000001,
    49.12,-17.330000000000002,85.12,49.88,0.0,86.43,-32.1,34.129999999999995,88.13000000000001,
    16.259999999999998,34.129999999999995,92.36000000000001,-16.31,34.129999999999995,92.36000000000001,34.11,0.0,93.78,
    -0.02,-17.330000000000002,98.28,49.88,86.43,0.0,-0.02,-34.129999999999995,93.78,
    49.12,86.43,-8.67,32.05,34.129999999999995,88.13000000000001,-0.02,98.28,-17.330000000000002,
    -3.03,98.28,-17.07,46.870000000000005,86.43,-17.07,98.26,0.0,-17.330000000000002,
    -60.300000000000004,-76.44999999999999,-21.939999999999998,-71.86,-64.15,-26.150000000000002,93.75999999999999,0.0,-34.129999999999995,
    92.33000000000001,-17.330000000000002,-33.620000000000005,85.09,-17.330000000000002,-49.14,-32.1,-34.129999999999995,88.13000000000001,
    -5.949999999999999,98.28,-16.279999999999998,17.04,17.330000000000002,96.79,-15.03,-49.900000000000006,85.12,
    16.259999999999998,-34.129999999999995,92.36000000000001,17.04,-17.330000000000002,96.79,-63.2,-76.44999999999999,-11.14,
    -75.31,-64.15,-13.280000000000001,-0.02,34.129999999999995,93.78,-0.02,-49.900000000000006,86.43,
    33.59,17.330000000000002,92.36000000000001,86.41,0.0,-49.900000000000006,43.19,86.43,-24.950000000000003,
    32.05,-34.129999999999995,88.13000000000001,-8.69,98.28,-15.009999999999998,49.12,17.330000000000002,85.12,
    -64.17,-76.44999999999999,0.0,-11.16,98.28,-13.280000000000001,98.26,-17.330000000000002,0.0,
    93.75999999999999,-34.129999999999995,0.0,92.33000000000001,-34.129999999999995,-16.279999999999998,-49.17,17.330000000000002,85.12,
    17.310000000000002,0.0,98.28,-13.3,98.28,-11.14,88.10000000000001,-34.129999999999995,-32.08,
    -76.47,-64.15,0.0,-33.64,17.330000000000002,92.36000000000001,8.64,86.43,49.14,
    14.990000000000002,-49.900000000000006,85.12,-29.580000000000002,93.78,-17.07,-17.09,17.330000000000002,96.79,
    33.59,93.78,-5.93,17.04,86.43,46.89,-75.31,-17.330000000000002,63.17999999999999,
    -76.47,0.0,64.15,86.41,-49.900000000000006,0.0,85.09,-49.900000000000006,-15.009999999999998,
    -32.1,93.78,-11.67,-0.02,17.330000000000002,98.28,34.11,93.78,0.0,
    -63.2,-17.330000000000002,75.28999999999999,-64.17,0.0,76.44999999999999,32.05,93.78,-11.67,
    24.93,86.43,43.209999999999994,-33.64,93.78,-5.93,-63.2,-17.330000000000002,-75.28999999999999,
    -81.24000000000001,-34.129999999999995,46.89,-34.16,93.78,0.0,-64.17,0.0,-76.44999999999999,
    29.540000000000003,93.78,-17.07,-75.31,-17.330000000000002,-63.17999999999999,-76.47,0.0,-64.15,
    -71.86,-34.129999999999995,60.279999999999994,-49.92,0.0,86.43,-34.16,0.0,93.78,
    -60.300000000000004,-34.129999999999995,71.84,-17.35,0.0,98.28,-46.91,-34.129999999999995,81.22,
    85.09,-17.330000000000002,49.14,-46.91,-34.129999999999995,-81.22,-0.02,0.0,99.80000000000001,
    86.41,0.0,49.900000000000006,-60.300000000000004,-34.129999999999995,-71.84,92.33000000000001,-17.330000000000002,33.620000000000005,
    93.75999999999999,0.0,34.129999999999995,43.19,86.43,24.950000000000003,-0.02,93.78,-34.129999999999995,
    81.19,-49.900000000000006,-29.56,96.77,-17.330000000000002,17.07,98.26,0.0,17.330000000000002,
    -71.86,-34.129999999999995,-60.279999999999994,46.870000000000005,86.43,17.07,-81.24000000000001,-34.129999999999995,-46.89,
    -5.949999999999999,93.78,-33.620000000000005,-24.97,86.43,43.209999999999994,-11.7,93.78,-32.08,
    49.12,86.43,8.67,75.27,-64.15,-13.280000000000001,-17.09,86.43,46.89,
    -17.09,93.78,-29.56,17.310000000000002,98.28,0.0,17.04,98.28,-3.01,
    99.78,0.0,0.0,76.42999999999999,-64.15,0.0,71.82000000000001,-64.15,-26.150000000000002,
    16.259999999999998,98.28,-5.93,88.10000000000001,-34.129999999999995,32.08,-8.69,86.43,49.14,
    14.990000000000002,98.28,-8.67,-0.02,86.43,49.900000000000006,13.25,98.28,-11.14,
    -29.580000000000002,-49.900000000000006,81.22,92.33000000000001,-34.129999999999995,16.279999999999998,11.120000000000001,98.28,-13.280000000000001,
    66.19,-64.15,-38.23,8.64,98.28,-15.009999999999998,-21.96,-76.44999999999999,-60.279999999999994,
    5.8999999999999995,98.28,-16.279999999999998,-38.25,-64.15,66.21000000000001,2.9899999999999998,98.28,-17.07,
    -32.1,-76.44999999999999,-55.56,85.09,-49.900000000000006,15.009999999999998,64.13,-76.44999999999999,0.0,
    63.150000000000006,-76.44999999999999,-11.14,-26.17,-64.15,71.84,60.26,-76.44999999999999,-21.939999999999998,
    -13.3,-64.15,75.28999999999999,-21.96,93.78,-26.150000000000002,5.8999999999999995,93.78,33.620000000000005,
    -0.02,-64.15,76.44999999999999,55.53,-76.44999999999999,-32.08,63.150000000000006,-17.330000000000002,75.28999999999999,
    -26.17,93.78,-21.939999999999998,11.65,93.78,32.08,64.13,0.0,76.44999999999999,
    75.27,-17.330000000000002,63.17999999999999,76.42999999999999,0.0,64.15,-17.09,93.78,29.56,
    -32.1,86.43,-38.23,-11.7,93.78,32.08,17.04,93.78,29.56,
    -11.16,-76.44999999999999,63.17999999999999,-38.25,86.43,-32.08,-5.949999999999999,93.78,33.620000000000005,
    46.870000000000005,-34.129999999999995,81.22,-0.02,-76.44999999999999,64.15,60.26,-34.129999999999995,71.84,
    21.92,93.78,26.150000000000002,-29.580000000000002,-49.900000000000006,-81.22,-0.02,93.78,34.129999999999995,
    71.82000000000001,-34.129999999999995,60.279999999999994,26.12,93.78,-21.939999999999998,26.12,93.78,21.939999999999998,
    -0.02,-64.15,-76.44999999999999,-43.239999999999995,86.43,-24.950000000000003,81.19,-34.129999999999995,46.89,
    75.27,-17.330000000000002,-63.17999999999999,21.92,93.78,-26.150000000000002,76.42999999999999,0.0,-64.15,
    -46.91,86.43,-17.07,63.150000000000006,-17.330000000000002,-75.28999999999999,-32.1,-76.44999999999999,55.56,
    -13.3,-64.15,-75.28999999999999,64.13,0.0,-76.44999999999999,-49.17,86.43,-8.67,
    38.199999999999996,86.43,-32.08,-21.96,-76.44999999999999,60.279999999999994,-26.17,-64.15,-71.84,
    32.05,86.43,38.23,81.19,-34.129999999999995,-46.89,-26.17,93.78,21.939999999999998,
    -49.92,86.43,0.0,32.05,86.43,-38.23,38.199999999999996,86.43,32.08,
    -21.96,93.78,26.150000000000002,71.82000000000001,-34.129999999999995,-60.279999999999994,-38.25,-64.15,-66.21000000000001,
    43.19,-49.900000000000006,74.85000000000001,-38.25,86.43,32.08,60.26,-34.129999999999995,-71.84,
    55.53,-49.900000000000006,66.21000000000001,-0.02,-76.44999999999999,-64.15,-32.1,86.43,38.23,
    66.19,-49.900000000000006,55.56,46.870000000000005,-34.129999999999995,-81.22,-11.16,-76.44999999999999,-63.17999999999999,
    74.83,-49.900000000000006,43.209999999999994,17.04,93.78,-29.56,-74.87,-49.900000000000006,43.209999999999994,
    -0.02,86.43,-49.900000000000006,11.65,93.78,-32.08,-8.69,86.43,-49.14,
    -66.23,-49.900000000000006,55.56,-55.58,-49.900000000000006,66.21000000000001,49.12,-64.15,58.57,
    5.8999999999999995,93.78,-33.620000000000005,29.540000000000003,93.78,17.07,-17.09,86.43,-46.89,
    -13.3,98.28,11.14,-43.239999999999995,-49.900000000000006,74.85000000000001,-11.16,98.28,13.280000000000001,
    32.05,93.78,11.67,58.54,-64.15,49.14,-8.69,98.28,15.009999999999998,
    -5.949999999999999,98.28,16.279999999999998,33.59,93.78,5.93,-24.97,86.43,-43.209999999999994,
    -3.03,98.28,17.07,-0.02,98.28,17.330000000000002,74.83,-49.900000000000006,-43.209999999999994,
    -58.59,-64.15,49.14,66.19,-49.900000000000006,-55.56,-49.17,-64.15,58.57,
    -43.239999999999995,-49.900000000000006,-74.85000000000001,41.21000000000001,-76.44999999999999,49.14,-55.58,-49.900000000000006,-66.21000000000001,
    55.53,-49.900000000000006,-66.21000000000001,49.12,-76.44999999999999,41.230000000000004,-66.23,-49.900000000000006,-55.56,
    24.93,86.43,-43.209999999999994,-74.87,-49.900000000000006,-43.209999999999994,43.19,-49.900000000000006,-74.85000000000001,
    17.04,86.43,-46.89,-55.58,76.44999999999999,-32.08,2.9899999999999998,98.28,17.07,
    -49.17,-76.44999999999999,41.230000000000004,5.8999999999999995,98.28,16.279999999999998,8.64,98.28,15.009999999999998,
    8.64,86.43,-49.14,-49.17,-64.15,-58.57,-41.260000000000005,-76.44999999999999,49.14,
    -60.300000000000004,76.44999999999999,-21.939999999999998,11.120000000000001,98.28,13.280000000000001,13.25,98.28,11.14,
    -17.35,98.28,0.0,-17.09,98.28,3.01,-0.02,99.80000000000001,0.0,
    -16.31,98.28,5.93,-58.59,-64.15,-49.14,14.990000000000002,98.28,8.67,
    58.54,-64.15,-49.14,-15.03,98.28,8.67,16.259999999999998,98.28,5.93,
    29.540000000000003,-49.900000000000006,81.22,17.04,98.28,3.01,-63.2,76.44999999999999,-11.14,
    49.12,-64.15,-58.57,-64.17,76.44999999999999,0.0,-81.24000000000001,-49.900000000000006,29.56,
    -66.23,64.15,-38.23,13.25,-64.15,75.28999999999999,-41.260000000000005,-76.44999999999999,-49.14,
    -71.86,64.15,-26.150000000000002,86.41,49.900000000000006,0.0,85.09,49.900000000000006,-15.009999999999998,
    -49.17,-76.44999999999999,-41.230000000000004,26.12,-64.15,71.84,49.12,-76.44999999999999,-41.230000000000004,
    -75.31,64.15,-13.280000000000001,92.33000000000001,34.129999999999995,-16.279999999999998,-75.31,-64.15,13.280000000000001,
    93.75999999999999,34.129999999999995,0.0,88.10000000000001,34.129999999999995,-32.08,38.199999999999996,-64.15,66.21000000000001,
    41.21000000000001,-76.44999999999999,-49.14,-76.47,64.15,0.0,96.77,17.330000000000002,-17.07,
    -71.86,-64.15,26.150000000000002,11.120000000000001,-76.44999999999999,63.17999999999999,98.26,17.330000000000002,0.0,
    -81.24000000000001,49.900000000000006,-29.56,92.33000000000001,17.330000000000002,-33.620000000000005,-15.03,-98.28,-8.67,
    -66.23,-64.15,38.23,-16.31,-98.28,-5.93,21.92,-76.44999999999999,60.279999999999994,
    85.09,17.330000000000002,-49.14,85.09,49.900000000000006,15.009999999999998,-63.2,-76.44999999999999,11.14,
    -33.64,93.78,5.93,32.05,-76.44999999999999,55.56,-17.09,-98.28,-3.01,
    29.540000000000003,-49.900000000000006,-81.22,-60.300000000000004,-76.44999999999999,21.939999999999998,88.10000000000001,34.129999999999995,32.08,
    -32.1,93.78,11.67,38.199999999999996,-64.15,-66.21000000000001,-17.35,-98.28,0.0,
    -55.58,-76.44999999999999,32.08,92.33000000000001,34.129999999999995,16.279999999999998,-29.580000000000002,93.78,17.07,
    26.12,-64.15,-71.84,-0.02,-99.80000000000001,0.0,64.13,76.44999999999999,0.0,
    63.150000000000006,76.44999999999999,-11.14,60.26,76.44999999999999,-21.939999999999998,13.25,-64.15,-75.28999999999999,
    55.53,76.44999999999999,-32.08,85.09,17.330000000000002,49.14,-21.96,76.44999999999999,-60.279999999999994,
    -32.1,76.44999999999999,-55.56,32.05,-76.44999999999999,-55.56,81.19,-49.900000000000006,29.56,
    92.33000000000001,17.330000000000002,33.620000000000005,21.92,-76.44999999999999,-60.279999999999994,-49.17,86.43,8.67,
    66.19,-64.15,38.23,96.77,17.330000000000002,17.07,71.82000000000001,-64.15,26.150000000000002,
    75.27,64.15,-13.280000000000001,-46.91,86.43,17.07,11.120000000000001,-76.44999999999999,-63.17999999999999,
    75.27,-64.15,13.280000000000001,76.42999999999999,64.15,0.0,-24.97,-86.43,43.209999999999994,
    -43.239999999999995,86.43,24.950000000000003,71.82000000000001,64.15,-26.150000000000002,-0.02,-98.28,-17.330000000000002,
    -17.09,-86.43,46.89,66.19,64.15,-38.23,-0.02,76.44999999999999,-64.15,
    -3.03,-98.28,-17.07,-8.69,-86.43,49.14,55.53,-76.44999999999999,32.08,
    -11.16,76.44999999999999,-63.17999999999999,-0.02,-86.43,49.900000000000006,-5.949999999999999,-98.28,-16.279999999999998,
    60.26,-76.44999999999999,21.939999999999998,-0.02,64.15,-76.44999999999999,-8.69,-98.28,-15.009999999999998,
    -11.16,76.44999999999999,63.17999999999999,63.150000000000006,-76.44999999999999,11.14,-13.3,64.15,-75.28999999999999,
    41.21000000000001,76.44999999999999,49.14,81.19,49.900000000000006,-29.56,-0.02,76.44999999999999,64.15,
    -11.16,-98.28,-13.280000000000001,49.12,76.44999999999999,41.230000000000004,-26.17,64.15,-71.84,
    49.12,64.15,58.57,49.12,-86.43,-8.67,-13.3,-98.28,-11.14,
    -38.25,64.15,-66.21000000000001,-38.25,64.15,66.21000000000001,58.54,64.15,49.14,
    -17.09,-93.78,29.56,49.88,-86.43,0.0,46.870000000000005,-86.43,-17.07,
    -26.17,64.15,71.84,-11.7,-93.78,32.08,49.12,76.44999999999999,-41.230000000000004,
    -13.3,64.15,75.28999999999999,-5.949999999999999,-93.78,33.620000000000005,43.19,49.900000000000006,74.85000000000001,
    41.21000000000001,76.44999999999999,-49.14,43.19,-86.43,-24.950000000000003,-29.580000000000002,49.900000000000006,-81.22,
    58.54,64.15,-49.14,8.64,-86.43,49.14,55.53,49.900000000000006,66.21000000000001,
    -0.02,64.15,76.44999999999999,-0.02,-93.78,34.129999999999995,49.12,64.15,-58.57,
    17.04,-86.43,46.89,-29.580000000000002,-93.78,-17.07,-32.1,-93.78,-11.67,
    66.19,49.900000000000006,55.56,24.93,-86.43,43.209999999999994,-33.64,-93.78,-5.93,
    74.83,49.900000000000006,43.209999999999994,74.83,49.900000000000006,-43.209999999999994,66.19,49.900000000000006,-55.56,
    -29.580000000000002,49.900000000000006,81.22,-34.16,-93.78,0.0,34.11,-93.78,0.0,
    33.59,-93.78,-5.93,55.53,49.900000000000006,-66.21000000000001,-41.260000000000005,76.44999999999999,-49.14,
    32.05,-93.78,-11.67,43.19,49.900000000000006,-74.85000000000001,-49.17,76.44999999999999,-41.230000000000004,
    -38.25,-86.43,32.08,29.540000000000003,-93.78,-17.07,-49.17,64.15,-58.57,
    -32.1,-86.43,38.23,43.19,-86.43,24.950000000000003,-58.59,64.15,-49.14,
    46.870000000000005,-86.43,17.07,-0.02,-93.78,-34.129999999999995,-26.17,-93.78,21.939999999999998,
    11.120000000000001,76.44999999999999,63.17999999999999,49.12,-86.43,8.67,-21.96,-93.78,26.150000000000002,
    -5.949999999999999,-93.78,-33.620000000000005,-11.7,-93.78,-32.08,21.92,76.44999999999999,60.279999999999994,
    -17.09,-93.78,-29.56,-43.239999999999995,49.900000000000006,-74.85000000000001,-32.1,76.44999999999999,55.56,
    32.05,76.44999999999999,55.56,17.310000000000002,-98.28,0.0,17.04,-98.28,-3.01,
    32.05,76.44999999999999,-55.56,16.259999999999998,-98.28,-5.93,-55.58,49.900000000000006,-66.21000000000001,
    -21.96,76.44999999999999,60.279999999999994,14.990000000000002,-98.28,-8.67,-13.3,-98.28,11.14,
    21.92,76.44999999999999,-60.279999999999994,32.05,-86.43,38.23,-11.16,-98.28,13.280000000000001,
    -66.23,49.900000000000006,-55.56,13.25,-98.28,-11.14,-8.69,-98.28,15.009999999999998,
    11.120000000000001,76.44999999999999,-63.17999999999999,38.199999999999996,-86.43,32.08,13.25,64.15,75.28999999999999,
    21.92,-93.78,26.150000000000002,11.120000000000001,-98.28,-13.280000000000001,-74.87,49.900000000000006,-43.209999999999994,
    -5.949999999999999,-98.28,16.279999999999998,26.12,64.15,71.84,26.12,-93.78,21.939999999999998,
    -3.03,-98.28,17.07,-32.1,-86.43,-38.23,8.64,-98.28,-15.009999999999998,
    38.199999999999996,64.15,66.21000000000001,-0.02,-98.28,17.330000000000002,38.199999999999996,64.15,-66.21000000000001,
    -38.25,-86.43,-32.08,-49.17,76.44999999999999,41.230000000000004,26.12,64.15,-71.84,
    5.8999999999999995,-98.28,-16.279999999999998,-21.96,-93.78,-26.150000000000002,-41.260000000000005,76.44999999999999,49.14,
    13.25,64.15,-75.28999999999999,2.9899999999999998,-98.28,-17.07,-26.17,-93.78,-21.939999999999998,
    -58.59,64.15,49.14,29.540000000000003,49.900000000000006,81.22,-49.17,64.15,58.57,
    -46.91,34.129999999999995,-81.22,-17.09,-98.28,3.01,5.8999999999999995,-93.78,33.620000000000005,
    -16.31,-98.28,5.93,-60.300000000000004,34.129999999999995,-71.84,11.65,-93.78,32.08,
    29.540000000000003,49.900000000000006,-81.22,-15.03,-98.28,8.67,-71.86,34.129999999999995,-60.279999999999994,
    -74.87,49.900000000000006,43.209999999999994,17.04,-93.78,29.56,-43.239999999999995,-86.43,-24.950000000000003,
    -81.24000000000001,34.129999999999995,-46.89,-66.23,49.900000000000006,55.56,-46.91,-86.43,-17.07,
    -49.17,-86.43,-8.67,-63.2,17.330000000000002,-75.28999999999999,-55.58,49.900000000000006,66.21000000000001,
    38.199999999999996,-86.43,-32.08,46.870000000000005,34.129999999999995,81.22,-49.92,-86.43,0.0,
    -75.31,17.330000000000002,-63.17999999999999,32.05,-86.43,-38.23,-43.239999999999995,49.900000000000006,74.85000000000001,
    60.26,34.129999999999995,71.84,26.12,-93.78,-21.939999999999998,21.92,-93.78,-26.150000000000002,
    71.82000000000001,34.129999999999995,60.279999999999994,29.540000000000003,-93.78,17.07,81.19,34.129999999999995,-46.89,
    -0.02,-86.43,-49.900000000000006,17.04,-93.78,-29.56,32.05,-93.78,11.67,
    81.19,34.129999999999995,46.89,71.82000000000001,34.129999999999995,-60.279999999999994,-8.69,-86.43,-49.14,
    -81.24000000000001,34.129999999999995,46.89,-0.02,49.900000000000006,-86.43,33.59,-93.78,5.93,
    60.26,34.129999999999995,-71.84,11.65,-93.78,-32.08,-17.09,-86.43,-46.89,
    -33.64,-93.78,5.93,-15.03,49.900000000000006,-85.12,63.150000000000006,17.330000000000002,75.28999999999999,
    46.870000000000005,34.129999999999995,-81.22,-71.86,34.129999999999995,60.279999999999994,-32.1,-93.78,11.67,
    -24.97,-86.43,-43.209999999999994,5.8999999999999995,-93.78,-33.620000000000005,75.27,17.330000000000002,63.17999999999999,
    -0.02,34.129999999999995,-93.78,-60.300000000000004,34.129999999999995,71.84,-29.580000000000002,-93.78,17.07,
    75.27,17.330000000000002,-63.17999999999999,-16.31,34.129999999999995,-92.36000000000001,-46.91,34.129999999999995,81.22,
    -32.1,34.129999999999995,-88.13000000000001,63.150000000000006,17.330000000000002,-75.28999999999999,-75.31,17.330000000000002,63.17999999999999,
    -0.02,17.330000000000002,-98.28,-63.2,17.330000000000002,75.28999999999999,-17.09,17.330000000000002,-96.79,
    2.9899999999999998,-98.28,17.07,-33.64,17.330000000000002,-92.36000000000001,5.8999999999999995,-98.28,16.279999999999998,
    -49.17,17.330000000000002,-85.12,-49.17,-86.43,8.67,8.64,-98.28,15.009999999999998,
    -0.02,-17.330000000000002,-98.28,55.53,76.44999999999999,32.08,-0.02,0.0,-99.80000000000001,
    11.120000000000001,-98.28,13.280000000000001,-63.2,76.44999999999999,11.14,-17.09,-17.330000000000002,-96.79,
    -17.35,0.0,-98.28,-46.91,-86.43,17.07,14.990000000000002,49.900000000000006,-85.12,
    -33.64,-17.330000000000002,-92.36000000000001,-34.16,0.0,-93.78,60.26,76.44999999999999,21.939999999999998,
    -60.300000000000004,76.44999999999999,21.939999999999998,-49.17,-17.330000000000002,-85.12,13.25,-98.28,11.14,
    -49.92,0.0,-86.43,-55.58,76.44999999999999,32.08,-43.239999999999995,-86.43,24.950000000000003,
    24.93,-86.43,-43.209999999999994,14.990000000000002,-98.28,8.67,63.150000000000006,76.44999999999999,11.14,
    32.05,34.129999999999995,-88.13000000000001,17.04,-86.43,-46.89,16.259999999999998,-98.28,5.93,
    -0.02,-34.129999999999995,-93.78,16.259999999999998,34.129999999999995,-92.36000000000001,-85.13999999999999,49.900000000000006,-15.009999999999998,
    8.64,-86.43,-49.14,66.19,64.15,38.23,-16.31,-34.129999999999995,-92.36000000000001,
    -75.31,64.15,13.280000000000001,17.04,-98.28,3.01,-86.44999999999999,49.900000000000006,0.0,
    -32.1,-34.129999999999995,-88.13000000000001,71.82000000000001,64.15,26.150000000000002,-71.86,64.15,26.150000000000002,
    -88.14999999999999,34.129999999999995,-32.08,-99.82,0.0,0.0,-98.31,-17.330000000000002,0.0,
    49.12,17.330000000000002,-85.12,-96.80999999999999,-17.330000000000002,17.07,-66.23,64.15,38.23,
    75.27,64.15,13.280000000000001,-92.38,34.129999999999995,-16.279999999999998,-98.31,0.0,17.330000000000002,
    -92.38,-17.330000000000002,33.620000000000005,-93.80000000000001,0.0,34.129999999999995,33.59,17.330000000000002,-92.36000000000001,
    -85.13999999999999,-17.330000000000002,49.14,49.12,-17.330000000000002,-85.12,49.88,0.0,-86.43,
    -93.80000000000001,34.129999999999995,0.0,33.59,-17.330000000000002,-92.36000000000001,34.11,0.0,-93.78,
    -86.44999999999999,0.0,49.900000000000006,17.04,17.330000000000002,-96.79,-85.13999999999999,17.330000000000002,-49.14,
    17.04,-17.330000000000002,-96.79,-81.24000000000001,49.900000000000006,29.56,81.19,49.900000000000006,29.56,
    -92.38,-34.129999999999995,16.279999999999998,17.310000000000002,0.0,-98.28,-92.38,17.330000000000002,-33.620000000000005,
    -93.80000000000001,-34.129999999999995,0.0,-49.17,-17.330000000000002,85.12,-88.14999999999999,-34.129999999999995,32.08,
    -33.64,-17.330000000000002,92.36000000000001,-0.02,-49.900000000000006,-86.43,-96.80999999999999,17.330000000000002,-17.07,
    32.05,-34.129999999999995,-88.13000000000001,-15.03,-49.900000000000006,-85.12,16.259999999999998,-34.129999999999995,-92.36000000000001,
    -98.31,17.330000000000002,0.0,-17.09,-17.330000000000002,96.79,-86.44999999999999,0.0,-49.900000000000006,
    -86.44999999999999,-49.900000000000006,0.0,-85.13999999999999,-49.900000000000006,15.009999999999998,-85.13999999999999,49.900000000000006,15.009999999999998,
    -93.80000000000001,0.0,-34.129999999999995,-15.03,49.900000000000006,85.12,-92.38,34.129999999999995,16.279999999999998,
    -98.31,0.0,-17.330000000000002,14.990000000000002,-49.900000000000006,-85.12,-88.14999999999999,34.129999999999995,32.08,
    -0.02,49.900000000000006,86.43,-96.80999999999999,17.330000000000002,17.07,96.77,-17.330000000000002,-17.07,
    -92.38,17.330000000000002,33.620000000000005,-81.24000000000001,-49.900000000000006,-29.56,-16.31,-34.129999999999995,92.36000000000001,
    -85.13999999999999,17.330000000000002,49.14,-85.13999999999999,-17.330000000000002,-49.14,-66.23,-64.15,-38.23,
    -15.03,98.28,-8.67,-92.38,-17.330000000000002,-33.620000000000005,-16.31,98.28,-5.93,
    -17.09,98.28,-3.01,-96.80999999999999,-17.330000000000002,-17.07,-88.14999999999999,-34.129999999999995,-32.08,
    -92.38,-34.129999999999995,-16.279999999999998,-55.58,-76.44999999999999,-32.08,-85.13999999999999,-49.900000000000006,-15.009999999999998,
    -71.88,3.4799999999999995,-7.99,-72.75999999999999,2.96,-7.880000000000001,-81.08000000000001,15.29,17.88,
    -84.46,22.14,5.0,-87.23,10.53,17.0,-115.48,-12.350000000000001,-1.5,
    -120.13999999999999,-16.56,0.03,-112.49000000000001,-3.85,5.0,-113.38,-15.46,-2.5,
    -118.53,-18.939999999999998,-0.74,-111.28,-18.57,-1.5,-90.07,14.74,11.93,
    -111.80999999999999,-4.859999999999999,0.42999999999999994,-84.88,-4.069999999999999,16.25,-121.74,-14.18,5.0,
    -109.94,-7.63,-2.9099999999999997,-83.46000000000001,13.46,17.549999999999997,-102.28,-18.990000000000002,5.0,
    -107.38,-11.419999999999998,-4.13,-117.01,-10.08,8.75,-86.41999999999999,17.86,12.24,
    -76.65,-5.16,11.93,-95.00999999999999,-15.87,5.0,-95.81,-14.690000000000001,10.3,
    -117.57999999999998,-9.25,5.0,-104.83000000000001,-15.2,-2.9099999999999997,-79.48,-0.96,17.0,
    -117.01,-10.08,1.25,-109.75,-20.85,8.75,-72.39,-2.9499999999999997,12.24,
    -97.98,-11.47,14.190000000000001,-109.19,-21.68,5.0,-109.75,-20.85,1.25,
    -84.12,19.810000000000002,12.44,-103.91,-2.68,-4.1899999999999995,-83.34,20.470000000000002,12.5,
    -80.27,15.920000000000002,17.99,-88.75,-11.28,10.95,-94.80000000000001,10.64,-1.5,
    -87.85,-12.6,5.0,-90.07,14.74,-1.9300000000000002,-111.28,-18.57,11.5,
    -87.23,10.53,-7.0,-91.11000000000001,16.279999999999998,5.0,-102.96,-17.97,9.57,
    -123.57,-19.990000000000002,8.36,-86.41999999999999,17.86,-2.24,-83.46000000000001,13.46,-7.55,
    -124.36,-18.82,6.9399999999999995,-104.83000000000001,-15.2,12.91,-87.50999999999999,19.46,5.0,
    -124.66,-18.380000000000003,5.0,-107.38,-11.419999999999998,14.13,-124.36,-18.82,3.06,
    -84.12,19.810000000000002,-2.44,-100.95,-7.08,-5.61,-123.57,-19.990000000000002,1.6400000000000001,
    -83.34,20.470000000000002,-2.5,-97.98,-11.47,-4.1899999999999995,-102.96,-17.97,0.42999999999999994,
    -120.60000000000001,-24.39,6.9399999999999995,-94.80000000000001,10.64,11.5,-95.81,-14.690000000000001,-0.3,
    -121.4,-23.21,8.36,-95.77,12.08,5.0,-122.47999999999999,-21.6,8.88,
    -100.27,5.81,-0.95,-94.51,-2.7300000000000004,-6.8999999999999995,-115.75,-23.060000000000002,7.87,
    -124.02,-24.689999999999998,5.9799999999999995,-97.84,2.2,-5.3100000000000005,-124.42,-24.089999999999996,6.7,
    -97.84,2.2,15.309999999999999,-91.18,-7.67,-5.3100000000000005,-124.97,-23.279999999999998,6.959999999999999,
    -116.92999999999999,-21.32,9.97,-125.52,-22.47,6.7,-100.27,5.81,10.95,
    -88.75,-11.28,-0.95,-125.92,-21.869999999999997,5.9799999999999995,-118.53,-18.939999999999998,10.74,
    -101.16,7.13,5.0,-75.36,1.45,17.549999999999997,-92.14,6.7,-6.25,
    -88.51,1.31,17.99,-88.51,1.31,-7.99,-79.41,7.45,19.490000000000002,
    -92.14,6.7,16.25,-113.38,-15.46,12.5,-83.36,4.79,-8.86,
    -84.88,-4.069999999999999,-6.25,-115.48,-12.350000000000001,11.5,-72.75999999999999,2.96,17.88,
    -82.22,-8.01,-1.5,-83.36,4.79,18.86,-76.92,9.13,19.87,
    -71.88,3.4799999999999995,17.99,-76.07000000000001,9.7,20.0,-125.82000000000001,-23.849999999999998,5.0,
    -123.87,-24.900000000000002,5.0,-106.08000000000001,0.54,10.3,-126.06,-21.66,5.0,
    -106.88000000000001,1.7199999999999998,5.0,-125.92,-21.869999999999997,4.0200000000000005,-109.94,-7.63,12.91,
    -125.52,-22.47,3.3000000000000003,-124.97,-23.279999999999998,3.04,-120.13999999999999,-16.56,9.97,
    -124.42,-24.089999999999996,3.3000000000000003,-124.02,-24.689999999999998,4.0200000000000005,-111.80999999999999,-4.859999999999999,9.57,
    -69.72,-1.55,12.44,-121.31,-14.82,7.87,-68.81,-1.07,12.5,
    -76.07000000000001,9.7,5.0,-81.25,-9.459999999999999,5.0,-103.91,-2.68,14.190000000000001,
    -106.08000000000001,0.54,-0.3,-75.61,-6.7,5.0,-121.31,-14.82,2.13,
    -71.3,-4.5600000000000005,5.0,-79.41,7.45,-9.49,-100.95,-7.08,15.61,
    -75.36,1.45,-7.55,-68.61,-3.2,5.0,-81.08000000000001,15.29,-7.880000000000001,
    -80.27,15.920000000000002,-7.99,-91.18,-7.67,15.309999999999999,-76.92,9.13,-9.87,
    -94.51,-2.7300000000000004,16.9,-76.07000000000001,9.7,-10.0,-120.31,-24.82,5.0,
    -122.47999999999999,-21.6,1.12,-67.69,-2.7300000000000004,5.0,-121.4,-23.21,1.6400000000000001,
    -120.60000000000001,-24.39,3.06,-79.48,-0.96,-7.0,-82.22,-8.01,11.5,
    -76.65,-5.16,-1.9300000000000002,-115.32,-23.700000000000003,5.0,-72.39,-2.9499999999999997,-2.24,
    -69.72,-1.55,-2.44,-116.92999999999999,-21.32,0.03,-68.81,-1.07,-2.5,
    -115.75,-23.060000000000002,2.13,-85.24,21.46,5.0,128.49,-19.75,6.7,
    128.85,-19.13,5.9799999999999995,128.89,-21.110000000000003,5.0,128.01,-20.6,3.04,
    119.14999999999999,-7.98,8.75,83.42,20.139999999999997,12.5,121.28,-16.71,-0.74,
    76.92999999999999,8.89,-10.0,112.65,-19.23,8.75,91.03,-11.15,-0.95,
    98.32000000000001,-14.059999999999999,-0.3,127.52000000000001,-21.44,3.3000000000000003,77.81,8.379999999999999,-9.87,
    127.16,-22.06,4.0200000000000005,81.53,14.82,-7.880000000000001,127.03,-22.29,5.0,
    125.41,-19.099999999999998,8.88,117.78,-10.36,-1.5,123.47,-22.46,5.0,
    119.65,-7.109999999999999,5.0,126.38,-17.42,8.36,124.44000000000001,-20.779999999999998,1.6400000000000001,
    127.09,-16.19,6.9399999999999995,123.72999999999999,-22.01,3.06,122.72,-14.23,0.03,
    115.9,-13.61,-2.5,80.41,6.879999999999999,-9.49,99.16,2.9299999999999997,15.309999999999999,
    76.79,0.61,-7.55,74.1,1.94,-7.880000000000001,119.14999999999999,-7.98,1.25,
    101.34,6.7,10.95,114.03,-16.86,-1.5,102.14,8.08,5.0,
    73.17999999999999,2.4,-7.99,113.59,-3.14,9.57,89.92000000000002,1.3900000000000001,17.99,
    114.2,-2.08,5.0,107.35,-13.94,-2.9099999999999997,93.17,7.02,16.25,
    113.59,-3.14,0.42999999999999994,123.77000000000001,-12.41,7.87,107.5,1.85,10.3,
    78.54,-5.89,11.93,77.61,-7.5,5.0,96.19,-2.23,-6.8999999999999995,
    84.54,4.5,18.86,86.67,-4.2299999999999995,-6.25,93.21,-7.38,-5.3100000000000005,
    84.29,-8.35,-1.5,81.07,-1.5,17.0,74.14,-3.9800000000000004,12.24,
    128.98,-18.9,5.0,73.17,-5.659999999999999,5.0,109.63,-9.99,14.13,
    128.85,-19.13,4.0200000000000005,128.49,-19.75,3.3000000000000003,108.21,3.08,5.0,
    127.35,-15.74,5.0,111.92,-6.04,12.91,81.53,14.82,17.88,
    107.5,1.85,-0.3,127.09,-16.19,3.06,80.67999999999999,15.389999999999999,17.99,
    102.91,-6.109999999999999,15.61,126.38,-17.42,1.6400000000000001,71.36999999999999,-2.7700000000000005,12.44,
    70.38,-4.5,5.0,95.54,11.14,-1.5,105.55999999999999,-1.51,14.190000000000001,
    90.54,14.89,-1.9300000000000002,125.41,-19.099999999999998,1.12,88.0,10.5,-7.0,
    70.43,-2.36,12.5,124.14999999999999,-11.739999999999998,5.0,86.67999999999999,17.75,-2.24,
    123.77000000000001,-12.41,2.13,84.03,13.16,-7.55,93.21,-7.38,15.309999999999999,
    76.79,0.61,17.549999999999997,119.85,-19.2,0.03,80.41,6.879999999999999,19.490000000000002,
    84.25,19.54,-2.44,121.28,-16.71,10.74,74.1,1.94,17.88,
    114.03,-16.86,11.5,83.42,20.139999999999997,-2.5,69.42999999999999,-4.1,5.0,
    115.9,-13.61,12.5,77.81,8.379999999999999,19.87,76.92999999999999,8.89,20.0,
    85.25,21.259999999999998,5.0,117.78,-10.36,11.5,127.16,-22.06,5.9799999999999995,
    127.52000000000001,-21.44,6.7,128.01,-20.6,6.959999999999999,84.42999999999999,21.880000000000003,5.0,
    81.07,-1.5,-7.0,78.54,-5.89,-1.9300000000000002,123.72999999999999,-22.01,6.9399999999999995,
    101.34,6.7,-0.95,95.54,11.14,11.5,73.17999999999999,2.4,17.99,
    119.85,-19.2,9.97,124.44000000000001,-20.779999999999998,8.36,74.14,-3.9800000000000004,-2.24,
    96.41,12.64,5.0,99.16,2.9299999999999997,-5.3100000000000005,122.72,-14.23,9.97,
    93.17,7.02,-6.25,89.92000000000002,1.3900000000000001,-7.99,96.19,-2.23,16.9,
    88.0,10.5,17.0,112.65,-19.23,1.25,84.54,4.5,-8.86,
    90.54,14.89,11.93,91.47,16.5,5.0,84.29,-8.35,11.5,
    83.42,-9.86,5.0,84.03,13.16,17.549999999999997,112.15,-20.099999999999998,5.0,
    86.67999999999999,17.75,12.24,86.67,-4.2299999999999995,16.25,87.65,19.43,5.0,
    105.67999999999999,-16.84,9.57,84.25,19.54,12.44,105.07,-17.9,5.0,
    107.35,-13.94,12.91,105.67999999999999,-16.84,0.42999999999999994,71.36999999999999,-2.7700000000000005,-2.44,
    70.43,-2.36,-2.5,98.32000000000001,-14.059999999999999,10.3,97.60999999999999,-15.29,5.0,
    100.25999999999999,-10.700000000000001,14.190000000000001,91.03,-11.15,10.95,118.80000000000001,-21.02,7.87,
    118.41,-21.69,5.0,90.24,-12.53,5.0,118.80000000000001,-21.02,2.13,
    100.25999999999999,-10.700000000000001,-4.1899999999999995,111.92,-6.04,-2.9099999999999997,109.63,-9.99,-4.13,
    105.55999999999999,-1.51,-4.1899999999999995,102.91,-6.109999999999999,-5.61,76.92999999999999,8.89,5.0,
    80.67999999999999,15.389999999999999,-7.99,0.0,14.379999999999999,120.47,0.0,-15.0,72.5,
    35.0,14.379999999999999,72.5,0.0,43.769999999999996,72.5,-35.0,14.379999999999999,72.5,
    ];
  bilibili2_faces = [4,9,2,5,2,9,16,12,13,
    3,17,18,3,18,0,19,24,25,
    0,18,31,38,17,37,25,23,19,
    17,38,18,24,19,44,18,45,31,
    18,38,45,19,49,44,729,112,119,
    32,134,41,43,44,49,36,34,51,
    31,45,48,37,52,38,43,683,44,
    36,51,53,55,52,37,44,702,24,
    683,702,44,53,51,56,38,52,57,
    21,126,32,162,50,54,38,57,45,
    45,57,59,58,43,49,45,59,48,
    15,53,56,138,11,41,62,63,65,
    138,10,11,28,27,66,34,47,300,
    68,74,67,74,75,67,71,67,75,
    61,76,168,63,77,65,27,82,66,
    51,34,80,28,66,85,207,61,168,
    71,75,87,86,87,75,78,49,77,
    49,65,77,49,78,58,79,26,88,
    80,132,51,28,85,40,60,469,93,
    86,75,95,95,98,94,40,85,97,
    65,92,62,60,93,69,152,83,73,
    98,95,75,93,99,81,93,81,69,
    109,85,66,51,132,56,92,65,91,
    83,158,90,142,84,81,132,136,56,
    212,91,65,46,40,97,142,148,84,
    95,207,86,84,148,129,97,736,46,
    103,94,98,66,82,315,99,93,105,
    100,105,93,153,8,29,82,257,315,
    101,106,102,105,102,99,107,108,110,
    12,112,13,496,49,19,102,106,115,
    114,98,113,106,116,115,15,117,104,
    98,114,103,130,106,101,109,66,315,
    13,112,729,56,117,15,98,110,113,
    85,109,738,112,12,133,30,121,21,
    115,116,122,111,104,120,117,120,104,
    330,109,315,108,113,110,122,123,125,
    30,124,121,96,118,1,116,123,122,
    482,497,101,85,738,97,110,128,107,
    97,739,736,497,130,101,21,121,126,
    106,131,116,129,133,12,32,126,134,
    234,233,96,49,499,65,322,127,110,
    110,127,128,130,131,106,131,135,116,
    136,117,56,112,137,119,41,134,138,
    120,136,139,134,126,161,8,140,7,
    112,133,137,116,135,123,120,117,136,
    161,138,134,7,140,96,120,139,143,
    130,497,563,81,99,142,75,591,98,
    138,145,10,144,131,130,10,146,70,
    143,621,120,145,146,10,49,496,499,
    144,130,563,142,115,148,144,150,131,
    70,149,73,75,587,591,159,163,132,
    146,149,70,148,151,129,499,713,65,
    131,150,135,163,136,132,149,152,73,
    8,153,140,148,122,151,65,713,212,
    136,166,139,129,151,133,133,155,137,
    151,155,133,153,29,156,39,156,29,
    83,152,158,102,142,99,39,50,182,
    102,115,142,39,182,156,159,132,80,
    124,161,121,110,595,540,50,162,182,
    126,121,161,110,540,322,115,122,148,
    122,125,151,207,162,54,151,125,155,
    173,177,160,161,145,138,159,175,163,
    160,177,164,161,146,145,683,78,77,
    54,61,207,163,166,136,161,149,146,
    92,681,62,139,169,143,161,152,149,
    157,164,167,139,166,169,58,683,43,
    78,683,58,161,158,152,171,172,2,
    172,171,174,108,107,182,128,182,107,
    175,178,166,175,166,163,172,174,179,
    179,174,180,270,169,166,192,174,171,
    114,162,103,94,103,162,181,176,183,
    169,270,275,180,184,179,177,185,164,
    183,176,226,55,184,188,77,63,681,
    184,180,188,186,187,190,227,240,171,
    176,191,226,164,185,167,128,127,182,
    191,176,194,167,195,170,192,171,240,
    178,175,193,189,193,175,87,207,71,
    185,195,167,174,196,180,194,176,241,
    178,193,288,174,192,196,180,196,198,
    241,176,247,702,89,20,176,202,247,
    180,198,188,200,201,205,192,240,254,
    578,173,365,176,206,76,206,176,181,
    173,580,177,209,196,192,199,203,204,
    212,208,210,578,580,173,186,190,211,
    254,209,192,91,212,210,199,204,197,
    196,209,213,190,205,211,201,211,205,
    87,86,207,196,213,198,68,67,168,
    208,212,223,200,205,218,214,219,217,
    203,199,219,215,216,221,199,217,219,
    205,280,218,220,224,193,220,193,189,
    216,223,221,222,227,2,222,2,5,
    221,223,212,219,140,203,171,2,227,
    278,680,218,215,221,229,191,272,226,
    291,229,221,224,220,236,231,236,220,
    224,236,237,214,217,234,194,141,191,
    227,222,238,235,238,222,227,238,240,
    272,191,141,233,234,217,194,147,141,
    232,252,239,244,242,243,225,17,3,
    241,147,194,225,239,17,243,245,244,
    230,312,235,165,147,241,244,245,217,
    217,245,233,235,318,238,246,179,248,
    218,650,200,236,319,237,241,247,165,
    22,249,6,247,202,154,252,232,248,
    251,244,250,244,6,250,249,250,6,
    254,240,327,244,251,242,154,165,247,
    229,583,215,187,186,651,211,651,186,
    76,206,277,258,206,181,150,261,262,
    206,258,277,259,254,327,294,181,183,
    588,91,210,223,588,208,210,208,588,
    260,275,282,254,265,209,260,282,263,
    262,261,274,258,181,294,254,259,265,
    588,681,91,92,91,681,209,266,213,
    183,267,294,63,62,681,255,268,257,
    209,265,266,253,655,264,255,263,268,
    267,183,226,305,253,271,264,271,253,
    226,272,267,270,166,178,261,273,274,
    256,269,276,269,508,276,76,277,168,
    260,169,275,262,279,264,280,278,218,
    244,217,677,274,279,262,256,276,259,
    244,489,6,259,276,283,275,270,290,
    264,281,271,275,293,282,279,281,264,
    263,286,268,259,283,265,281,356,271,
    263,282,286,265,287,266,284,285,280,
    265,283,287,178,288,270,280,285,278,
    473,471,277,677,489,244,229,291,289,
    270,288,290,284,280,292,273,598,274,
    22,89,249,88,598,273,289,606,229,
    280,299,292,293,275,290,295,292,299,
    245,96,233,296,297,291,282,293,298,
    297,289,291,282,298,286,251,118,242,
    281,279,604,242,118,243,119,300,47,
    34,300,80,296,291,302,137,303,119,
    119,303,300,301,302,304,291,304,302,
    204,203,140,300,307,80,303,307,300,
    159,80,307,228,310,231,155,311,137,
    305,310,228,197,204,140,295,299,309,
    715,272,141,302,606,296,137,311,303,
    312,230,306,231,310,236,313,236,310,
    303,317,307,309,299,308,311,317,303,
    319,236,313,235,312,318,314,316,322,
    307,323,159,257,268,325,328,324,326,
    238,318,327,317,323,307,268,286,333,
    323,175,159,268,333,325,248,184,252,
    257,325,315,301,304,321,320,321,304,
    127,322,316,248,179,184,155,329,311,
    237,319,157,315,325,330,327,240,238,
    239,37,17,125,329,155,239,252,37,
    329,334,311,4,2,172,271,335,305,
    271,356,335,311,334,317,336,337,338,
    4,172,246,305,335,310,344,331,332,
    306,398,340,334,339,317,325,342,330,
    317,339,323,313,310,343,335,343,310,
    325,333,342,179,246,172,306,340,312,
    313,160,319,337,341,338,320,304,341,
    323,189,175,330,342,345,340,346,318,
    340,318,312,339,189,323,318,256,327,
    348,349,351,313,343,160,286,350,333,
    319,160,164,338,341,304,319,164,157,
    344,347,322,318,346,256,348,351,353,
    314,322,347,286,298,350,327,256,259,
    308,299,352,326,352,328,353,357,358,
    332,347,344,333,350,359,351,357,353,
    333,359,342,354,355,364,328,352,299,
    358,361,362,356,365,343,356,343,335,
    342,359,366,331,344,360,342,366,345,
    343,173,160,357,361,358,345,366,5,
    365,173,343,55,188,371,363,369,346,
    363,346,340,197,360,199,199,360,344,
    346,269,256,55,371,52,368,338,367,
    355,367,364,373,57,52,52,371,373,
    346,369,269,370,372,375,374,59,57,
    57,373,374,364,367,338,368,336,338,
    349,376,351,221,212,714,360,153,331,
    188,380,371,378,328,377,372,377,375,
    381,376,349,193,379,288,380,188,198,
    376,382,351,371,380,383,378,324,328,
    375,377,328,193,224,379,371,383,373,
    288,379,385,373,383,425,351,382,357,
    373,425,374,382,487,357,288,385,290,
    290,385,386,380,198,387,384,398,306,
    198,213,387,384,394,398,293,290,386,
    357,487,361,293,388,298,293,386,388,
    170,195,403,224,237,379,170,403,389,
    385,379,391,376,381,390,391,379,237,
    381,393,390,385,392,386,726,338,304,
    385,391,392,386,392,397,395,399,396,
    252,184,55,252,55,37,396,399,400,
    386,397,388,399,402,400,408,399,395,
    237,157,391,400,402,405,405,349,348,
    402,349,405,542,344,322,406,392,391,
    389,407,394,199,344,669,389,403,407,
    157,406,391,399,411,402,394,412,398,
    408,411,399,392,406,413,411,381,402,
    390,414,376,404,409,410,407,412,394,
    406,167,170,402,381,349,398,412,363,
    382,376,414,430,501,408,392,413,397,
    415,411,408,157,167,406,501,415,408,
    415,393,411,413,406,170,398,363,340,
    332,331,153,153,360,140,415,418,393,
    411,393,381,657,403,195,415,510,418,
    59,374,419,417,416,26,197,140,360,
    420,393,418,403,657,661,419,421,59,
    419,423,424,419,424,421,424,395,396,
    395,424,423,393,420,390,403,661,407,
    367,355,574,354,574,355,332,153,347,
    156,347,153,374,426,419,420,427,390,
    574,596,367,374,425,426,375,328,27,
    426,429,423,420,418,435,423,419,426,
    429,430,423,577,321,320,577,320,341,
    156,127,316,156,316,314,314,347,156,
    423,430,395,414,390,427,430,408,395,
    368,596,336,328,615,27,156,182,127,
    337,336,596,427,431,414,298,388,433,
    114,113,162,182,162,113,577,302,301,
    321,577,301,418,434,435,113,108,182,
    404,410,401,298,433,350,297,296,606,
    606,302,577,564,561,436,437,359,350,
    350,433,437,383,438,425,297,606,289,
    425,443,426,420,444,427,404,440,409,
    404,446,440,439,440,446,425,438,443,
    442,366,359,435,444,420,95,94,162,
    426,443,429,445,429,443,445,449,429,
    442,359,437,427,448,431,162,207,95,
    366,442,222,429,449,430,444,448,427,
    448,546,431,451,452,453,207,168,67,
    438,454,443,5,366,222,454,456,445,
    454,445,443,451,453,450,388,457,433,
    445,502,449,67,71,207,453,458,450,
    397,457,388,433,457,462,250,249,89,
    465,452,464,461,466,456,461,456,454,
    161,455,447,161,463,455,118,251,250,
    118,250,89,459,460,446,439,446,460,
    611,613,435,452,465,453,118,96,245,
    453,467,458,433,462,437,417,161,416,
    435,613,444,465,467,453,437,462,230,
    380,387,468,422,416,161,458,469,60,
    387,477,468,472,470,471,467,469,458,
    444,616,448,245,243,118,468,383,380,
    161,428,422,438,383,468,462,306,230,
    161,432,428,468,480,438,464,353,465,
    161,436,432,219,214,96,234,96,214,
    459,446,473,437,230,442,161,441,436,
    213,266,474,442,235,222,219,96,140,
    442,230,235,161,447,441,348,353,464,
    474,387,213,446,472,473,362,361,475,
    387,474,477,353,358,465,474,485,477,
    397,476,457,471,473,472,465,358,467,
    475,100,362,358,362,467,397,413,476,
    475,482,105,475,105,100,480,468,477,
    467,362,469,480,454,438,457,476,384,
    484,266,287,105,101,102,469,100,93,
    68,481,74,101,105,482,484,474,266,
    362,100,469,486,74,481,485,474,484,
    489,491,6,476,394,384,477,490,480,
    292,680,284,285,284,680,457,384,462,
    485,490,477,361,493,475,480,490,461,
    285,680,278,491,19,6,361,487,493,
    483,455,492,462,384,306,480,461,454,
    482,475,495,493,495,475,491,496,19,
    495,497,482,413,170,389,377,372,154,
    372,370,154,154,676,377,541,490,485,
    509,518,494,476,413,389,494,518,500,
    309,308,670,352,670,308,394,476,389,
    479,452,451,378,676,324,326,324,676,
    430,449,501,500,452,479,363,532,369,
    521,493,487,564,436,441,369,537,504,
    456,502,445,670,292,295,309,670,295,
    502,505,449,504,269,369,447,483,478,
    525,495,493,501,449,505,478,441,447,
    415,501,510,508,269,504,505,510,501,
    354,364,506,364,511,506,507,506,511,
    483,447,455,503,400,509,495,526,497,
    396,400,503,276,513,283,491,489,512,
    488,472,486,502,456,514,382,414,515,
    463,492,455,276,508,513,466,514,456,
    502,514,516,283,513,517,492,463,498,
    488,470,472,74,486,472,515,487,382,
    489,520,512,502,516,505,512,522,491,
    505,516,523,515,521,487,283,517,287,
    505,523,510,500,464,452,510,434,418,
    510,523,434,521,525,493,518,464,500,
    506,574,354,526,495,525,504,553,508,
    491,522,496,508,553,559,566,514,466,
    522,530,496,511,528,529,514,570,516,
    566,570,514,545,522,512,559,513,508,
    509,405,518,529,507,511,30,517,513,
    434,523,576,414,431,515,26,416,519,
    496,530,499,287,531,484,528,511,534,
    431,535,515,400,405,509,511,538,534,
    517,531,287,431,546,535,405,348,518,
    484,531,536,519,422,524,515,535,521,
    518,348,464,533,534,538,537,369,532,
    536,485,484,485,536,541,535,539,525,
    535,525,521,499,530,717,416,422,519,
    536,41,541,428,524,422,524,428,527,
    461,490,589,450,512,520,534,665,528,
    428,432,527,490,541,589,520,451,450,
    527,432,561,543,547,537,543,537,532,
    517,21,531,548,533,538,432,436,561,
    537,550,504,517,30,21,542,540,549,
    544,549,540,537,547,550,546,552,539,
    546,539,535,545,512,450,531,32,536,
    32,531,21,551,554,356,555,556,557,
    719,522,545,536,32,41,553,504,550,
    560,538,558,530,522,719,538,560,548,
    530,720,717,553,610,559,604,561,551,
    719,720,530,556,558,557,561,564,554,
    561,554,551,545,450,458,566,466,592,
    526,563,497,557,558,538,559,30,513,
    564,478,554,557,190,568,549,544,567,
    565,567,544,458,60,545,571,526,525,
    567,572,549,557,569,555,573,523,516,
    539,571,525,526,571,575,564,441,478,
    647,596,623,570,573,516,187,568,190,
    557,568,569,573,576,523,547,603,550,
    547,602,603,563,526,575,365,554,578,
    562,642,648,554,478,578,144,563,579,
    565,562,648,575,579,563,144,261,150,
    565,648,567,652,567,648,566,73,570,
    579,261,144,73,83,570,177,581,185,
    177,580,581,539,582,571,185,581,584,
    538,511,53,83,573,570,552,582,539,
    83,90,573,74,586,587,582,585,571,
    581,498,584,573,90,576,185,584,195,
    124,30,559,587,75,74,578,483,580,
    592,466,461,589,592,461,571,585,575,
    478,483,578,585,594,575,580,483,492,
    595,110,98,623,596,574,486,277,488,
    580,492,581,98,591,595,541,41,11,
    460,459,258,473,258,459,581,492,498,
    575,594,579,579,273,261,11,589,541,
    594,273,579,470,277,471,11,10,592,
    11,592,589,595,544,540,368,367,596,
    470,488,277,566,592,70,10,70,592,
    341,596,577,460,258,439,440,439,258,
    598,599,274,557,104,190,440,294,409,
    566,70,73,64,582,552,586,601,587,
    547,543,602,582,72,585,341,337,596,
    599,279,274,64,72,582,104,111,190,
    599,604,279,605,601,586,601,607,587,
    68,168,481,486,481,168,550,608,553,
    585,79,594,556,555,660,569,660,555,
    486,168,277,72,79,585,79,88,594,
    356,281,551,560,654,548,533,548,654,
    473,277,258,587,607,591,529,528,665,
    608,550,603,551,281,604,607,609,591,
    594,88,273,610,553,608,554,365,356,
    216,215,583,606,583,229,529,665,507,
    434,611,435,519,598,88,190,111,205,
    88,26,519,611,434,576,612,280,205,
    595,591,609,599,598,524,205,111,612,
    559,610,124,519,524,598,612,614,280,
    440,258,294,612,625,614,527,599,524,
    609,544,595,223,216,588,583,588,216,
    280,614,299,615,299,614,605,0,601,
    599,527,604,613,616,444,527,561,604,
    605,3,0,161,590,463,328,299,615,
    125,123,620,593,590,161,111,120,621,
    622,617,618,619,607,601,161,597,593,
    621,612,111,176,647,623,620,329,125,
    448,694,546,161,600,597,329,624,334,
    601,0,619,161,602,600,625,612,621,
    616,694,448,620,624,329,647,176,626,
    161,603,602,619,562,607,614,628,615,
    334,627,339,626,176,631,161,608,603,
    641,611,576,614,625,628,624,627,334,
    576,90,641,161,610,608,82,615,628,
    631,176,659,627,220,339,634,629,630,
    617,622,635,611,646,613,161,124,610,
    607,562,609,659,176,633,609,565,544,
    27,615,82,339,220,189,609,562,565,
    633,176,639,621,636,625,619,0,31,
    621,143,636,123,638,620,639,176,667,
    625,636,255,649,616,613,638,123,135,
    635,634,630,636,263,255,667,176,674,
    638,640,620,255,628,625,255,257,628,
    622,634,635,176,644,674,628,257,82,
    642,562,619,169,260,143,620,640,624,
    629,634,645,634,404,645,143,260,636,
    31,642,619,640,228,624,263,636,260,
    641,646,611,649,613,646,401,645,404,
    590,632,498,642,656,648,498,463,590,
    624,228,627,637,632,593,627,231,220,
    577,647,626,629,645,267,630,629,267,
    294,267,645,228,231,627,567,653,572,
    632,590,593,90,662,641,652,653,567,
    294,645,401,637,593,597,638,135,655,
    635,630,267,643,637,597,494,572,653,
    150,655,135,643,597,600,577,596,647,
    641,663,646,253,638,655,31,48,642,
    643,600,543,656,642,48,626,631,606,
    600,602,543,201,200,650,577,626,606,
    666,649,646,656,658,652,656,652,648,
    640,638,253,583,606,631,211,201,651,
    650,651,201,653,652,503,568,187,651,
    584,657,195,253,305,640,658,503,652,
    651,660,568,569,568,660,503,509,653,
    640,305,228,659,583,631,560,558,654,
    558,660,654,653,509,494,90,158,662,
    410,409,294,421,656,48,558,556,660,
    633,588,583,48,59,421,150,262,655,
    534,533,654,407,661,664,262,264,655,
    659,633,583,658,656,424,421,424,656,
    641,662,663,664,412,407,534,654,665,
    424,396,658,666,646,663,532,363,412,
    658,396,503,412,664,532,665,574,506,
    410,294,401,584,632,657,540,542,322,
    584,498,632,506,507,665,272,635,267,
    637,661,657,637,657,632,666,668,649,
    637,643,661,643,664,661,664,643,543,
    635,272,617,715,618,272,617,272,618,
    664,543,532,676,695,670,649,668,33,
    22,6,20,23,20,19,19,20,6,
    542,669,344,35,33,671,668,671,33,
    199,669,672,35,673,42,680,686,650,
    671,673,35,199,672,217,672,677,217,
    673,675,42,89,674,644,378,377,676,
    352,676,670,352,326,676,542,549,679,
    698,147,165,678,417,14,292,670,680,
    680,650,218,542,679,669,639,681,633,
    14,417,26,669,682,672,588,633,681,
    158,161,662,176,695,202,679,682,669,
    681,639,683,161,663,662,695,176,684,
    684,176,686,667,683,639,161,666,663,
    686,176,700,161,668,666,672,688,677,
    689,700,176,161,671,668,370,375,685,
    375,690,685,687,685,690,161,673,671,
    689,176,691,682,688,672,691,176,704,
    161,675,673,704,176,706,161,678,675,
    688,520,677,623,706,176,161,417,678,
    202,676,154,702,674,89,676,202,695,
    692,693,690,552,546,696,694,696,546,
    695,684,670,696,64,552,489,677,520,
    693,687,690,549,572,679,680,684,686,
    699,682,679,670,684,680,681,683,77,
    697,698,701,649,33,616,701,698,690,
    692,690,698,679,572,699,650,686,700,
    33,694,616,699,479,682,651,650,700,
    689,651,700,33,35,696,33,696,694,
    667,702,683,696,42,64,689,691,660,
    674,702,667,651,689,660,35,42,696,
    654,660,691,699,500,479,698,165,692,
    64,703,72,691,704,654,25,24,702,
    479,688,682,42,703,64,704,665,654,
    479,451,688,705,697,701,703,14,72,
    22,20,89,688,451,520,665,704,706,
    42,675,703,707,708,709,706,623,574,
    675,678,703,23,702,20,703,678,14,
    699,572,494,665,706,574,14,79,72,
    25,702,23,36,364,712,712,34,36,
    712,47,34,499,717,713,711,701,710,
    705,701,711,364,36,511,494,500,699,
    14,26,79,36,53,511,15,557,538,
    709,710,701,713,714,212,538,53,15,
    176,1,644,710,709,708,15,104,557,
    618,715,622,709,716,707,1,176,7,
    715,709,622,7,176,8,709,715,716,
    714,713,718,717,718,713,27,28,375,
    8,176,29,690,375,28,40,701,690,
    176,39,29,39,176,50,50,176,54,
    690,28,40,61,54,176,46,709,701,
    61,176,76,644,118,89,718,717,721,
    720,721,717,721,722,718,46,701,40,
    644,1,118,718,722,16,722,12,16,
    545,60,719,1,7,96,60,69,719,
    710,141,147,710,147,711,719,69,720,
    141,710,708,69,81,721,69,721,720,
    705,147,697,711,147,705,698,697,147,
    722,721,84,693,692,165,81,84,721,
    685,165,154,685,154,370,84,129,722,
    722,129,12,687,165,685,693,165,687,
    221,723,291,141,716,715,221,714,723,
    716,141,707,723,724,291,708,707,141,
    291,724,304,634,725,404,724,726,304,
    634,735,725,727,404,725,338,712,364,
    727,446,404,726,712,338,718,16,714,
    727,728,446,714,16,723,13,724,723,
    446,728,472,16,13,723,472,586,74,
    724,729,726,472,728,586,13,729,724,
    729,47,726,725,735,730,727,725,731,
    729,119,47,725,730,731,726,47,712,
    727,732,728,727,731,732,728,732,605,
    728,605,586,730,733,731,731,733,225,
    733,239,225,731,225,732,225,3,732,
    732,3,605,733,741,232,239,733,232,
    709,46,734,734,622,709,634,622,734,
    735,634,734,46,736,734,735,734,737,
    736,737,734,735,737,730,738,739,97,
    737,736,740,739,740,736,737,740,741,
    737,741,730,741,733,730,738,742,743,
    743,739,738,742,738,109,109,330,742,
    742,9,743,740,739,744,743,744,739,
    741,740,745,745,740,744,741,745,232,
    345,742,330,9,742,345,345,5,9,
    9,4,744,9,744,743,246,745,744,
    246,744,4,745,246,248,745,248,232,
    757,754,758,765,829,766,767,768,769,
    768,770,769,853,746,759,770,771,769,
    759,750,763,765,775,838,771,776,769,
    776,777,769,765,844,775,857,763,748,
    777,779,769,765,750,844,779,780,769,
    765,747,750,780,782,769,778,749,772,
    748,763,773,751,778,784,748,773,754,
    751,784,839,791,787,781,758,793,788,
    754,793,758,788,796,790,793,796,788,
    755,825,756,790,798,764,796,798,790,
    798,802,764,764,802,841,824,801,806,
    763,747,773,747,763,750,762,811,776,
    808,810,752,747,789,773,776,811,777,
    754,781,793,773,789,781,814,777,811,
    773,781,754,752,810,848,811,831,814,
    781,787,793,782,815,812,777,814,779,
    753,812,816,812,827,816,779,818,780,
    787,826,795,836,813,799,753,816,792,
    801,799,785,792,820,794,814,818,779,
    788,803,758,818,815,780,799,786,785,
    792,816,820,804,803,788,786,756,822,
    815,823,824,790,808,804,789,791,781,
    780,815,782,788,790,804,791,826,787,
    815,824,812,825,765,766,822,785,786,
    764,808,790,785,822,828,811,762,835,
    793,787,796,827,812,824,795,830,783,
    796,795,798,816,827,749,795,826,830,
    787,795,796,830,834,783,811,835,831,
    833,829,765,772,749,827,814,831,836,
    832,835,762,798,795,783,816,749,820,
    814,836,818,765,838,833,808,764,810,
    761,837,840,818,823,815,818,836,823,
    823,799,801,810,841,832,821,838,775,
    840,755,761,823,801,824,841,810,764,
    809,813,831,841,774,832,825,755,840,
    746,821,775,806,827,824,813,836,831,
    747,765,789,844,759,746,765,791,789,
    799,823,836,806,772,827,847,757,842,
    832,774,835,765,826,791,842,757,843,
    801,817,806,831,835,809,765,830,826,
    801,785,817,844,746,775,845,846,767,
    765,834,830,844,750,759,765,837,834,
    806,819,772,774,809,835,765,840,837,
    806,817,819,767,846,768,825,840,765,
    846,752,768,847,842,839,774,856,809,
    768,752,770,758,803,843,839,784,847,
    770,848,771,749,751,820,749,778,751,
    752,848,770,848,762,771,785,828,817,
    817,849,819,813,786,799,817,828,849,
    794,850,797,810,832,848,760,819,821,
    757,758,843,832,762,848,819,849,821,
    794,820,850,821,746,760,771,762,776,
    756,825,766,766,822,756,797,851,800,
    828,822,829,804,845,803,772,819,760,
    822,766,829,804,846,845,828,829,833,
    797,850,851,851,852,800,828,833,849,
    772,760,778,849,833,838,808,752,846,
    849,838,821,784,778,853,804,808,846,
    841,854,774,800,852,805,805,855,807,
    802,854,841,760,853,778,854,856,774,
    855,805,852,784,853,857,746,853,760,
    854,761,856,807,845,767,855,845,807,
    809,856,858,759,857,853,751,850,820,
    858,813,809,850,839,851,786,813,858,
    755,858,856,857,847,784,858,756,786,
    858,755,756,850,751,839,857,748,847,
    802,798,783,851,842,852,857,759,763,
    802,783,859,839,842,851,802,859,854,
    842,843,852,847,748,757,748,754,757,
    852,843,855,859,761,854,834,859,783,
    859,837,761,855,803,845,834,837,859,
    843,803,855,782,753,769,753,792,769,
    856,761,755,792,794,769,794,797,769,
    797,800,769,800,805,769,805,807,769,
    807,767,769,782,812,753,860,861,862,
    863,864,862,861,865,862,864,869,862,
    865,867,862,869,872,862,867,871,862,
    871,874,863,860,873,861,883,874,871,
    887,873,860,874,888,863,911,916,870,
    880,889,885,861,873,891,863,888,864,
    861,891,865,864,892,869,870,916,877,
    896,909,910,865,893,867,890,879,866,
    895,945,899,891,893,865,877,924,900,
    866,886,868,910,897,896,893,883,867,
    916,924,877,897,913,901,879,886,866,
    868,886,898,888,892,864,884,881,905,
    892,906,869,867,883,871,868,898,881,
    884,905,875,869,906,872,968,954,956,
    875,911,870,883,908,874,914,889,938,
    875,905,911,900,908,883,875,870,873,
    874,908,912,870,877,891,938,915,914,
    912,888,874,919,920,921,877,893,891,
    912,918,888,942,946,912,912,946,918,
    877,900,893,913,897,910,913,923,901,
    893,900,883,918,892,888,925,926,862,
    921,892,918,926,927,862,901,923,903,
    971,879,876,892,921,906,918,919,921,
    927,928,862,921,920,930,872,929,862,
    928,860,862,929,931,862,898,957,881,
    931,934,862,925,933,926,924,935,900,
    934,925,862,937,933,925,920,932,930,
    926,933,939,900,935,908,879,972,886,
    894,932,940,903,941,907,923,941,903,
    886,914,898,909,880,910,926,939,927,
    942,912,908,880,913,910,927,943,928,
    894,940,895,935,942,908,880,923,913,
    962,948,916,939,943,927,880,941,923,
    945,895,940,928,943,887,907,947,878,
    916,948,924,944,924,948,928,887,860,
    946,919,918,937,949,933,958,947,907,
    935,924,944,937,899,949,932,968,940,
    954,968,904,951,939,933,944,950,935,
    904,952,954,949,951,933,935,950,942,
    939,951,955,951,866,868,939,955,943,
    940,902,945,953,907,878,957,905,881,
    942,953,946,907,941,958,942,950,953,
    953,878,946,948,896,897,943,955,884,
    946,878,919,905,957,960,947,959,952,
    871,863,862,868,955,951,897,944,948,
    955,881,884,897,901,944,955,868,881,
    947,958,959,944,901,950,921,930,906,
    952,959,961,903,953,950,943,884,887,
    901,903,950,960,911,905,899,945,890,
    916,911,962,952,961,954,953,903,907,
    915,963,917,954,964,956,899,890,949,
    954,961,964,919,965,920,960,962,911,
    951,949,866,915,938,963,941,880,958,
    963,966,917,880,959,958,878,965,919,
    932,894,930,962,896,948,880,961,959,
    965,904,920,922,896,962,949,890,866,
    917,966,922,880,964,961,872,936,929,
    878,947,965,922,909,896,947,952,965,
    898,914,915,966,909,922,965,952,904,
    906,936,872,920,904,932,889,880,938,
    936,967,929,880,963,938,898,915,957,
    880,966,963,957,915,917,929,967,931,
    880,909,966,957,917,960,902,956,970,
    931,969,934,960,922,962,917,922,960,
    969,931,967,934,969,937,967,895,969,
    968,932,904,971,876,970,902,940,968,
    876,890,945,968,956,902,934,937,925,
    945,902,876,906,930,936,890,876,879,
    972,879,971,902,970,876,914,886,972,
    882,956,964,936,894,967,956,882,970,
    936,930,894,973,971,970,967,894,895,
    970,882,973,971,973,885,880,973,882,
    969,895,899,880,885,973,969,899,937,
    971,885,972,887,875,873,972,889,914,
    972,885,889,887,884,875,880,882,964,
    891,873,870,981,986,974,986,987,974,
    988,985,984,993,1004,994,976,987,986,
    1000,1043,1001,1003,974,1002,976,998,987,
    995,1006,996,993,999,1004,1003,1005,974,
    1005,1009,974,998,1023,1007,994,1004,1008,
    1009,1011,974,1011,1014,974,1014,981,974,
    996,1006,975,975,1017,976,1006,1017,975,
    1017,1019,976,1029,983,1028,988,1037,985,
    1003,1078,1005,985,1041,990,976,1019,998,
    1037,1041,985,1038,991,983,1016,1021,1034,
    1019,1023,998,1007,1023,1027,1038,984,1012,
    995,1018,1006,1032,1012,984,1007,1027,1015,
    984,985,1032,1015,1027,1033,1012,1032,1018,
    979,1029,1028,1008,1034,1013,1018,1035,1022,
    987,1036,974,1030,1037,988,1029,1038,983,
    1036,1039,974,1032,1035,1018,1039,1050,974,
    1032,990,1035,1050,1051,974,985,990,1032,
    1054,974,1051,1055,974,1054,1022,1035,1047,
    995,991,1012,1056,974,1055,1022,1047,1042,
    1024,1044,1026,1043,1010,1001,1024,1040,1044,
    1043,1016,1010,1012,991,1038,1026,1046,1080,
    1043,1021,1016,998,1036,987,1026,1044,1046,
    1043,1025,1021,1012,1018,995,1043,1030,1025,
    1043,1037,1030,994,1008,977,1043,1041,1037,
    1042,1024,1045,1041,1049,990,1047,1024,1042,
    977,1013,979,990,1049,1031,1040,1031,1052,
    1008,1013,977,1013,1020,979,979,1020,1029,
    1045,1024,1026,1009,1053,1011,1031,1049,1052,
    1059,1038,1029,1031,1035,990,1006,1022,1017,
    1057,1040,1052,974,1056,1002,1047,1035,1031,
    1022,1006,1018,1059,984,1038,1031,1040,1047,
    1040,1057,1044,1022,1042,1017,1047,1040,1024,
    1017,1042,1019,1042,1045,1019,1044,1058,1046,
    998,1007,1036,1062,992,1061,1044,1057,1058,
    1036,1007,1039,1058,1065,1046,1029,1020,1059,
    1064,1004,999,1039,1015,1050,975,976,986,
    1073,1060,1063,1064,999,997,1015,1039,1007,
    978,1063,1068,1004,1064,1069,1050,1015,1070,
    1064,1010,1069,1063,1077,1048,1066,1028,1078,
    1015,1033,1070,1063,1048,1068,1069,1008,1004,
    1050,1070,1051,1072,1002,992,978,1068,989,
    1069,1034,1008,1073,1054,1051,1071,1020,1013,
    982,1067,1074,1066,979,1028,989,1061,992,
    989,1068,1061,1013,1034,1071,1002,1072,1003,
    1073,1051,1070,1071,1076,1020,1078,1003,1072,
    1054,1073,978,1071,1034,1021,994,1061,993,
    1060,1077,1063,1021,1025,1071,1062,1061,994,
    1041,1043,1049,1071,1025,1076,1060,980,1077,
    1043,1052,1049,1083,1075,997,1005,1079,1009,
    1074,1075,982,1043,1057,1052,1054,978,1055,
    977,1066,1062,1075,1000,997,1078,1079,1005,
    1055,989,1056,1043,1058,1057,1075,1074,1000,
    1076,1059,1020,1079,1053,1009,1043,1065,1058,
    999,1083,997,1055,978,989,1076,988,1059,
    977,1062,994,997,1000,1001,1043,1067,1065,
    1056,992,1002,1043,1074,1067,977,979,1066,
    1076,1030,988,1062,1072,992,1056,989,992,
    1025,1030,1076,1000,1074,1043,997,1001,1064,
    1059,988,984,1072,1066,1078,1068,993,1061,
    1070,1060,1073,1068,1048,993,1062,1066,1072,
    1070,1033,1060,1010,1064,1001,978,1073,1063,
    1069,1010,1016,1087,1080,1081,980,1081,1082,
    1016,1034,1069,1028,1079,1078,1077,980,1082,
    1079,1028,983,1083,1077,1082,1079,983,1053,
    1082,1075,1083,1082,982,1075,1083,1048,1077,
    1048,1083,999,1019,1045,1023,983,991,1053,
    1011,1084,1014,1048,999,993,1053,1084,1011,
    1045,1085,1023,1080,1046,1086,996,1014,1084,
    1023,1085,1027,1053,991,1084,1086,1081,1080,
    1084,995,996,1086,982,1081,1046,1065,1086,
    991,995,1084,1087,1033,1027,1086,1067,982,
    1086,1065,1067,1014,996,981,982,1082,1081,
    1085,1087,1027,975,986,981,980,1033,1087,
    996,975,981,980,1060,1033,1085,1045,1026,
    1085,1026,1080,1085,1080,1087,980,1087,1081,
    1097,1091,1146,1088,1093,1098,1103,1104,1105,
    1090,1089,1121,1105,1104,1112,1093,1109,1113,
    1107,1105,1092,1112,1115,1116,1093,1113,1098,
    1104,1115,1112,1115,1120,1116,1089,1119,1121,
    1123,1125,1113,1116,1120,1127,1121,1119,1130,
    1125,1128,1129,1222,1224,1114,1131,1114,1224,
    1123,1128,1125,1153,1213,1120,1128,1134,1129,
    1131,1226,1114,1121,1130,1133,1143,1150,1108,
    1124,1152,1132,1133,1130,1135,1145,1152,1124,
    1226,1228,1114,1108,1150,1111,1129,1134,1137,
    1228,1230,1114,1150,1156,1111,1230,1232,1114,
    1243,1138,1103,1158,1134,1128,1135,1142,1133,
    1232,1278,1114,1103,1141,1104,1121,1136,1090,
    1118,1314,1304,1139,1145,1122,1138,1141,1103,
    1194,1195,1114,1141,1147,1104,1118,1316,1314,
    1195,1196,1114,1091,1183,1146,1119,1148,1130,
    1352,1097,1146,1196,1200,1114,1118,1099,1316,
    1122,1145,1124,1149,1123,1352,1200,1201,1114,
    1147,1115,1104,1117,1151,1126,1201,1231,1114,
    1118,1206,1202,1130,1148,1154,1153,1120,1115,
    1117,1144,1151,1231,1233,1114,1146,1149,1352,
    1149,1155,1123,1126,1151,1093,1233,1236,1114,
    1152,1253,1132,1147,1153,1115,1118,1227,1219,
    1236,1171,1114,1130,1154,1135,1118,1250,1227,
    1123,1155,1128,1135,1154,1091,1118,1257,1250,
    1126,1093,1088,1118,1264,1257,1118,1178,1264,
    1157,1159,1140,1155,1158,1128,1136,1133,1144,
    1158,1246,1134,1162,1114,1160,1136,1121,1133,
    1162,1164,1114,1335,1177,1138,1175,1179,1145,
    1164,1165,1114,1140,1159,1143,1142,1151,1144,
    1138,1177,1141,1145,1179,1152,1143,1166,1150,
    1142,1144,1133,1141,1181,1147,1159,1166,1143,
    1151,1142,1109,1141,1177,1181,1166,1168,1150,
    1151,1109,1093,1147,1241,1153,1150,1168,1156,
    1088,1098,1170,1114,1171,1160,1156,1275,1261,
    1146,1187,1149,1168,1275,1156,1139,1175,1145,
    1192,1271,1155,1139,1170,1175,1157,1092,1105,
    1271,1158,1155,1148,1326,1176,1263,1174,1180,
    1189,1175,1170,1157,1112,1159,1182,1154,1148,
    1254,1165,1164,1105,1112,1157,1152,1184,1253,
    1185,1169,1269,1112,1116,1159,1148,1176,1182,
    1152,1179,1184,1181,1241,1147,1116,1166,1159,
    1154,1182,1186,1161,1118,1163,1166,1127,1168,
    1167,1163,1118,1187,1146,1183,1269,1180,1185,
    1116,1127,1166,1185,1188,1169,1118,1173,1167,
    1170,1098,1189,1091,1154,1186,1106,1177,1335,
    1118,1276,1173,1171,1265,1160,1186,1183,1091,
    1155,1149,1192,1190,1181,1177,1175,1193,1179,
    1194,1114,1278,1188,1139,1235,1187,1192,1149,
    1189,1193,1175,1193,1197,1179,1176,1267,1199,
    1193,1137,1197,1161,1178,1118,1199,1182,1176,
    1127,1120,1203,1179,1197,1184,1202,1106,1102,
    1203,1205,1127,1190,1106,1206,1180,1126,1185,
    1199,1214,1182,1205,1208,1209,1203,1208,1205,
    1125,1189,1098,1186,1214,1207,1186,1207,1183,
    1185,1088,1188,1206,1106,1202,1183,1210,1187,
    1185,1126,1088,1098,1113,1125,1196,1195,1191,
    1204,1237,1211,1125,1129,1189,1190,1206,1212,
    1229,1237,1204,1129,1193,1189,1120,1213,1203,
    1183,1207,1210,1188,1170,1139,1182,1214,1186,
    1187,1210,1216,1191,1195,1096,1203,1215,1208,
    1096,1111,1218,1191,1198,1196,1129,1137,1193,
    1213,1215,1203,1114,1217,1220,1196,1198,1200,
    1216,1192,1187,1218,1191,1096,1220,1222,1114,
    1137,1095,1197,1191,1223,1198,1204,1201,1200,
    1198,1204,1200,1199,1267,1225,1218,1223,1191,
    1223,1229,1198,1267,1221,1225,1199,1225,1234,
    1169,1220,1217,1198,1229,1204,1235,1222,1220,
    1244,1248,1213,1214,1199,1234,1131,1124,1132,
    1213,1248,1215,1099,1118,1202,1235,1220,1169,
    1131,1132,1226,1235,1122,1222,1237,1293,1211,
    1211,1201,1204,1137,1134,1240,1214,1238,1207,
    1206,1118,1212,1134,1246,1240,1226,1239,1228,
    1201,1211,1231,1118,1219,1212,1214,1234,1238,
    1240,1095,1137,1095,1243,1107,1231,1242,1233,
    1222,1122,1224,1207,1238,1110,1240,1243,1095,
    1226,1132,1239,1239,1245,1228,1244,1213,1153,
    1211,1242,1231,1131,1224,1124,1111,1156,1218,
    1122,1124,1224,1233,1242,1270,1207,1110,1210,
    1241,1244,1153,1228,1245,1230,1110,1298,1210,
    1169,1188,1235,1249,1243,1240,1221,1276,1118,
    1235,1139,1122,1233,1270,1236,1223,1266,1229,
    1118,1225,1221,1246,1249,1240,1249,1138,1243,
    1165,1251,1114,1234,1225,1118,1266,1300,1229,
    1252,1320,1215,1232,1285,1278,1114,1251,1217,
    1118,1238,1234,1248,1252,1215,1300,1237,1229,
    1118,1110,1238,1132,1253,1239,1181,1256,1241,
    1160,1258,1162,1239,1259,1245,1190,1256,1181,
    1272,1257,1247,1094,1255,1260,1254,1263,1165,
    1261,1218,1156,1256,1262,1241,1160,1265,1258,
    1239,1253,1259,1218,1261,1223,1259,1305,1245,
    1330,1249,1246,1172,1094,1260,1282,1258,1265,
    1257,1264,1247,1262,1244,1241,1267,1176,1172,
    1251,1165,1263,1172,1260,1267,1343,1264,1178,
    1244,1268,1248,1251,1269,1217,1261,1266,1223,
    1158,1274,1246,1251,1263,1269,1169,1217,1269,
    1262,1268,1244,1268,1272,1248,1167,1173,1101,
    1184,1336,1253,1236,1273,1171,1254,1174,1263,
    1101,1173,1255,1248,1272,1252,1254,1295,1174,
    1255,1276,1260,1236,1270,1273,1263,1180,1269,
    1271,1274,1158,1275,1277,1261,1247,1252,1272,
    1171,1273,1265,1255,1173,1276,1260,1276,1221,
    1117,1180,1174,1190,1212,1256,1261,1277,1266,
    1265,1281,1282,1230,1280,1232,1260,1221,1267,
    1117,1126,1180,1256,1219,1262,1245,1280,1230,
    1192,1283,1271,1212,1219,1256,1188,1088,1170,
    1280,1285,1232,1219,1227,1262,1205,1275,1168,
    1162,1258,1287,1216,1283,1192,1127,1205,1168,
    1283,1288,1271,1205,1209,1275,1262,1227,1268,
    1287,1164,1162,1250,1272,1268,1279,1286,1284,
    1275,1209,1277,1287,1254,1164,1286,1306,1284,
    1209,1297,1277,1194,1278,1290,1271,1288,1274,
    1287,1258,1291,1227,1250,1268,1100,1350,1292,
    1250,1257,1272,1294,1270,1242,1285,1290,1278,
    1258,1282,1291,1288,1340,1274,1287,1291,1295,
    1096,1194,1290,1242,1211,1293,1350,1289,1292,
    1100,1292,1299,1294,1242,1293,1209,1296,1297,
    1210,1298,1216,1254,1287,1295,1208,1296,1209,
    1270,1294,1301,1296,1302,1297,1096,1195,1194,
    1100,1299,1089,1298,1304,1216,1237,1303,1293,
    1284,1306,1307,1119,1089,1299,1297,1302,1308,
    1270,1301,1273,1237,1300,1303,1273,1281,1265,
    1293,1303,1312,1305,1280,1245,1304,1283,1216,
    1308,1309,1311,1273,1301,1281,1280,1313,1285,
    1283,1314,1288,1291,1329,1295,1308,1302,1309,
    1311,1309,1279,1291,1325,1329,1293,1312,1294,
    1289,1310,1315,1305,1313,1280,1284,1307,1310,
    1283,1304,1314,1279,1309,1286,1314,1316,1288,
    1108,1285,1313,1108,1313,1143,1266,1317,1300,
    1292,1289,1315,1215,1320,1208,1282,1325,1291,
    1108,1290,1285,1277,1317,1266,1292,1321,1299,
    1317,1322,1300,1290,1111,1096,1296,1208,1320,
    1118,1298,1110,1108,1111,1290,1315,1321,1292,
    1296,1323,1302,1294,1333,1301,1319,1325,1282,
    1299,1321,1326,1118,1304,1298,1322,1303,1300,
    1296,1320,1323,1312,1333,1294,1302,1323,1328,
    1303,1327,1312,1301,1333,1332,1299,1326,1119,
    1332,1281,1301,1322,1327,1303,1306,1286,1324,
    1281,1319,1282,1326,1148,1119,1328,1309,1302,
    1274,1330,1246,1332,1319,1281,1306,1331,1307,
    1286,1309,1328,1313,1140,1143,1295,1329,1334,
    1249,1335,1138,1331,1306,1337,1330,1335,1249,
    1307,1331,1101,1259,1253,1336,1252,1338,1320,
    1315,1346,1094,1295,1334,1174,1297,1317,1277,
    1334,1117,1174,1259,1339,1305,1315,1094,1321,
    1320,1338,1323,1340,1330,1274,1317,1308,1322,
    1336,1339,1259,1318,1328,1323,1297,1308,1317,
    1341,1319,1332,1340,1102,1330,1339,1140,1305,
    1318,1323,1338,1092,1339,1336,1322,1308,1311,
    1319,1342,1325,1339,1157,1140,1328,1318,1324,
    1327,1322,1311,1092,1157,1339,1338,1247,1343,
    1330,1102,1335,1328,1324,1286,1140,1313,1305,
    1319,1341,1342,1312,1327,1345,1338,1252,1247,
    1325,1342,1090,1343,1318,1338,1184,1344,1336,
    1102,1106,1335,1103,1105,1107,1310,1346,1315,
    1342,1089,1090,1106,1190,1177,1345,1333,1312,
    1100,1089,1342,1197,1344,1184,1347,1324,1318,
    1316,1340,1288,1344,1092,1336,1107,1243,1103,
    1090,1329,1325,1099,1102,1340,1197,1095,1344,
    1307,1346,1310,1329,1136,1334,1343,1347,1318,
    1095,1107,1344,1344,1107,1092,1099,1340,1316,
    1324,1347,1337,1099,1202,1102,1329,1090,1136,
    1332,1348,1341,1347,1161,1337,1333,1348,1332,
    1345,1348,1333,1334,1136,1144,1347,1178,1161,
    1321,1172,1326,1348,1349,1350,1334,1144,1117,
    1172,1321,1094,1337,1306,1324,1172,1176,1326,
    1348,1350,1341,1337,1161,1163,1351,1345,1327,
    1101,1346,1307,1327,1311,1351,1348,1345,1349,
    1255,1094,1346,1351,1349,1345,1100,1341,1350,
    1331,1337,1163,1255,1346,1101,1097,1109,1142,
    1142,1135,1097,1341,1100,1342,1352,1113,1109,
    1331,1167,1101,1109,1097,1352,1167,1331,1163,
    1123,1113,1352,1264,1343,1247,1135,1091,1097,
    1347,1343,1178,1349,1289,1350,1353,1289,1349,
    1311,1279,1351,1351,1279,1353,1279,1284,1353,
    1351,1353,1349,1353,1310,1289,1353,1284,1310,
    1359,1360,1361,1366,1367,1368,1361,1360,1370,
    1363,1362,1377,1370,1372,1373,1360,1372,1370,
    1376,1375,1381,1365,1379,1385,1376,1381,1358,
    1365,1385,1374,1383,1389,1384,1369,1386,1359,
    1374,1385,1390,1359,1394,1360,1386,1394,1359,
    1571,1395,1379,1394,1397,1360,1391,1398,1371,
    1379,1395,1399,1360,1397,1372,1396,1400,1380,
    1379,1399,1385,1362,1418,1377,1385,1399,1401,
    1356,1605,1494,1385,1401,1390,1380,1400,1383,
    1377,1418,1429,1364,1398,1402,1377,1429,1382,
    1402,1405,1386,1555,1393,1356,1405,1394,1386,
    1397,1394,1450,1406,1411,1387,1408,1412,1410,
    1410,1414,1404,1411,1391,1387,1412,1369,1410,
    1407,1437,1413,1432,1437,1407,1409,1439,1415,
    1391,1416,1398,1411,1416,1391,1416,1421,1398,
    1373,1372,1422,1418,1362,1415,1401,1420,1424,
    1398,1421,1402,1373,1422,1425,1357,1426,1378,
    1424,1427,1428,1422,1431,1425,1405,1402,1516,
    1419,1426,1357,1420,1427,1424,1426,1432,1378,
    1427,1433,1428,1430,1419,1417,1425,1431,1434,
    1431,1495,1434,1378,1432,1407,1428,1433,1408,
    1417,1419,1357,1372,1436,1422,1435,1409,1528,
    1438,1392,1393,1406,1455,1411,1372,1397,1436,
    1452,1455,1406,1436,1441,1422,1384,1413,1437,
    1439,1409,1435,1447,1451,1423,1415,1439,1442,
    1422,1441,1431,1423,1451,1430,1437,1383,1384,
    1440,1443,1420,1380,1383,1437,1415,1442,1418,
    1430,1451,1454,1453,1436,1397,1420,1443,1427,
    1429,1418,1569,1457,1441,1436,1454,1419,1430,
    1569,1418,1442,1427,1445,1433,1457,1464,1441,
    1443,1445,1427,1426,1461,1432,1435,1449,1366,
    1456,1461,1426,1439,1435,1366,1368,1442,1439,
    1405,1450,1394,1397,1450,1453,1380,1437,1432,
    1368,1439,1366,1438,1469,1440,1442,1368,1574,
    1419,1454,1456,1419,1456,1426,1455,1460,1411,
    1444,1390,1463,1453,1457,1436,1411,1460,1416,
    1444,1463,1447,1447,1466,1451,1432,1461,1380,
    1474,1461,1456,1461,1396,1380,1458,1467,1459,
    1463,1466,1447,1474,1396,1461,1466,1468,1451,
    1458,1471,1467,1459,1467,1363,1404,1456,1454,
    1470,1450,1405,1451,1468,1454,1472,1443,1440,
    1450,1473,1453,1404,1474,1456,1404,1414,1474,
    1468,1404,1454,1469,1472,1440,1459,1363,1462,
    1470,1473,1450,1472,1387,1443,1473,1475,1453,
    1424,1463,1390,1387,1472,1406,1468,1410,1404,
    1390,1401,1424,1443,1387,1445,1453,1475,1457,
    1408,1410,1468,1424,1428,1463,1387,1391,1445,
    1457,1477,1464,1428,1466,1463,1465,1471,1458,
    1466,1408,1468,1471,1479,1480,1475,1477,1457,
    1408,1466,1428,1469,1478,1472,1478,1406,1472,
    1480,1467,1471,1448,1452,1478,1481,1593,1589,
    1516,1526,1470,1478,1452,1406,1354,1382,1487,
    1480,1362,1467,1473,1540,1475,1388,1358,1381,
    1367,1388,1490,1540,1542,1475,1480,1479,1409,
    1489,1491,1483,1475,1542,1477,1480,1409,1415,
    1383,1403,1389,1480,1415,1362,1434,1495,1496,
    1400,1403,1383,1423,1514,1493,1496,1497,1498,
    1495,1497,1496,1497,1500,1498,1481,1448,1446,
    1489,1487,1365,1474,1414,1361,1481,1452,1448,
    1481,1455,1452,1361,1396,1474,1498,1500,1502,
    1481,1460,1455,1365,1374,1489,1396,1370,1400,
    1502,1503,1504,1485,1484,1357,1491,1444,1493,
    1502,1500,1503,1361,1370,1396,1370,1373,1400,
    1493,1447,1423,1481,1536,1526,1400,1373,1403,
    1493,1444,1447,1357,1378,1485,1481,1540,1536,
    1485,1378,1486,1373,1425,1403,1499,1507,1465,
    1486,1407,1488,1499,1505,1507,1481,1552,1549,
    1431,1508,1495,1507,1471,1465,1378,1407,1486,
    1481,1619,1552,1407,1413,1488,1431,1441,1508,
    1508,1513,1495,1501,1512,1505,1459,1515,1458,
    1548,1509,1511,1459,1462,1515,1501,1585,1512,
    1402,1421,1516,1495,1513,1497,1505,1512,1519,
    1520,1515,1462,1405,1516,1470,1497,1518,1500,
    1521,1482,1506,1522,1421,1416,1505,1519,1507,
    1513,1518,1497,1521,1506,1514,1500,1518,1523,
    1532,1534,1515,1507,1479,1471,1416,1460,1522,
    1534,1537,1515,1417,1482,1521,1507,1519,1479,
    1522,1525,1421,1537,1506,1515,1523,1503,1500,
    1519,1512,1529,1506,1482,1515,1516,1421,1525,
    1482,1484,1515,1417,1484,1482,1484,1485,1515,
    1417,1357,1484,1441,1464,1508,1486,1515,1485,
    1483,1491,1510,1516,1525,1526,1488,1515,1486,
    1510,1493,1514,1493,1510,1491,1409,1479,1528,
    1541,1518,1513,1423,1521,1514,1527,1530,1509,
    1521,1430,1417,1460,1481,1522,1423,1430,1521,
    1560,1562,1515,1481,1525,1522,1520,1531,1515,
    1562,1563,1515,1509,1530,1511,1563,1564,1515,
    1515,1531,1532,1519,1529,1528,1481,1526,1525,
    1511,1533,1517,1564,1499,1515,1513,1508,1535,
    1526,1536,1470,1499,1465,1515,1479,1519,1528,
    1530,1533,1511,1470,1536,1473,1533,1539,1517,
    1435,1528,1538,1465,1458,1515,1464,1535,1508,
    1535,1541,1513,1538,1550,1449,1535,1616,1541,
    1524,1517,1539,1435,1538,1449,1473,1536,1540,
    1518,1614,1523,1515,1488,1543,1518,1541,1614,
    1546,1515,1543,1384,1389,1527,1531,1545,1532,
    1464,1477,1547,1595,1544,1529,1515,1546,1548,
    1529,1538,1528,1354,1545,1531,1529,1544,1538,
    1547,1535,1464,1532,1545,1483,1554,1568,1530,
    1488,1413,1543,1545,1489,1483,1477,1542,1549,
    1550,1538,1544,1530,1568,1533,1543,1551,1546,
    1534,1532,1483,1537,1534,1510,1413,1551,1543,
    1546,1551,1509,1534,1483,1510,1510,1514,1537,
    1550,1544,1553,1551,1527,1509,1537,1514,1506,
    1356,1494,1555,1546,1509,1548,1487,1545,1354,
    1494,1570,1555,1392,1399,1395,1395,1355,1392,
    1548,1511,1558,1489,1545,1487,1556,1401,1399,
    1565,1388,1381,1511,1517,1558,1393,1557,1438,
    1556,1399,1392,1393,1555,1557,1401,1556,1420,
    1557,1469,1438,1489,1374,1491,1438,1556,1392,
    1556,1440,1420,1491,1374,1444,1556,1438,1440,
    1551,1384,1527,1444,1374,1390,1603,1605,1356,
    1515,1548,1558,1356,1355,1603,1558,1560,1515,
    1381,1375,1561,1393,1392,1355,1492,1559,1494,
    1355,1356,1393,1570,1494,1559,1381,1561,1565,
    1555,1570,1573,1555,1573,1557,1517,1560,1558,
    1560,1524,1562,1578,1469,1557,1517,1524,1560,
    1524,1583,1562,1557,1573,1578,1566,1490,1388,
    1562,1583,1563,1554,1530,1527,1563,1501,1564,
    1564,1501,1505,1388,1565,1566,1559,1598,1602,
    1564,1505,1499,1389,1554,1527,1382,1567,1487,
    1492,1490,1566,1429,1567,1382,1567,1365,1487,
    1569,1571,1429,1569,1575,1571,1567,1429,1571,
    1567,1379,1365,1567,1571,1379,1442,1574,1569,
    1607,1572,1561,1575,1569,1574,1575,1395,1571,
    1561,1576,1565,1403,1577,1389,1467,1362,1363,
    1520,1462,1579,1561,1572,1576,1389,1577,1554,
    1565,1576,1580,1578,1478,1469,1579,1462,1363,
    1579,1354,1520,1554,1581,1568,1377,1579,1363,
    1579,1382,1354,1579,1377,1382,1577,1581,1554,
    1566,1565,1580,1354,1531,1520,1570,1582,1573,
    1577,1434,1581,1570,1602,1582,1573,1582,1446,
    1425,1577,1403,1582,1481,1446,1573,1446,1578,
    1425,1434,1577,1478,1578,1448,1446,1448,1578,
    1589,1580,1576,1583,1501,1563,1584,1583,1524,
    1481,1582,1602,1584,1524,1539,1584,1585,1583,
    1550,1376,1449,1583,1585,1501,1566,1586,1492,
    1550,1587,1376,1586,1566,1580,1591,1584,1539,
    1504,1503,1588,1584,1592,1585,1586,1559,1492,
    1591,1592,1584,1588,1553,1504,1533,1590,1539,
    1553,1588,1587,1568,1590,1533,1590,1591,1539,
    1476,1589,1576,1553,1587,1550,1587,1375,1376,
    1593,1580,1589,1375,1587,1594,1585,1592,1595,
    1542,1540,1481,1588,1503,1596,1542,1481,1549,
    1585,1595,1512,1586,1580,1593,1595,1529,1512,
    1581,1597,1568,1597,1590,1568,1596,1503,1523,
    1586,1598,1559,1590,1599,1591,1588,1596,1594,
    1600,1574,1368,1597,1599,1590,1599,1601,1591,
    1598,1586,1593,1368,1367,1600,1574,1600,1603,
    1587,1588,1594,1591,1601,1592,1592,1604,1595,
    1592,1601,1604,1603,1575,1574,1595,1604,1544,
    1570,1559,1602,1355,1575,1603,1434,1496,1581,
    1476,1481,1589,1496,1597,1581,1395,1575,1355,
    1600,1367,1490,1496,1498,1597,1597,1498,1599,
    1605,1603,1600,1599,1502,1601,1593,1481,1598,
    1600,1490,1605,1498,1502,1599,1481,1602,1598,
    1601,1502,1504,1504,1604,1601,1594,1606,1607,
    1553,1544,1604,1605,1492,1494,1604,1504,1553,
    1433,1412,1408,1606,1608,1607,1414,1359,1361,
    1410,1369,1414,1492,1605,1490,1594,1607,1375,
    1358,1366,1449,1369,1359,1414,1607,1561,1375,
    1449,1376,1358,1433,1445,1371,1366,1358,1367,
    1445,1391,1371,1358,1388,1367,1433,1371,1412,
    1412,1364,1369,1608,1606,1609,1371,1364,1412,
    1572,1607,1608,1364,1386,1369,1398,1364,1371,
    1402,1386,1364,1609,1610,1611,1611,1608,1609,
    1612,1572,1608,1608,1611,1612,1476,1572,1612,
    1572,1476,1576,1610,1481,1611,1481,1612,1611,
    1481,1476,1612,1481,1613,1619,1610,1613,1481,
    1523,1614,1615,1614,1618,1615,1617,1618,1614,
    1615,1596,1523,1615,1606,1596,1616,1535,1547,
    1541,1616,1617,1617,1614,1541,1615,1618,1609,
    1618,1610,1609,1615,1609,1606,1477,1549,1547,
    1549,1552,1547,1616,1547,1552,1616,1619,1617,
    1552,1619,1616,1613,1617,1619,1613,1618,1617,
    1613,1610,1618,1596,1606,1594,1413,1384,1551,
    1620,1621,1622,1705,1638,1629,1624,1630,1732,
    1700,1639,1626,1701,1627,1730,1642,1643,1621,
    1700,1636,1639,1630,1624,1633,1629,1638,1625,
    1639,1647,1626,1635,1643,1642,1638,1635,1625,
    1627,1644,1628,1621,1646,1622,1663,1671,1634,
    1633,1656,1632,1655,1628,1644,1621,1643,1646,
    1638,1640,1635,1622,1646,1650,1643,1640,1645,
    1651,1633,1624,1636,1637,1652,1636,1652,1639,
    1622,1650,1637,1639,1652,1653,1639,1653,1647,
    1651,1624,1641,1637,1650,1668,1633,1651,1656,
    1628,1655,1631,1657,1717,1631,1646,1645,1649,
    1653,1694,1647,1668,1652,1637,1655,1661,1660,
    1668,1673,1652,1632,1663,1634,1635,1640,1643,
    1656,1663,1632,1705,1640,1638,1673,1653,1652,
    1643,1645,1646,1665,1661,1644,1705,1645,1640,
    1649,1650,1646,1705,1649,1645,1631,1655,1675,
    1662,1667,1674,1644,1661,1655,1655,1660,1675,
    1661,1702,1703,1631,1675,1657,1674,1700,1676,
    1654,1650,1649,1703,1660,1661,1674,1697,1700,
    1678,1651,1641,1668,1659,1673,1657,1677,1658,
    1654,1668,1650,1641,1648,1678,1654,1659,1668,
    1651,1681,1656,1677,1657,1675,1658,1677,1667,
    1651,1678,1681,1681,1685,1656,1658,1667,1662,
    1656,1685,1663,1667,1677,1689,1662,1674,1664,
    1685,1693,1663,1690,1695,1729,1674,1676,1664,
    1667,1689,1697,1694,1684,1647,1664,1676,1666,
    1663,1693,1671,1684,1699,1688,1667,1697,1674,
    1666,1696,1670,1694,1699,1684,1696,1704,1670,
    1696,1666,1676,1699,1641,1688,1669,1671,1693,
    1629,1719,1705,1701,1644,1627,1678,1648,1687,
    1702,1714,1703,1676,1700,1626,1623,1630,1706,
    1711,1648,1699,1670,1704,1672,1641,1699,1648,
    1687,1691,1678,1688,1641,1624,1680,1682,1660,
    1706,1686,1623,1660,1703,1680,1678,1691,1681,
    1672,1707,1692,1705,1654,1649,1706,1709,1686,
    1653,1708,1694,1681,1698,1685,1680,1620,1682,
    1705,1659,1654,1675,1682,1677,1673,1708,1653,
    1672,1704,1707,1708,1711,1694,1707,1712,1692,
    1665,1702,1661,1690,1686,1709,1681,1691,1698,
    1690,1713,1695,1682,1675,1660,1665,1710,1702,
    1689,1721,1697,1705,1683,1679,1709,1713,1690,
    1677,1682,1689,1705,1687,1683,1695,1715,1701,
    1705,1691,1687,1694,1711,1699,1705,1698,1691,
    1714,1702,1716,1724,1623,1727,1713,1715,1695,
    1636,1700,1697,1703,1714,1642,1705,1723,1698,
    1658,1717,1657,1665,1701,1715,1712,1623,1724,
    1705,1725,1723,1662,1717,1658,1719,1725,1705,
    1664,1717,1662,1666,1717,1664,1703,1642,1680,
    1682,1620,1689,1696,1676,1626,1670,1717,1666,
    1710,1718,1720,1733,1708,1673,1665,1644,1701,
    1672,1717,1670,1626,1722,1696,1706,1630,1633,
    1723,1685,1698,1722,1626,1647,1671,1718,1634,
    1672,1692,1717,1721,1689,1620,1723,1693,1685,
    1710,1720,1716,1696,1722,1704,1706,1632,1709,
    1724,1717,1692,1722,1726,1704,1636,1697,1721,
    1720,1718,1671,1711,1679,1683,1724,1727,1717,
    1727,1728,1717,1633,1632,1706,1728,1729,1717,
    1648,1711,1683,1725,1669,1693,1622,1721,1620,
    1702,1710,1716,1632,1634,1709,1729,1730,1717,
    1721,1637,1636,1716,1731,1625,1721,1622,1637,
    1709,1634,1713,1723,1725,1693,1730,1627,1717,
    1716,1720,1731,1683,1687,1648,1704,1726,1707,
    1720,1669,1731,1719,1669,1725,1627,1628,1717,
    1707,1732,1712,1628,1631,1717,1713,1718,1715,
    1659,1733,1673,1726,1732,1707,1634,1718,1713,
    1692,1712,1724,1705,1733,1659,1621,1620,1680,
    1715,1718,1710,1712,1630,1623,1715,1710,1665,
    1732,1630,1712,1708,1679,1711,1716,1625,1714,
    1625,1635,1714,1621,1680,1642,1733,1679,1708,
    1727,1623,1686,1635,1642,1714,1727,1686,1728,
    1705,1679,1733,1728,1690,1729,1720,1671,1669,
    1686,1690,1728,1722,1684,1726,1730,1729,1695,
    1647,1684,1722,1695,1701,1730,1684,1688,1726,
    1731,1629,1625,1726,1688,1732,1629,1731,1719,
    1731,1669,1719,1688,1624,1732,1740,1741,1820,
    1746,1748,1749,1745,1754,1755,1746,1749,1756,
    1740,1765,1741,1760,1740,1735,1734,1757,1735,
    1757,1760,1735,1763,1743,1756,1748,1764,1749,
    1760,1765,1740,1736,1766,1753,1764,1748,1767,
    1749,1763,1756,1736,1761,1766,1763,1771,1743,
    1762,1838,1759,1753,1770,1758,1755,1834,1824,
    1753,1766,1770,1741,1773,1825,1754,1745,1789,
    1774,1750,1744,1789,1807,1754,1774,1752,1750,
    1776,1763,1749,1774,1757,1752,1768,1758,1778,
    1775,1747,1751,1764,1776,1749,1774,1760,1757,
    1774,1765,1760,1763,1776,1780,1768,1778,1769,
    1769,1781,1772,1761,1795,1800,1761,1800,1766,
    1775,1801,1779,1778,1781,1769,1763,1780,1771,
    1771,1780,1761,1781,1747,1772,1742,1784,1782,
    1779,1785,1759,1761,1780,1795,1788,1790,1773,
    1771,1761,1736,1773,1790,1777,1782,1784,1787,
    1759,1785,1762,1764,1793,1776,1770,1806,1805,
    1737,1778,1758,1782,1787,1783,1737,1738,1778,
    1741,1788,1773,1783,1748,1746,1765,1788,1741,
    1843,1791,1798,1738,1781,1778,1783,1787,1748,
    1776,1803,1780,1774,1790,1788,1751,1781,1738,
    1777,1791,1843,1789,1745,1786,1779,1810,1785,
    1801,1810,1779,1796,1775,1751,1790,1791,1777,
    1784,1794,1787,1792,1743,1797,1812,1796,1751,
    1797,1799,1792,1796,1801,1775,1787,1794,1767,
    1803,1776,1793,1799,1804,1792,1806,1770,1766,
    1774,1798,1791,1793,1813,1803,1804,1768,1792,
    1766,1800,1806,1768,1769,1792,1770,1805,1737,
    1807,1789,1835,1772,1792,1769,1787,1767,1748,
    1795,1780,1803,1737,1809,1738,1809,1737,1805,
    1788,1765,1774,1809,1812,1738,1833,1811,1793,
    1810,1818,1785,1791,1790,1774,1810,1827,1818,
    1738,1812,1751,1806,1820,1805,1813,1793,1811,
    1814,1784,1742,1808,1798,1774,1806,1739,1820,
    1815,1814,1762,1785,1818,1815,1816,1803,1813,
    1743,1771,1797,1762,1785,1815,1803,1816,1795,
    1814,1819,1784,1815,1819,1814,1794,1784,1819,
    1797,1736,1799,1795,1821,1800,1797,1771,1736,
    1815,1822,1819,1820,1825,1805,1799,1736,1753,
    1796,1823,1801,1818,1822,1815,1826,1755,1754,
    1753,1804,1799,1795,1816,1821,1811,1828,1813,
    1819,1822,1786,1817,1823,1796,1758,1768,1804,
    1800,1821,1739,1811,1824,1828,1805,1825,1809,
    1754,1830,1826,1823,1829,1801,1819,1786,1794,
    1804,1753,1758,1831,1812,1809,1767,1832,1833,
    1826,1834,1755,1809,1825,1831,1827,1835,1818,
    1772,1836,1792,1836,1837,1792,1801,1829,1810,
    1831,1817,1812,1821,1735,1739,1818,1835,1822,
    1792,1837,1838,1800,1739,1806,1786,1745,1832,
    1744,1824,1834,1822,1789,1786,1838,1839,1792,
    1767,1833,1764,1829,1827,1810,1822,1835,1789,
    1841,1816,1813,1839,1742,1792,1831,1777,1817,
    1793,1764,1833,1817,1843,1823,1812,1817,1796,
    1824,1744,1828,1813,1828,1841,1742,1782,1792,
    1844,1807,1802,1767,1794,1832,1744,1750,1828,
    1777,1843,1817,1816,1841,1734,1842,1827,1829,
    1740,1820,1739,1794,1786,1832,1828,1750,1841,
    1827,1842,1802,1782,1783,1792,1823,1845,1829,
    1832,1846,1833,1840,1844,1802,1841,1752,1734,
    1783,1746,1792,1841,1750,1752,1807,1844,1830,
    1821,1816,1734,1823,1843,1845,1832,1745,1846,
    1781,1751,1747,1752,1757,1734,1735,1821,1734,
    1840,1802,1842,1833,1846,1811,1842,1829,1845,
    1737,1758,1770,1772,1747,1836,1755,1846,1745,
    1827,1802,1835,1754,1807,1830,1846,1755,1824,
    1825,1773,1831,1836,1847,1837,1830,1774,1826,
    1835,1802,1807,1846,1824,1811,1773,1777,1831,
    1774,1834,1826,1847,1836,1747,1774,1744,1834,
    1847,1759,1837,1774,1840,1808,1739,1735,1740,
    1808,1840,1842,1840,1774,1844,1845,1843,1798,
    1747,1775,1847,1820,1741,1825,1808,1842,1845,
    1775,1779,1847,1830,1844,1774,1798,1808,1845,
    1847,1779,1759,1837,1759,1838,1756,1792,1746,
    1756,1743,1792,1762,1839,1838,1762,1814,1839,
    1839,1814,1742,1853,1854,1852,1872,1849,1876,
    1854,1856,1852,1858,1865,1855,1850,1861,1852,
    1866,1862,1875,1855,1867,1868,1866,1864,1862,
    1851,1878,1852,1864,1866,1870,1870,1871,1872,
    1870,1872,1864,1861,1859,1852,1864,1872,1876,
    1855,1873,1874,1870,1866,1875,1870,1875,1871,
    1855,1862,1876,1848,1876,1849,1862,1864,1876,
    1872,1871,1875,1876,1873,1855,1852,1849,1850,
    1865,1869,1855,1860,1853,1852,1850,1849,1872,
    1875,1850,1872,1856,1848,1852,1855,1874,1863,
    1848,1849,1852,1855,1877,1867,1860,1852,1878,
    1869,1879,1855,1854,1853,1874,1867,1861,1868,
    1852,1859,1857,1863,1874,1853,1867,1859,1861,
    1848,1873,1876,1857,1851,1852,1848,1856,1873,
    1851,1857,1879,1869,1851,1879,1869,1865,1851,
    1878,1851,1865,1860,1878,1865,1853,1860,1858,
    1860,1865,1858,1877,1879,1857,1858,1863,1853,
    1877,1857,1859,1868,1861,1850,1874,1856,1854,
    1874,1873,1856,1855,1879,1877,1867,1877,1859,
    1862,1855,1868,1855,1863,1858,1850,1875,1868,
    1862,1868,1875,1882,1883,1884,1891,1893,1892,
    1886,1895,1882,1882,1881,1894,1896,1891,1892,
    1882,1897,1880,1895,1899,1882,1894,1900,1882,
    1889,1887,1890,1887,1886,1882,1883,1904,1884,
    1900,1901,1882,1899,1897,1882,1882,1884,1887,
    1882,1901,1883,1891,1896,1880,1882,1880,1881,
    1888,1886,1887,1892,1903,1888,1880,1896,1881,
    1898,1892,1902,1888,1887,1889,1892,1888,1889,
    1898,1896,1892,1891,1880,1897,1890,1904,1892,
    1884,1890,1887,1885,1903,1892,1905,1902,1892,
    1893,1891,1897,1890,1884,1904,1885,1895,1903,
    1881,1896,1898,1886,1888,1903,1904,1905,1892,
    1883,1901,1904,1905,1904,1901,1885,1892,1893,
    1902,1905,1900,1901,1900,1905,1899,1885,1893,
    1899,1895,1885,1898,1902,1894,1899,1893,1897,
    1894,1902,1900,1898,1894,1881,1889,1890,1892,
    1903,1895,1886,1908,1909,1913,1910,1954,1958,
    1910,1958,1912,1906,1911,1918,1926,1927,1925,
    1914,1932,1933,1924,1934,1935,1911,1938,1918,
    1925,1927,1939,1912,1966,1936,1911,1930,1938,
    1914,1916,1932,1933,1932,1941,1923,1934,1924,
    1935,1934,1944,1918,1938,1943,1946,1947,1948,
    1916,1937,1956,1915,2201,2202,1907,1941,2052,
    1917,1915,2202,1935,1944,1953,1930,1950,1913,
    1930,1913,1938,1917,2203,1921,1938,1909,1943,
    2202,2203,1917,1938,1913,1909,1907,2052,1908,
    1940,2258,2073,1954,1949,1982,2158,1937,2037,
    1954,1984,1958,1951,1957,2511,1954,1982,1984,
    1916,1956,1932,1957,1965,2511,1963,1964,1947,
    2298,2303,1955,1955,2303,1960,1956,1937,2158,
    1969,1962,1968,1961,1968,1962,1956,2158,2164,
    1966,1912,1958,1947,1964,1948,1936,1966,1930,
    1936,1930,1911,1959,1921,1970,1974,1980,2466,
    1976,1973,1979,1978,1979,1973,1995,1952,1948,
    1940,1977,1970,1949,1981,1982,1961,1980,1968,
    1983,1968,1980,1968,1983,1985,1967,1917,1959,
    1972,2072,2079,1967,1915,1917,1966,1958,1988,
    2044,1986,1989,1972,2079,1975,1989,1991,1992,
    1986,1991,1989,1964,1995,1948,1988,1958,1984,
    1978,1973,1998,1990,1998,1973,1917,1921,1959,
    1992,1996,1997,1966,1988,1950,1919,2001,1920,
    1921,1940,1970,1991,1996,1992,1966,1950,1930,
    2000,1978,1998,1974,2100,1980,1994,2001,1919,
    1996,1946,1997,1995,2117,1952,1920,2003,1929,
    1963,2005,1964,2100,1983,1980,2001,2003,1920,
    1987,2123,1990,2003,2007,1929,1997,1946,2010,
    2005,1963,2011,2005,2012,1964,2009,2013,2144,
    1998,1990,2126,1986,2014,1991,1929,2007,1942,
    2013,2016,2144,2005,2033,2012,2000,1998,2128,
    1995,1964,2012,2063,2014,1986,1985,2107,2019,
    2014,2020,1991,2012,2022,1995,2014,2029,2020,
    1985,2019,1928,1945,2035,1951,2019,1931,1928,
    1991,2020,1996,1996,1947,1946,2020,1947,1996,
    1995,2022,2117,2011,2030,2031,2008,1959,2009,
    1993,2429,1999,2020,1963,1947,1967,1959,2008,
    2007,2003,2114,2005,2011,2031,2238,2015,2006,
    2029,1963,2020,1959,1970,2009,2438,2004,1999,
    2032,2019,2107,2004,2201,1915,2009,1970,2013,
    2019,2034,1931,1970,1977,2013,2298,1955,2017,
    2019,2032,2034,1942,2035,1945,2031,2033,2005,
    2011,1963,2029,2013,1977,2016,2007,2035,1942,
    1931,2037,1937,2033,2038,2012,1909,1908,2039,
    1931,2034,2037,2035,2040,1951,1957,1951,2040,
    2255,2263,2033,2039,2042,1909,2033,2263,2038,
    2012,2038,2022,2042,2043,2044,2003,2105,2114,
    2007,2046,2035,2042,2039,2043,2043,1986,2044,
    2390,2397,2024,2026,2074,2032,2007,2114,2046,
    2032,2049,2034,2040,2035,2050,2046,2050,2035,
    2024,2397,2028,2040,2050,2062,2098,2025,2023,
    2032,2074,2049,2034,2049,2053,2255,2033,2031,
    2054,2039,1908,2040,2062,1957,2034,2053,2037,
    2051,2057,2115,1908,2052,2054,2054,2058,2039,
    2059,2018,2016,2115,2057,2116,2039,2058,2043,
    1977,2059,2016,2043,2063,1986,2043,2058,2063,
    2064,2066,1939,2045,2006,2047,2057,1955,2036,
    1939,1927,2064,2067,1957,2062,2036,1955,1960,
    2015,2051,2047,2064,2068,2066,2047,2006,2015,
    2052,2088,2054,1960,2041,2036,2067,1965,1957,
    2051,2017,2057,2066,2068,2071,1971,2048,2041,
    2017,2051,2015,2074,2026,2069,2072,1972,1965,
    1960,1971,2041,2057,2017,1955,2069,2226,2074,
    1977,2073,2059,2069,2222,2226,2091,2094,2058,
    1965,2067,2072,1971,2076,2048,1926,1952,2077,
    2067,2153,2072,1977,1940,2073,2058,2094,2063,
    2048,2076,2055,2073,2080,2059,2070,2024,2075,
    2077,1927,1926,2055,2081,2060,2077,2083,1927,
    2059,2080,2065,2056,2084,2121,2076,2081,2055,
    2075,2084,2056,2222,2069,2138,1993,2060,2081,
    2062,2050,2131,2085,2052,1941,2083,2064,1927,
    2081,2419,1993,2064,2087,2068,2088,2052,2085,
    2054,2091,2058,2083,2087,2064,2082,2078,2090,
    2086,2090,2078,2087,2092,2068,2082,2090,2002,
    2230,2049,2074,2018,2059,2065,2061,2093,2070,
    2054,2088,2091,2018,2065,2021,2095,2023,2021,
    2089,2093,2061,2093,2024,2070,2002,2045,2082,
    2065,2095,2021,2002,2006,2045,2081,2245,2419,
    2097,2099,1994,2100,1974,2096,2090,2086,2342,
    2077,2119,2083,2095,2098,2023,2098,2103,2025,
    1994,2099,2001,2060,2104,2141,2101,1983,2100,
    2085,2102,2088,2119,2124,2083,2075,2028,2084,
    2099,2105,2001,2060,1993,2104,2101,2107,1983,
    2024,2028,2075,2130,2136,2098,2085,2171,2102,
    2083,2124,2087,2102,2110,2088,2099,2207,2105,
    2025,2103,2027,2001,2105,2003,2107,1985,1983,
    2087,2129,2092,2103,1994,2027,2098,2136,2103,
    2110,2091,2088,2091,2214,2094,2089,2384,2093,
    2117,2077,1952,2110,2214,2091,2096,2118,2100,
    2094,2216,2210,2214,2216,2094,2101,2100,2120,
    2095,2130,2098,2117,2119,2077,2100,2118,2120,
    2109,2104,1999,2082,2108,2106,2078,2082,2106,
    2121,2123,1987,2102,2171,2122,2101,2120,2026,
    2108,2082,2045,2104,1993,1999,2108,2045,2111,
    2102,2125,2110,1999,2004,2109,2120,2069,2026,
    1990,2123,2126,2111,2047,2112,2128,1998,2126,
    2101,2026,2107,2065,2127,2095,2102,2122,2125,
    2109,2004,2113,2111,2045,2047,2112,2047,2051,
    2065,2080,2127,2129,2087,2124,2004,1915,2113,
    2107,2026,2032,2127,2130,2095,2113,1915,1967,
    2051,2115,2112,2506,2000,2128,2288,2131,2050,
    2118,2133,2138,2121,2137,2123,2062,2131,2139,
    2103,2097,1994,2116,2057,2036,2131,2160,2139,
    2136,2097,2103,2131,2157,2160,2142,2143,2144,
    2137,2121,2084,2118,2138,2120,2123,2137,2146,
    2143,2145,2144,2022,2148,2117,2139,2067,2062,
    2145,2149,2144,2106,2144,2149,1932,1956,2151,
    2108,2144,2106,2153,2067,2139,2069,2120,2138,
    2117,2148,2119,2111,2144,2108,2123,2146,2126,
    2151,1941,1932,2112,2144,2111,2154,2124,2119,
    1941,2151,2085,2115,2144,2112,2116,2036,2132,
    2164,2151,1956,2072,2155,2079,2116,2144,2115,
    2148,2154,2119,2072,2153,2155,2136,2130,2322,
    2154,2194,2124,2144,2116,2132,2132,2041,2134,
    2132,2134,2144,2132,2036,2041,2084,2028,2159,
    2134,2135,2144,2131,2288,2157,2134,2041,2048,
    2037,2176,2158,2124,2194,2129,2135,2140,2144,
    2140,2141,2144,2159,2137,2084,2134,2048,2135,
    2137,2163,2146,2141,2147,2144,2048,2055,2135,
    2159,2163,2137,2147,2150,2144,2139,2160,2166,
    2135,2055,2140,2161,2167,2162,2150,2152,2144,
    2165,2148,2022,2167,2161,2169,2060,2141,2140,
    2163,2518,2146,2152,2008,2144,2038,2165,2022,
    2167,2170,2162,2055,2060,2140,2139,2166,2153,
    2151,2171,2085,2165,2172,2148,2153,2173,2155,
    2151,2164,2171,2141,2104,2147,2153,2166,2173,
    2169,2174,2167,2172,2154,2148,2147,2109,2150,
    2186,2168,1953,2168,2186,2191,2104,2109,2147,
    2169,2177,2174,2168,2191,2175,2174,2179,2167,
    2152,2150,2113,2178,2160,2157,2174,1925,2179,
    2037,2053,2176,2109,2113,2150,2156,2181,2096,
    2167,2179,2170,2113,1967,2152,2158,2176,2183,
    2160,2178,2444,2156,2175,2181,2181,2118,2096,
    2008,2152,1967,2179,2184,2170,1975,2187,2142,
    2158,2183,2164,2178,2461,2444,2177,2010,1922,
    2164,2188,2171,2177,1922,2174,2186,1953,1944,
    2160,2444,2166,2129,2190,2092,2164,2183,2188,
    2166,2444,2450,2142,2187,2143,1922,1925,2174,
    2143,2187,2193,2171,2188,2122,2166,2450,2173,
    2179,1939,2184,2187,2218,2193,1925,1939,2179,
    2143,2193,2145,2196,2181,2175,1939,2066,2184,
    2145,2198,2149,2129,2194,2199,2145,2193,2198,
    2196,2175,2191,2209,2212,2194,2149,2078,2106,
    2196,2133,2181,2053,2266,2176,2194,2212,2199,
    2149,2198,2078,2197,2169,2185,2129,2199,2190,
    2190,2204,2500,2181,2133,2118,2199,2204,2190,
    2185,2169,2161,2275,2188,2183,1921,2205,1940,
    2232,2207,2099,2218,2187,2213,2204,2061,2500,
    2416,2425,2186,2125,2122,2323,2223,2198,2193,
    2205,1921,2203,2105,2208,2114,2063,2094,2210,
    2186,2425,2191,2205,2258,1940,2209,2194,2154,
    2191,2425,2435,2198,2086,2078,2205,2203,2227,
    2207,2208,2105,2172,2209,2154,2198,2223,2086,
    2191,2435,2196,2063,2210,2014,2208,2285,2114,
    2200,2244,2237,2210,2029,2014,1975,2213,2187,
    2200,2249,2244,2079,2213,1975,2200,2180,2249,
    2258,2262,2073,2215,2197,2192,2114,2285,2046,
    2217,2202,2201,2200,2182,2180,2046,2285,2050,
    2199,2219,2204,2200,2189,2182,2211,2215,2192,
    2200,2195,2189,2221,2217,2201,2212,2219,2199,
    2215,2177,2197,2210,2220,2029,2217,2224,2202,
    2219,2089,2204,2193,2218,2223,2207,2250,2208,
    2215,2010,2177,2216,2220,2210,2217,2242,2224,
    2197,2177,2169,2220,2011,2029,2202,2224,2203,
    2079,2422,2213,2220,2030,2011,2204,2089,2061,
    2220,2239,2030,2074,2226,2230,2200,2229,2225,
    2125,2231,2110,2227,2203,2224,2226,2260,2230,
    2097,2232,2099,1989,1992,2206,2227,2265,2205,
    2097,2228,2232,2049,2233,2053,2278,2227,2224,
    2110,2231,2214,2206,1992,2211,2235,2216,2214,
    2049,2230,2233,1992,1997,2211,2233,2266,2053,
    1997,2215,2211,2265,2258,2205,2235,2214,2231,
    2216,2235,2239,2221,2161,2162,2236,2240,2228,
    1997,2010,2215,2221,2162,2217,2236,2392,2240,
    2260,2226,2257,2216,2239,2220,2228,2240,2232,
    2445,2219,2212,2162,2242,2217,2207,2232,2246,
    2245,2081,2241,2230,2260,2269,2242,2278,2224,
    2230,2269,2233,2232,2240,2246,2031,2030,2248,
    2250,2207,2246,2323,2293,2125,2247,2252,2241,
    2162,2170,2242,2248,2030,2254,2231,2125,2293,
    2248,2255,2031,2231,2295,2235,2241,2252,2245,
    2293,2295,2231,2235,2299,2239,2295,2299,2235,
    2080,2073,2262,2234,2229,2200,2257,2331,2260,
    2236,2386,2392,2200,2237,2234,2246,2240,2264,
    2038,2367,2165,2261,2347,2368,2238,2268,2243,
    2263,2367,2038,2392,2264,2240,2258,2270,2262,
    2271,2183,2176,2238,2259,2268,2265,2270,2258,
    2176,2266,2271,2268,2324,2243,2271,2275,2183,
    2254,2283,2248,2247,2274,2252,2283,2286,2248,
    2255,2248,2286,2267,2274,2247,2274,2277,2252,
    2317,2122,2188,2280,2256,2251,2323,2122,2317,
    2227,2279,2265,2233,2351,2266,2254,2282,2283,
    2279,2227,2278,2279,2284,2265,2271,2266,2354,
    2266,2351,2354,2284,2270,2265,2182,2273,2272,
    2180,2182,2272,2285,2288,2050,2284,2287,2270,
    2189,2273,2182,2267,2376,2274,2255,2286,2290,
    2289,2292,2138,2289,2138,2133,2208,2291,2285,
    2273,2189,2276,2292,2222,2138,2276,2189,2195,
    2309,2282,2308,2259,2502,2268,2250,2291,2208,
    2276,2195,2281,2283,2282,2309,2285,2291,2294,
    2278,2383,2279,2283,2311,2286,2279,2388,2284,
    2291,2319,2294,2309,2311,2283,2289,2435,2297,
    2279,2383,2388,2297,2300,2292,2297,2292,2289,
    2285,2294,2288,2314,2290,2286,2311,2314,2286,
    2157,2288,2294,2292,2253,2222,2243,2298,2017,
    2253,2292,2300,2299,2254,2239,2294,2319,2327,
    2222,2257,2226,2374,2290,2320,2327,2157,2294,
    2302,2384,2301,2222,2253,2257,2239,2254,2030,
    2264,2305,2246,2293,2323,2377,2127,2080,2310,
    2306,2002,2090,2377,2381,2293,2307,1971,1960,
    2246,2305,2250,2262,2310,2080,2090,2342,2306,
    2305,2312,2250,2303,2307,1960,2295,2387,2299,
    2002,2306,2313,2381,2387,2295,2307,2241,1971,
    2306,2256,2313,2310,2316,2127,2299,2282,2254,
    2225,2229,2296,2387,2282,2299,2313,2006,2002,
    2296,2229,2301,2312,2291,2250,2188,2275,2317,
    2229,2234,2301,2297,2315,2300,2318,2300,2315,
    2127,2316,2130,2076,1971,2241,2290,2314,2320,
    2302,2301,2234,2313,2238,2006,2076,2241,2081,
    2300,2321,2253,2304,2302,2237,2238,2243,2015,
    2319,2291,2312,2321,2300,2318,2015,2243,2017,
    2234,2237,2302,2316,2322,2130,2253,2321,2328,
    2317,2275,2325,2243,2324,2298,2237,2244,2304,
    2322,2228,2136,2304,2244,2341,2298,2329,2303,
    2253,2328,2257,2236,2228,2322,2317,2325,2330,
    2251,2306,2342,2178,2157,2327,2298,2324,2329,
    2331,2257,2328,2329,2334,2303,2136,2228,2097,
    2260,2335,2269,2270,2336,2262,2306,2251,2256,
    2317,2330,2323,2260,2331,2335,2305,2264,2349,
    2313,2256,2259,2313,2259,2238,2335,2412,2269,
    2336,2310,2262,2307,2303,2334,2305,2353,2312,
    2310,2339,2316,2307,2247,2241,2353,2357,2319,
    2353,2319,2312,2304,2341,2397,2334,2247,2307,
    2336,2339,2310,2086,2338,2342,2339,2343,2316,
    1906,2324,2268,2341,2345,2337,2341,2337,2332,
    2268,2502,1906,2347,2329,2324,2345,2272,2337,
    2330,2325,2432,2316,2343,2322,2338,2348,2342,
    2347,2324,1906,2338,2346,2348,2308,2200,2309,
    2343,2236,2322,2329,2347,2261,2251,2342,2348,
    2349,2353,2305,2233,2269,2351,2345,2341,2249,
    2341,2244,2249,2287,2336,2270,2200,2311,2309,
    2345,2180,2272,2415,2365,2349,2249,2180,2345,
    2349,2365,2353,2200,2314,2311,2355,2339,2336,
    2163,2159,2337,2334,2329,2261,2332,2337,2159,
    2200,2320,2314,2271,2354,2359,2287,2355,2336,
    2337,2360,2163,2319,2361,2327,2200,2326,2320,
    2337,2272,2360,2334,2261,2267,2319,2357,2361,
    2334,2267,2247,2326,2200,2333,2363,1923,2518,
    2271,2359,2275,1906,1918,2347,2518,2360,2363,
    2340,2333,2200,2359,2325,2275,2200,2350,2195,
    2200,2344,2340,1923,2364,1934,2200,2352,2350,
    2346,2362,2366,2344,2200,2225,2200,2356,2352,
    2412,2351,2269,2363,2364,1923,2200,2315,2356,
    1934,2364,2369,2346,2366,2348,2200,2318,2315,
    2353,2365,2357,2370,2357,2365,2348,2372,2251,
    2200,2321,2318,2347,1918,2368,2357,2370,2474,
    1934,2369,1944,2348,2366,2372,2200,2328,2321,
    2373,2261,2368,2325,2359,2421,2255,2290,2263,
    2280,2251,2372,2200,2331,2328,2200,2335,2331,
    2360,2273,2363,2393,2373,2368,2290,2374,2263,
    2272,2273,2360,2357,2474,2361,2267,2261,2373,
    2200,2412,2335,2363,2273,2276,2432,2325,2421,
    2374,2367,2263,2200,2414,2412,2363,2276,2364,
    2373,2376,2267,2378,2242,2170,2200,2417,2414,
    2369,2364,2281,2367,2375,2371,2366,2362,2401,
    2170,2184,2378,2373,2399,2376,2276,2281,2364,
    2200,2421,2417,2278,2242,2378,2366,2405,2372,
    2374,2375,2367,2377,2323,2330,2200,2432,2421,
    2366,2401,2405,2375,2380,2371,2370,2365,1979,
    1976,1979,2365,2274,2382,2277,2200,2437,2432,
    2378,2383,2278,2376,2382,2274,2200,2441,2437,
    2379,2384,2089,2200,2449,2441,2295,2293,2381,
    1918,1943,2368,2281,2350,2391,2390,2024,2093,
    2368,1943,2393,2358,2385,2395,2284,2394,2287,
    2384,2390,2093,2388,2394,2284,2385,2408,2395,
    2358,2395,2362,2389,2344,2398,2362,2395,2401,
    2399,2373,2393,2386,2404,2392,2378,2403,2383,
    2400,2404,2386,2399,2206,2376,2264,2392,2406,
    2159,2028,2332,2378,2184,2403,1910,2372,2405,
    2404,2406,2392,2403,2407,2383,2397,2332,2028,
    2382,2376,2206,2406,2349,2264,2281,2195,2350,
    2383,2407,2388,2206,2211,2382,2449,2387,2381,
    2382,2211,2192,2401,2395,2410,2408,2410,2395,
    2379,2301,2384,2387,2308,2282,2405,2401,1949,
    2296,2301,2379,2391,2352,2396,2409,2411,2400,
    2042,2393,1943,2350,2352,2391,2410,1949,2401,
    2396,2352,2356,2384,2302,2390,2402,2396,2356,
    2405,1949,1954,2374,2326,2375,1943,1909,2042,
    2405,1954,1910,2320,2326,2374,2042,2044,2393,
    2302,2304,2390,2400,2411,2404,2402,2356,2315,
    2393,2044,2399,2333,2375,2326,2404,2413,2406,
    2412,2414,2351,2066,2403,2184,2399,1989,2206,
    2411,2413,2404,2390,2304,2397,2402,2315,2297,
    2403,2071,2407,2375,2333,2380,1989,2399,2044,
    2406,2415,2349,2351,2414,2354,2408,1962,2410,
    1969,2410,1962,2397,2341,2332,2186,1944,2416,
    2413,2415,2406,2333,2340,2380,2354,2417,2359,
    2410,1969,1981,2066,2071,2403,2414,2417,2354,
    2340,2389,2380,1981,1949,2410,2071,2468,2407,
    2416,1944,2369,2079,2155,2422,2420,2423,2424,
    2339,2355,2426,2418,2423,2420,2389,2340,2344,
    2424,2427,2428,2391,2396,2416,2417,2421,2359,
    2225,2296,2398,2419,2429,1993,2420,2424,2409,
    2423,2427,2424,2430,2218,2213,2339,2426,2343,
    2344,2225,2398,2213,2422,2430,2409,2424,2411,
    2426,2386,2343,2428,2431,2433,2371,2172,2367,
    2419,2452,2429,2424,2428,2411,2434,2223,2218,
    2367,2172,2165,2427,2431,2428,2411,2428,2413,
    2371,2436,2172,2431,1973,2433,2343,2386,2236,
    2371,2380,2436,2428,2433,2413,2218,2430,2434,
    2429,2438,1999,2330,2437,2377,2436,2209,2172,
    2394,2439,2287,2413,2433,2415,2196,2289,2133,
    2223,2434,2338,2429,2460,2438,2459,2434,2430,
    2415,1976,2365,2432,2437,2330,2440,2212,2209,
    2196,2435,2289,2433,1973,1976,2287,2439,2355,
    2433,1976,2415,2437,2441,2377,2436,2440,2209,
    2369,2281,2391,2439,2443,2355,2223,2338,2086,
    2201,2004,2438,2440,2445,2212,2369,2391,2416,
    2418,2447,2423,2441,2381,2377,2425,2416,2396,
    2446,2419,2245,2443,2426,2355,2448,2155,2173,
    2441,2449,2381,2442,2447,2418,2425,2396,2402,
    2446,2245,2252,2219,2379,2089,2444,2461,2469,
    2447,2451,2423,2443,2400,2426,2446,2452,2419,
    2444,2469,2450,2155,2448,2422,2445,2379,2219,
    2435,2425,2402,2443,2409,2400,2277,2446,2252,
    2435,2402,2297,2422,2453,2430,2361,2454,2327,
    2426,2400,2386,2449,2308,2387,2446,2477,2452,
    2436,2389,2440,2455,2456,2458,2448,2453,2422,
    2454,2178,2327,2380,2389,2436,2423,2451,2427,
    2430,2453,2459,2388,2457,2394,2440,2389,2398,
    1987,2427,2451,2454,2461,2178,2455,2458,2462,
    2388,2407,2457,2440,2398,2445,2451,2121,1987,
    2463,2464,2462,2394,2457,2465,2452,2460,2429,
    2398,2296,2445,2454,2486,2461,2460,2221,2438,
    2463,2462,2458,2379,2445,2296,2468,2471,2457,
    2434,2346,2338,2464,2463,2466,1987,2431,2427,
    2457,2471,2465,2071,2467,2468,2431,1990,1973,
    2434,2459,2346,2068,2467,2071,1987,1990,2431,
    2438,2221,2201,2439,2394,2465,2461,2490,2469,
    2466,2472,2464,2468,2470,2471,2465,2473,2439,
    1962,2472,1961,2467,2470,2468,2465,2479,2473,
    2470,2475,2471,2472,2466,1961,2446,2277,2477,
    2443,2439,2473,2448,2476,2453,2456,2478,2458,
    2361,2474,2480,2449,2200,2308,2481,2478,2456,
    2473,2409,2443,2471,2475,2479,2458,2478,2483,
    2475,2418,2479,2477,2185,2452,2056,2451,2447,
    2358,2453,2476,1969,2482,1981,2277,2192,2477,
    2496,2480,2474,2457,2407,2468,1969,1968,2482,
    2056,2121,2451,2454,2361,2480,1981,2482,2484,
    2479,2418,2420,2463,2458,2483,2486,2454,2480,
    2068,2092,2467,2453,2358,2459,2463,2483,1974,
    2452,2185,2460,2480,2499,2486,2470,2467,2487,
    2459,2362,2346,2471,2479,2465,2480,2496,2499,
    2460,2161,2221,2092,2487,2467,2459,2358,2362,
    2473,2420,2409,2485,2488,2442,1981,2484,1982,
    2185,2161,2460,2483,2096,1974,1982,2484,2491,
    2479,2420,2473,2475,2470,2489,2490,2461,2486,
    2385,2358,2476,2463,1974,2466,2009,2144,2008,
    2487,2489,2470,2466,1980,1961,2488,2447,2442,
    2474,2370,2492,2489,2442,2475,2481,2493,2494,
    2277,2382,2192,1982,2491,1984,2488,2056,2447,
    2173,2495,2448,2192,2197,2477,1984,2491,1914,
    2370,1979,2492,2495,2173,2450,2477,2197,2185,
    2474,2492,2496,2476,2448,2495,2475,2442,2418,
    2016,2018,2144,2497,2256,2280,2478,2481,2494,
    2488,2075,2056,2450,2498,2495,2018,2021,2144,
    2190,2487,2092,2478,2494,2156,2450,2469,2498,
    2497,2259,2256,2500,2489,2487,1914,1988,1984,
    2021,2023,2144,2501,2476,2495,2190,2500,2487,
    2502,2259,2497,2023,2025,2144,2495,2498,2501,
    1950,1988,1933,2494,2175,2156,2489,2485,2442,
    2025,2027,2144,2501,2385,2476,2486,2499,2455,
    1988,1914,1933,2485,2489,2500,2469,2490,2503,
    2486,2455,2490,2485,2500,2061,2482,1968,1985,
    2156,2483,2478,2485,2061,2070,2482,1928,2484,
    2483,2156,2096,2010,2504,1922,2469,2503,2498,
    2498,2505,2501,1985,1928,2482,2498,2503,2505,
    2485,2070,2488,2010,1946,2504,2168,2493,1953,
    2000,2506,2516,2070,2075,2488,2504,1926,1922,
    2501,2508,2385,1948,2504,1946,2501,2505,2508,
    2491,2484,2507,2504,1952,1926,1979,1978,2509,
    2508,2408,2385,1912,2280,1910,1948,1952,2504,
    2168,2494,2493,1926,1925,1922,2497,2280,1912,
    2490,2462,2503,2175,2494,2168,2484,1928,2507,
    2492,1979,2509,2491,2507,1916,2510,2128,2126,
    2455,2462,2490,2511,2513,2144,2503,2462,2464,
    1931,2507,1928,2497,1912,1936,2503,2464,2505,
    2492,2512,2496,2507,1937,1916,2513,2514,2144,
    2505,2472,2508,2497,1936,2502,2492,2509,2512,
    2510,2126,2146,2507,1931,1937,2496,2512,2515,
    2502,1911,1906,2505,2464,2472,2514,2142,2144,
    2510,1924,2128,2491,1916,1914,2508,2472,1962,
    2502,1936,1911,2508,1962,2408,2496,2515,2499,
    2499,2456,2455,2280,2372,1910,2510,1923,1924,
    2499,2515,2456,2000,2509,1978,2128,1924,2506,
    1907,1913,1950,2509,2516,2512,2000,2516,2509,
    1950,1933,1907,2506,1924,1935,1913,1907,1908,
    2511,1965,2513,1941,1907,1933,2512,2517,2515,
    2513,1972,2514,2519,1935,1953,2513,1965,1972,
    2512,2516,2517,2515,2517,2481,2514,1975,2142,
    2518,2510,2146,2514,1972,1975,1919,2144,2027,
    2515,2481,2456,2518,1923,2510,1919,1920,2144,
    2360,2518,2163,2144,1920,1929,2516,2519,2517,
    1929,1942,2144,2516,2506,2519,2517,2493,2481,
    2144,1942,1945,2517,2519,2493,1945,1951,2144,
    2506,1935,2519,1951,2511,2144,1953,2493,2519,
    2027,1994,1919,2529,2530,2662,2528,2530,2529,
    2535,2525,2547,2536,2540,2524,2537,2542,2543,
    2535,2538,2525,2536,2553,2540,2538,2545,2528,
    2526,2528,2529,2524,2540,2531,2544,2547,2534,
    2540,2570,2531,2528,2545,2530,2534,2547,2639,
    2638,2549,2541,2532,2554,2535,2536,2522,2553,
    2579,2552,2530,2575,2538,2535,2542,2557,2543,
    2542,2559,2557,2557,2647,2543,2556,2522,2615,
    2560,2562,2558,2522,2556,2555,2647,2550,2543,
    2537,2564,2551,2522,2555,2553,2537,2543,2564,
    2582,2559,2542,2560,2567,2562,2566,2567,2560,
    2567,2641,2562,2548,2569,2561,2570,2563,2531,
    2568,2571,2599,2563,2566,2560,2551,2564,2548,
    2598,2635,2559,2564,2569,2548,2569,2572,2561,
    2570,2566,2563,2537,2551,2552,2574,2566,2570,
    2665,2574,2570,2575,2535,2554,2575,2578,2538,
    2587,2575,2554,2575,2593,2578,2587,2593,2575,
    2530,2545,2579,2538,2578,2545,2578,2582,2545,
    2552,2579,2537,2564,2550,2569,2571,2639,2573,
    2581,2563,2584,2543,2550,2564,2573,2526,2576,
    2526,2529,2576,2531,2563,2581,2563,2560,2584,
    2584,2560,2558,2636,2624,2572,2580,2595,2583,
    2545,2582,2579,2590,2587,2554,2580,2588,2595,
    2579,2542,2537,2579,2582,2542,2578,2598,2582,
    2601,2558,2586,2581,2597,2592,2593,2598,2578,
    2541,2549,2602,2581,2584,2597,2603,2586,2558,
    2597,2584,2601,2580,2589,2619,2582,2598,2559,
    2558,2562,2603,2586,2603,2590,2601,2586,2622,
    2602,2546,2541,2589,2583,2591,2602,2606,2546,
    2590,2605,2587,2589,2580,2583,2603,2605,2590,
    2583,2585,2591,2612,2602,2549,2612,2615,2602,
    2602,2615,2606,2591,2585,2594,2607,2592,2649,
    2603,2609,2605,2585,2565,2594,2605,2610,2587,
    2600,2611,2627,2608,2611,2600,2607,2581,2592,
    2562,2609,2603,2587,2610,2593,2596,2594,2565,
    2561,2572,2608,2593,2613,2598,2601,2584,2558,
    2610,2613,2593,2565,2568,2596,2572,2624,2608,
    2596,2568,2599,2533,2614,2604,2608,2624,2611,
    2641,2643,2609,2546,2614,2533,2598,2613,2635,
    2614,2524,2604,2614,2536,2524,2617,2615,2612,
    2604,2524,2607,2619,2589,2618,2616,2617,2612,
    2607,2531,2581,2609,2562,2641,2591,2618,2589,
    2524,2531,2607,2594,2618,2591,2596,2618,2594,
    2599,2618,2596,2618,2599,2621,2606,2536,2614,
    2621,2623,2618,2623,2625,2618,2625,2626,2618,
    2585,2600,2627,2626,2628,2618,2628,2629,2618,
    2546,2606,2614,2629,2619,2618,2632,2568,2565,
    2624,2630,2611,2627,2632,2565,2630,2527,2539,
    2621,2599,2571,2549,2631,2612,2606,2522,2536,
    2522,2606,2615,2571,2573,2621,2539,2527,2544,
    2544,2532,2547,2623,2621,2573,2631,2633,2616,
    2527,2532,2544,2625,2623,2576,2573,2576,2623,
    2547,2532,2535,2617,2556,2615,2631,2616,2612,
    2634,2617,2616,2539,2627,2611,2611,2630,2539,
    2653,2634,2633,2642,2636,2572,2627,2539,2632,
    2622,2630,2620,2556,2617,2634,2622,2637,2527,
    2534,2632,2544,2634,2616,2633,2632,2539,2544,
    2628,2655,2629,2523,2555,2634,2637,2532,2527,
    2635,2638,2541,2634,2577,2523,2632,2534,2568,
    2620,2624,2636,2637,2554,2532,2634,2555,2556,
    2634,2646,2577,2568,2534,2571,2635,2613,2638,
    2636,2597,2620,2549,2638,2640,2624,2620,2630,
    2597,2601,2620,2571,2534,2639,2600,2585,2583,
    2620,2601,2622,2622,2527,2630,2639,2526,2573,
    2586,2637,2622,2595,2600,2583,2637,2590,2554,
    2627,2565,2585,2586,2590,2637,2567,2648,2641,
    2640,2631,2549,2642,2572,2569,2631,2640,2644,
    2550,2642,2569,2566,2574,2645,2595,2588,2561,
    2574,2646,2645,2577,2646,2574,2588,2548,2561,
    2566,2645,2567,2561,2608,2595,2645,2648,2567,
    2595,2608,2600,2641,2521,2643,2647,2649,2550,
    2580,2619,2651,2644,2640,2660,2652,2626,2625,
    2644,2633,2631,2648,2521,2641,2625,2576,2652,
    2653,2633,2644,2642,2550,2649,2645,2650,2648,
    2626,2654,2628,2644,2661,2653,2650,2645,2646,
    2642,2592,2636,2648,2650,2520,2634,2650,2646,
    2652,2654,2626,2592,2642,2649,2634,2520,2650,
    2654,2655,2628,2597,2636,2592,2648,2520,2521,
    2605,2609,2656,2657,2559,2635,2654,2662,2664,
    2605,2656,2610,2654,2664,2655,2656,2658,2610,
    2643,2656,2609,2651,2619,2629,2657,2557,2559,
    2629,2655,2651,2657,2533,2557,2610,2658,2613,
    2651,2659,2588,2635,2541,2657,2638,2613,2658,
    2657,2546,2533,2638,2658,2640,2659,2548,2588,
    2541,2546,2657,2533,2647,2557,2651,2588,2580,
    2649,2647,2604,2658,2656,2660,2656,2643,2660,
    2576,2529,2652,2647,2533,2604,2660,2640,2658,
    2604,2607,2649,2529,2662,2652,2661,2660,2643,
    2654,2652,2662,2643,2521,2661,2661,2644,2660,
    2662,2530,2552,2663,2653,2661,2662,2552,2664,
    2655,2659,2651,2655,2664,2659,2653,2663,2634,
    2659,2551,2548,2521,2520,2663,2663,2520,2634,
    2663,2661,2521,2540,2665,2570,2553,2665,2540,
    2664,2552,2551,2555,2523,2553,2664,2551,2659,
    2665,2553,2523,2577,2574,2665,2523,2577,2665,
    2639,2525,2526,2547,2525,2639,2525,2528,2526,
    2525,2538,2528,2668,2677,2669,2668,2679,2677,
    2681,2679,2668,2677,2687,2669,2679,2689,2677,
    2694,2695,2692,2677,2689,2687,2667,2688,2666,
    2695,2678,2692,2684,2689,2679,2688,2686,2666,
    2698,2691,2672,2700,2673,2678,2684,2679,2681,
    2802,2689,2684,2700,2678,2695,2685,2703,2670,
    2698,2704,2691,2703,2701,2670,2685,2706,2703,
    2749,2770,2682,2777,2693,2705,2696,2706,2685,
    2688,2707,2686,2772,2697,2699,2688,2740,2707,
    2734,2772,2699,2709,2717,2710,2717,2719,2710,
    2714,2713,2711,2675,2715,2714,2715,2713,2714,
    2685,2670,2707,2668,2722,2721,2713,2715,2764,
    2668,2669,2722,2724,2688,2667,2715,2710,2764,
    2727,2723,2703,2718,2724,2667,2721,2728,2718,
    2728,2724,2718,2731,2728,2721,2719,2732,2733,
    2690,2728,2731,2735,2730,2720,2722,2731,2721,
    2737,2731,2722,2755,2726,2729,2725,2735,2720,
    2717,2732,2719,2725,2708,2735,2738,2736,2734,
    2750,2732,2717,2737,2722,2669,2669,2687,2737,
    2701,2708,2725,2724,2740,2688,2741,2782,2736,
    2723,2701,2703,2723,2708,2701,2742,2724,2728,
    2738,2743,2736,2742,2740,2724,2743,2741,2736,
    2690,2742,2728,2696,2740,2742,2716,2745,2709,
    2706,2727,2703,2717,2709,2745,2746,2672,2737,
    2747,2745,2716,2672,2690,2731,2735,2693,2730,
    2755,2750,2745,2735,2708,2697,2731,2737,2672,
    2747,2755,2745,2697,2693,2735,2746,2737,2687,
    2723,2699,2708,2680,2748,2741,2699,2697,2708,
    2739,2733,2732,2733,2739,2753,2723,2727,2766,
    2750,2717,2745,2811,2752,2748,2795,2733,2753,
    2755,2756,2750,2758,2754,2749,2680,2741,2743,
    2668,2760,2759,2678,2680,2743,2760,2668,2761,
    2793,2674,2751,2752,2762,2757,2668,2666,2761,
    2791,2762,2671,2754,2720,2751,2668,2667,2666,
    2751,2720,2793,2762,2752,2810,2764,2763,2713,
    2748,2752,2757,2725,2754,2758,2759,2765,2681,
    2670,2701,2758,2762,2810,2671,2726,2755,2747,
    2701,2725,2758,2765,2684,2681,2697,2767,2693,
    2723,2766,2699,2768,2739,2732,2770,2765,2759,
    2810,2739,2768,2750,2768,2732,2780,2763,2694,
    2693,2767,2705,2756,2768,2750,2729,2756,2755,
    2697,2772,2767,2773,2766,2727,2760,2770,2759,
    2763,2771,2694,2760,2682,2770,2775,2766,2773,
    2685,2740,2696,2808,2773,2727,2764,2771,2763,
    2683,2742,2690,2754,2769,2749,2764,2719,2771,
    2761,2682,2760,2719,2733,2771,2686,2774,2682,
    2666,2686,2761,2699,2766,2734,2767,2781,2705,
    2771,2733,2795,2686,2682,2761,2683,2696,2742,
    2749,2682,2774,2766,2775,2734,2691,2683,2690,
    2686,2707,2774,2691,2690,2672,2776,2775,2773,
    2734,2736,2772,2746,2698,2672,2777,2744,2799,
    2711,2713,2776,2778,2712,2702,2779,2698,2746,
    2775,2738,2734,2778,2785,2712,2751,2801,2769,
    2769,2765,2770,2705,2778,2702,2776,2780,2775,
    2730,2777,2799,2754,2751,2769,2780,2738,2775,
    2749,2769,2770,2781,2778,2705,2786,2779,2804,
    2763,2780,2776,2774,2758,2749,2767,2772,2782,
    2777,2730,2693,2668,2759,2681,2781,2767,2782,
    2758,2774,2670,2772,2736,2782,2670,2774,2707,
    2776,2713,2763,2692,2743,2738,2779,2794,2698,
    2667,2668,2718,2785,2747,2712,2685,2707,2740,
    2780,2692,2738,2668,2721,2718,2787,2785,2778,
    2785,2726,2747,2780,2694,2692,2781,2787,2778,
    2789,2787,2781,2782,2789,2781,2782,2741,2789,
    2777,2702,2744,2674,2790,2786,2787,2791,2785,
    2702,2788,2744,2705,2702,2777,2790,2792,2786,
    2791,2726,2785,2757,2791,2787,2793,2790,2674,
    2757,2762,2791,2787,2789,2757,2784,2715,2675,
    2741,2748,2789,2748,2757,2789,2709,2710,2784,
    2671,2729,2726,2791,2671,2726,2709,2784,2783,
    2788,2716,2783,2754,2725,2720,2716,2709,2783,
    2719,2764,2710,2694,2771,2795,2702,2712,2788,
    2694,2795,2695,2795,2796,2695,2716,2788,2712,
    2698,2794,2704,2695,2796,2700,2795,2753,2796,
    2792,2794,2779,2810,2796,2753,2715,2784,2710,
    2810,2700,2796,2792,2779,2786,2716,2712,2747,
    2797,2798,2792,2797,2800,2798,2793,2799,2790,
    2790,2797,2792,2720,2730,2793,2799,2797,2790,
    2730,2799,2793,2794,2792,2798,2801,2802,2684,
    2798,2800,2803,2800,2797,2744,2801,2684,2765,
    2744,2788,2800,2769,2801,2765,2799,2744,2797,
    2689,2804,2687,2803,2675,2676,2804,2746,2687,
    2676,2798,2803,2783,2784,2803,2802,2804,2689,
    2801,2674,2802,2802,2674,2786,2783,2803,2800,
    2800,2788,2783,2751,2674,2801,2746,2804,2779,
    2784,2675,2803,2802,2786,2804,2806,2706,2696,
    2806,2696,2683,2676,2805,2704,2807,2683,2691,
    2807,2806,2683,2691,2704,2807,2794,2676,2704,
    2798,2676,2794,2806,2808,2706,2773,2808,2711,
    2711,2776,2773,2727,2706,2808,2807,2809,2806,
    2809,2808,2806,2809,2807,2805,2676,2675,2805,
    2805,2675,2714,2704,2805,2807,2810,2673,2700,
    2809,2711,2808,2805,2714,2809,2711,2809,2714,
    2739,2810,2753,2729,2671,2810,2810,2756,2729,
    2810,2768,2756,2678,2743,2692,2680,2811,2748,
    2680,2673,2811,2811,2673,2810,2811,2810,2752,
    2678,2673,2680,2812,2813,2814,2814,2815,2812,
    2815,2816,2812,2816,2815,2813,2814,2813,2815,
    2816,2813,2812,];
  bilibili2_color_type = [
    [0.4588235294117647, 0.807843137254902, 0.7568627450980392], // 黑色
    [0.16862745098039217,0.1803921568627451,0.19215686274509805],//白色
    [0.9137254901960784,0.5882352941176471,0.5490196078431373], //蓝色
    [1,0.8666666666666667,0.10196078431372549], //灰色
  ]
  bilibili2_colors = []
  //触手
  for (var i = 0; i <= 745; i++) {
    bilibili2_colors.push(bilibili2_color_type[0][0]);
    bilibili2_colors.push(bilibili2_color_type[0][1]);
    bilibili2_colors.push(bilibili2_color_type[0][2]);
  }
  //白色身体
  for (var i = 746; i <= 1087 ; i++) {
    bilibili2_colors.push(bilibili2_color_type[1][0]);
    bilibili2_colors.push(bilibili2_color_type[1][1]);
    bilibili2_colors.push(bilibili2_color_type[1][2]);
  }
  //眼睛
  for (var i = 1088 ; i <= 1619 ; i++) {
    bilibili2_colors.push(bilibili2_color_type[2][0]);
    bilibili2_colors.push(bilibili2_color_type[2][1]);
    bilibili2_colors.push(bilibili2_color_type[2][2]);
  }
  //脸
  for (var i = 1620; i <= 2519 ; i++) {
    bilibili2_colors.push(bilibili2_color_type[1][0]);
    bilibili2_colors.push(bilibili2_color_type[1][1]);
    bilibili2_colors.push(bilibili2_color_type[1][2]);
  }
  //foot
  for (var i = 2520; i <= 2811 ; i++) {
    bilibili2_colors.push(bilibili2_color_type[0][0]);
    bilibili2_colors.push(bilibili2_color_type[0][1]);
    bilibili2_colors.push(bilibili2_color_type[0][2]);
  }
  // mouth
  for (var i = 2812 ; i <= 2816 ; i++) {
    bilibili2_colors.push(bilibili2_color_type[3][0]);
    bilibili2_colors.push(bilibili2_color_type[3][1]);
    bilibili2_colors.push(bilibili2_color_type[3][2]);
  }
}

function drawground()
{

        // 创建一个立方体
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
  ground_vertices = [
    800,  -20 ,  500,     -800,  -20,  500,  // v0 v1
    -800,  -30,  500,     800,  -30,  500,  // v2 v3
    800, -30,  -500,     800,  -20,  -500,  // v4 v5
    -800, -20,  -500,     -800,  -30,  -500,  // v6 v7
  ]

  ground_faces = [
    0, 1, 2,   0, 2, 3,    // 前
    0, 3, 4,   0, 4, 5,    // 右
    0, 5, 6,   0, 6, 1,    // 上
    1, 6, 7,   1, 7, 2,    // 左
    7, 4, 3,   7, 3, 2,    // 下
    4, 7, 6,   4, 6, 5     // 后
  ]

  ground_colors = [
    1, 1,1,
    1, 1,1,
    1, 1,1,
    1, 1,1,
    1, 1,1,
    1, 1,1,
    1, 1,1,
    1, 1,1,
  ]

}


function drawlight()
{

        // 创建一个立方体
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
  light_vertices = [
    20,  20 ,  20,     -20,  20,  20,  // v0 v1
    -20,  -20,  20,     20,  -20,  20,  // v2 v3
    20, -20,  -20,     20,  20,  -20,  // v4 v5
    -20, 20,  -20,     -20,  -20,  -20,  // v6 v7
  ]

  light_faces = [
    0, 1, 2,   0, 2, 3,    // 前
    0, 3, 4,   0, 4, 5,    // 右
    0, 5, 6,   0, 6, 1,    // 上
    1, 6, 7,   1, 7, 2,    // 左
    7, 4, 3,   7, 3, 2,    // 下
    4, 7, 6,   4, 6, 5     // 后
  ]

  light_colors = [
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
    217/255, 217/255, 25/255,
  ]

}


function drawguanzhang()
{

        // 创建一个立方体
        //    v6----- v5
        //   /|      /|
        //  v1------v0|
        //  | |     | |
        //  | |v7---|-|v4
        //  |/      |/
        //  v2------v3
        guanzhang_vertices = [
    100,  100 ,  200,     -100,  100,  200,  // v0 v1
    -100,  -100,  200,     100,  -100,  200,  // v2 v3
    100, -100,  -200,     100,  100,  -200,  // v4 v5
    -100, 100,  -200,     -100,  -100,  -200,  // v6 v7
  ]

  guanzhang_faces = [
    0, 1, 2,   0, 2, 3,    // 前
    0, 3, 4,   0, 4, 5,    // 右
    0, 5, 6,   0, 6, 1,    // 上
    1, 6, 7,   1, 7, 2,    // 左
    7, 4, 3,   7, 3, 2,    // 下
    4, 7, 6,   4, 6, 5     // 后
  ]

  guanzhang_colors = [
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
    1,1,1,
  ]

}

function setGeometry(gl) {
  var positions = new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  var matrix = m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformPoint(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function setNormals(gl) {
  var normals = new Float32Array([
          // left column front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // top rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // middle rung front
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,

          // left column back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // middle rung back
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,

          // top
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // top rung right
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // under top rung
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // between top rung and middle
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // top of middle rung
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,

          // right of middle rung
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom of middle rung.
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // right of bottom
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,

          // bottom
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,

          // left side
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0]);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
}
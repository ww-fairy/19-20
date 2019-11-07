// vertex shader
var VERTEX_SHADER_SOURCE =
`
   attribute vec4 a_Position;
   attribute vec4 a_Color;
   varying vec4 v_Color;

   void main()
   {
      v_Color = a_Color;
      gl_Position = a_Position;
   }
`;
// fragment shader
var FRAGMENT_SHADER_SOURCE =
`
precision mediump float;
varying vec4 v_Color;

void main()
{
    gl_FragColor = v_Color;
}
`;
var canvas = document.getElementById("canvas");
var gl = canvas.getContext('webgl');
if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
   alert('Failed to init shaders');
}

// 大圆脸
var N = 100;
var outlineData = [0.0, 0.0];
var r = normalize(50) ;
var R = 245/255.0;
var G = 207/255.0;
var B = 126/255.0;
var A = 1.0;
var outlineColorData = [R,G,B,A];
for (var i = 0; i <= N; i++) {
   var theta = i * 2 * Math.PI / N;
   var x = r * Math.sin(theta);
   var y = r * Math.cos(theta);
   outlineData.push(x, y);
   outlineColorData.push(R,G,B,A);
}
 
// 笑脸酒窝1
var face1Data = [normalize(-55/2), normalize(16)];
var r = normalize(10) ;
var R = 238/255.0;
var G = 163/255.0;
var B = 79/255.0;
var A = 1;
var face1ColorData = [R,G,B,A];
for (var i = 0; i <= N; i++) {
   var theta = i * 2 * Math.PI / N;
   var x = r * Math.sin(theta)*1.5+normalize(-55/2);
   var y = r * Math.cos(theta)*0.5+normalize(16);
   face1Data.push(x, y);
   face1ColorData.push(R,G,B,A);
}

// 笑脸酒窝2
var face2Data = [normalize(55/2), normalize(16)];
var r = normalize(10) ;
for (var i = 0; i <= N; i++) {
   var theta = i * 2 * Math.PI / N;
   var x = r * Math.sin(theta)*1.5+normalize(55/2);
   var y = r * Math.cos(theta)*0.5+normalize(16);
   face2Data.push(x, y);
}

//嘴巴x下
var mouthData = [0, 0];
var r = normalize(40) ;
var R = 115/255.0;
var G = 55/255.0;
var B = 5/255.0;
var A = 1;
var mouthColorData = [R,G,B,A];
for (var i = 50; i <= N; i++) {
   var theta = i/N * 2 * Math.PI - Math.PI/2;
   var x = r * Math.sin(theta);
   var y = r * Math.cos(theta);
   mouthData.push(x, y);
   mouthColorData.push(R,G,B,A);
}

//嘴巴x 上
var mouth2Data = [0, normalize(3)];
var r = normalize(40) ;
for (var i = 50; i <= N; i++) {
   var theta = i * 2 * Math.PI / N - Math.PI/2;;
   var x = r * Math.sin(theta);
   var y = r * Math.cos(theta) + normalize(3);
   mouth2Data.push(x, y);
}

//眼睛1
var eye1Data = [- normalize(55/2),- normalize(9)];
var r = normalize(42) ;
var R = 1;
var G = 1;
var B = 1;
var A = 1;
var eye1ColorData = [R,G,B,A];
for (var i = 18; i <= 32; i++) {
   var theta =  i/N * 2 * Math.PI - Math.PI/2;
   var x = r * Math.sin(theta)- normalize(55/2);
   var y = r * Math.cos(theta)- normalize(9);
   eye1Data.push(x, y);
   eye1ColorData.push(R,G,B,A);
}
// 眼睛11
var eye11Data = [- normalize(55/2),- normalize(9)];
var r = normalize(42-6.5) ;
for (var i = 18; i <= 32; i++) {
   var theta =  i/N * 2 * Math.PI - Math.PI/2;
   var x = r * Math.sin(theta)- normalize(55/2);
   var y = r * Math.cos(theta)- normalize(9);
   eye11Data.push(x, y);
}

// 眼睛2
var eye2Data = [ normalize(55/2),- normalize(9)];
var r = normalize(42) ;
for (var i = 18; i <= 32; i++) {
   var theta =  i/N * 2 * Math.PI - Math.PI/2;
   var x = r * Math.sin(theta)+ normalize(55/2);
   var y = r * Math.cos(theta)- normalize(9);
   eye2Data.push(x, y);
}
// 眼睛22
var eye22Data = [ normalize(55/2),- normalize(9)];
var r = normalize(42-6.5) ;
for (var i = 18; i <= 32; i++) {
   var theta =  i/N * 2 * Math.PI - Math.PI/2;
   var x = r * Math.sin(theta)+ normalize(55/2);
   var y = r * Math.cos(theta)- normalize(9);
   eye22Data.push(x, y);
}

// 眼珠子
var x0 = normalize(-55/2 - (42-6.5/2)*Math.sin(20*(Math.PI/180)));
var y0 = normalize(-9 + (42-6.5/2)*Math.cos(20*(Math.PI/180)));
var eyeleftData = [ x0, y0];
var r = normalize(6.5/2) ;
var R = 115/255.0;
var G = 55/255.0;
var B = 5/255.0;
var A = 1;
var eyeColorData = [R,G,B,A];
for (var i = 0; i <= N; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x0;
   var y = r * Math.cos(theta)+ y0;
   eyeleftData.push(x, y);
   eyeColorData.push(R,G,B,A);
}

var x1 = normalize( 55/2 - (42-6.5/2)*Math.sin(20*(Math.PI/180)));
var y1 = normalize(-9 + (42-6.5/2)*Math.cos(20*(Math.PI/180)));
var eyerightData = [ x1, y1];
var r = normalize(6.5/2) ;
for (var i = 0; i <= N; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x1;
   var y = r * Math.cos(theta)+ y1;
   eyerightData.push(x, y);
}

// 眼弧 
var x0 =  normalize(-55/2 - (42-6.5/2)*Math.sin(25*(Math.PI/180)));
var y0 = normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));
var rad1Data = [x0,y0];
var r = normalize(6.5/2)// 圆的半径
var R = 1;
var G = 1;
var B = 1;
var A = 1;
var radColorData = [R,G,B,A];
for (var i = 42; i <= 100; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x0;
   var y = r * Math.cos(theta)+ y0;
   rad1Data.push(x, y);
   radColorData.push(R,G,B,A)
}

var x0 = + normalize(-55/2 + (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;
var y0 = normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));
var rad2Data = [x0,y0];
var r = normalize(6.5/2)// 圆的半径
var R = 1;
var G = 1;
var B = 1;
var A = 1;
var rad2ColorData = [R,G,B,A];
for (var i = 0; i <= 100; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x0;
   var y = r * Math.cos(theta)+ y0;
   rad2Data.push(x, y);
   rad2ColorData.push(R,G,B,A)
}

var x0 =  normalize(55/2 - (42-6.5/2)*Math.sin(25*(Math.PI/180)));
var y0 = normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));
var rad11Data = [x0,y0];
var r = normalize(6.5/2)// 圆的半径
for (var i = 42; i <= 100; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x0;
   var y = r * Math.cos(theta)+ y0;
   rad11Data.push(x, y);
   radColorData.push(R,G,B,A)
}

var x0 = normalize(55/2 + (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;
var y0 = normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));
var rad22Data = [x0,y0];
var r = normalize(6.5/2)// 圆的半径
for (var i = 0; i <= 100; i++) {
   var theta =  i/N * 2 * Math.PI;
   var x = r * Math.sin(theta)+ x0;
   var y = r * Math.cos(theta)+ y0;
   rad22Data.push(x, y);
   rad2ColorData.push(R,G,B,A)
}

var lineData = [
   normalize(-66), normalize(36),
   normalize(-66),normalize(39),
   normalize(66), normalize(39),
   normalize(66),normalize(36)            
]
var linecolorData = [
   0,0,0,1.0,
   0,0,0,1.0,
   0,0,0,1.0,
   0,0,0,1.0,
] 

var hatData = [
   normalize(-36),normalize(36),
   normalize(-36),normalize(82),
   normalize(36),normalize(82),
   normalize(36),normalize(36),
]

var hatcolorData = [
   0,0,0,1.0,
   0,0,0,1.0,
   0,0,0,1.0,
   0,0,0,1.0,
] 

gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

var outline = new Float32Array(outlineData);
var outlineColor = new Float32Array(outlineColorData);
initVertexBuffers(gl, outline, outlineColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, outline.length / 2);

var mouth = new Float32Array(mouthData);
var mouthColor = new Float32Array(mouthColorData);
initVertexBuffers(gl, mouth,mouthColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, mouthData.length / 2);

var mouth2 = new Float32Array(mouth2Data);
initVertexBuffers(gl, mouth2,outlineColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, mouth2Data.length / 2);

var eye1 = new Float32Array(eye1Data);
var eye1Color = new Float32Array(eye1ColorData);
initVertexBuffers(gl, eye1,eye1Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, eye1Data.length / 2);

var eye11 = new Float32Array(eye11Data);
initVertexBuffers(gl, eye11,outlineColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, eye11Data.length / 2);

var eye2 = new Float32Array(eye2Data);
var eye1Color = new Float32Array(eye1ColorData);
initVertexBuffers(gl, eye2,eye1Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, eye2Data.length / 2);

var eye22 = new Float32Array(eye22Data);
initVertexBuffers(gl, eye22,outlineColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, eye22Data.length / 2);

var eyeleft = new Float32Array(eyeleftData);
var eyeColor = new Float32Array(eyeColorData)
initVertexBuffers(gl, eyeleft, eyeColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0,  eyeleftData.length /2);

var eyeright = new Float32Array(eyerightData);
initVertexBuffers(gl, eyeright, eyeColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, eyerightData.length /2);

var rad1 = new Float32Array(rad1Data);
var radColor = new Float32Array(radColorData)
initVertexBuffers(gl, rad1, radColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, rad1Data.length /2);

var rad2 = new Float32Array(rad2Data);
var rad2Color = new Float32Array(rad2ColorData)
initVertexBuffers(gl, rad2, rad2Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, rad2Data.length /2);

var rad11 = new Float32Array(rad11Data);
var radColor = new Float32Array(radColorData)
initVertexBuffers(gl, rad11, radColor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, rad11Data.length /2);

var rad22 = new Float32Array(rad22Data);
var rad2Color = new Float32Array(rad2ColorData)
initVertexBuffers(gl, rad22, rad2Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, rad22Data.length /2);


var face1 = new Float32Array(face1Data);
var face1Color = new Float32Array(face1ColorData);
initVertexBuffers(gl, face1,face1Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, face1.length / 2);

var face2 = new Float32Array(face2Data);
var face1Color = new Float32Array(face1ColorData);
initVertexBuffers(gl, face2,face1Color);
gl.drawArrays(gl.TRIANGLE_FAN, 0, face2.length / 2);

var line = new Float32Array(lineData);
var linecolor = new Float32Array(linecolorData);
initVertexBuffers(gl, line,linecolor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

var hat = new Float32Array(hatData);
var hatcolor = new Float32Array(hatcolorData);
initVertexBuffers(gl, hat, hatcolor);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

function normalize(x) 
{ 
    x = x/50 * 0.55;
    return x;
}





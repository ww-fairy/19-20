
var gl;
var points;

var vPosition = [];
var outlineBuffer, bufferId2;
var program;

// 为了自己画图方便，做了个像素归一化的工具，归一到 (-1 ，1)
function normalize(x) 
{ 
    x = x/50 * 0.75;
    return x;
}


// 画outline
var n = 512;
var outline = new Float32Array(n*2+2);
var angle = 0; // 开始的弧度
var r = normalize(50) ; // 圆的半径
var stepAngle = 360/(n) * (Math.PI/180);
outline[0] = 0 ;
outline[1] = 0;
for(var i=2; i<n*2+2; i+=2){
    // // 计算顶点x坐标
    // outline[i] = r * Math.cos(angle);
    // // 计算顶点y坐标
    // outline[i+1] = r * Math.sin(angle);
    outline[i] = r * Math.cos(angle);
    outline[i+1] = r * Math.sin(angle);
 //   outline[i] = vec2(r * Math.cos(angle),r * Math.sin(angle) );
    angle += stepAngle;
}



// face1
var n_face = 256;
var face_1 = new Float32Array(n_face*2);
var angle = 0; // 开始的弧度
var r = normalize(10); // 圆的半径
var stepAngle = 360/n_face * (Math.PI/180);
for(var i=0; i<n_face*2; i+=2){
    face_1[i]= r * Math.cos(angle) * 1.5 + normalize(-55/2);    //乘以2和除以二只是为了调整显示效果
    face_1[i+1]= r * Math.sin(angle) *0.5 + normalize(16);   //因为控制台显示字符的时候宽和高不等比例
    angle += stepAngle;
}

// face2
// 整个图像 533*455
var n_face = 256;
var face_2 = new Float32Array(n_face*2);
var angle = 0; // 开始的弧度
var r = normalize(10); // 圆的半径
var stepAngle = 360/n_face * (Math.PI/180);
for(var i=0; i<n_face*2; i+=2){
    face_2[i]= r * Math.cos(angle) * 1.5 + normalize(55/2);    //乘以2和除以二只是为了调整显示效果
    face_2[i+1]= r * Math.sin(angle) *0.5 + normalize(16);   //因为控制台显示字符的时候宽和高不等比例
    angle += stepAngle;
}

//嘴巴1
var n_mouse = 512;
var mouse_1 = new Float32Array(n_mouse*2);
var angle = Math.PI; // 开始的弧度
var r = normalize(40); // 圆的半径
var stepAngle = 360/n_mouse * (Math.PI/180);
for(var i=0; i<n_mouse*2; i+=2){
    mouse_1[i]= r * Math.cos(angle) ;    //乘以2和除以二只是为了调整显示效果
    mouse_1[i+1]= r * Math.sin(angle) ;   //因为控制台显示字符的时候宽和高不等比例
    angle += stepAngle;
}

//嘴巴2
var n_mouse = 512;
var mouse_2 = new Float32Array(n_mouse*2);
var angle = Math.PI; // 开始的弧度
var r = normalize(40); // 圆的半径
var stepAngle = 360/n_mouse * (Math.PI/180);
for(var i=0; i<n_mouse*2; i+=2){
    mouse_2[i]= r * Math.cos(angle) ;   
    mouse_2[i+1]= r * Math.sin(angle)+normalize(3);   
    angle += stepAngle;
}

//眼睛
//(-55/2,-9) R = 42
var n_eye = 512;
var eye_1 = new Float32Array(n_eye*2);
var angle = 64*(Math.PI/180); // 开始的弧度
var r = normalize(42); // 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_1[i]= r * Math.cos(angle) - normalize(55/2) ;   
    eye_1[i+1]= r * Math.sin(angle) - normalize(9);   
    angle += stepAngle;
}

var n_eye = 512;
var eye_11 = new Float32Array(n_eye*2);
var angle = 64*(Math.PI/180); // 开始的弧度
var r = normalize(42-6.5); // 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_11[i]= r * Math.cos(angle) - normalize(55/2) ;   
    eye_11[i+1]= r * Math.sin(angle) - normalize(9);   
    angle += stepAngle;
}

var n_eye = 512;
var eye_2 = new Float32Array(n_eye*2);
var angle = 64*(Math.PI/180); // 开始的弧度
var r = normalize(42); // 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_2[i]= r * Math.cos(angle) + normalize(55/2) ;   
    eye_2[i+1]= r * Math.sin(angle) - normalize(9);   
    angle += stepAngle;
}

var n_eye = 512;
var eye_22 = new Float32Array(n_eye*2);
var angle =64*(Math.PI/180); // 开始的弧度
var r = normalize(42-6.5); // 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_22[i]= r * Math.cos(angle) + normalize(55/2) ;   
    eye_22[i+1]= r * Math.sin(angle) - normalize(9);   
    angle += stepAngle;
}

// 眼珠子 
// (-55/2 - (42-6.5/2)*Math.sin(20*(Math.PI/180)) , -9 + (42-6.5/2)*Math.cos(20*(Math.PI/180)))
// r = 6.5/2
var n_eye = 128;
var eye_left = new Float32Array(n_eye*2);
var angle =64*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_left[i]= r * Math.cos(angle) + normalize(55/2 - (42-6.5/2)*Math.sin(20*(Math.PI/180))) ;   
    eye_left[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(20*(Math.PI/180)));   
    angle += stepAngle;
}

var n_eye = 128;
var eye_right = new Float32Array(n_eye*2);
var angle =64*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_right[i]= r * Math.cos(angle) + normalize(-55/2 - (42-6.5/2)*Math.sin(20*(Math.PI/180))) ;   
    eye_right[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(20*(Math.PI/180)));   
    angle += stepAngle;
}

//眼弧
var n_eye = 128;
var eye_rad_1 = new Float32Array(n_eye*2);
var angle =116*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_rad_1[i]= r * Math.cos(angle) + normalize(-55/2 - (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;   
    eye_rad_1[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));   
    angle += stepAngle;
}

var n_eye = 128;
var eye_rad_11 = new Float32Array(n_eye*2);
var angle =-116*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_rad_11[i]= r * Math.cos(angle) + normalize(-55/2 + (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;   
    eye_rad_11[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));   
    angle += stepAngle;
}

var n_eye = 128;
var eye_rad_2 = new Float32Array(n_eye*2);
var angle =116*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_rad_2[i]= r * Math.cos(angle) + normalize( 55/2 - (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;   
    eye_rad_2[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));   
    angle += stepAngle;
}

var n_eye = 128;
var eye_rad_22 = new Float32Array(n_eye*2);
var angle =-116*(Math.PI/180); // 开始的弧度
var r = normalize(6.5/2)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    eye_rad_22[i]= r * Math.cos(angle) + normalize( 55/2 + (42-6.5/2)*Math.sin(26*(Math.PI/180))) ;   
    eye_rad_22[i+1]= r * Math.sin(angle) + normalize(-9 + (42-6.5/2)*Math.cos(26*(Math.PI/180)));   
    angle += stepAngle;
}

// 眉毛
// (-55/2, 40) R10  (-55/2 , 39) R12
var n_eye = 128;
var brow_1 = new Float32Array(n_eye*2);
var angle = 0 ; // 开始的弧度
var r = normalize(10)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    brow_1[i]= r * Math.cos(angle) + normalize(-55/2) ;   
    brow_1[i+1]= r * Math.sin(angle) + normalize(40);   
    angle += stepAngle;
}

var n_eye = 128;
var brow_11 = new Float32Array(n_eye*2);
var angle = 35*(Math.PI/180) ; // 开始的弧度
var r = normalize(12)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    brow_11[i]= r * Math.cos(angle) + normalize(-55/2) ;   
    brow_11[i+1]= r * Math.sin(angle) + normalize(34);   
    angle += stepAngle;
}

var n_eye = 128;
var brow_2 = new Float32Array(n_eye*2);
var angle = 0 ; // 开始的弧度
var r = normalize(10)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    brow_2[i]= r * Math.cos(angle) + normalize(55/2) ;   
    brow_2[i+1]= r * Math.sin(angle) + normalize(40);   
    angle += stepAngle;
}

var n_eye = 128;
var brow_22 = new Float32Array(n_eye*2);
var angle = 35*(Math.PI/180); // 开始的弧度
var r = normalize(12)// 圆的半径
var stepAngle = 360/n_eye * (Math.PI/180);
for(var i=0; i<n_eye*2; i+=2){
    brow_22[i]= r * Math.cos(angle) + normalize(55/2) ;   
    brow_22[i+1]= r * Math.sin(angle) + normalize(34);   
    angle += stepAngle;
}



//var vertices  = new Float32Array([0, 0, 0, -1, -1, 1]);


var vertices2 = new Float32Array([0, 0, 0, -1, 1, 1,0,1,1,-1]);

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    




    outlineBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, outlineBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, outline, gl.STATIC_DRAW );

    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(outline_color), gl.STATIC_DRAW);


    face_1_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, face_1_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, face_1, gl.STATIC_DRAW );

    face_2_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, face_2_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, face_2, gl.STATIC_DRAW );

    mouse_1_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mouse_1_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, mouse_1, gl.STATIC_DRAW );

    mouse_2_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, mouse_2_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, mouse_2, gl.STATIC_DRAW );


    eye_1_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_1_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_1, gl.STATIC_DRAW );
        
    eye_11_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_11_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_11, gl.STATIC_DRAW );

    eye_2_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_2_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_2, gl.STATIC_DRAW );

    eye_22_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_22_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_22, gl.STATIC_DRAW );

    eye_left_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_left_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_left, gl.STATIC_DRAW );

    eye_right_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_right_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, eye_right, gl.STATIC_DRAW );

    eye_rad1_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad1_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.eye_rad_1, gl.STATIC_DRAW );

    eye_rad11_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad11_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.eye_rad_11, gl.STATIC_DRAW );

    eye_rad2_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad2_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.eye_rad_2, gl.STATIC_DRAW );

    eye_rad22_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad22_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.eye_rad_22, gl.STATIC_DRAW );

    brow1_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, brow1_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.brow_1, gl.STATIC_DRAW );

    brow11_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, brow11_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.brow_11, gl.STATIC_DRAW );
    
    brow2_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, brow2_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.brow_2, gl.STATIC_DRAW );
    
    brow22_buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, brow22_buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.brow_22, gl.STATIC_DRAW );
    

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // vPosition 作用
    gl.bindBuffer( gl.ARRAY_BUFFER, outlineBuffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ))
    gl.vertexAttribPointer( vPosition[0], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[0] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 513  );
    // var vColor = gl.getAttribLocation(program, "vColor");
    // gl.vertexAttribPointer(vColor, 4 , gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);


    gl.bindBuffer( gl.ARRAY_BUFFER, face_1_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[1], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[1] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 256 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, face_2_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[2], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[2] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 256 );

    gl.bindBuffer( gl.ARRAY_BUFFER, mouse_1_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[3], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[3] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 256 );

    gl.bindBuffer( gl.ARRAY_BUFFER, mouse_2_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[4], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[4] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 256 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_1_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[5], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[5] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 74 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_11_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[6], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[6] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 74 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_2_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[7], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[7] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 74 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_22_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[8], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[8] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 74 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_left_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[9], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[9] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 128 );

    gl.bindBuffer( gl.ARRAY_BUFFER, eye_right_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[10], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[10] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 128 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad1_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[11], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[11] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad11_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[12], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[12] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad2_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[13], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[13] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, eye_rad22_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[14], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[14] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
        
    gl.bindBuffer( gl.ARRAY_BUFFER, brow1_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[15], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[15] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
        
    gl.bindBuffer( gl.ARRAY_BUFFER, brow11_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[16], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[16] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 40 );
        
    gl.bindBuffer( gl.ARRAY_BUFFER, brow2_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[17], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[17] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 64 );
        
    gl.bindBuffer( gl.ARRAY_BUFFER, brow22_buffer );
    vPosition.push(gl.getAttribLocation( program, "vPosition" ));
    gl.vertexAttribPointer( vPosition[18], 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition[18] );
    gl.drawArrays( gl.TRIANGLES_FAN, 0, 40 );

}

main();

	// 主程序入口
	function main(){
		var canvas = document.getElementById('glcanvas');
    var context = canvas.getContext('webgl');
    var VSHADER_SOURCE = 
    `
      attribute vec4 a_Position;
      void main(){
        gl_Position = a_Position;
        gl_PointSize = 10.0;
      }
    `;

    // 片元着色器代码（给像素上色）
    var FSHADER_SOURCE =
    `
      void main(){
        gl_FragColor =  vec4(1.0, 0.0, 0.0, 1.0);
      }
    `;
		var program = createProgram(context , VSHADER_SOURCE , FSHADER_SOURCE);
		context.program = program;
		context.useProgram(program);

		var n = initVertexBuffers(context);

    // var square = initSquare(context);
		// 每一次重绘时的背景色
  		context.clearColor(0.0, 0.0, 0.0, 1.0);

		// 清除 <canvas>
		context.clear(context.COLOR_BUFFER_BIT);

		// 画n个点
    context.drawArrays(context.TRIANGLE_FAN, 0, n);
    // context.drawArrays(context.TRIANGLE_FAN,0,square);
  }
  
	function initVertexBuffers(context) {
	  // 画n个点
	  var n = 64;
	  var vertices = new Float32Array(n*2);
	  var angle = 0; // 开始的弧度
	  var r = 0.5; // 圆的半径
	  var stepAngle = 360/n * (Math.PI/180);
	  for(var i=0; i<n*2; i+=2){
	  	// 计算顶点x坐标
	  	vertices[i] = r * Math.cos(angle);
	  	// 计算顶点y坐标
	  	vertices[i+1] = r * Math.sin(angle);
	  	angle += stepAngle;
	  }

    const positions = [
      1.0,  1.0,
     -1.0,  1.0,
      1.0, -1.0,
     -1.0, -1.0,
   ];

	  // 创建一个缓存对象，用于存放顶点数据
	  var vertexBuffer = context.createBuffer();
	  // 绑定缓存对象
	  context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
	  // 把数据写到缓冲对象中
    context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW);
    
    context.bufferData(context.ARRAY_BUFFER,
      new Float32Array(positions),
      context.STATIC_DRAW);



	  // 获取顶点着色器代码中的顶点变量
	  var a_Position = context.getAttribLocation(context.program, 'a_Position');
	  // // 设置变量获取数据规则
	  context.vertexAttribPointer(a_Position, 2, context.FLOAT, false, 0, 0);
	  // // 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
	  context.enableVertexAttribArray(a_Position);

	  return n;
	}
	// 创建一个program（相当于着色器的上下文）
	function createProgram(context, vshader, fshader){
		var vertexShader = loadShader(context, context.VERTEX_SHADER, vshader);
  		var fragmentShader = loadShader(context, context.FRAGMENT_SHADER, fshader);
  		var program = context.createProgram();
  		context.attachShader(program, vertexShader);
  		context.attachShader(program, fragmentShader);

  		context.linkProgram(program);
  		return program;
	}	
	function loadShader(context, type, source){
		var shader = context.createShader(type);
		context.shaderSource(shader, source);
  		context.compileShader(shader);
  		return shader;
	}


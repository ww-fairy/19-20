
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    var N = 100;
    var vertexData = [0.0, 0.0];
    var r = 0.5;
    
    for (var i = 0; i <= N; i++) {
        var theta = i * 2 * Math.PI / N;
        var x = r * Math.sin(theta);
        var y = r * Math.cos(theta);
        vertexData.push(x, y);
    }
    
    var vertices = new Float32Array(vertexData);
    
    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);      
    
    // Associate out shader variables with our data buffer    
    var vPosition = gl.getAttribLocation( gl.program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}

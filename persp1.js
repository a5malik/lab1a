//I have done extra credit part 1 and part 2 

var canvas;
var gl;

var NumVertices  = 288;
var cur = [0,0,0];
var pointsArray = [];
var colorsArray = [];
var curtheta = 0;
var m1,m2,m3,m4,m5,m6,m7,m8;

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
	vec4( 0.5, 0.5, 0.5, 1.0 ), //grey
    vec4( 1.0, 1.0, 1.0, 1.0 )  // white
	
];

var cube = function(center)
{
	var x = center[0],y = center[1],z = center[2];
	var vertices = 
	[ 
	vec4(x-2.0,y-2.0,z+2.0,1.0),
	vec4(x-2.0,y+2.0,z+2.0,1.0),
	vec4(x+2.0,y+2.0,z+2.0,1.0),
	vec4(x+2.0,y-2.0,z+2.0,1.0),
	vec4(x-2.0,y-2.0,z-2.0,1.0),
	vec4(x-2.0,y+2.0,z-2.0,1.0),
	vec4(x+2.0,y+2.0,z-2.0,1.0),
	vec4(x+2.0,y-2.0,z-2.0,1.0)
	]
	return vertices;
}

var near = 0.3;
var far = 100;
var radius = 10.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;
var cross = false;
var  fovy = 60.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var cameraMatrix, cameraMatrixLoc;

var col_off = 0;
modelViewMatrix = mat4();
cameraMatrix = mat4();
cameraMatrix = mult(translate(0,0,-50), cameraMatrix);

var cBuffer;

function liner(a,b,vertices,conly)
{	
if(!conly)
{
	pointsArray.push(vertices[a]);
	pointsArray.push(vertices[b]);
}
	colorsArray.push(vertexColors[8]);
	colorsArray.push(vertexColors[8]);
}

function colorCube(center,col,conly)
{
	var vertices = cube(center);
    
	if(!conly)
	{
	pointsArray.push(vertices[0]);
	pointsArray.push(vertices[3]);
	pointsArray.push(vertices[1]);
	pointsArray.push(vertices[2]);
	pointsArray.push(vertices[5]);
	pointsArray.push(vertices[6]);
	pointsArray.push(vertices[4]);
	pointsArray.push(vertices[7]);
	pointsArray.push(vertices[0]);
	pointsArray.push(vertices[3]);
	pointsArray.push(vertices[7]);
	pointsArray.push(vertices[2]);
	pointsArray.push(vertices[6]);
	pointsArray.push(vertices[1]);
	pointsArray.push(vertices[5]);
	pointsArray.push(vertices[4]);
	pointsArray.push(vertices[0]);
	}
	for(var i = 0; i < 17;i++)
		colorsArray.push(vertexColors[col]);
	linecube([0,0,0],conly);
	if(!conly)
	{
	pointsArray.push(vec4(-4.0,0,-5,1.0));
	pointsArray.push(vec4(4.0,0,-5,1.0));
	pointsArray.push(vec4(0,4.0,-5,1.0));
	pointsArray.push(vec4(0,-4.0,-5,1.0));
	}
	for(var i = 0; i < 4;i++)
		colorsArray.push(vertexColors[8]);
}
var list = [
	[10.0,10.0,10.0],
	[-10.0,10.0,10.0],
	[10.0,-10.0,10.0],
	[10.0,10.0,-10.0],
	[-10.0,-10.0,10.0],
	[-10.0,10.0,-10.0],
	[10.0,-10.0,-10.0],
	[-10.0,-10.0,-10.0]
	];
function linecube(center,conly)
{
	var vertices = cube(center);
	liner(1,2,vertices,conly);
	liner(1,5,vertices,conly);
	liner(1,0,vertices,conly);
	liner(6,2,vertices,conly);
	liner(6,5,vertices,conly);
	liner(6,7,vertices,conly);
	liner(4,5,vertices,conly);
	liner(4,0,vertices,conly);
	liner(4,7,vertices,conly);
	liner(3,0,vertices,conly);
	liner(3,2,vertices,conly);
	liner(3,7,vertices,conly);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    aspect =  canvas.width/canvas.height;
    
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
	colorCube([0.0,0.0,0.0],col_off,false);//this will push the vertices of one cube centered at the origin into the pointsArray
    
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.DYNAMIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.DYNAMIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
 
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	cameraMatrixLoc = gl.getUniformLocation( program, "cameraMatrix");

// buttons for viewing parameters
	window.addEventListener("keydown",function() {
		switch(event.keyCode) {
			case 67:                           //'c'
				col_off = (col_off + 1)%8;
				colorsArray = [];
				cubeliner(true);
				gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
				gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.DYNAMIC_DRAW );
				break;
			case 38: //up
				event.preventDefault();
				cameraMatrix = mult(translate(0,-0.25,0), cameraMatrix);
				
				break;
			case 40: //down
				event.preventDefault();
				cameraMatrix = mult(translate(0,+0.25,0), cameraMatrix);
				
				break;
			case  37://left
				
				cameraMatrix = mult(rotate(-1,[0,1.0,0]), cameraMatrix);
				
				break;
			case 39: //right
				
				cameraMatrix = mult(rotate(1,[0,1.0,0]), cameraMatrix );
				
				break;
			case 73: //forward
				cameraMatrix = mult(translate(0,0,0.25),cameraMatrix);
				
				break;
			case 77:  //backward
				cameraMatrix = mult(translate(0,0,-0.25),cameraMatrix);
				
				break;
			case 74://left translate
				cameraMatrix = mult(translate(0.25,0,0),cameraMatrix);
				
				break;
			case 75: // right translate
				cameraMatrix = mult(translate(-0.25,0,0),cameraMatrix);
				
				break;
			case 82: //reset
				cameraMatrix = mat4();
				cameraMatrix = mult(translate(0,0,-50),cameraMatrix);
				fovy = 60.0;
				
				break;
			case 187: //'+' key
				if(cross)
					cross = false;
				else cross = true;
				break;
			case 78: //'n'
				fovy*=0.9;
				break;
			case 87://'w'
				fovy*=1.1;
				break;
		}
	});
    render(); 
}

var mvm;
var t = 0;
var sc;
var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    projectionMatrix = perspective(fovy, aspect, near, far);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
	gl.uniformMatrix4fv(cameraMatrixLoc, false, flatten(cameraMatrix) );
	sc = 1+0.1*Math.cos(radians(t)); // this is my scaling factor
	modelViewMatrix = mult(rotate(6,[1,0,0]),modelViewMatrix);
	// I instance each cube from the same data and translate each to the required position.
    for(var i = 0; i < 8; i++)
	{
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, 
		flatten((mult(translate(list[i][0],list[i][1],list[i][2]),mult(scale(sc,sc,sc),modelViewMatrix)))) );
		colorsArray = [];
		colorCube([0.0,0.0,0.0],(col_off+i)%8,true);
		gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.DYNAMIC_DRAW );
		gl.drawArrays( gl.TRIANGLE_STRIP, 0,17 );
		gl.drawArrays(gl.LINES,17,24);
	gl.drawArrays(gl.LINES,17,24);
	}
	t+=(2*Math.PI/5);
	if(cross)
	{
		gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(ortho(-30,30,-30,30,0,100)) );
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mat4()));
		gl.uniformMatrix4fv( cameraMatrixLoc, false, flatten(mat4()));
		gl.drawArrays(gl.LINES,41,4);
	}
    requestAnimFrame(render);
}

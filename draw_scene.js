function drawScene(gl, programInfo, buffers, texture, cubeRotation) {

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // clear to black
    gl.clearDepth(1.0); // clear everything
    gl.enable(gl.DEPTH_TEST); // enable depth testing
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    // clear canvas before we start drawing on it
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // create perspective matrix
    // fov of 45 degrees w/h ratio matches canvas size
    // only display objects between 0.1 and 100 units from camera
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(
        projectionMatrix,
        fieldOfView, 
        aspect, 
        zNear,
        zFar
    );

    // set drawing position to 'identity' point (center of the scene)
    const modelViewMatrix = mat4.create()

    // move drawing pos to a bit where we want to start drawing the square
    mat4.translate(
        modelViewMatrix,   // destination matrix
        modelViewMatrix,   // matrix to translate
        [-0.0, 0.0, -6.0], // amount to translate
    );

    mat4.rotate(
        modelViewMatrix,   // destination matrix
        modelViewMatrix,   // matrix to rotate
        cubeRotation,    // amount to rotate in radians
        [0, 0, 1],         // axis to rotate around (Z)
    )

    mat4.rotate(
        modelViewMatrix,   // destination matrix
        modelViewMatrix,   // matrix to rotate
        cubeRotation,    // amount to rotate in radians
        [0, 1, 0],         // axis to rotate around (Y)
    )

    mat4.rotate(
        modelViewMatrix,   // destination matrix
        modelViewMatrix,   // matrix to rotate
        cubeRotation,    // amount to rotate in radians
        [1, 0, 0],         // axis to rotate around (X)
    )

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelViewMatrix);
    mat4.transpose(normalMatrix, normalMatrix);


    // tell webgl how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    setPositionAttribute(gl, buffers, programInfo);

    setTextureAttribute(gl, buffers, programInfo);

    // tell webgl which indices to use to index the vertices
    gl.bindBuffer(
        gl.ELEMENT_ARRAY_BUFFER,
        buffers.indices,
    );

    setNormalAttribute(gl, buffers, programInfo);

    // tell webl to use our program when drawing
    gl.useProgram(programInfo.program);

    // set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix,
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix,
    );

    // tell webgl we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // bind texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // tell shader we bound texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    { 
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

// tell webgl how to pull out the positions from the 
// position buffer into the vertexPosition attribute
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3; // pull out 2 values per iteration
    const type = gl.FLOAT; // data in the buffer is float32s
    const normalize = false;
    const stride = 0; // in bytes; 0 stride = use type and numComponents above
    const offset = 0; // buffer byte offset

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

// tell webgl how to pull out the colors from the color buffer
// and into the vertexColor attribute
function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

// tell webgl how to pull out the texture coords from buffer
function setTextureAttribute(gl, buffers, programInfo) {
    const num = 2;           // every coord composed of 2 values
    const type = gl.FLOAT;   // data in buffer is 32 bit float
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord)
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset,
    );

    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

// Tell WebGL how to pull out the normals from
// the normal buffer into the vertexNormal attribute.
function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
  }

export { drawScene };

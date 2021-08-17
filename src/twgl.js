export var twgl = require('twgl.js');

const canvasArrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
}

export var loadShadersDir = function(shaders, subDir) {
    var shaderDict = {}
    shaders.forEach(function (value) {
        var shader = require('shaders/' + subDir + value)
        shaderDict[value] = shader.default;
    })
    return shaderDict
}

export var loadShaders = function(shaders) {
    return loadShadersDir(shaders, '')
}

export var createProgramInfo = function(gl, shaderDict, vShader, fShader){
    return twgl.createProgramInfo(gl, [shaderDict[vShader], shaderDict[fShader]]);
}

export var createCanvasBuffer = function(gl){
    return twgl.createBufferInfoFromArrays(gl, canvasArrays)
}

export var importAudio = function(audio){
    var audioFile = require(audio)
    return audioFile.default
}
var _canvasProto = CanvasRenderingContext2D.prototype as any;

_canvasProto.s = _canvasProto.save;
_canvasProto.r = _canvasProto.restore;
_canvasProto._fillRect = _canvasProto.fillRect;
_canvasProto._lineTo = _canvasProto.lineTo;
_canvasProto._translate = _canvasProto.translate;
_canvasProto._beginPath = _canvasProto.beginPath;
_canvasProto._fillStyle = function(x) {
    this.fillStyle = x;
};

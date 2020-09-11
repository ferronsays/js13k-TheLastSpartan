import { shadeColor } from "./BaseTile";
import { TILESIZE } from "../../constants";

// draw tile
var drawT = (ctx, x, y, h, color) => {
  var wx = TILESIZE.x / 2;
  var wy = TILESIZE.x / 2;

  // diag distance
  var dDist = wx * 0.5 + wy * 0.5;

  ctx.s();

  // left side / x axis
  ctx._beginPath();
  ctx.moveTo(x, y + dDist); // tr
  ctx._lineTo(x - wx, y + dDist - wx * 0.5); // tl
  ctx._lineTo(x - wx, y + dDist - h - wx * 0.5); // bl
  ctx._lineTo(x, y + dDist - h * 1); // br
  ctx.closePath();
  // ctx.fillStyle = shadeColor(color, -10);
  // ctx.strokeStyle = color;
  ctx.fillStyle = ctx.strokeStyle = shadeColor(color, -20);
  // ctx.strokeStyle = shadeColor(color, -10);
  ctx.stroke();
  ctx.fill();

  // right side / y axis
  ctx._beginPath();
  ctx.moveTo(x, y + dDist); // tl
  ctx._lineTo(x + wy, y + dDist - wy * 0.5); // tr
  ctx._lineTo(x + wy, y + dDist - h - wy * 0.5); // br
  ctx._lineTo(x, y + dDist - h * 1); // bl
  ctx.closePath();
  // ctx.fillStyle = shadeColor(color, 10);
  // ctx.strokeStyle = shadeColor(color, 50);
  ctx.fillStyle = ctx.strokeStyle = shadeColor(color, -10);
  // ctx.strokeStyle = shadeColor(color, 30);
  ctx.stroke();
  ctx.fill();

  // top
  ctx._beginPath();
  ctx.moveTo(x, y - h); // top
  ctx._lineTo(x - wx, y - h + wx * 0.5); // left
  ctx._lineTo(x - wx + wy, y - h + dDist); // bottom
  ctx._lineTo(x + wy, y - h + wy * 0.5); // right
  ctx.closePath();
  // ctx.fillStyle = shadeColor(color, 20);
  // ctx.strokeStyle = shadeColor(color, 60);
  ctx.fillStyle = ctx.strokeStyle = color;
  ctx.strokeStyle = shadeColor(color, -10);
  ctx.stroke();
  ctx.fill();

  ctx.r();
};

var tC = () => {
  var tmpC = document.createElement("canvas");
  var tmpCtx = tmpC.getContext("2d");

  return {
    tmpC,
    tmpCtx,
  };
};

export var tilePregen = () => {
  var { tmpC, tmpCtx } = tC();

  // water, water, sand, dirt, grass,
  var colors = ["#1ba5e1", "#1eb8fa", "#e5d9c2", "#564d40", "#48893e"];

  var total = 120;
  tmpC.width = (TILESIZE.x + 1) * colors.length;
  tmpC.height = TILESIZE.y * total + (total * (total + 1)) / 2;

  for (var j = 0; j < colors.length; j++) {
    var color = colors[j];
    var x = j * (TILESIZE.x + 1) + (TILESIZE.x + 1) / 2;
    for (var i = 0; i < total; i++) {
      var h = i;
      var y = TILESIZE.y * i + (i * (i + 1)) / 2;

      drawT(tmpCtx, x, y, h, color);
    }
  }

  // var image = new Image();

  // image.src = tmpC.toDataURL();

  return tmpC;
};

// export var borderTilePregen = () => {
//   var { tmpC, tmpCtx } = tC();

//   var color = "#444952";
//   var tiles = 10;
//   var hStart = 100;
//   var hStep = 20;

//   tmpC.width = (TILESIZE.x + 1) * tiles;
//   tmpC.height = TILESIZE.y + hStart + hStep * tiles;

//   for (var j = 0; j < tiles; j++) {
//     var x = j * (TILESIZE.x + 1) + (TILESIZE.x + 1) / 2;
//     var h = hStart + hStep * j;
//     var y = h;

//     drawT(tmpCtx, x, y, h, color);
//   }

//   var image = new Image();

//   image.src = tmpC.toDataURL();

//   return image;
// };

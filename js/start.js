// start.js
'use strict';

/**
 * Вызывается каждый раз когда игрок проходит уровень.
 * @ctx {object} канвас, на котором рисуется игра.
 * @names {Array.<string>} массив с именами игроков прошедших уровень. Имя самого игрока — Вы.
 * @times {Array.<number>} vассив содержит значения времени прохождения уровня соответствующих игроков из массива names. Время прохождения уровня задано в миллисекундах. Массив по длине совпадает с массивом names.
 */
window.renderStatistics = function (ctx, names, times) {

  // Подготовка данных для облока.
  var whiteCloudPosition = { x : 100, y : 10 },
      whiteCloudSize = { width : 420, height : 270 },
      whiteCloudShadow = { horizontalOffset : 10, verticalOffset : 10 };
  var whiteCloud = {
    shapes : [
      {
        origin : {
          x : whiteCloudPosition.x + whiteCloudShadow.horizontalOffset,
          y : whiteCloudPosition.y + whiteCloudShadow.verticalOffset
        },
        size : whiteCloudSize,
        background : 'rgba(0, 0, 0, 0.7)'
      },
      {
        origin : whiteCloudPosition,
        size : whiteCloudSize,
        background : 'rgba(255, 255, 255, 1.0)'
      }
    ],
    message : {
      origin : { x: 120, y: 40 },
      lineOffset : 20,
      foreground : '#000',
      font : '16px PT Mono',
      lines : ['Ура, вы победили!', 'Список результатов:']
    }
  };

  // Подготовка данных для гистограммы.
  var histogram = {
    origin : { x : 120, y : 260 },
    height : 150,
    lineOffset : 8,
    lineHeight : 18,
    foreground : '#000',
    font : '14px PT Mono'
  };
  {
    var playerBarStyle = {
      width : 40,
      distance : 25,
      rgbItems : [ 255, 0, 0 ],
      opacity : 1.0
    };
    var memberBarStyle = {
      width : 40,
      distance : 25,
      rgbItems : [ 0, 0, 155 ],
      opacity : 1.0
    };

    var minTime = Number.MAX_VALUE,
        maxTime = Number.MIN_VALUE,
        memberCount = names.length < times.length ? names.length : times.length;
    for (var index = 0; index < memberCount; index++) {
      minTime = times[index] < minTime ? times[index] : minTime;
      maxTime = maxTime < times[index] ? times[index] : maxTime;
    }
    histogram.minTime = minTime;
    histogram.maxTime = maxTime;

    var bars = [];
    for (var index = 0; index < memberCount; index++) {
      var isPlayerBar = names[index] === 'Вы';
      var barStyle = isPlayerBar ? playerBarStyle : memberBarStyle;
      var barOpacity = isPlayerBar ? playerBarStyle.opacity : times[index] / maxTime;
      var background = 'rgba('
        + barStyle.rgbItems[0]
        + ', ' + barStyle.rgbItems[1]
        + ', ' + barStyle.rgbItems[2]
        + ', ' + barOpacity
        + ')';

      var bar = {
        header : names[index],
        value : times[index],
        width : barStyle.width,
        distance : barStyle.distance,
        background : background,
      };
      bars[index] = bar;
    }
    histogram.bars = bars;
  }

  // Отрисовка данных.
  {
    // Отрисовка облака.
    var cloud = whiteCloud;
    for (var index = 0; index < cloud.shapes.length; index++) {
      var shape = cloud.shapes[index];
      ctx.fillStyle = shape.background;
      ctx.strokeRect(shape.origin.x, shape.origin.y, shape.size.width, shape.size.height);
      ctx.fillRect(shape.origin.x, shape.origin.y, shape.size.width, shape.size.height);
    }
  }
  {
    // Отрисовка текста сообщения.
    var message = whiteCloud.message;
    ctx.fillStyle = message.foreground;
    ctx.font = message.font;
    for (var index = 0; index < message.lines.length; index++) {
      var line = message.lines[index];
      ctx.fillText(line, message.origin.x, message.origin.y + message.lineOffset * index);
    }
  }
  {
    // Отрисовка гистограммы.
    var origin = histogram.origin;
    var indent = { x : 0, y : - histogram.lineHeight };
    var valueOffset = 0.75 * histogram.minTime;
    var step = histogram.height / (histogram.maxTime - valueOffset);

    for (var index = 0; index < histogram.bars.length; index++) {
      var bar = histogram.bars[index];
      var initial = { x : origin.x + indent.x, y : origin.y + indent.y };

      ctx.fillStyle = bar.background;
      ctx.fillRect(initial.x + bar.distance, initial.y, bar.width, - (bar.value - valueOffset) * step);

      ctx.fillStyle = histogram.foreground;
      ctx.font = histogram.font;
      ctx.fillText(bar.header, initial.x + bar.distance, initial.y + histogram.lineHeight);
      ctx.fillText(bar.value.toFixed(0), initial.x + bar.distance, initial.y - ((bar.value - valueOffset) * step + histogram.lineOffset));

      indent.x += bar.width + 2 * bar.distance;
    }
  }
}

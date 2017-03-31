// start.js
'use strict';

/** Настройки.
 ******************************************************************************/

/**
 * @const
 * @type {Object}
 */
var WHITE_CLOUD_ORIGIN = {x: 100, y: 10};

/**
 * @const
 * @type {Object}
 */
var WHITE_CLOUD_SIZE = {width: 420, height: 270};

/**
 * @const
 * @type {Object}
 */
var WHITE_CLOUD_SHADOW = {horizontalOffset: 10, verticalOffset: 10};

/**
 * @const
 * @type {Object}
 */
var TOTALS_HISTOGRAM_ORIGIN = {x: 120, y: 260};

/**
 * @const
 * @type {Object}
 */
var TOTALS_HISTOGRAM_SIZE = {width: null, height: 150};

/**
 * @const
 * @type {Object}
 */
var TOTALS_HISTOGRAM_STYLE = {
  lineOffset: 8,
  lineHeight: 18,
  foreground: '#000',
  font: '14px PT Mono'
};

/**
 * @const
 * @type {Object}
 */
var TOTALS_HISTOGRAM_PLAYER_BAR_STYLE = {
  width: 40,
  distance: 25,
  rgbItems: [255, 0, 0],
  opacity: 1.0
};

/**
 * @const
 * @type {Object}
 */
var TOTALS_HISTOGRAM_MEMBERS_BAR_STYLE = {
  width: 40,
  distance: 25,
  rgbItems: [0, 0, 155],
  opacity: 1.0
};

/**
 * Типы колонок гистограммы.
 * @enum {number}
 */
var HistogramBarType = {
  Player: 1,
  Member: 2
};

/** Предоставляемые методы.
 ******************************************************************************/

/**
 * Вызывается каждый раз когда игрок проходит уровень.
 * Время прохождения уровня задано в миллисекундах.
 * Массивы names и times совпадают по длине, а элементы с одинаковым индексом принадлежат одному игроку.
 * @param {Object} ctx канвас, на котором рисуется игра.
 * @param {Array.<string>} names имена игроков прошедших уровень. Имя самого игрока — Вы.
 * @param {Array.<number>} times времени прохождения уровня. Соответствует имени
 */
window.renderStatistics = function (ctx, names, times) {
  // Создание моделей вида
  var whiteCloud = createWhiteCloud();
  var totalHistogram = createTotalHistogram(names, times);

  // Отрисовка моделей вида
  renderCloud(ctx, whiteCloud);
  renderHistogram(ctx, totalHistogram);
};

/** Создание объектов модели вида.
 ******************************************************************************/

/**
 * Создает модель вида белого облака.
 * @return {Object}
 */
function createWhiteCloud() {
  return {
    shapes: [
      createWhiteCloudShadowShape(),
      createWhiteCloudShape()
    ],
    message: createWhiteCloudMessage()
  };
}

function createWhiteCloudShape() {
  return {
    origin: WHITE_CLOUD_ORIGIN,
    size: WHITE_CLOUD_SIZE,
    background: 'rgba(255, 255, 255, 1.0)'
  };
}

function createWhiteCloudShadowShape() {
  return {
    origin: {
      x: WHITE_CLOUD_ORIGIN.x + WHITE_CLOUD_SHADOW.horizontalOffset,
      y: WHITE_CLOUD_ORIGIN.y + WHITE_CLOUD_SHADOW.verticalOffset
    },
    size: WHITE_CLOUD_SIZE,
    background: 'rgba(0, 0, 0, 0.7)'
  };
}

function createWhiteCloudMessage() {
  return {
    origin: {x: 120, y: 40},
    lineOffset: 20,
    foreground: '#000',
    font: '16px PT Mono',
    lines: ['Ура, вы победили!', 'Список результатов:']
  };
}

/**
 * Создает модель вида гистограммы прохождения уровня игроками.
 * @param {Array.<string>} names Массив имен игроков.
 * @param {Array.<string>} times Массив времени, затраченного каждым игроком на прохождение уровня.
 * @return {Object} Модель вида гистограммы.
 */
function createTotalHistogram(names, times) {
  var histogram = {
    origin: TOTALS_HISTOGRAM_ORIGIN,
    size: TOTALS_HISTOGRAM_SIZE,
    style: TOTALS_HISTOGRAM_STYLE
  };

  var memberCount = names.length < times.length ? names.length : times.length;
  var timeRange = getRange(times, memberCount);
  histogram.minValue = timeRange.min;
  histogram.maxValue = timeRange.max;
  histogram.bars = [];

  for (var index = 0; index < memberCount; index++) {
    var barType = getHistogramBarType(names[index]);
    var bar = craeteHistogramBar(barType, names[index], times[index], timeRange);
    histogram.bars.push(bar);
  }

  return histogram;
}

function craeteHistogramBar(barType, name, value, valueRange) {
  var barStyle = barType === HistogramBarType.Player
    ? TOTALS_HISTOGRAM_PLAYER_BAR_STYLE
    : TOTALS_HISTOGRAM_MEMBERS_BAR_STYLE;
  var barOpacity = barType === HistogramBarType.Player
    ? TOTALS_HISTOGRAM_PLAYER_BAR_STYLE.opacity
    : (value / valueRange.max).toFixed(2);

  return {
    header: name,
    value: value,
    width: barStyle.width,
    distance: barStyle.distance,
    background: getRgbaAsString(barStyle.rgbItems, barOpacity)
  };
}

/** Отрисовка.
 ******************************************************************************/

/**
 * Отрисовывает облако.
 * @param {Object} ctx Контекст рисования.
 * @param {Object} cloud Модель вида облака.
 */
function renderCloud(ctx, cloud) {
  for (var index = 0; index < cloud.shapes.length; index++) {
    renderShape(ctx, cloud.shapes[index]);
  }
  renderMessage(ctx, cloud.message);
}

/**
 * Отрисовывает фигуру.
 * @param {Object} ctx Контекст рисования.
 * @param {Object} shape Массив моделей вида фигур.
 */
function renderShape(ctx, shape) {
  ctx.fillStyle = shape.background;
  ctx.strokeRect(shape.origin.x, shape.origin.y, shape.size.width, shape.size.height);
  ctx.fillRect(shape.origin.x, shape.origin.y, shape.size.width, shape.size.height);
}

/**
 * Отрисовывает текст сообщения.
 * @param {Object} ctx Контекст рисования.
 * @param {Object} message Модель вида ссообщения.
 */
function renderMessage(ctx, message) {
  ctx.fillStyle = message.foreground;
  ctx.font = message.font;

  for (var index = 0; index < message.lines.length; index++) {
    var line = message.lines[index];
    var textXPosition = message.origin.x;
    var textYPosition = message.origin.y + message.lineOffset * index;

    ctx.fillText(line, textXPosition, textYPosition);
  }
}

/**
 * Отрисовывает гистограмму прохождения уровня игроками.
 * @param {Object} ctx Контекст рисования.
 * @param {Object} histogram Модель вида гистограммы.
 */
function renderHistogram(ctx, histogram) {
  var origin = histogram.origin;
  var style = {
    base: {x: 0, y: histogram.style.lineHeight},
    foreground: histogram.style.foreground,
    font: histogram.style.font,
    lineHeight: histogram.style.lineHeight,
    lineOffset: histogram.style.lineOffset
  };

  var valueOffset = 0.75 * histogram.minValue;
  var step = histogram.size.height / (histogram.maxValue - valueOffset);

  var xRelative = style.base.x;
  for (var index = 0; index < histogram.bars.length; index++) {
    var bar = histogram.bars[index];
    style.background = bar.background;

    xRelative += bar.distance;

    style.width = bar.width;
    style.height = (bar.value - valueOffset) * step;

    renderHistogramBar(ctx, bar, origin, xRelative, style);

    xRelative += bar.width + bar.distance;
  }
}

/**
 * Отрисовывает столбец гистограммы.
 * @param {Object} ctx Контекст рисования.
 * @param {Object} bar Модель вида столбца.
 * @param {Object} origin Начало координат.
 * @param {number} xRelative Относительная X координата.
 * @param {Object} style Определяет параметры стиля столбца.
 */
function renderHistogramBar(ctx, bar, origin, xRelative, style) {
  var xPosition = xTransform(xRelative, origin);
  var base = style.base;
  var width = style.width;
  var height = style.height;

  ctx.fillStyle = style.background;
  ctx.fillRect(xPosition, yTransform(base.y, origin), width, yTransform(height));

  ctx.fillStyle = style.foreground;
  ctx.font = style.font;

  var headerYRelative = base.y - style.lineHeight;
  ctx.fillText(bar.header, xPosition, yTransform(headerYRelative, origin));

  var valueYRelative = base.y + height + style.lineOffset;
  ctx.fillText(bar.value.toFixed(0), xPosition, yTransform(valueYRelative, origin));
}


/** Вспомогательные функции.
 ******************************************************************************/

function getRange(array, count) {
  var minValue = Number.MAX_VALUE;
  var maxValue = Number.MIN_VALUE;

  for (var index1 = 0; index1 < count; index1++) {
    minValue = array[index1] < minValue ? array[index1] : minValue;
    maxValue = maxValue < array[index1] ? array[index1] : maxValue;
  }

  return {min: minValue, max: maxValue};
}

function getHistogramBarType(name) {
  return name === 'Вы'
    ? HistogramBarType.Player
    : HistogramBarType.Member;
}

function getRgbaAsString(rgbItems, opacity) {
  return 'rgba('
    + rgbItems[0]
    + ', ' + rgbItems[1]
    + ', ' + rgbItems[2]
    + ', ' + opacity
    + ')';
}

/**
 * Преобразует координату X.
 * @param {number} x Исходная координата X.
 * @param {Object} origin Начало координат.
 * @return {number} Результат преобразования.
 */
function xTransform(x, origin) {
  return typeof origin !== 'undefined'
    ? origin.x + x
    : x;
}

/**
 * Преобразует координату Y.
 * @param {number} y Исходная координата Y.
 * @param {Object} origin Начало координат.
 * @return {number} Результат преобразования.
 */
function yTransform(y, origin) {
  return typeof origin !== 'undefined'
    ? origin.y - y
    : -y;
}

// setup.js
'use strict';

/** Настройки.
 ******************************************************************************/

/**
 * @const
 * @type {Array.<string>}
 */
var WIZARD_FIRST_NAMES = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон'
];

/**
 * @const
 * @type {Array.<string>}
 */
var WIZARD_SECOND_NAMES = [
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг'
];

/**
 * @const
 * @type {Array.<string>}
 */
var WIZARD_COAT_COLORS = [
  'rgb(101, 137, 164)',
  'rgb(241, 43, 107)',
  'rgb(146, 100, 161)',
  'rgb(56, 159, 117)',
  'rgb(215, 210, 55)',
  'rgb(0, 0, 0)'
];

/**
 * @const
 * @type {Array.<string>}
 */
var WIZARD_EYES_COLORS = [
  'black',
  'red',
  'blue',
  'yellow',
  'green'
];

/**
 * @const
 * @type {number}
 */
var SETUP_WIZARDS_COUNT = 4;

/** Предоставляемые методы.
 ******************************************************************************/

/**
 * Отображает окно настроек пользователя.
 */
var showSetupView = function () {
  var userDialog = document.querySelector('.setup');
  userDialog.classList.remove('hidden');

  var similarListElement = userDialog.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;

  var wizards = craeteWizards(SETUP_WIZARDS_COUNT);
  var wizardFragment = renderWizardsFragment(similarWizardTemplate, wizards);
  similarListElement.appendChild(wizardFragment);

  userDialog.querySelector('.setup-similar').classList.remove('hidden');
};

showSetupView();

/** Создание моделей вида персонажей.
 ******************************************************************************/

function craeteWizards(count) {
  var wizards = [];
  var wizardNumber = 0;
  while (wizardNumber++ < count) {
    var wizard = createWizard();
    wizards.push(wizard);
  }

  return wizards;
}

function createWizard() {
  return {
    name: getRandomWizardName(),
    coatColor: getRandomItem(WIZARD_COAT_COLORS),
    eyesColor: getRandomItem(WIZARD_EYES_COLORS)
  };
}

function getRandomWizardName() {
  var nameParts = [
    getRandomItem(WIZARD_FIRST_NAMES),
    getRandomItem(WIZARD_SECOND_NAMES),
  ];
  if (getRandomInt(0, 1)) {
    nameParts = nameParts.reverse();
  }
  var fullName = nameParts.join(' ');

  return fullName;
}

/** Отображение моделей вида персонажей.
 ******************************************************************************/

function renderWizardsFragment(template, wizards) {
  var wizardsFragment = document.createDocumentFragment();
  for (var index = 0; index < wizards.length; index++) {
    var wizardElement = renderWizard(template, wizards[index]);
    wizardsFragment.appendChild(wizardElement);
  }

  return wizardsFragment;
}

function renderWizard(template, model) {
  var element = template.cloneNode(true);

  element.querySelector('.setup-similar-label').textContent = model.name;
  element.querySelector('.wizard-coat').style.fill = model.coatColor;
  element.querySelector('.wizard-eyes').style.fill = model.eyesColor;

  return element;
}

/** Вспомогательные методы.
 ******************************************************************************/

function getRandomItem(array) {
  return array[getRandomInt(0, array.length - 1)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

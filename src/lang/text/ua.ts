import { en } from '@src/lang/text/en';

export const ua: typeof en = {
  translation: {
    gameTypes: {
      draughts64: 'Шашки 64',
      international: 'Міжнародні Шашки',
      brazilian: 'Бразильські шашки',
      frisian: 'Фризькі Шашки',
      frisian64: 'Фризькі Шашки 64',
    },
    piecesColors: {
      white: 'Білі',
      black: 'Чорні',
    },
    validation: {
      required: "Обов'язкове поле",
    },
    mainMenu: {
      title: 'Оберіть Гру',
    },
    newGame: {
      title: 'Налаштування Гри',
      startGame: 'Почати Гру',
      offline: 'Сам з собою',
    },
    gameMenu: {
      mainMenu: 'Головне Меню',
      newGame: 'Нова Гра',
      undoMove: 'Відмінити?',
    },
    editMode: {
      title: 'Редагування',
      kingPiece: 'Дамка',
      clear: 'Очистити',
      done: 'Готово',
    },
    userForm: {
      name: 'Ваше імʼя',
    },
    joinModal: {
      title: 'Приєднатись до гри',
      start: 'Почати',
    },
    players: {
      title: 'Гравці',
      waiting: 'Очікуємо',
      ready: 'Готовий',
      start: 'Почати',
      spectatorLabel: 'Ви приєднались як глядач',
    },
    chat: {
      title: 'Чат',
      messagePlaceholder: 'Повідомлення',
      messagesEmptyState: 'Почніть розмову, надіславши повідомлення',
    },
    onlineMenu: {
      copyLink: {
        buttonLabel: 'Скопіювати запрошення',
        copyLinkTooltip: 'Посилання скопійовано!',
      },
      drawButton: 'Нічия?',
      resignButton: 'Здатись',
    },
    requestsModals: {
      title: 'Новий запит від іншого гравця',
      drawContent: 'Чи згодні ви на нічию?',
      undoContent: 'Чи згодні ви відмінити останній хід?',
      drawDeclinedContent: 'Гравець відмовився від нічиї',
      undoDeclinedContent: 'Гравець відмовився відмінити хід',
      defaultDeclinedContent: 'Гравець відмовився',
      acceptLabel: 'Погодитись',
      declineLabel: 'Відмовитись',
    },
    winner: {
      white: 'Гравець білими',
      black: 'Гравець чорними',
      winsLabel: 'переміг!',
    },
    gameAlerts: {
      kingMaxMoves:
        'Дамка не може ходити більше 3 разів підряд.\nЗробіть інший хід або побийте цією дамкою, щоб її розблокувати.',
    },
  },
};

import { en } from '@src/lang/text/en';

export const ua: typeof en = {
  translation: {
    gameTypes: {
      draughts64: 'Шашки 64',
      international: 'Міжнародні Шашки',
    },
    piecesColors: {
      white: 'Білі',
      black: 'Чорні',
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
      undoMove: 'Відмінити Хід',
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
    onlineMenu: {
      copyLink: {
        buttonLabel: 'Скопіювати запрошення',
        copyLinkTooltip: 'Посилання скопійовано!',
      },
      drawButton: 'Нічия',
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
  },
};

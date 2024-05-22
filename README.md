**EN**

# Telegram ClickUp Notification Bot

This project is a Telegram bot for receiving task notifications from ClickUp.

## Table of Contents

- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)

## Technologies

- Node.js
- Express
- Sequelize (for database operations)
- node-telegram-bot-api

## Installation

1. Clone the repository to your local machine:

   ```sh
   git clone https://github.com/estecore/clickUpPushTgBot.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root of the project and add your Telegram bot token:
   ```env
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   ```

## Configuration

1. Register your bot with [BotFather](https://core.telegram.org/bots#botfather) and obtain a token.
2. Add the token to the `.env` file.

## Usage

1. Start the bot:
   ```sh
   npm start
   ```
2. Your bot is now running and ready to use. In Telegram, find your bot and press `/start`.

## Commands

- `/start` - Start the bot and display the main menu.
- `/register` - Register with ClickUp email.
- `/help` - Help and command guide.

---

**RU**

# Telegram ClickUp Notification Bot

Этот проект представляет собой Telegram-бота для уведомлений о задачах в ClickUp.

## Оглавление

- [Технологии](#технологии)
- [Установка](#установка)
- [Конфигурация](#конфигурация)
- [Использование](#использование)
- [Команды](#команды)

## Технологии

- Node.js
- Express
- Sequelize (для работы с базой данных)
- node-telegram-bot-api

## Установка

1. Склонируйте репозиторий на ваш локальный компьютер:

   ```sh
   git clone https://github.com/estecore/clickUpPushTgBot.git
   ```

2. Установите зависимости:

   ```sh
   npm install
   ```

3. Создайте файл `.env` в корне проекта и добавьте туда ваш токен Telegram бота:
   ```env
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   ```

## Конфигурация

1. Зарегистрируйте вашего бота с помощью [BotFather](https://core.telegram.org/bots#botfather) и получите токен.
2. Добавьте токен в файл `.env`.

## Использование

1. Запустите бота:
   ```sh
   npm run start
   ```
2. Теперь ваш бот запущен и готов к работе. В Telegram найдите вашего бота и нажмите `/start`.

## Команды

- `/start` - Запуск бота и отображение главного меню.
- `/register` - Регистрация с ClickUp email.
- `/help` - Помощь и справка по командам.

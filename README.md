
### 1. Клонування репозиторію

Скопіюйте репозиторій на ваш комп'ютер. Використовуйте команду:

```bash
git clone https://github.com/username/VoteChain-Backend.git
```

Замініть `username` на ваше ім'я користувача на GitHub.

### Запуск сервера з автооновленням
```bash
npm run serve
```
### Запуск сервера без автооновлення 
```bash
node app
```


Сервер буде доступний за адресою `http://localhost:5000`.

## Спільна робота

### Внесення змін

1. Всі нововедення початково пушити в develop гілку.

```bash
git checkout develop
```

2. Внесіть ваші зміни і збережіть їх:

```bash
git add .
git commit -m "Опис змін"
```

3. Відправте вашу гілку на GitHub:

```bash
git push origin develop
```

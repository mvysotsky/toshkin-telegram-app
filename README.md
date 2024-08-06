# Toshkin Telegram App

### Start the project:
1. `cp dev/example.env .env`
2. Put correct Telegram token string to the .env file and db password
3. `sudo docker-compose up -d`

### Create database migration:
```bash
npm run create-migration -- <migration_name>
```

### Setup Telegram dev environment:
1. You need iPhone or Android Telegram Beta for [this](https://github.com/telegramdesktop/tdesktop/issues/26361)
2. Enable Telegram test environment using Telegram Mobile:  
   Tap 10 times on the `Settings icon` > `Accounts` > `Login to another account` > `Test`
3. Enable Telegram test environment using Telegram Desktop:  
   1. Open `☰ Settings` > `My Account` > `Shift` + `Alt` right click `Add Account` and select `Test Server`
   2. Click `Login using phone number`
   3. Input your phone and click `Continue`
   4. Telegram desktop asks you to input the code that was sent on other device (which you don't have)
   5. Click `Send code using SMS`



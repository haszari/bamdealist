# bamdealist
## Markdown-based task, idea and miscellaneous snippet manager.

### dependencies
Docker.

The app depends on [nodejs + npm](https://nodejs.org) and [mongodb](https://www.mongodb.com); these are handled by `docker-compose`.

### developer start
Set up required environment variables (`cp sample.env .env` to use the defaults).

`docker-compose up --build`

You'll see a `webpack-dev-server` process running, which will pick up client (`src/www`) code/style changes. You'll need to relaunch if you make server changes. `babel-node` is used so we can use ES6 in server code.

### production start
Set up required environment variables (see `sample.env`).

`docker-compose -f ./docker-compose.yml up --build -d`

This builds to `/dist` and serves that.

It takes a minute or two to come up (peek at `docker-compose logs bamdealist` to see where it's up to).

### stop
`docker-compose down`

### backup/restore & import
The `bamdealist-backup` folder is mounted as `/usr/src/backup` in the `mongo` container, so we can use that for import, export and backup.

Make sure you use the right database name (`-d`) if you've customised it for some reason.

#### backup 
`docker-compose exec mongo mongoexport -d bamdealist -c items -o "/usr/src/backup/$(date '+%Y%m%d-%H-%M-%S')-bamdealist.json"`

Do this regularly and look after the json files – if you lose your container state, the data is gone!

#### restore
`docker-compose exec mongo mongoimport -d bamdealist -c items "/usr/src/backup/tmp~~/${BACKUP_FILE}"`

#### import
1. Put the content you want to import into a file in `bamdealist-backup/tmp~~`, e.g. `import.md`.
2. Import using node script `docker-compose exec bamdealist npm run import -- -f  /usr/src/backup/tmp~~/import.md`.
3. Do a backup (see above)!

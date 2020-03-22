# BAMdealist
## Markdown-based task, idea and miscellaneous snippet manager.

### How to run it
#### Build & run production
- `npm install`
- `cp example.env .env` and set host, ports etc
- `npm run build`
- `docker-compose up -d`

App & API is served on host/port configured in env, e.g. http://localhost:8947

#### Build & run development
- `npm install`
- `cp example.env .env` and set host, ports etc
- `npm start`
- `docker-compose up -d`

Client app is served using [create-react-app](https://create-react-app.dev), e.g. http://localhost:3000

API is served on host/port configured in env, e.g. http://localhost:8947

### How to get content in & out
The `bamdealist-backup` folder is mounted as `/usr/src/backup` in the `mongo` container, so we can use that for import, export and backup.

#### Backup
- `docker-compose exec mongo mongoexport -d bamdealist -c items -o "/usr/src/backup/backups/$(date '+%Y%m%d-%H-%M-%S')-bamdealist.json"`

This is a mongo dump of the database.

### Restore
- `docker-compose exec mongo mongoimport -d bamdealist -c items "/usr/src/backup/backups/${BACKUP_FILE}"`

### Import 
- `docker-compose exec web npm run import -- -f  /usr/src/backup/tmp~~/${IMPORT_FILE}`

Import from a [markdown](https://github.github.com/gfm/) file. 

- #hashtags are indexed
- __Bold__ is indexed
- _Italics_ is indexed 
- Words in titles < H4 are indexed and apply to all items (until another heading of same level). You can use this to set common tags in H1 at the start of the file, or use H3 for dates or topics.
- H2 is reserved for two different kinds of import:
  - `## history` 
    - The file is broken up into sections delimited by H4 (`####`), each of which is imported as a single item.
  - `## tasks`
    - Each top-level bullet point is imported as a single item.

Example file:

```md
# #diary #notes

## tasks
- get flour
- go for a run

## history

### 20200321
#### Free as in ?
<!-- #opensource #ideas #philosophy -->
##### Beer
As in you get a product or service to use without having to pay or contribute.

##### Speech
An idea or expression or product is released into the #community to flourish, and will not do so without contribution from others.

#### Went for a short #walk
<!-- #activity -->
And saw the #flowers growing in the #park.
```


# LeagueBot
> GroupMe bot that scrapes ESPN Fantasy Football leagues for transaction activities (trade, adds, drops, moves)

## Install
```
npm install mistakia/leaguebot
```

## Usage
```
cp config.sample.js config.js
```
Edit config.js to include your [GroupMe bot](https://dev.groupme.com/bots) credentials: `bot_id` & `access_token`. The opts property
accepts an array of objects used to fetch league transactions with the following properties:
- `leagueId` (Number): the league you want to get activities for
- `seasonId` (Number): the year you want to get activies for
- `activityType` (Number): the type of activity:
    - `-2` : All activites except moved
    - `-1` : All activites
    - `1` : moved
    - `2` : added
    - `3` : dropped
    - `4` : traded
    - `5` : drafted
- `teamId` (Number): the team you want activities for, or `-1` for all teams
- `tranType` (Number): should be set to `2` to get transactions.

Setup a crontab (or other script scheduler). Currently, it only fetches transactions for the last day so make sure it runs at least daily.
```
*/20 * * * * node /path/to/leaguebot/index.js
```
![example](https://i.imgur.com/JWOaa7c.png)

## License
MIT

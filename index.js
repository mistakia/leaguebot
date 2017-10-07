const activity = require('espnff').activity
const moment = require('moment')
const jsonfile = require('jsonfile')
const Logger = require('logplease')
const path = require('path')
const async = require('async')
const API = require('groupme').Stateless

const config = require('./config')
const logger = Logger.create('LeagueBot')

const data_path = path.resolve(__dirname, 'data.json')
let data = {}
try {
  data = jsonfile.readFileSync(data_path)
} catch(e) {
  logger.error(e)
  data = {}
}

const endDate = moment().format('YYYYMMDD')
const startDate = moment().subtract(1, 'day').format('YYYYMMDD')

logger.info(`getting activity from ${startDate} to ${endDate}`)

const countError = function() {
  if (!data.error_count)
    data.error_count = 0

  data.error_count++;
  jsonfile.writeFileSync(data_path, data)
}

async.concat(config.opts, function(opts, next) {
  const options = Object.assign(opts, {startDate: startDate, endDate: endDate})
  logger.info(options)

  activity.get(options, next)

}, function(err, items) {
  if (err) {
    countError()
    logger.error(err)
    return
  }

  logger.info(`found ${items.length} activities`)

  let new_items = []

  items.forEach(function(item, index) {
    if (!data[item.date])
      new_items.push(item)
  })
  logger.info(`${new_items.length} new items`)
  
  if (new_items.length) {

    const messages = []

    new_items.forEach(function(item) {
      const detail = item.detail[0]
      messages.push(detail.full)
    })

    async.each(messages, function(message, next) {
      logger.info('pushing message to groupme')
      API.Bots.post(config.access_token, config.bot_id, message, {}, next)
    }, function(err) {
      if (err) {
        countError()
        return logger.error(err)
      }

      logger.info('pushed all messages to groupme')

      logger.info('saving new items')

      new_items.forEach(function(item) {
        data[item.date] = item
      })

      jsonfile.writeFileSync(data_path, data)
    })
  }  
})

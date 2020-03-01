"use strict";
const MemoryStore = require("./memory-store");

var pushLogs = function (name, error) {
  console.log(name, error);
};

//
class RateLimit {

  constructor(options) {
    this.options = Object.assign(
      {
        windowMs: 300 * 1000, // milliseconds - how long to keep records of requests in memory/ set to 5 minutes in default
        samplingPeriod: 10000, // milliseconds - sampling period to group counters for efficient memory
        max: 5, // max number of recent connections during `window` milliseconds before sending a 429 response
        message: "Too many requests, please try again later.",
        statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
        headers: true, //Send custom rate limit header with limit and remaining
        draft_polli_ratelimit_headers: false, //Support for the new RateLimit standardization headers
        onLimitReached: function (/*req, res, optionsUsed*/) { }
      },
      options
    );

    this.rateLimitGroup = {}      // key = entity, value = sliding window counter (queue of hash map)     
  } // end constructor()


  checkLimit(key) {
      try {
        if(!(key in this.rateLimitGroup)){
          this.rateLimitGroup[key] = new MemoryStore(this.options.windowMs, this.options.samplingPeriod, this.options.max);
          console.log('New limit table created for ip ' + key);
        }
      
        if (this.rateLimitGroup[key].incr(this.options.max) === -1) {
          this.options.onLimitReached();
          console.log('Limit exceeded for ip '+ key);
          return -1;
        }
        console.log('limit checked');
        return 1;
      }
      catch (e) {
        pushLogs('checkLimit', e);
      }
    }

  }







module.exports = RateLimit;

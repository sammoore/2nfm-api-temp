"use strict";
var pushLogs = function(name, error) {
  console.log(name, error);
};

function createTimestamp(samplingPeriod){
  var time = new Date();
  var timestamp = Math.floor(time.getTime()/samplingPeriod)*samplingPeriod;
  return timestamp;
}

function getTimeDif(timestamp){
  var time = new Date();
  var dif = (time.getTime() - timestamp);
  return dif;
}

// Sliding Window Counter
function MemoryStore(windowMs_, samplingPeriod_, max_) {
  try{
  let hits = [];
  let windowMs = windowMs_;
  let samplingPeriod = samplingPeriod_;
  let max = max_;
  let counter = 0;
  this.incr = function() {

    let timestamp = createTimestamp(samplingPeriod);

    // Add new timestamp into empty queue
    if(hits.length === 0){
      hits.push([timestamp, 1]);
      counter ++;
      return 1;
    }

    // Delete old request data
    while(getTimeDif(hits[0][0]) > windowMs){
      let out = hits.shift();
      counter -= out[1];

      // Add new timestamp into empty queue
      if(hits.length === 0){
        hits.push([timestamp, 1]);
        counter ++;
        console.log('Request Count: ', counter);
        return 1;
      }
    }

    // check limit
    if(counter < max){
      // add to last timestamp
      if(hits[hits.length-1][0] === timestamp){
        hits[hits.length-1][1] += 1;
        counter ++;
        console.log('Request Count: ', counter);

        return 1;
      }
      // add new timestamp
      hits.push([timestamp, 1]);
      counter ++;
      console.log('Request Count: ', counter);
      return 1;
    }
    hits[0] 
    return -1;
    }
  }
  catch(e){
    pushLogs('Memorystore', e);
  }

  
  // export an API to allow hits all IPs to be reset
  this.reset = function() {
    hits = [];
  };


}

module.exports = MemoryStore;

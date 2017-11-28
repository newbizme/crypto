

export function formatData(data) {
    data.map((d) => {
        d.date = new Date(d.date);
    })
    return data;
}

// ---------------------------------------
// CONVERT PORTFOLIO -> EVEN TIME INCREMENTS
// ---------------------------------------
// portfolio: array of portfolio objects
// interval: time interval between output objects
// start: UTC time to start
// stop: UTC time to stop
export function parsePortfolioTimeline(portfolio, interval, start, stop) {
    let int;
    if (interval = '1d') { int = 24*60*60; } // TODO: expand to allow hourly, weekly, etc.
    
    let data = [];
    let amount = 0;
    let ts = start; // 1506470400
    
    let p = 0;
  
    // if portfolio starts before data starttime, find 'starting' point
    if (portfolio[0].timestamp <= ts) {
      do {
        p++;
      }
      while (portfolio[p].timestamp <= ts)
      // subtract one to remove the unnecessary p++ from last do loop
      p--;
    }
  
    // For each time range increment, find the closing portfolio balances
    do {
      if (portfolio[p+1] && portfolio[p+1].timestamp > ts + int) {
        // if next snapshot is outside ts -> ts+int time range, push
        data.push({ x: ts, y: Object.assign({}, portfolio[p]) })
      } else {
        // else, find closing portfolio balance of timerange
        let i = 0;
        portfolio.map((p, index) => {
           if (p.timestamp < ts+int) {
             i = index;
           }
        })
        p = i;
        data.push({ x: ts, y: Object.assign({}, portfolio[p]) });
      }
      
      // increment to next interval
      ts += int;
    } while (ts <= stop)
    
    return data;
  }
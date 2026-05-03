const timeCheck = require('./middleware/timeCheck');

let resStatus, resJson;
const res = {
  status: (code) => {
    resStatus = code;
    return {
      json: (obj) => {
        resJson = obj;
      }
    };
  }
};
let nextCalled = false;
const next = () => { nextCalled = true; }

// Test 1: Time Check
console.log("---- Testing TimeCheck Middleware ----");
timeCheck({}, res, next);
if (resStatus === 403) {
  console.log("SUCCESS: 403 Forbidden returned! (Because current time is not between 10-11 AM IST)");
  console.log("Error JSON: ", resJson);
} else if (nextCalled) {
  console.log("INFO: next() was called. (Current time might actually be 10-11 AM IST, but test says 13:xx so this shouldn't happen usually)");
} else {
  console.log("FAILED to return expected result");
}

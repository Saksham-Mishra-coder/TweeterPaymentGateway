const checkTime = (req, res, next) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    hourCycle: 'h23'
  });
  
  const formattedHourStr = formatter.format(new Date());
  // Extract digits just in case the Node env adds AM/PM or spaces
  const currentHour = parseInt(formattedHourStr.replace(/[^0-9]/g, ''), 10);

  // 10 AM to 11 AM IST means currentHour should be 10 (which covers 10:00 to 10:59)
  if (currentHour === 10) {
    next();
  } else {
    res.status(403).json({ error: "Payments are only allowed between 10 AM and 11 AM IST." });
  }
};

module.exports = checkTime;

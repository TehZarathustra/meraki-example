const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('meraki')
})

app.listen(3000, function () {
  console.log('meraki app listening on port 3000!')
})

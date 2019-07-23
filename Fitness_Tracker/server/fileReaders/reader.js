const csv = require('csv')
var testCSV = csv()
const fs = require('fs')

function MyCSV(col1, col2, col3) {
  this.col1 = col1
  this.col2 = col2
  this.col3 = col3
}
// test

function validate(byte, marker) {
  if (byte !== marker) {
    console.log("***********NOT A VALID FILE************")
    console.log("expected: ", marker, "actual: ", byte)
  }
}

// for jump, its [sport, num jumps, ndata, hangtime, height in .01 inches]
// swim: [sport, stroke (U, B, R, F), ndata, lap time, calories]
// run: [sport, time walking, ndata, step count, calories]
// unscrambles encoded byte file
function convert(byteArr) {
  var converted = []
  var set = []
  var i8 = parseInt("0x00"),
      i16 = parseInt("0x0000"),
      i321 = parseInt("0x00000000"),
      i322 = parseInt("0x00000000"),
      i323 = parseInt("0x00000000"),
      count = 0
  for (var i = 0; i < byteArr.length; i++) {
    var byte = byteArr[i]
    switch(count) {
      case 0:
        i8 = byte
        break
      case 1:
        // first 8 bits of i16
        i16 = i16 | (byte << 8)
        break
      case 2:
        // last 8 bits of i16
        i16 = i16 | byte
        break
      case 3:
        // 0xFA
        validate(byte, parseInt("0xFA"))
        break
      case 4:
        // 2nd last of i321
        i321 = i321 | (byte << 8)
        break
      case 5:
        // 3rd last of i321
        i321 = i321 | (byte << 16)
        break
      case 6:
        // last 8 of i321
        i321 = i321 | byte
        break
      case 7:
        // 0xFB
        validate(byte, parseInt("0xFB"))
        break
      case 8:
        // 2nd last of i322
        i322 = i322 | (byte << 8)
        break
      case 9:
        // last 8 of i322
        i322 = i322 | byte
        break
      case 10:
        // 3rd last of i322
        i322 = i322 | (byte << 16)
        break
      case 11:
        // marker 0xFC
        validate(byte, parseInt("0xFC"))
        break
      case 12:
        // 3rd last of i323
        i323 = i323 | (byte << 16)
        break
      case 13:
        // 2nd last of i323
        i323 = i323 | (byte << 8)
        break
      case 14:
        // last 8 of i323
        i323 = i323 | byte
        break
      case 15:
        //reached a semicolon, reset the set and count
        set.push(...[i8, i16, i321, i322, i323])
        converted.push(set)
        set = []
        var i8 = parseInt("0x00")
        var i16 = parseInt("0x0000")
        var i321 = parseInt("0x00000000")
        var i322 = parseInt("0x00000000")
        var i323 = parseInt("0x00000000")
        count = -1
    }
    count += 1
  }
  return converted
}

module.exports = {

  readEncoded: function readEncoded(filePath) {
    var byteArr = []
    var converted = []
    var prom = new Promise((resolve, reject) =>{
      fs.open(filePath, 'r', function(err, fd) {
        // read into the byte array
        if (err) {
          reject(err)
        }
        var buffer = new Buffer.alloc(1, "hex")
        while (true) {
          var num = fs.readSync(fd, buffer, 0, 1, null);
          if (num === 0) {
            break
          }
          byteArr.push(buffer[0])
        }
        converted = convert(byteArr)
        resolve(converted)
      })
    })
    return prom
  }
}

'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mailer: {
      service: 'Gmail',
      auth: {
        user: 'chuks09087064063@gmail.com',
        pass: '!pass4sure'
      }
    },
    mongoURI: 'mongodb://emmanuel:pass4sure@ds249123.mlab.com:49123/collabo',
    sessionKey: 'keyboard light'
  }
} else {
  module.exports = {
    mailer: {
      service: 'Gmail',
      auth: {
        user: 'chuks09087064063@gmail.com',
        pass: '!pass4sure'
      }
    },
    mongoURI: 'mongodb://localhost/collabo',
    //mongoURI: 'mongodb+srv://emmanuel:pass4sure@cluster0-ryu8m.mongodb.net/collabo',
    sessionKey: 'keyboard light'
  }
}

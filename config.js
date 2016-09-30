'use strict'

const config = {
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  client: {
    endpoints: {
      pictures: 'http://api.pictoriums.com/picture',
      users: 'http://api.pictoriums.com/user',
      auth: 'http://api.pictoriums.com/auth'
    }
  },
  auth: {
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://pictoriums.com/auth/facebook/callback'
    }
  },
  secret: process.env.PICTORIUMS_SECRET || 'p1ct0' // never use default
}

// For development use local micro instances
if (process.env.NODE_ENV !== "production") {
  config.client.endpoints = {
    pictures: 'http://localhost:5000',
    users: 'http://localhost:5001',
    auth: 'http://localhost:5002'
  }

  config.auth.facebook.callbackURL = 'http://pictoriums.test:5050/auth/facebook/callback'
}

module.exports = config

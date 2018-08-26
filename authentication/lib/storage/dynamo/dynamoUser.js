const AWS = require('aws-sdk')

const config = {
  region: process.env.REGION || 'eu-west-1'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(config)

const saveUser = (profile) => {
  const params = {
    TableName: process.env.USERS_DB_NAME,
    Item: profile
  }
  return dynamodb.put(params).promise()
}

module.exports = {
  saveUser
}

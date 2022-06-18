import { MongoClient } from 'mongodb'
import { type } from 'os'
import { getErrorMessage } from './utils/getErrorMessage'

const uri = process.env.MONGODB_URI
const options = {}

let mongoClient: MongoClient
let globalWithMongo = global as typeof globalThis & {
  mongoClientPromise: MongoClient
}

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

export const connectMongo = async (): Promise<MongoClient> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (!globalWithMongo.mongoClientPromise) {
        const client = new MongoClient(uri, options)

        globalWithMongo.mongoClientPromise = await client.connect()
        await client.db('admin').command({ ping: 1 })
      }

      mongoClient = globalWithMongo.mongoClientPromise
    } else {
      // In production mode, it's best to not use a global variable.
      const prodClient = new MongoClient(uri, options)
      mongoClient = await prodClient.connect()
    }
  } catch (error) {
    console.error(getErrorMessage(error))
  }

  return mongoClient
}

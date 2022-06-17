import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const run = async (): Promise<MongoClient> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        const client = new MongoClient(uri, options)

        global._mongoClientPromise = await client.connect()
        await client.db('admin').command({ ping: 1 })
      }

      clientPromise = global._mongoClientPromise
    } else {
      // In production mode, it's best to not use a global variable.
      const prodClient = new MongoClient(uri, options)
      clientPromise = await prodClient.connect()
    }
  } catch (e) {
    console.error(e.message)
  }

  return clientPromise
}

export default run()

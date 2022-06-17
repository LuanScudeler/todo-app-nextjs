// FIXME: Types merge not being recognized by ts-node
interface global {
  _mongoClientPromise: Promise<MongoClient>
}

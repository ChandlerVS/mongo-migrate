import { ipcMain, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { MongoConfig } from "../interfaces/MongoConfig";
import { Collection, MongoClient } from "mongodb";

export default async function migrateData(event: IpcMainEvent, ...args: any[]) {
  let data = args[0] as MongoConfig;
  console.log(
    `Migrating database ${data.sourceDatabaseName} to ${data.destDatabaseName}`
  );

  let sourceClient, destClient;

  // Initialize connections to the source and destination
  try {
    sourceClient = await new MongoClient(data.sourceConnectionString).connect();
    destClient = await new MongoClient(data.destConnectionString).connect();
    console.log("Connected to servers");
  } catch (e) {
    event.reply("migrate", {
      error: true,
      message: "Unable to connect to servers",
    });
    return Promise.reject(e);
  }

  let sourceDb = sourceClient.db(data.sourceDatabaseName);
  let destDb = destClient.db(data.destDatabaseName);

  // Get collections from the source database
  let collections: Collection<any>[];
  try {
    collections = await sourceDb.collections();
    console.log("Received collection list from source server");
  } catch (e) {
    event.reply("migrate", {
      error: true,
      message: "Failed to receive collection list",
    });
    return Promise.reject(e);
  }

  try {
    for (let i = 0; i < collections.length; i++) {
      let collection = collections[i];
      let newCollection = await destDb.createCollection(
        collection.collectionName
      );
      let documents = await collection.find({}).toArray();
      await newCollection.insertMany(documents);
      console.log(`Migrated ${collection.collectionName} data`);
    }
  } catch (e) {
    event.reply("migrate", {
      error: true,
      message: "An error occurred while migrating a collection",
    });
    return Promise.reject(e);
  }

  event.reply("migrate", { error: false, message: "Completed Migration" });
  return Promise.resolve();
}

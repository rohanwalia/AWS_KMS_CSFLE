const crypto = require('crypto');
const { MongoClient, Binary, UUID } = require('mongodb');
const { ClientEncryption } = require('mongodb-client-encryption');
const fs = require('fs');

// add user name, password and connection string for Atlas Cluster
const connectionString = 'mongodb+srv://<username>:<password>@<atlas-url>/test?retryWrites=true&w=majority';

const extraOptions = {
  mongocryptdSpawnPath: '/usr/bin/mongocryptd'
}

const secureClient = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    monitorCommands: true,
});

async function main() {
    try {

	await secureClient.connect();
	const db = secureClient.db("medicalRecords");
	const coll = db.collection("patients");

	const patient = await coll.findOne();
	console.log("Found patient: ", JSON.stringify(patient, null, 4));
    }
    catch (writeError) {
	console.log('[main]:', writeError);
    }
    finally {
	await secureClient.close();
    }
}

main();

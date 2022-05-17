const crypto = require('crypto');
const { MongoClient, Binary, UUID } = require('mongodb');
const { ClientEncryption } = require('mongodb-client-encryption');
const fs = require('fs');

// add user name, password and connection string for Atlas Cluster
const connectionString = 'mongodb+srv://<username>:<password>@<connection-string>/test?retryWrites=true&w=majority';
const keyVaultDb = 'encryption';
const keyVaultCollection = '__keyVault';

const keyVaultNamespace = keyVaultDb + "." + keyVaultCollection;

const base64KeyId = '<base64KeyId>';   // Add base64 key (Data Encryption Key) created in the last step

function JSONSchemaCreator(keyId) {
  return {
    bsonType: 'object',
    encryptMetadata: {
      keyId : [new Binary(Buffer.from(keyId, "base64"), 4)]
    },
    properties: {
      insurance: {
        bsonType: 'object',
        properties: {
          policyNumber: {
            encrypt: {
              bsonType: 'int',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
            },
          },
        },
      },
      medicalRecords: {
        encrypt: {
          bsonType: 'array',
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
        },
      },
      bloodType: {
        encrypt: {
          bsonType: 'string',
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
        },
      },
      ssn: {
        encrypt: {
          bsonType: 'int',
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
        },
      },
      mobile: {
        encrypt: {
          bsonType: 'string',
          algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random',
        },
      },
    },
  };
}

const jsonSchema = JSONSchemaCreator(base64KeyId); 

//const path = './master-key.txt';
//const localMasterKey = fs.readFileSync(path);

const kmsProviders = {
  aws: {
      accessKeyId: '<access-key-id>', //Add AWS Access Key Id
      secretAccessKey: '<secret-access-key>' //Add AWS Secret access key
  },
};
const patientSchema = {
  'medicalRecords.patients': jsonSchema,
}

const extraOptions = {
  mongocryptdSpawnPath: '/usr/bin/mongocryptd'
}

const secureClient = new MongoClient(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    monitorCommands: true,
    autoEncryption: {
      keyVaultNamespace,
      kmsProviders,
      schemaMap: patientSchema,
      //extraOptions: extraOptions,
    }
});

const samplePatient = {
    "name": "Jon Doe",
    "ssn": 241014209,
    "bloodType": "AB+",
    "medicalRecords": [
        {
            "weight": 180,
            "bloodPressure": "120/80"
        }
    ],
    "insurance": {
        "provider": "MaestCare",
        "policyNumber": 123142
    }
};

async function insertPatient(collection, patient) {
  try {
    const writeResult = await collection.insertOne(patient);
  } catch (writeError) {
    console.error('writeError occurred:', writeError);
  }
}

async function main() {
    try {

	await secureClient.connect();
	const db = secureClient.db("medicalRecords");
	const coll = db.collection("patients");
	await insertPatient(coll, samplePatient);

	const patient = await coll.findOne({ssn : 241014209});
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

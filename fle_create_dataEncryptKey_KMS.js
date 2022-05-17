const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { ClientEncryption } = require('mongodb-client-encryption');


const kmsMasterKeyInfo = {
    "KeyMetadata": {
        "AWSAccountId": "<Account if of AWS ACCOUNT>", //Add AWS Account ID.
        "KeyId": "<KEY ID OF AWS MASTER KET>", //Add Key ID
        "Arn": "<ARN-AWS-MASTERKEY>", // Add AWS MASTER KEY ARN
        "CreationDate": "2020-05-18T15:05:55.521000-04:00",
        "Enabled": true,
        "Description": "test key for FLE",
        "KeyUsage": "ENCRYPT_DECRYPT",
        "KeyState": "Enabled",
        "Origin": "AWS_KMS",
        "KeyManager": "CUSTOMER",
        "CustomerMasterKeySpec": "SYMMETRIC_DEFAULT",
        "EncryptionAlgorithms": [
            "SYMMETRIC_DEFAULT"
        ]
    }
};

// add user name, password and connection string for Atlas Cluster
const connectionString = 'mongodb+srv://<username>:<password>@<connection-string>/test?retryWrites=true&w=majority';
const keyVaultNamespace = 'encryption.__keyVault';

async function main() {

    const client = new MongoClient(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	}
    );
    
    try {
	await client.connect()

	// CREATE ENCRYPTED CONNECTION
	const encryption = new ClientEncryption(client, {
	    keyVaultNamespace: keyVaultNamespace,
	    kmsProviders: {
		aws: {
			accessKeyId: '<access-key-id>', //Add AWS Access Key Id
			secretAccessKey: '<secret-access-key>' //Add AWS Secret access key
			  },
	    }
	});

	// CREATE DATA ENCRYPTION KEY
	const key = await encryption.createDataKey('aws', {
	    masterKey: {
		key: kmsMasterKeyInfo.KeyMetadata.Arn, 
		region: 'ap-southeast-2' //Make Sure this is righ region - where you created Master Key
	    }
	});

	//PRINT KEY
	const base64DataKeyId = key.toString('base64');
	console.log('DataKeyId [base64]: ', base64DataKeyId);
    }
    catch (err) {
	console.log(err);
    }
    finally {
	await client.close();
    }
}

main();

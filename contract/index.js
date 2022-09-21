'use strict';

var Web3 = require('web3')
const fs = require('fs');
const inquirer = require('inquirer');
const prompt = inquirer.createPromptModule();
let web3 = new Web3(Web3.givenProvider);

const decryptKeyStore = async ({file}) => {
	if (!file) {
		throw Error(
			`must provide private key file`
		);
	}
	if (!fs.existsSync(file)) {
		throw Error(
			`private key file not exist`
		);
	}
	const privateEncrypt = JSON.parse(await fs.readFileSync(file));
	const {password} = await prompt({type: 'password', name: 'password', message: 'Enter a password', mask: '*'})
	const key = web3.eth.accounts.decrypt(privateEncrypt, password.toString())
	return key.privateKey;
}

module.exports = {
	decryptKeyStore
}

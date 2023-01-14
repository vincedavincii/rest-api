import * as dotenv from "dotenv";
const result = dotenv.config();
import "reflect-metadata";
import {AppDataSource} from "../dataSource";

import Users from "./users";
import {Products} from "./products";
import {Company} from "./company";

async function deleteDb() {
	await AppDataSource.initialize();
	console.log(`Db Connection Ready`);
	//delete lesson table
	console.log(`Clearing Medicine Table`);
	await AppDataSource.getRepository(Products).delete({});

	//delete course table
	console.log(`Clearing Company Table`);
	await AppDataSource.getRepository(Company).delete({});

	//delete users table
	console.log(`Clearing Courses Table`);
	await AppDataSource.getRepository(Users).delete({});
}

deleteDb()
	.then(() => {
		console.log(`Delete Db Sucessfull`);
		process.exit(0);
	})
	.catch((err) => {
		console.log(`Delete Db Failed.`, err);
	});

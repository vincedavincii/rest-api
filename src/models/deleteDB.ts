import * as dotenv from "dotenv";
const result = dotenv.config();
import "reflect-metadata";
import {AppDataSource} from "../dataSource";
import {Lesson} from "./lesson";
import {Course} from "./course";

async function deleteDb() {
	await AppDataSource.initialize();
	console.log(`Db Connection Ready`);
	//delete lesson table
	console.log(`Clearing Lessons Table`);
	await AppDataSource.getRepository(Lesson).delete({});

	//delete course table
	console.log(`Clearing Courses Table`);
	await AppDataSource.getRepository(Course).delete({});
}

deleteDb()
	.then(() => {
		console.log(`Delete Db Sucessfull`);
		process.exit(0);
	})
	.catch((err) => {
		console.log(`Delete Db Failed.`, err);
	});

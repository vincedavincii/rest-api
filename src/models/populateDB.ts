import * as dotenv from "dotenv";
const result = dotenv.config();

import "reflect-metadata";
import {COURSES, USERS} from "./data";
import {AppDataSource} from "../dataSource";
import {Course} from "./course";
import {DeepPartial} from "typeorm";
import {Lesson} from "./lesson";
import Users from "./users";
import {passwordCalculator} from "../utils";

async function populateDb() {
	await AppDataSource.initialize();
	console.log(`Db Connection Ready`);
	const courses = Object.values(COURSES) as DeepPartial<Course>[];
	const courseRepository = AppDataSource.getRepository(Course);
	const lessonRepository = AppDataSource.getRepository(Lesson);

	for (let courseData of courses) {
		console.log(`Adding Course: ${courseData.title}`);
		const course = courseRepository.create(courseData);
		console.log(courseData);
		await courseRepository.save(course);

		for (let lessonData of courseData.lessons) {
			console.log(`Adding lesson: ${lessonData.title}`);
			const lesson = lessonRepository.create(lessonData);
			lesson.course = course;
			await lessonRepository.save(lesson);
		}
	}

	const users = Object.values(USERS) as any[];
	for (let userData of users) {
		const {email, pictureUrl, passwordSalt, isAdmin, plainTextPassword} =
			userData;
		const saveUserInDb = AppDataSource.getRepository(Users).create({
			email,
			pictureUrl,
			isAdmin,
			passwordSalt,
			passwordHash: await passwordCalculator(plainTextPassword, passwordSalt),
		});
		await AppDataSource.manager.save(saveUserInDb);
	}

	const totalCourses = await courseRepository.createQueryBuilder().getCount();

	const totalLesson = await lessonRepository.createQueryBuilder().getCount();

	console.log(`Data Inserted: ${totalCourses} courses, ${totalLesson} lessons`);
}

populateDb()
	.then(() => {
		console.log(`Populate Db Sucessfull`);
		process.exit(0);
	})

	.catch((err) => {
		console.log(`Populate Db Failed.`, err);
	});

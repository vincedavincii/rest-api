import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {isInteger} from "../utils";
import {AppDataSource} from "../dataSource";
import {Course} from "../models/course";

export default async function createCourse(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug("CreatNewCourse() Triggered");
		const data = request.body;
		if (!data) {
			throw `no data found, Error!`;
		}

		const updatedCourse = await AppDataSource.transaction(
			"REPEATABLE READ",
			async (transactionalEntityManager) => {
				const repository = transactionalEntityManager.getRepository(Course);
				const result = await repository
					.createQueryBuilder("course")
					.select("MAX(course.seqNo)", "max")
					.getRawOne();

				const newCourse = repository.create({
					...data,
					seqNo: (result?.max ?? 0) + 1,
				});
				await repository.save(newCourse);
				return newCourse;
			}
		);
		response.status(200).json({updatedCourse});
	} catch (error) {
		logger.error("Error updating course");
		return next(error);
	}
}

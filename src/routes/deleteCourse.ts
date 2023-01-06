import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Course} from "../models/course";
import {isInteger} from "../utils";
import {Lesson} from "../models/lesson";

export async function deleteCourses(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` delete Courses and lessons function called`);
		const courseId = request.params.courseId;
		if (!isInteger(courseId)) {
			throw `Invalid courseid: ${courseId}`;
		}
		const deleteCourse = await AppDataSource.transaction(
			async (transactionalEntityManager) => {
				await transactionalEntityManager
					.createQueryBuilder()
					.delete()
					.from(Lesson)
					.where(`courseId = :courseId`, {courseId})
					.execute();

				await transactionalEntityManager
					.createQueryBuilder()
					.delete()
					.from(Course)
					.where(`id = :courseId`, {courseId})
					.execute();
			}
		);

		response.status(200).json({
			message: `Course deleted succesfully: ${courseId}`,
		});
	} catch (error) {
		logger.error(`Error Occured While deleteing Courses() `);
		return next(error);
	}
}

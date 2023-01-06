import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Course} from "../models/course";
import {Lesson} from "../models/lesson";

export async function findCourseUrl(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` Find course url called`);
		const courseUrl = request.params.courseUrl;
		if (!courseUrl) {
			throw ` courseUrl not Found`;
		}

		const course = await AppDataSource.getRepository(Course).findOneBy({
			url: courseUrl,
		});
		if (!course) {
			const message = `Course with Url: ${courseUrl} not found`;
			logger.error(message);
			response.status(404).json({message});
			return;
		}

		const totalLessons = await AppDataSource.getRepository(Lesson)
			.createQueryBuilder("lessons")
			.where(`lessons.courseId = :courseId`, {
				courseId: course.id,
			})
			.getCount();
		response.status(200).json({course, totalLessons});
	} catch (error) {
		logger.error(`Error Occured While calling FindCourses()`);
		return next(error);
	}
}

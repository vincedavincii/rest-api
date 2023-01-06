import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Lesson} from "../models/lesson";
import {isInteger} from "../utils";

export async function findLessons(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` FindLessons()  called`);
		const courseId = request.params.courseId,
			query = request.query as any,
			pageNumber = query?.pageNumber ?? "0",
			pageSize = query?.pageSize ?? "3";
		if (!isInteger(courseId)) {
			throw ` Invalid course id ${courseId}`;
		}
		if (!isInteger(pageNumber)) {
			throw ` Invalid page number ${pageNumber}`;
		}
		if (!isInteger(pageSize)) {
			throw ` Invalid page size ${pageSize}`;
		}

		const lessons = await AppDataSource.getRepository(Lesson)
			.createQueryBuilder("lessons")
			.where(`lessons.courseId = :courseId`, {courseId})
			.orderBy("lessons.seqNo")
			.skip(pageNumber * pageSize)
			.take(pageSize)
			.getMany();

		response.status(200).json({lessons});
	} catch (error) {
		logger.error(`Error Occured While calling FindLessons()`);
		return next(error);
	}
}

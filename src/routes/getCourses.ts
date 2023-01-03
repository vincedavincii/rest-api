import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Course} from "../models/course";

export async function getCourses(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` GetCourse function called`);
		//throw {error: "Thrown Error!"};
		const courses = await AppDataSource.getRepository(Course)
			.createQueryBuilder("courses")
			.orderBy("courses.seqNo")
			.getMany();
		response.status(200).json({courses});
	} catch (error) {
		logger.error(`Error Occured While calling getCourses()`);
		return next(error);
	}
}

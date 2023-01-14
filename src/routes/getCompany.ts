import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Company} from "../models/company";

export async function getCompany(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` getCompany function called`);
		//throw {error: "Thrown Error!"};
		const companies = await AppDataSource.getRepository(Company)
			.createQueryBuilder("company")
			.orderBy("company.seqNo")
			.getMany();
		response.status(200).json({companies});
	} catch (error) {
		logger.error(`Error Occured While calling getCompanies()`);
		return next(error);
	}
}

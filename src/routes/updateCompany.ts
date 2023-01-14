import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {isInteger} from "../utils";
import {AppDataSource} from "../dataSource";
import {Company} from "../models/company";

export default async function updateCompany(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug("createCompany() triggered");
		const companyId = request.params.companyId,
			changes = request.body;
		if (!isInteger(companyId)) {
			throw `Invalid course id ${companyId}`;
		}
		await AppDataSource.createQueryBuilder()
			.update(Company)
			.set(changes)
			.where(`id = :companyId`, {companyId})
			.execute();
		response.status(200).json({
			message: `Company ${companyId} was updated successfully`,
		});
	} catch (error) {
		logger.error("Error updating company");
		return next(error);
	}
}

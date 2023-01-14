import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {isInteger} from "../utils";
import {Products} from "../models/products";
import {Company} from "../models/company";

// delete via command line
// curl -X DELETE http://localhost:3000/api/company/32

export async function deleteCompany(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` delete company and products function called`);
		const companyId = request.params.companyId;
		if (!isInteger(companyId)) {
			throw `Invalid companyid: ${companyId}`;
		}
		const deleteCompany = await AppDataSource.transaction(
			async (transactionalEntityManager) => {
				await transactionalEntityManager
					.createQueryBuilder()
					.delete()
					.from(Products)
					.where(`companyId = :companyId`, {companyId})
					.execute();

				await transactionalEntityManager
					.createQueryBuilder()
					.delete()
					.from(Company)
					.where(`id = :companyId`, {companyId})
					.execute();
			}
		);

		response.status(200).json({
			message: `Company deleted succesfully: ${companyId}`,
		});
	} catch (error) {
		logger.error(`Error Occured While deleteing Company data() `);
		return next(error);
	}
}

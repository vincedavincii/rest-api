import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Company} from "../models/company";

// // create new Company
// curl -X POST http://localhost:3000/api/company -H "Content-Type: application/json" -d '{"name": "Okeke Pharma", "country": "Nigeria", "address": "okeke  Center", "companyUrl": "newMade-teva.com"}'

export default async function createCompany(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug("CreatNewCompany() Triggered");
		const data = request.body;
		if (!data) {
			throw `no data found, Error!`;
		}

		const updateCompany = await AppDataSource.transaction(
			"REPEATABLE READ",
			async (transactionalEntityManager) => {
				const repository = transactionalEntityManager.getRepository(Company);
				const result = await repository
					.createQueryBuilder("company")
					.select("MAX(company.seqNo)", "max")
					.getRawOne();

				const newCompany = repository.create({
					...data,
					seqNo: (result?.max ?? 0) + 1,
				});
				await repository.save(newCompany);
				return newCompany;
			}
		);
		response.status(200).json({updateCompany});
	} catch (error) {
		logger.error("Error creating new company");
		return next(error);
	}
}

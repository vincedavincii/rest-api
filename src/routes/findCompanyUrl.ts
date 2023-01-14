import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {Company} from "../models/company";
import {Products} from "../models/products";

export async function findCompanyByUrl(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` Find company by url() called`);
		const companyUrl = request.params.companyUrl;
		if (!companyUrl) {
			throw ` Url: ${companyUrl} not Found`;
		}

		const company = await AppDataSource.getRepository(Company).findOneBy({
			companyUrl: companyUrl,
		});
		if (!company) {
			const message = `Course with Url: ${companyUrl} not found`;
			logger.error(message);
			response.status(404).json({message});
			return;
		}

		const totalProducts = await AppDataSource.getRepository(Products)
			.createQueryBuilder("products")
			.where(`products.companyId = :companyId`, {
				companyId: company.id,
			})
			.getCount();
		response.status(200).json({company, totalProducts});
	} catch (error) {
		logger.error(`Error Occured While calling FindCompanyByUrl()`);
		return next(error);
	}
}

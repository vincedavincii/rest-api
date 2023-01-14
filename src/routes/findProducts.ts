import {NextFunction, Request, Response} from "express";
import {logger} from "../logger";
import {AppDataSource} from "../dataSource";
import {isInteger} from "../utils";
import {Products} from "../models/products";

export async function FindProducts(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		logger.debug(` FindProducts()  called`);
		const companyId = request.params.companyId,
			query = request.query as any,
			pageNumber = query?.pageNumber ?? "0",
			pageSize = query?.pageSize ?? "3";
		if (!isInteger(companyId)) {
			throw ` Invalid company id ${companyId}`;
		}
		if (!isInteger(pageNumber)) {
			throw ` Invalid page number ${pageNumber}`;
		}
		if (!isInteger(pageSize)) {
			throw ` Invalid page size ${pageSize}`;
		}

		const product = await AppDataSource.getRepository(Products)
			.createQueryBuilder("products")
			.where(`products.companyId = :companyId`, {companyId})
			.orderBy("products.seqNo")
			.skip(pageNumber * pageSize)
			.take(pageSize)
			.getMany();

		response.status(200).json({product});
	} catch (error) {
		logger.error(`Error Occured While calling FindProducts()`);
		return next(error);
	}
}

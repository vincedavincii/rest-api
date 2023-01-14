import * as dotenv from "dotenv";
const result = dotenv.config();

import "reflect-metadata";
import {COMPANY, USERS} from "./data";
import {AppDataSource} from "../dataSource";
import {Company} from "./company";
import {DeepPartial} from "typeorm";
import {Products} from "./products";
import Users from "./users";
import {passwordCalculator} from "../utils";

async function populateDb() {
	await AppDataSource.initialize();
	console.log(`Db Connection Ready`);
	const companyList = Object.values(COMPANY) as DeepPartial<Company>[];
	const companyRepository = AppDataSource.getRepository(Company);
	const productsRepository = AppDataSource.getRepository(Products);

	for (let companyData of companyList) {
		console.log(`Adding Company Info: ${companyData.name}`);
		const company = companyRepository.create(companyData);
		console.log(companyData);
		await companyRepository.save(company);

		for (let productItem of companyData.products) {
			console.log(`Adding medicines Info: ${productItem.brandName}`);
			const product = productsRepository.create(productItem);
			product.company = company;
			await productsRepository.save(product);
		}
	}

	const users = Object.values(USERS) as any[];
	for (let userData of users) {
		const {email, pictureUrl, passwordSalt, isAdmin, plainTextPassword} =
			userData;
		const saveUserInDb = AppDataSource.getRepository(Users).create({
			email,
			pictureUrl,
			isAdmin,
			passwordSalt,
			passwordHash: await passwordCalculator(plainTextPassword, passwordSalt),
		});
		await AppDataSource.manager.save(saveUserInDb);
	}

	const numberOfCompanies = await companyRepository
		.createQueryBuilder()
		.getCount();

	const totalNumberOfProducts = await productsRepository
		.createQueryBuilder()
		.getCount();

	console.log(
		`Data Inserted: ${numberOfCompanies} companies, ${totalNumberOfProducts} products`
	);
}

populateDb()
	.then(() => {
		console.log(`Populate Db Sucessfull`);
		process.exit(0);
	})

	.catch((err) => {
		console.log(`Populate Db Failed.`, err);
	});

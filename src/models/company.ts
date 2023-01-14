import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import {Products} from "./products";

@Entity({
	name: "COMPANY",
})
export class Company {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	seqNo: number;

	@Column()
	name: string;

	@Column()
	country: string;

	@Column()
	address: string;

	@Column()
	companyUrl: string;

	@OneToMany(() => Products, (products) => products.company)
	products: Products[];

	@CreateDateColumn()
	createdDT: Date;

	@UpdateDateColumn()
	updateDateDT: Date;
}

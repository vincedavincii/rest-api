import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import {Company} from "./company";

@Entity({
	name: "PRODUCTS",
})
export class Products {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	brandName: string;

	@Column()
	genericName: string;

	@Column()
	imageUrl: string;

	@Column()
	seqNo: number;

	@ManyToOne(() => Company, (company) => company.products)
	@JoinColumn({
		name: "companyId",
	})
	company: Company;

	@CreateDateColumn()
	createdDT: Date;

	@UpdateDateColumn()
	updateDateDT: Date;
}

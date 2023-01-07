import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity({
	name: "USERS",
})
export default class Users {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	passwordHash: string;
	@Column()
	passwordSalt: string;

	@Column()
	pictureUrl: string;

	@Column()
	isAdmin: boolean;

	@CreateDateColumn()
	createdAT: Date;

	@UpdateDateColumn()
	lastUpdatedAT: Date;
}

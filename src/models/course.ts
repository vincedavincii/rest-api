import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import {Lesson} from "./lesson";

@Entity({
	name: "COURSES",
})
export class Course {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	seqNo: number;

	@Column()
	title: string;

	@Column()
	iconUrl: string;

	@Column()
	description: string;

	@Column()
	category: string;

	@OneToMany(() => Lesson, (lesson) => lesson.course)
	lessons: Lesson[];

	@CreateDateColumn()
	createdDT: Date;

	@UpdateDateColumn()
	updateDateDT: Date;
}

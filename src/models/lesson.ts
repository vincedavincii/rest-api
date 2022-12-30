import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	UpdateDateColumn,
} from "typeorm";
import {Course} from "./course";

@Entity({
	name: "LESSON",
})
export class Lesson {
	@Column()
	id: number;

	@Column()
	title: string;

	@Column()
	duration: string;

	@Column()
	seqNo: number;

	@ManyToOne(() => Course, (course) => course.lessons)
	course: Course;

	@CreateDateColumn()
	createdDT: Date;

	@UpdateDateColumn()
	updateDateDT: Date;
}

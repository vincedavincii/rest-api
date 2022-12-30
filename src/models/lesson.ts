import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import {Course} from "./course";

@Entity({
	name: "LESSON",
})
export class Lesson {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	duration: string;

	@Column()
	seqNo: number;

	@ManyToOne(() => Course, (course) => course.lessons)
	@JoinColumn({
		name: "courseId",
	})
	course: Course;

	@CreateDateColumn()
	createdDT: Date;

	@UpdateDateColumn()
	updateDateDT: Date;
}

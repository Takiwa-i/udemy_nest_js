import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "../tasks/dto/task.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;
  
  @Column()
  password: string;

  @OneToMany(_type => Task, task => task.user, { eager: true }) //eager 真だとuserをデータベースから持ってきたときにこのtasksも一緒に引っ張ってくるといこと
  tasks: Task[];
}

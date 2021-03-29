import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsDate, IsEmail, Length } from "class-validator";
import * as bcrypt from "bcrypt";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  readonly uuid: string;

  @Column({
    type: "varchar",
    length: 20,
    unique: true,
  })
  @Length(3, 20)
  @Field()
  username: string;

  @Column({
    name: "password",
    type: "varchar",
    length: "60",
  })
  private _password: string;

  @Column({ nullable: true })
  @Field()
  @IsEmail()
  @Length(5, 255)
  email: string;

  @Column({ nullable: true })
  @Field()
  firstName: string;

  @Column({ nullable: true })
  @Field()
  lastName: string;

  @Column({ nullable: true })
  @Field()
  @IsDate()
  dateOfBirth: Date;

  @Column({ nullable: true })
  phone: string;

  set password(password) {
    this._password = bcrypt.hashSync(password, 2);
  }

  get password() {
    return this._password;
  }

  async comparePassword(password) {
    return this._password && (await bcrypt.compare(password, this.password));
  }
}

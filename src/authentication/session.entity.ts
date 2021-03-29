import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import * as moment from "moment";
import { Field, ObjectType } from "@nestjs/graphql";

export class AnonymousSession {
  anon = true;
}

@Entity()
@ObjectType()
export class Session extends AnonymousSession {
  @PrimaryGeneratedColumn("uuid")
  @Field()
  readonly uuid: number;

  @ManyToOne(() => User)
  @Field((type) => User)
  user: Promise<User>;

  userUuid: string;

  @Column({
    name: "startedAt",
    type: "timestamp with time zone",
  })
  @Field(() => String)
  startedAt: Date;

  @Column({
    type: "timestamp with time zone",
  })
  @Field(() => String)
  validUntil: Date;

  @Field({ nullable: true })
  token?: string;

  anon = false;

  start() {
    this.startedAt = new Date();
    this.validUntil = moment(this.startedAt).add(30, "m").toDate();
  }

  extend() {
    if (!this.startedAt) {
      throw new Error("Session never started");
    }
    this.validUntil = moment(this.startedAt).add(30, "m").toDate();
  }
}

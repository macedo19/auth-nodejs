import {
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBasicAuth } from './users-basic-auth.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'varchar' })
  name: string;

  @Column({ name: 'last_name', length: 100, type: 'varchar', nullable: true })
  lastName?: string;

  @Column({ length: 100, type: 'varchar' })
  email: string;

  @Column({ length: 100, type: 'varchar' })
  password: string;

  @Column({ name: 'document', length: 20, type: 'varchar', nullable: true })
  document?: string;

  @Column({ name: 'is_brazilian', type: 'boolean', default: true })
  isBrazilian: boolean;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @BeforeInsert() setCreatedAt() {
    this.createdAt = new Date();
  }

  @OneToOne(() => UserBasicAuth, (userBasicAuth) => userBasicAuth.user, {
    cascade: true,
  })
  userBasicAuth: UserBasicAuth;
}

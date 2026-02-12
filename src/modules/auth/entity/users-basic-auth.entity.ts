import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('users_basic_auth')
export class UserBasicAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_user' })
  idUser: number;

  @Column({ name: 'basic_auth', length: 100, type: 'varchar' })
  basicAuth: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert() setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate() setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @OneToOne(() => User, (user) => user.userBasicAuth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;
}

import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }
}

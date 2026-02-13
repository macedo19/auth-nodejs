import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 100, type: 'varchar' })
  nome: string;

  @Column({ name: 'last_name', length: 100, type: 'varchar', nullable: true })
  sobrenome?: string;

  @Column({ name: 'email', length: 100, type: 'varchar' })
  email: string;

  @Column({ name: 'password', length: 100, type: 'varchar' })
  senha: string;

  @Column({ name: 'document', length: 20, type: 'varchar', nullable: true })
  documento: string;

  @Column({ name: 'is_brazilian', type: 'boolean', default: true })
  brasileiro: boolean;

  @Column({ name: 'created_at', type: 'timestamp' })
  criadoEm: Date;

  @BeforeInsert() definirCriadoEm() {
    this.criadoEm = new Date();
  }
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  import { User } from '../user/User.entity'; // Adjust import path as needed
  
  @Entity('campuses') // Maps this class to the 'campuses' table
  export class Campus {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Index() // Index for faster name lookups
    name: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    location: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    @Index() // Index for faster domain lookups
    email_domain: string;
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Relationships ---
    @OneToMany(() => User, (user) => user.campus) // A campus can have many users
    users: User[];
  }
  
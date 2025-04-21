import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { Category } from '../category/Category.entity'; // Adjust import path as needed
  
  @Entity('category_fees') // Maps this class to the 'category_fees' table
  export class CategoryFee {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Category (One-to-One) ---
    @OneToOne(() => Category, (category) => category.categoryFee, {
        nullable: false,
        onDelete: 'CASCADE', // If category deleted, delete its fee settings
    })
    @JoinColumn({ name: 'category_id' }) // Creates category_id column
    @Index({ unique: true }) // Ensure category_id is unique (One-to-One)
    category: Category;
  
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
    fee_percentage: number; // e.g., 5.00 for 5%
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    min_fee: number; // Minimum fee applied
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    max_fee: number; // Maximum fee applied
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean; // Whether these fee settings are currently active
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
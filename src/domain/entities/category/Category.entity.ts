import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { Product } from '../product/Product.entity';
  import { CategoryFee } from '../fee/CategoryFee.entity'; // Assuming CategoryFee entity path
  
  @Entity('categories') // Maps this class to the 'categories' table
  export class Category {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    @Index() // Index for faster name lookups
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string | null;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    icon: string | null; // e.g., name of an icon identifier
  
    // --- Self-referencing relationship for parent/child categories ---
    @ManyToOne(() => Category, (category) => category.children, {
      nullable: true, // parent_id can be null for top-level categories
      onDelete: 'SET NULL', // If parent is deleted, set parent_id to NULL for children
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'parent_id' }) // Specifies the foreign key column name
    parent: Category | null; // A category can have one parent (or null)
  
    @OneToMany(() => Category, (category) => category.parent)
    children: Category[]; // A category can have many children (subcategories)
    // --- End Self-referencing ---
  
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
  
    // --- Other Relationships ---
    @OneToMany(() => Product, (product) => product.category)
    products: Product[]; // A category can have many products
  
    @OneToOne(() => CategoryFee, (fee) => fee.category) // Assuming one fee setting per category
    categoryFee: CategoryFee; // The fee settings associated with this category
  }
  
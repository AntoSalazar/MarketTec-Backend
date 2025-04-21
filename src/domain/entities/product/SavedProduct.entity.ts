import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique, // Import Unique decorator for composite unique constraints
  } from 'typeorm';
  import { User } from '../user/User.entity'; // Adjust import path as needed
  import { Product } from './Product.entity'; // Adjust import path as needed
  
  @Entity('saved_products') // Maps this class to the 'saved_products' table
  @Unique(['user', 'product']) // Ensures a user can only save a specific product once
  // Alternatively use @Index(['user', 'product'], { unique: true })
  export class SavedProduct {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.savedProducts, {
      nullable: false,
      onDelete: 'CASCADE', // If user is deleted, remove their saved products
    })
    @JoinColumn({ name: 'user_id' }) // Specifies the foreign key column name
    user: User;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.savedByUsers, {
      nullable: false,
      onDelete: 'CASCADE', // If product is deleted, remove saves for it
    })
    @JoinColumn({ name: 'product_id' }) // Specifies the foreign key column name
    product: Product;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date; // Timestamp when the user saved the product
  }
  
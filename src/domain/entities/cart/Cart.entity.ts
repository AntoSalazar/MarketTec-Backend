import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { CartItem } from './CartItem.entity';
  
  @Entity('carts') // Maps this class to the 'carts' table
  export class Cart {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User (One-to-One) ---
    // Assuming one active cart per user based on unique index on user_id
    @OneToOne(() => User, (user) => user.carts, { // Use user.cart if defined as OneToOne on User entity
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, delete their cart
    })
    @JoinColumn({ name: 'user_id' }) // Creates user_id column
    @Index({ unique: true }) // Enforce One-to-One via unique index
    user: User;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Relationships ---
    @OneToMany(() => CartItem, (item) => item.cart, {
        cascade: true, // Cascade operations (like saving/deleting) to items
        eager: true, // Optionally load items automatically (consider performance)
    })
    items: CartItem[]; // Items currently in the cart
  }
  
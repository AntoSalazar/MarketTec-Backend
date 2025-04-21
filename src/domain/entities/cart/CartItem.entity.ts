import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { Cart } from './Cart.entity';
  import { Product } from '../product/Product.entity';
  
  @Entity('cart_items') // Maps this class to the 'cart_items' table
  // Prevent adding the same product to the same cart multiple times as separate rows
  @Unique(['cart', 'product'])
  export class CartItem {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Cart ---
    @ManyToOne(() => Cart, (cart) => cart.items, {
      nullable: false,
      onDelete: 'CASCADE', // If cart is deleted, delete its items
    })
    @JoinColumn({ name: 'cart_id' })
    @Index()
    cart: Cart;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.cartItems, {
      nullable: false,
      onDelete: 'CASCADE', // If product is deleted, remove it from carts
      eager: true, // Optionally load product details with cart item
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
  
    @Column({ type: 'int', nullable: false, default: 1 })
    quantity: number; // How many of this product are in the cart
  
    // Use CreateDateColumn for the 'added_at' timestamp
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      name: 'added_at', // Match the column name in the schema
    })
    added_at: Date;
  
    @Column({ type: 'text', nullable: true })
    notes: string | null; // Any notes specific to this item in the cart
  }
  
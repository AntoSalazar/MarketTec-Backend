import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Category } from '../category/Category.entity';
  import { ProductImage } from './ProductImage.entity';
  import { SavedProduct } from './SavedProduct.entity';
  import { Conversation } from '../messaging/Conversation.entity';
  import { Review } from '../review/Review.entity';
  import { Transaction } from '../transaction/Transaction.entity';
  import { Report } from '../report/Report.entity';
  import { PromotionalSlot } from '../promotion/PromotionalSlot.entity';
  import { CartItem } from '../cart/CartItem.entity'; // Assuming CartItem entity path
  
  // Define Enums for controlled vocabulary fields
  export enum ProductCondition {
    NEW = 'New',
    LIKE_NEW = 'Like New',
    GOOD = 'Good',
    FAIR = 'Fair',
    POOR = 'Poor',
  }
  
  export enum ProductStatus {
    AVAILABLE = 'Available',
    SOLD = 'Sold',
    RESERVED = 'Reserved',
    DELETED = 'Deleted', // Soft delete or admin removal
  }
  
  export enum ProductVisibility {
    PUBLIC = 'Public', // Visible to everyone
    CAMPUS_ONLY = 'Campus Only', // Visible only to users from the same campus
  }
  
  @Entity('products') // Maps this class to the 'products' table
  export class Product {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Index() // Index for faster title searching/sorting
    title: string;
  
    @Column({ type: 'text', nullable: false })
    description: string;
  
    @Column({
      type: 'decimal',
      precision: 10, // Total digits
      scale: 2, // Digits after decimal
      nullable: false,
    })
    price: number; // TypeORM typically maps decimal to number or string
  
    @Column({
      type: 'enum',
      enum: ProductCondition,
      nullable: false,
    })
    condition: ProductCondition;
  
    // --- Relationship with User (Seller) ---
    @ManyToOne(() => User, (user) => user.products, {
      nullable: false, // A product must have a seller
      onDelete: 'CASCADE', // If seller is deleted, delete their products (adjust as needed)
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'seller_id' }) // Specifies the foreign key column name
    @Index() // Index on seller_id for faster lookups of user's products
    seller: User;
  
    // --- Relationship with Category ---
    @ManyToOne(() => Category, (category) => category.products, {
      nullable: false, // A product must belong to a category
      onDelete: 'RESTRICT', // Prevent deleting category if products exist (adjust as needed)
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'category_id' }) // Specifies the foreign key column name
    @Index() // Index on category_id for faster filtering by category
    category: Category;
  
    @Column({ type: 'boolean', default: false })
    is_service: boolean; // True if this listing is for a service, not a physical product
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string | null; // Suggested meeting point, etc.
  
    @Column({
      type: 'enum',
      enum: ProductStatus,
      nullable: false,
      default: ProductStatus.AVAILABLE, // Default status when created
    })
    @Index() // Index for filtering by status
    status: ProductStatus;
  
    @Column({
      type: 'enum',
      enum: ProductVisibility,
      nullable: false,
      default: ProductVisibility.PUBLIC,
    })
    visibility: ProductVisibility;
  
    @Column({ type: 'int', default: 0 })
    views: number; // Counter for product page views
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships (One-to-Many) ---
  
    @OneToMany(() => ProductImage, (image) => image.product, {
        cascade: true, // If product is saved/deleted, cascade to images
        eager: true, // Automatically load images when loading product (optional, consider performance)
    })
    images: ProductImage[]; // Images associated with this product
  
    @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.product)
    savedByUsers: SavedProduct[]; // Link table entries for users who saved this product
  
    @OneToMany(() => Conversation, (conversation) => conversation.product)
    conversations: Conversation[]; // Conversations related to this product
  
    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[]; // Reviews for this product
  
    @OneToMany(() => Transaction, (transaction) => transaction.product)
    transactions: Transaction[]; // Transactions involving this product
  
    @OneToMany(() => Report, (report) => report.product)
    reports: Report[]; // Reports filed against this product
  
    @OneToMany(() => PromotionalSlot, (slot) => slot.product)
    promotionalSlots: PromotionalSlot[]; // Promotions applied to this product
  
    @OneToMany(() => CartItem, (item) => item.product)
    cartItems: CartItem[]; // Instances of this product in user carts
  }
  
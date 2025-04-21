import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { Product } from '../product/Product.entity';
  import { User } from '../user/User.entity';
  import { UserSubscription } from '../subscription/UserSubscription.entity';
  
  // Enum for promotion types
  export enum PromotionType {
    FEATURED = 'Featured', // General featured listing
    TOP_RESULTS = 'Top Results', // Boosted in search results
    HOMEPAGE = 'Homepage', // Featured on the homepage
    CATEGORY_BANNER = 'Category Banner', // Banner within a specific category
  }
  
  // Enum for promotion status
  export enum PromotionStatus {
    SCHEDULED = 'Scheduled', // Set to run in the future
    ACTIVE = 'Active', // Currently running
    ENDED = 'Ended', // Finished running
    CANCELLED = 'Cancelled', // Cancelled before or during run
  }
  
  @Entity('promotional_slots') // Maps this class to the 'promotional_slots' table
  export class PromotionalSlot {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.promotionalSlots, {
      nullable: false,
      onDelete: 'CASCADE', // If product deleted, remove its promotions
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.promotionalSlots, {
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, remove their promotions
    })
    @JoinColumn({ name: 'user_id' })
    @Index()
    user: User;
  
    // --- Relationship with UserSubscription ---
    // Links the promotion to the subscription that granted the slot
    @ManyToOne(() => UserSubscription, (sub) => sub.promotionalSlots, {
      nullable: false, // Promotion must be linked to a subscription
      onDelete: 'CASCADE', // If subscription deleted, remove associated promotions
    })
    @JoinColumn({ name: 'subscription_id' })
    @Index()
    subscription: UserSubscription;
  
    @Column({ type: 'timestamp', nullable: false })
    start_date: Date; // When the promotion begins
  
    @Column({ type: 'timestamp', nullable: false })
    @Index() // Index for finding active/expired promotions
    end_date: Date; // When the promotion ends
  
    @Column({
      type: 'enum',
      enum: PromotionType,
      nullable: false,
    })
    promotion_type: PromotionType;
  
    @Column({
      type: 'enum',
      enum: PromotionStatus,
      nullable: false,
    })
    @Index() // Index for filtering by status
    status: PromotionStatus;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
  } from 'typeorm';
  import { Min, Max } from 'class-validator'; // For validation
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Product } from '../product/Product.entity';
  
  @Entity('reviews') // Maps this class to the 'reviews' table
  // Ensure a unique review exists for a specific reviewer, reviewed user, and product
  @Unique(['reviewer', 'reviewed', 'product'])
  export class Review {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User (Reviewer) ---
    @ManyToOne(() => User, (user) => user.reviewsGiven, {
      nullable: false,
      onDelete: 'CASCADE', // If reviewer deleted, remove their reviews
    })
    @JoinColumn({ name: 'reviewer_id' })
    @Index()
    reviewer: User;
  
    // --- Relationship with User (Reviewed) ---
    @ManyToOne(() => User, (user) => user.reviewsReceived, {
      nullable: false,
      onDelete: 'CASCADE', // If reviewed user deleted, remove reviews about them
    })
    @JoinColumn({ name: 'reviewed_id' })
    @Index()
    reviewed: User;
  
    // --- Relationship with Product ---
    // Note: Review is tied to a specific product transaction/interaction
    @ManyToOne(() => Product, (product) => product.reviews, {
      nullable: false,
      onDelete: 'CASCADE', // If product deleted, remove reviews for it
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
  
    @Column({ type: 'int', nullable: false })
    @Min(1) // Validation: Minimum rating is 1
    @Max(5) // Validation: Maximum rating is 5
    rating: number; // Integer rating from 1 to 5
  
    @Column({ type: 'text', nullable: true })
    comment: string | null; // Optional textual comment
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
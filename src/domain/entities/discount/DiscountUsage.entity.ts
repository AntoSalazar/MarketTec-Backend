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
  import { User } from '../user/User.entity';
  import { DiscountCampaign } from './DiscountCampaign.entity';
  import { Payment } from '../payment/Payment.entity';
  
  @Entity('discount_usage') // Maps this class to the 'discount_usage' table
  // Ensures a user doesn't use the same campaign for the same payment multiple times
  @Unique(['user', 'campaign', 'payment'])
  export class DiscountUsage {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.discountUsages, {
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, remove their usage records
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    // --- Relationship with Discount Campaign ---
    @ManyToOne(() => DiscountCampaign, (campaign) => campaign.discountUsages, {
      nullable: false,
      onDelete: 'RESTRICT', // Prevent deleting campaign if it has usage records
    })
    @JoinColumn({ name: 'campaign_id' })
    campaign: DiscountCampaign;
  
    // --- Relationship with Payment ---
    // Links the discount usage to the specific payment it was applied to
    @ManyToOne(() => Payment, (payment) => payment.discountUsages, {
      nullable: false,
      onDelete: 'CASCADE', // If payment deleted, remove associated discount usage
    })
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    discount_amount: number; // The actual amount discounted on this usage
  
    // Use CreateDateColumn for the 'used_at' timestamp
    @CreateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      name: 'used_at', // Match the column name in the schema
    })
    used_at: Date;
  }
  
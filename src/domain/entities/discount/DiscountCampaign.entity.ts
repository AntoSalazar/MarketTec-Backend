import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { DiscountUsage } from './DiscountUsage.entity';
  import { OrderGroup } from '../order/OrderGroup.entity'; // Assuming OrderGroup entity path
  
  // Enum for discount types
  export enum DiscountType {
    PERCENTAGE = 'Percentage',
    FIXED = 'Fixed', // Fixed amount discount
  }
  
  // Enum for what the discount applies to
  export enum DiscountAppliesTo {
    SUBSCRIPTION = 'Subscription',
    TRANSACTION_FEE = 'Transaction Fee',
    PRODUCT = 'Product', // If discounts can apply directly to products
    ORDER = 'Order', // Applies to the total order amount
    BOTH = 'Both', // Example if it applies to multiple things
  }
  
  @Entity('discount_campaigns') // Maps this class to the 'discount_campaigns' table
  export class DiscountCampaign {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string; // Name of the campaign (e.g., 'Summer Sale')
  
    @Column({ type: 'text', nullable: true })
    description: string | null;
  
    @Column({
      type: 'enum',
      enum: DiscountType,
      nullable: false,
    })
    discount_type: DiscountType;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    discount_value: number; // Percentage value (e.g., 10.00 for 10%) or fixed amount
  
    @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
    @Index() // Index for faster code lookup
    code: string | null; // Coupon code to apply the discount (if applicable)
  
    @Column({
      type: 'enum',
      enum: DiscountAppliesTo,
      nullable: false,
    })
    applies_to: DiscountAppliesTo;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    min_purchase: number | null; // Minimum purchase amount to qualify
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    max_discount: number | null; // Maximum discount amount allowed
  
    @Column({ type: 'timestamp', nullable: false })
    start_date: Date; // Campaign start date
  
    @Column({ type: 'timestamp', nullable: false })
    @Index() // Index for finding active/expired campaigns
    end_date: Date; // Campaign end date
  
    @Column({ type: 'int', nullable: true })
    usage_limit: number | null; // Max number of times the campaign/code can be used overall
  
    @Column({ type: 'int', default: 0 })
    current_usage: number; // How many times the campaign/code has been used
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean; // Whether the campaign is currently active
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Relationships ---
    @OneToMany(() => DiscountUsage, (usage) => usage.campaign)
    discountUsages: DiscountUsage[]; // Records of this discount being used
  
    @OneToMany(() => OrderGroup, (group) => group.discountCampaign)
      orderGroups: OrderGroup[]; // Orders where this campaign discount was applied
  }
  
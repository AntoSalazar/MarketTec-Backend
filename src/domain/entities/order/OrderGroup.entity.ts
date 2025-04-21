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
  import { DiscountCampaign } from '../discount/DiscountCampaign.entity';
  import { OrderGroupItem } from './OrderGroupItem.entity';
  
  // Enum for order group status
  export enum OrderGroupStatus {
    CREATED = 'Created', // Initial state, likely after checkout from cart
    PROCESSING = 'Processing', // Payment pending or being processed
    COMPLETED = 'Completed', // All transactions within the group are completed/paid
    CANCELLED = 'Cancelled', // The entire order group was cancelled
    PARTIALLY_COMPLETED = 'Partially Completed', // If some items completed, others cancelled
  }
  
  @Entity('order_groups') // Maps this class to the 'order_groups' table
  export class OrderGroup {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User (Buyer) ---
    @ManyToOne(() => User, { // No inverse needed on User unless required
      nullable: false,
      onDelete: 'SET NULL', // Keep order group record, set buyer_id to null
    })
    @JoinColumn({ name: 'buyer_id' })
    @Index()
    buyer: User;
  
    @Column({
      type: 'enum',
      enum: OrderGroupStatus,
      nullable: false,
      default: OrderGroupStatus.CREATED,
    })
    @Index() // Index for filtering by status
    status: OrderGroupStatus;
  
    @Column({ type: 'boolean', default: true })
    created_from_cart: boolean; // Indicates if this order originated from a cart checkout
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total_amount: number; // Total amount for all items in the group before discounts
  
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount_amount: number; // Total discount applied at the group level
  
    // --- Optional Relationship with Discount Campaign ---
    @ManyToOne(() => DiscountCampaign, (campaign) => campaign.orderGroups, {
      nullable: true, // An order group might not have a discount
      onDelete: 'SET NULL', // Keep order group if campaign deleted
    })
    @JoinColumn({ name: 'discount_campaign_id' })
    discountCampaign: DiscountCampaign | null;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Relationships ---
    @OneToMany(() => OrderGroupItem, (item) => item.orderGroup, { cascade: true })
    items: OrderGroupItem[]; // The individual transaction items belonging to this group
  }
  
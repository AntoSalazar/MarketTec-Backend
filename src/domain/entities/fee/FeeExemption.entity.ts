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
  import { User } from '../user/User.entity';
  import { UserSubscription } from '../subscription/UserSubscription.entity';
  
  // Enum for exemption types
  export enum FeeExemptionType {
    SUBSCRIPTION = 'Subscription', // Exemption granted by an active subscription
    PROMOTION = 'Promotion', // Temporary promotional exemption
    SPECIAL = 'Special', // Manual or special case exemption
  }
  
  @Entity('fee_exemptions') // Maps this class to the 'fee_exemptions' table
  export class FeeExemption {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.feeExemptions, {
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, remove their exemptions
    })
    @JoinColumn({ name: 'user_id' })
    @Index()
    user: User;
  
    @Column({
      type: 'enum',
      enum: FeeExemptionType,
      nullable: false,
    })
    exemption_type: FeeExemptionType;
  
    // --- Optional Relationship with UserSubscription ---
    // Links exemption to a specific subscription if type is SUBSCRIPTION
    @ManyToOne(() => UserSubscription, (sub) => sub.feeExemptions, {
      nullable: true, // Only set if exemption_type is 'Subscription'
      onDelete: 'SET NULL', // Keep exemption record if subscription deleted
    })
    @JoinColumn({ name: 'subscription_id' })
    @Index()
    subscription: UserSubscription | null;
  
    @Column({ type: 'timestamp', nullable: false })
    start_date: Date; // When the exemption period begins
  
    @Column({ type: 'timestamp', nullable: false })
    @Index() // Index for finding active/expired exemptions
    end_date: Date; // When the exemption period ends
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean; // Calculated or set based on current date vs start/end dates
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
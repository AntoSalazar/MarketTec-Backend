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
  import { SubscriptionPlan } from './SubscriptionPlan.entity';
  import { PaymentMethod } from '../payment/PaymentMethod.entity';
  import { Payment } from '../payment/Payment.entity';
  import { PromotionalSlot } from '../promotion/PromotionalSlot.entity';
  import { FeeExemption } from '../fee/FeeExemption.entity';
  
  // Enum for subscription status
  export enum SubscriptionStatus {
    ACTIVE = 'Active',
    CANCELLED = 'Cancelled', // User initiated cancellation, may still be active until end_date
    EXPIRED = 'Expired', // Past end_date and not renewed
    PENDING = 'Pending', // Awaiting payment or confirmation
    FAILED = 'Failed', // Payment failed
  }
  
  @Entity('user_subscriptions') // Maps this class to the 'user_subscriptions' table
  export class UserSubscription {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.subscriptions, {
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, remove their subscriptions
    })
    @JoinColumn({ name: 'user_id' })
    @Index()
    user: User;
  
    // --- Relationship with Subscription Plan ---
    @ManyToOne(() => SubscriptionPlan, (plan) => plan.userSubscriptions, {
      nullable: false,
      onDelete: 'RESTRICT', // Prevent deleting plan if subscriptions exist
    })
    @JoinColumn({ name: 'plan_id' })
    @Index()
    plan: SubscriptionPlan;
  
    @Column({
      type: 'enum',
      enum: SubscriptionStatus,
      nullable: false,
    })
    @Index() // Index for filtering by status
    status: SubscriptionStatus;
  
    @Column({ type: 'timestamp', nullable: false })
    start_date: Date; // Date the subscription period started
  
    @Column({ type: 'timestamp', nullable: false })
    @Index() // Index for finding expiring/expired subscriptions
    end_date: Date; // Date the current subscription period ends
  
    @Column({ type: 'boolean', default: true })
    auto_renew: boolean; // Whether the subscription should automatically renew
  
    // --- Optional Relationship with Payment Method ---
    @ManyToOne(() => PaymentMethod, (method) => method.userSubscriptions, {
      nullable: true, // Might be null if payment handled differently or pending
      onDelete: 'SET NULL', // Keep subscription record if payment method deleted
    })
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethod | null;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships ---
    @OneToMany(() => Payment, (payment) => payment.subscription)
    payments: Payment[]; // Payments made for this subscription
  
    @OneToMany(() => PromotionalSlot, (slot) => slot.subscription)
    promotionalSlots: PromotionalSlot[]; // Promotions used under this subscription
  
    @OneToMany(() => FeeExemption, (exemption) => exemption.subscription)
    feeExemptions: FeeExemption[]; // Fee exemptions granted by this subscription
  }
  
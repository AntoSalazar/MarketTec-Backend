import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    Index,
    OneToMany,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Transaction } from '../transaction/Transaction.entity';
  import { UserSubscription } from '../subscription/UserSubscription.entity';
  import { PaymentMethod } from './PaymentMethod.entity';
  import { DiscountUsage } from '../discount/DiscountUsage.entity'; // Assuming DiscountUsage entity path
  
  // Enum for payment types
  export enum PaymentType {
    SUBSCRIPTION = 'Subscription',
    TRANSACTION_FEE = 'Transaction Fee',
    // Add other types if needed (e.g., PROMOTION_PURCHASE)
  }
  
  // Enum for payment status
  export enum PaymentStatus {
    PENDING = 'Pending',
    COMPLETED = 'Completed',
    FAILED = 'Failed',
    REFUNDED = 'Refunded',
    PARTIALLY_REFUNDED = 'Partially Refunded',
  }
  
  @Entity('payments') // Maps this class to the 'payments' table
  export class Payment {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.payments, {
      nullable: false,
      onDelete: 'SET NULL', // Keep payment record, set user_id to null
    })
    @JoinColumn({ name: 'user_id' })
    @Index()
    user: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number; // Amount of the payment
  
    @Column({
      type: 'enum',
      enum: PaymentType,
      nullable: false,
    })
    payment_type: PaymentType;
  
    @Column({
      type: 'enum',
      enum: PaymentStatus,
      nullable: false,
    })
    @Index() // Index for filtering by status
    status: PaymentStatus;
  
    // --- Optional Relationship with Transaction (for transaction fees) ---
    @OneToOne(() => Transaction, (transaction) => transaction.payment, {
      nullable: true, // Only applicable if payment_type is TRANSACTION_FEE
      onDelete: 'SET NULL', // Keep payment if transaction deleted
    })
    @JoinColumn({ name: 'transaction_id' })
    @Index()
    transaction: Transaction | null;
  
    // --- Optional Relationship with UserSubscription (for subscription payments) ---
    @ManyToOne(() => UserSubscription, (sub) => sub.payments, {
      nullable: true, // Only applicable if payment_type is SUBSCRIPTION
      onDelete: 'SET NULL', // Keep payment if subscription deleted
    })
    @JoinColumn({ name: 'subscription_id' })
    @Index()
    subscription: UserSubscription | null;
  
    // --- Relationship with Payment Method ---
    @ManyToOne(() => PaymentMethod, (method) => method.payments, {
      nullable: false, // Payment must have a method
      onDelete: 'SET NULL', // Keep payment record, set payment_method_id to null
    })
    @JoinColumn({ name: 'payment_method_id' })
    @Index()
    paymentMethod: PaymentMethod;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    payment_date: Date; // Timestamp when payment was processed/recorded
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    @Index() // Index for looking up by external reference
    external_reference: string | null; // ID from Stripe, PayPal, etc.
  
    @Column({ type: 'text', nullable: true })
    notes: string | null; // Internal notes about the payment
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships ---
    @OneToMany(() => DiscountUsage, (usage) => usage.payment)
    discountUsages: DiscountUsage[]; // Discounts applied to this payment
  }
  
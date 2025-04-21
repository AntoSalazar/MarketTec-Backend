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
  import { UserSubscription } from '../subscription/UserSubscription.entity';
  import { Payment } from './Payment.entity';
  
  // Enum for payment method types
  export enum PaymentMethodType {
    CREDIT_CARD = 'Credit Card',
    PAYPAL = 'PayPal',
    BANK_TRANSFER = 'Bank Transfer',
    // Add others like Google Pay, Apple Pay, etc.
  }
  
  // Interface for the structure of the 'details' JSONB column (optional)
  // Sensitive details should be encrypted before storing and decrypted only when needed.
  // Consider storing only non-sensitive references (like Stripe customer/payment method IDs)
  export interface PaymentMethodDetails {
    stripePaymentMethodId?: string; // Example: Store Stripe ID
    paypalEmail?: string; // Example
    // Avoid storing raw card numbers, CVCs, or full bank details here directly
    // Store encrypted tokens or references provided by payment processors
    encryptedData?: string; // Placeholder for encrypted blob if needed
  }
  
  @Entity('payment_methods') // Maps this class to the 'payment_methods' table
  export class PaymentMethod {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.paymentMethods, {
      nullable: false,
      onDelete: 'CASCADE', // If user deleted, remove their payment methods
    })
    @JoinColumn({ name: 'user_id' })
    @Index()
    user: User;
  
    @Column({
      type: 'enum',
      enum: PaymentMethodType,
      nullable: false,
    })
    method_type: PaymentMethodType;
  
    @Column({ type: 'boolean', default: false })
    is_default: boolean; // Whether this is the user's default payment method
  
    // Store potentially sensitive details securely. JSONB is flexible.
    // **IMPORTANT**: Ensure data stored here is properly secured/encrypted.
    // Consider storing only references to payment processor tokens/methods.
    @Column({ type: 'jsonb', nullable: false })
    details: PaymentMethodDetails;
  
    @Column({ type: 'varchar', length: 4, nullable: true })
    last_four: string | null; // Last 4 digits of card number
  
    @Column({ type: 'varchar', length: 7, nullable: true })
    expiry_date: string | null; // MM/YYYY format
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean; // Whether the payment method can be used
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships ---
    @OneToMany(() => UserSubscription, (sub) => sub.paymentMethod)
    userSubscriptions: UserSubscription[]; // Subscriptions using this payment method
  
    @OneToMany(() => Payment, (payment) => payment.paymentMethod)
    payments: Payment[]; // Payments made using this method
  }
  
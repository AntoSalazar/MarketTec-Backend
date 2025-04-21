import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
  } from 'typeorm';
  import { UserSubscription } from './UserSubscription.entity'; // Adjust import path as needed
  
  // Enum for billing cycles
  export enum BillingCycle {
    MONTHLY = 'Monthly',
    QUARTERLY = 'Quarterly',
    ANNUAL = 'Annual',
  }
  
  // Interface for the structure of the 'features' JSONB column (optional but recommended)
  export interface PlanFeatures {
    description: string; // Example feature property
    limit?: number; // Example feature property with a limit
    // Add other feature properties as needed
  }
  
  @Entity('subscription_plans') // Maps this class to the 'subscription_plans' table
  export class SubscriptionPlan {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    @Index()
    name: string; // e.g., 'Basic', 'Premium'
  
    @Column({ type: 'text', nullable: false })
    description: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number; // Price per billing cycle
  
    @Column({
      type: 'enum',
      enum: BillingCycle,
      nullable: false,
    })
    billing_cycle: BillingCycle;
  
    // Store features as JSON. Define an interface (PlanFeatures) for better type safety.
    @Column({ type: 'jsonb', nullable: false })
    features: PlanFeatures[]; // Array of included features
  
    @Column({ type: 'int', nullable: false, default: 0 })
    promotion_spots: number; // Number of products user can promote with this plan
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean; // Whether the plan is available for new subscriptions
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Relationships ---
    @OneToMany(() => UserSubscription, (subscription) => subscription.plan)
    userSubscriptions: UserSubscription[]; // Users subscribed to this plan
  }
  
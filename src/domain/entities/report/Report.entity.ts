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
  import { Product } from '../product/Product.entity';
  import { Conversation } from '../messaging/Conversation.entity';
  
  // Enum for report reasons
  export enum ReportReason {
    SPAM = 'Spam',
    INAPPROPRIATE_CONTENT = 'Inappropriate Content',
    SCAM_FRAUD = 'Scam/Fraud',
    HARASSMENT = 'Harassment',
    PROHIBITED_ITEM = 'Prohibited Item/Service',
    MISLEADING_LISTING = 'Misleading Listing',
    OTHER = 'Other',
  }
  
  // Enum for report status
  export enum ReportStatus {
    PENDING = 'Pending', // Awaiting review
    RESOLVED = 'Resolved', // Action taken
    DISMISSED = 'Dismissed', // No action needed
  }
  
  @Entity('reports') // Maps this class to the 'reports' table
  export class Report {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User (Reporter) ---
    @ManyToOne(() => User, (user) => user.reportsFiled, {
      nullable: false, // Report must have a reporter
      onDelete: 'SET NULL', // Keep report even if reporter deleted, set reporter_id to null
    })
    @JoinColumn({ name: 'reporter_id' })
    @Index()
    reporter: User;
  
    // --- Relationship with User (Reported) ---
    @ManyToOne(() => User, (user) => user.reportsReceived, {
      nullable: false, // Report must be against a user
      onDelete: 'SET NULL', // Keep report even if reported user deleted, set reported_id to null
    })
    @JoinColumn({ name: 'reported_id' })
    @Index()
    reported: User;
  
    // --- Optional Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.reports, {
      nullable: true, // Report might be about a user in general, not a specific product
      onDelete: 'SET NULL', // Keep report even if product deleted
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product | null;
  
    // --- Optional Relationship with Conversation ---
    @ManyToOne(() => Conversation, (conversation) => conversation.reports, {
      nullable: true, // Report might not be related to a specific conversation
      onDelete: 'SET NULL', // Keep report even if conversation deleted
    })
    @JoinColumn({ name: 'conversation_id' })
    @Index()
    conversation: Conversation | null;
  
    @Column({
      type: 'enum',
      enum: ReportReason,
      nullable: false,
    })
    reason: ReportReason;
  
    @Column({ type: 'text', nullable: false })
    description: string; // Detailed description of the issue
  
    @Column({
      type: 'enum',
      enum: ReportStatus,
      nullable: false,
      default: ReportStatus.PENDING,
    })
    @Index() // Index for filtering reports by status
    status: ReportStatus;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
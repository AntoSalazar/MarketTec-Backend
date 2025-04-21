import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { User } from '../user/User.entity'; // Adjust import path as needed
  
  // Enum for different notification types
  export enum NotificationType {
    NEW_MESSAGE = 'Message',
    PRODUCT_VIEW = 'ProductView', // Example: If you notify sellers about views
    NEW_OFFER = 'Offer', // Example: If you implement an offer system
    REVIEW_RECEIVED = 'Review',
    TRANSACTION_UPDATE = 'Transaction',
    SUBSCRIPTION_UPDATE = 'Subscription',
    PROMOTION_EXPIRING = 'Promotion',
    REPORT_UPDATE = 'Report',
    SYSTEM_ANNOUNCEMENT = 'System',
    // Add other specific types relevant to your application
  }
  
  @Entity('notifications') // Maps this class to the 'notifications' table
  export class Notification {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User (Recipient) ---
    @ManyToOne(() => User, (user) => user.notifications, {
      nullable: false, // Notification must have a recipient
      onDelete: 'CASCADE', // If user is deleted, delete their notifications
    })
    @JoinColumn({ name: 'user_id' })
    @Index() // Index for faster lookup of user's notifications
    user: User;
  
    @Column({
      type: 'enum',
      enum: NotificationType,
      nullable: false,
    })
    @Index() // Index for filtering by type
    type: NotificationType;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    title: string; // Short title for the notification
  
    @Column({ type: 'text', nullable: false })
    content: string; // Detailed content of the notification
  
    // ID of the related entity (e.g., product ID, message ID, transaction ID)
    // Can be used to link the notification to the relevant item in the UI
    // Handling polymorphic relations requires more complex logic if needed
    @Column({ type: 'uuid', nullable: true })
    @Index()
    reference_id: string | null;
  
    @Column({ type: 'boolean', default: false })
    @Index() // Index for querying unread notifications
    is_read: boolean; // Flag indicating if the user has read the notification
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index() // Index for sorting notifications by time
    created_at: Date;
  }
  
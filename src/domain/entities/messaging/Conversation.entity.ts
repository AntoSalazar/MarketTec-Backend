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
    Unique,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Product } from '../product/Product.entity';
  import { Message } from './Message.entity';
  import { Report } from '../report/Report.entity';
  
  // Enum for conversation status
  export enum ConversationStatus {
    ACTIVE = 'Active',
    ARCHIVED = 'Archived', // User archived the conversation
    REPORTED = 'Reported', // Conversation contains reported content
    // Add other statuses if needed (e.g., CLOSED, BLOCKED)
  }
  
  @Entity('conversations') // Maps this class to the 'conversations' table
  // Ensure a unique conversation exists for a specific buyer, seller, and product
  @Unique(['buyer', 'seller', 'product'])
  export class Conversation {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.conversations, {
      nullable: false, // Conversation must be about a product
      onDelete: 'CASCADE', // If product deleted, remove related conversations (or SET NULL if preferred)
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
  
    // --- Relationship with User (Buyer) ---
    @ManyToOne(() => User, (user) => user.boughtConversations, {
      nullable: false,
      onDelete: 'CASCADE', // If buyer deleted, remove their conversations
    })
    @JoinColumn({ name: 'buyer_id' })
    @Index()
    buyer: User;
  
    // --- Relationship with User (Seller) ---
    @ManyToOne(() => User, (user) => user.soldConversations, {
      nullable: false,
      onDelete: 'CASCADE', // If seller deleted, remove their conversations
    })
    @JoinColumn({ name: 'seller_id' })
    @Index()
    seller: User;
  
    @Column({
      type: 'enum',
      enum: ConversationStatus,
      nullable: false,
      default: ConversationStatus.ACTIVE,
    })
    @Index() // Index for filtering by status
    status: ConversationStatus;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships ---
    @OneToMany(() => Message, (message) => message.conversation, { cascade: true }) // Cascade deletes to messages
    messages: Message[]; // Messages within this conversation
  
    @OneToMany(() => Report, (report) => report.conversation)
    reports: Report[]; // Reports related to this conversation
  }
  
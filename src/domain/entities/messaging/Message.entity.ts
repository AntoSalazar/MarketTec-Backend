import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Conversation } from './Conversation.entity';
  
  @Entity('messages') // Maps this class to the 'messages' table
  export class Message {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Conversation ---
    @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
      nullable: false, // Message must belong to a conversation
      onDelete: 'CASCADE', // If conversation is deleted, delete messages
    })
    @JoinColumn({ name: 'conversation_id' })
    @Index() // Index for faster retrieval of messages for a conversation
    conversation: Conversation;
  
    // --- Relationship with User (Sender) ---
    @ManyToOne(() => User, (user) => user.sentMessages, {
      nullable: false, // Message must have a sender
      onDelete: 'SET NULL', // If sender is deleted, keep message but set sender to null (or CASCADE)
    })
    @JoinColumn({ name: 'sender_id' })
    @Index()
    sender: User;
  
    @Column({ type: 'text', nullable: false })
    content: string; // The actual message text
  
    @Column({ type: 'boolean', default: false })
    @Index() // Index for querying unread messages
    is_read: boolean; // Flag indicating if the recipient has read the message
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @Index() // Index for sorting messages by time
    created_at: Date;
  }
  
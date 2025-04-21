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
  
  // Enum for different token types
  export enum AuthTokenType {
    PASSWORD_RESET = 'Password Reset',
    EMAIL_VERIFICATION = 'Email Verification',
    // Add other types as needed (e.g., API_KEY, REFRESH_TOKEN)
  }
  
  @Entity('auth_tokens') // Maps this class to the 'auth_tokens' table
  export class AuthToken {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with User ---
    @ManyToOne(() => User, (user) => user.authTokens, {
      nullable: false, // A token must belong to a user
      onDelete: 'CASCADE', // If user is deleted, delete their tokens
    })
    @JoinColumn({ name: 'user_id' }) // Specifies the foreign key column name
    @Index() // Index for faster lookup of user's tokens
    user: User;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Index() // Index for faster token lookup (important for verification)
    token: string; // The actual token value (consider hashing sensitive tokens)
  
    @Column({
      type: 'enum',
      enum: AuthTokenType,
      nullable: false,
    })
    token_type: AuthTokenType;
  
    @Column({ type: 'timestamp', nullable: false })
    expires_at: Date; // Expiry date/time for the token
  
    @Column({ type: 'boolean', default: false })
    is_used: boolean; // Flag to indicate if the token has already been used
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  }
  
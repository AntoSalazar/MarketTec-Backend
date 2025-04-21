import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
    Index,
    Unique,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { OrderGroup } from './OrderGroup.entity';
  import { Transaction } from '../transaction/Transaction.entity';
  
  @Entity('order_group_items') // Maps this class to the 'order_group_items' table
  // Ensures a transaction is only linked to one order group item
  @Unique(['orderGroup', 'transaction'])
  export class OrderGroupItem {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with OrderGroup ---
    @ManyToOne(() => OrderGroup, (group) => group.items, {
      nullable: false,
      onDelete: 'CASCADE', // If order group deleted, delete its items
    })
    @JoinColumn({ name: 'order_group_id' })
    @Index()
    orderGroup: OrderGroup;
  
    // --- Relationship with Transaction (One-to-One) ---
    // Each item in an order group corresponds to one transaction
    @OneToOne(() => Transaction, (transaction) => transaction.orderGroupItems, { // Assuming 'orderGroupItem' on Transaction
      nullable: false,
      onDelete: 'CASCADE', // If transaction deleted, remove the link item
    })
    @JoinColumn({ name: 'transaction_id' }) // Creates transaction_id column
    @Index() // Index needed for the unique constraint check
    transaction: Transaction;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  }
  
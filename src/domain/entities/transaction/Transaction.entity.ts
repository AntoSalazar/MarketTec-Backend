import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    OneToOne,
    OneToMany,
  } from 'typeorm';
  
  // Import related entities (adjust paths as needed)
  import { User } from '../user/User.entity';
  import { Product } from '../product/Product.entity';
  import { Payment } from '../payment/Payment.entity'; // Assuming Payment entity path
  import { OrderGroupItem } from '../order/OrderGroupItem.entity'; // Assuming OrderGroupItem entity path
  
  // Enum for transaction status
  export enum TransactionStatus {
    PENDING = 'Pending', // Initial state, awaiting confirmation/payment/meeting
    COMPLETED = 'Completed', // Successfully finished
    CANCELLED = 'Cancelled', // Cancelled by buyer, seller, or system
    // Add other statuses if needed (e.g., DISPUTED, REFUNDED)
  }
  
  @Entity('transactions') // Maps this class to the 'transactions' table
  export class Transaction {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.transactions, {
      nullable: false, // Transaction must be for a product
      onDelete: 'SET NULL', // Keep transaction record even if product is deleted, set product_id to null
    })
    @JoinColumn({ name: 'product_id' })
    @Index()
    product: Product;
  
    // --- Relationship with User (Buyer) ---
    @ManyToOne(() => User, (user) => user.purchases, {
      nullable: false,
      onDelete: 'SET NULL', // Keep transaction record, set buyer_id to null
    })
    @JoinColumn({ name: 'buyer_id' })
    @Index()
    buyer: User;
  
    // --- Relationship with User (Seller) ---
    @ManyToOne(() => User, (user) => user.sales, {
      nullable: false,
      onDelete: 'SET NULL', // Keep transaction record, set seller_id to null
    })
    @JoinColumn({ name: 'seller_id' })
    @Index()
    seller: User;
  
    @Column({
      type: 'enum',
      enum: TransactionStatus,
      nullable: false,
      default: TransactionStatus.PENDING,
    })
    @Index() // Index for filtering by status
    status: TransactionStatus;
  
    // Use created_at for the initial record time. transaction_date might be when it's marked completed.
    // Let's keep transaction_date as per schema, defaulting to now, possibly updated later.
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    transaction_date: Date;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    meeting_location: string | null;
  
    @Column({ type: 'timestamp', nullable: true })
    meeting_time: Date | null;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    fee_amount: number | null; // Actual fee charged
  
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    fee_percentage: number | null; // Percentage used to calculate fee
  
    @Column({ type: 'boolean', default: false })
    is_fee_exempt: boolean;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    exemption_reason: string | null;
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships ---
    @OneToOne(() => Payment, (payment) => payment.transaction)
    payment: Payment; // Associated payment record (if applicable)
  
    @OneToMany(() => OrderGroupItem, (item) => item.transaction)
      orderGroupItems: OrderGroupItem[]; // Link to order groups if part of a multi-item order
  }
  
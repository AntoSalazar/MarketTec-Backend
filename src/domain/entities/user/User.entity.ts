import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index, // Import Index decorator for potential custom indexes if needed later
  } from 'typeorm';
  import { Exclude } from 'class-transformer'; // To exclude password from serialization
  
  // Import related entities (even if they don't exist yet, define them later)
  import { Campus } from '../campus/Campus.entity'; // Assuming Campus entity path
  import { Product } from '../product/Product.entity'; // Assuming Product entity path
  import { SavedProduct } from '../product/SavedProduct.entity'; // Assuming SavedProduct entity path
  import { AuthToken } from '../auth/AuthToken.entity'; // Assuming AuthToken entity path
  import { Conversation } from '../messaging/Conversation.entity'; // Assuming Conversation entity path
  import { Message } from '../messaging/Message.entity'; // Assuming Message entity path
  import { Review } from '../review/Review.entity'; // Assuming Review entity path
  import { Transaction } from '../transaction/Transaction.entity'; // Assuming Transaction entity path
  import { Notification } from '../notification/Notification.entity'; // Assuming Notification entity path
  import { Report } from '../report/Report.entity'; // Assuming Report entity path
  import { UserSubscription } from '../subscription/UserSubscription.entity'; // Assuming UserSubscription entity path
  import { Payment } from '../payment/Payment.entity'; // Assuming Payment entity path
  import { PaymentMethod } from '../payment/PaymentMethod.entity'; // Assuming PaymentMethod entity path
  import { PromotionalSlot } from '../promotion/PromotionalSlot.entity'; // Assuming PromotionalSlot entity path
  import { FeeExemption } from '../fee/FeeExemption.entity'; // Assuming FeeExemption entity path
  import { DiscountUsage } from '../discount/DiscountUsage.entity'; // Assuming DiscountUsage entity path
  import { Cart } from '../cart/Cart.entity'; // Assuming Cart entity path
  
  @Entity('users') // Maps this class to the 'users' table
  export class User {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @Index() // Index for faster email lookups
    email: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false, select: false }) // select: false prevents loading by default
    @Exclude({ toPlainOnly: true }) // Exclude from serialization output (e.g., in API responses)
    password: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    first_name: string;
  
    @Column({ type: 'varchar', length: 100, nullable: false })
    last_name: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    profile_picture: string | null;
  
    @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
    @Index() // Index for faster student ID lookups
    student_id: string;
  
    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;
  
    // --- Relationship with Campus ---
    @ManyToOne(() => Campus, (campus) => campus.users, {
      nullable: false, // Corresponds to 'not null' constraint
      onDelete: 'RESTRICT', // Prevent deleting a campus if users are associated (adjust as needed)
      onUpdate: 'CASCADE', // If campus ID changes, update it here
    })
    @JoinColumn({ name: 'campus_id' }) // Specifies the foreign key column name
    campus: Campus;
  
    // We don't need a separate @Column for campus_id if using @JoinColumn
    // TypeORM handles the foreign key column based on the relationship.
    // If you need to access just the ID without loading the relation,
    // you can add: @Column({ type: 'uuid', nullable: false }) campus_id: string;
    // But it's often better to access via user.campus.id after loading the relation.
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    major: string | null;
  
    @Column({ type: 'int', nullable: true })
    semester: number | null;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Explicit default for date_joined
    date_joined: Date;
  
    @Column({ type: 'boolean', default: false })
    is_verified: boolean;
  
    @Column({ type: 'boolean', default: true })
    is_active: boolean;
  
    @Column({
      type: 'decimal',
      precision: 3, // Total number of digits
      scale: 2, // Number of digits after the decimal point
      nullable: true,
    })
    rating: number | null; // TypeORM maps decimal to number or string depending on config/driver
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  
    // --- Other Relationships (One-to-Many) ---
  
    // Products listed by this user
    @OneToMany(() => Product, (product) => product.seller)
    products: Product[];
  
    // Products saved/favorited by this user
    @OneToMany(() => SavedProduct, (savedProduct) => savedProduct.user)
    savedProducts: SavedProduct[];
  
    // Auth tokens issued to this user
    @OneToMany(() => AuthToken, (token) => token.user)
    authTokens: AuthToken[];
  
    // Conversations where this user is the buyer
    @OneToMany(() => Conversation, (conversation) => conversation.buyer)
    boughtConversations: Conversation[];
  
    // Conversations where this user is the seller
    @OneToMany(() => Conversation, (conversation) => conversation.seller)
    soldConversations: Conversation[];
  
    // Messages sent by this user
    @OneToMany(() => Message, (message) => message.sender)
    sentMessages: Message[];
  
    // Reviews written by this user
    @OneToMany(() => Review, (review) => review.reviewer)
    reviewsGiven: Review[];
  
    // Reviews received by this user
    @OneToMany(() => Review, (review) => review.reviewed)
    reviewsReceived: Review[];
  
    // Transactions where this user is the buyer
    @OneToMany(() => Transaction, (transaction) => transaction.buyer)
    purchases: Transaction[];
  
    // Transactions where this user is the seller
    @OneToMany(() => Transaction, (transaction) => transaction.seller)
    sales: Transaction[];
  
    // Notifications for this user
    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
  
    // Reports filed by this user
    @OneToMany(() => Report, (report) => report.reporter)
    reportsFiled: Report[];
  
    // Reports filed against this user
    @OneToMany(() => Report, (report) => report.reported)
    reportsReceived: Report[];
  
    // Subscriptions held by this user
    @OneToMany(() => UserSubscription, (subscription) => subscription.user)
    subscriptions: UserSubscription[];
  
    // Payments made by this user
    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];
  
    // Payment methods registered by this user
    @OneToMany(() => PaymentMethod, (method) => method.user)
    paymentMethods: PaymentMethod[];
  
    // Promotional slots used by this user
    @OneToMany(() => PromotionalSlot, (slot) => slot.user)
    promotionalSlots: PromotionalSlot[];
  
    // Fee exemptions granted to this user
    @OneToMany(() => FeeExemption, (exemption) => exemption.user)
    feeExemptions: FeeExemption[];
  
    // Discount codes used by this user
    @OneToMany(() => DiscountUsage, (usage) => usage.user)
    discountUsages: DiscountUsage[];
  
    // Cart associated with this user (assuming One-to-One based on unique index)
    @OneToMany(() => Cart, (cart) => cart.user) // Or @OneToOne if strictly one cart per user
    carts: Cart[]; // Changed to carts to reflect OneToMany relationship
    // If it's strictly OneToOne:
    // @OneToOne(() => Cart, cart => cart.user)
    // cart: Cart;
  
    // --- Utility methods (optional) ---
    getFullName(): string {
      return `${this.first_name} ${this.last_name}`;
    }
  }
  
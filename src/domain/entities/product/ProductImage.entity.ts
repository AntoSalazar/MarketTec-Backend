import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
  } from 'typeorm';
  import { Product } from './Product.entity'; // Adjust import path as needed
  
  @Entity('product_images') // Maps this class to the 'product_images' table
  export class ProductImage {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    // --- Relationship with Product ---
    @ManyToOne(() => Product, (product) => product.images, {
      nullable: false, // An image must belong to a product
      onDelete: 'CASCADE', // If the product is deleted, delete the image entry
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'product_id' }) // Specifies the foreign key column name
    @Index() // Index for faster lookup of images for a product
    product: Product;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    image_url: string; // URL or path to the image file
  
    @Column({ type: 'boolean', default: false })
    is_primary: boolean; // Indicates if this is the main display image
  
    @Column({ type: 'int', default: 0 })
    display_order: number; // For ordering images in a gallery view
  
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  }
  
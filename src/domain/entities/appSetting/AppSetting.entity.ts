import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('app_settings') // Maps this class to the 'app_settings' table
  export class AppSetting {
    @PrimaryGeneratedColumn('uuid') // Defines the primary key as a UUID
    id: string;
  
    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    @Index() // Index for fast key lookup
    key: string; // The setting key (e.g., 'maintenance_mode', 'default_fee_percentage')
  
    @Column({ type: 'text', nullable: false })
    value: string; // The setting value (store as text, parse in application logic)
  
    @Column({ type: 'text', nullable: true })
    description: string | null; // Optional description of the setting
  
    // Only has updated_at as per schema
    @UpdateDateColumn({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  
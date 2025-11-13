import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ 
    required: true, 
    enum: ['office', 'store', 'landmark'],
    type: String 
  })
  category: 'office' | 'store' | 'landmark';

  @Prop({
    type: {
      lon: { type: Number, required: true },
      lat: { type: Number, required: true },
    },
    required: true,
    _id: false,
  })
  coordinates: {
    lon: number;
    lat: number;
  };

  @Prop({ required: false })
  address?: string;

  @Prop({ required: false })
  notes?: string;

  // createdAt and updatedAt are automatically added by timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
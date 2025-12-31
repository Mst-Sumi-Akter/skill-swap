import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExchange extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  offeredCourse: mongoose.Types.ObjectId;
  requestedCourse: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ExchangeSchema = new Schema<IExchange>(
  {
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    offeredCourse: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    requestedCourse: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export const Exchange: Model<IExchange> = mongoose.models.Exchange || mongoose.model<IExchange>("Exchange", ExchangeSchema);

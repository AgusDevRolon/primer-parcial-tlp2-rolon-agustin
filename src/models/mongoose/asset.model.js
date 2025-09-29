import { Schema, model } from "mongoose";

// TODO: completar relaciones embebidas y referenciadas

const AssetSchema = new Schema(
  {
    inventoryNumber: { type: String, required: true, unique: true },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    brand: { type: String, required: true, minlength: 2, maxlength: 100 },
    model: { type: String, required: true, minlength: 2, maxlength: 100 },
    status: {
      type: String,
      enum: ["good", "regular", "bad", "out_of_service"],
      default: "good",
    },
    acquisitionDate: { type: Date, required: true },
    acquisitionValue: { type: Number, required: true, min: 0 },
    // ! FALTA COMPLETAR ACA
    responsible: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // 1:N
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }], // N:M

  },
  { timestamps: true },
  {toJSON: {virtuals: true}},
  {toObject: {virtuals: true}}
);

AssetSchema.virtual("userAssets", {
  ref: "User",
  localField: "responsible",
  foreignField: "_id",
});

AssetSchema.pre("deleteOne", { document: true, query: false }, async function(next) {
  const assetId = this._id;

  await mongoose.model("Category").updateMany(
    { _id: { $in: this.categories } },
  );

  next();
});
export const AssetModel = model("Asset", AssetSchema);

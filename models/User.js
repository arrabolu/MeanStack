  import mongoose , {Schema} from "mongoose";

  const userSchema = mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      profileImage: {
        type: String,
        required: false,
        default:
          "https://media.istockphoto.com/id/522855255/vector/male-profile-flat-blue-simple-icon-with-long-shadow.jpg?s=612x612&w=0&k=20&c=EQa9pV1fZEGfGCW_aEK5X_Gyob8YuRcOYCYZeuBzztM="
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      roles: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: "Role"
      }
    },
    {
      timestamps: true,
    }
  );

  

  export default mongoose.model("User", userSchema);

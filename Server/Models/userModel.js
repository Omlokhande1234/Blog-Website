import mongoose ,{Schema,model} from 'mongoose';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();


const userSchema =mongoose.Schema(
  {
      personal_info:{
        username: {
          type: String,
          required: [true, 'Name is required'],
          minlength: [5, 'Name must be at least 5 characters'],
          lowercase: true,
          unique:[true,'Username must be unique'],
          trim: true, // Removes unnecessary spaces
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
          lowercase: true,
          match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], // Matches email against regex
        },
        password: {
          type: String,
          required: [true, 'Password is required'],
          minlength: [8, 'Password must be at least 8 characters'],
          //select: false, // Will not select password upon looking up a document
        },
        bio: {
          type: String,
          maxlength: [200, 'Bio should not be more than 200'],
          default: "",
        },
        
        avatar: {
          public_id: {
            type: String,
          },
          secure_url: {
            type: String,
          },
        },

      },
  
   
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    social_links: {
      youtube: {
          type: String,
          default: "",
      },
      instagram: {
          type: String,
          default: "",
      },
      facebook: {
          type: String,
          default: "",
      },
      twitter: {
          type: String,
          default: "",
      },
      github: {
          type: String,
          default: "",
      },
      website: {
          type: String,
          default: "",
      }
    },
    account_info:{
      total_posts: {
          type: Number,
          default: 0
      },
      total_reads: {
          type: Number,
          default: 0
      },
    },
    google_auth: {
      type: Boolean,
      default: false
    },
    blogs: {
      type: [ Schema.Types.ObjectId ],
      ref: 'blogs',
      default: [],
    } 

  },
  {
    timestamps: true,
  }
);

userSchema.methods={
  generateJWTTOKEN:async function(){
    return jwt.sign({id:this._id,email:this.email},
      process.env.SECRET,
      {
        expiresIn:process.env.JWT_EXPIRY
      }
    )

  }

}




const User = model('User', userSchema);

export default User;
import { Webhook } from "svix";
import User from "../models/user.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 🐛 Debug log: raw body (must be raw Buffer)
    console.log("🔍 Raw Clerk body (buffer):", req.body.toString());

    // 🐛 Debug log: headers
    console.log("🔐 Headers:", {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Verify and parse webhook
    const evt = whook.verify(
      req.body,
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      }
    );

    const { data, type } = evt;

    console.log(" lerk event received:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: "",
        };

        console.log("✅ Creating user in DB:", userData);

        await User.create(userData);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };

        console.log("🔁 Updating user:", userData);

        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        console.log("🗑️ Deleting user with ID:", data.id);

        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        console.log(`⚠️ Unhandled Clerk webhook event: ${type}`);
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: "Webhook processing error" });
  }
};

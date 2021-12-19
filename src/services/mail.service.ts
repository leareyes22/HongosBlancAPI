import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "hongosblanc@outlook.com",
    pass: "ChampiPorto123!",
  },
});

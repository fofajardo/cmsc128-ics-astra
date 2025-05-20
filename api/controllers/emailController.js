import emailService from "../services/emailService.js";
import httpStatus from "http-status-codes";

const sendEmail = async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "ERROR",
      message: "Missing email fields."
    });
  }

  try {
    await emailService.sendEmail({ to, subject, body });
    return res.status(httpStatus.OK).json({
      status: "SENT"
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: "Failed to send email."
    });
  }
};

const emailController = {
  sendEmail
};

export default emailController;
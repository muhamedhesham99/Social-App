import * as z from "zod";

const RepasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty("Current Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
        "Password is not True",
      ),
    newPassword: z
      .string()
      .nonempty("New Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
        "Password [8-25] characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    confirmNewPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    //error object
    path: ["confirmNewPassword"], // targting the place will show the error message of refine error
    message: "Confirmed Password not matched", // error messgae
  });

export default RepasswordSchema;

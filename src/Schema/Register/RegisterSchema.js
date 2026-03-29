import * as z from "zod";

const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is required")
      .min(3, "Name must be more than 3 letters")
      .max(20, "Name must be lower than 20 letters"),
    username: z.string(),
    email: z
      .string()
      .nonempty("Email is required")
      .email("Enter a vaild email where should contain '@'"),
    password: z
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/,
        "Password [8-25] characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      ),
    rePassword: z.string().nonempty("Confirm Password is required"),
    dateOfBirth: z
      .string()
      .nonempty("Date Of Birth is required")
      .refine((data) => {
        const currentDate = new Date().getFullYear();
        const birthDate = new Date(`${data}`).getFullYear(); // should be as string in ""
        const age = currentDate - birthDate;
        return age >= 18;
      }, "Your Age must be greater than 18"), // this is a message if the return is false
    gender: z.enum(["male", "female"], "Choose Male or Female"),
  })
  .refine((data) => data.password === data.rePassword, {
    //error object
    path: ["rePassword"], // targting the place will show the error message of refine error
    message: "Password not matched", // error messgae
  });

export default registerSchema;

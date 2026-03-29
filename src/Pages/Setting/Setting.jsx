import { FaKey } from "react-icons/fa";
import RepasswordSchema from "../../Schema/Repassword/RepasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@heroui/react";
import patchChangePasswordApi from "../../Services/Api/PatchApi/patchChangePasswordApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const navigation = useNavigate(); // use navigation to navigate in app routing
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitting }, // for errors where get if the validation is invalid "show the error of Zod validation or any error handled", isSubmitting return boolean value during fetching datat only
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(RepasswordSchema),
    mode: "onSubmit",
  }); // useForm library for handle form

  async function handleRepassword({ currentPassword, newPassword }) {
    const formData = {
      password: currentPassword,
      newPassword: newPassword,
    }; // an object where send via api as "body"

    try {
      await patchChangePasswordApi(formData);
      toast.success("Successfully Changed Password"); // success toastify
      localStorage.removeItem("token"); // remove token from localStorage
      navigation("/"); // will navigate to "/" path  where if the token is clear then any navigate will go to login page due to Auth guard component
    } catch (error) {
      toast.error(error?.response?.data?.message); // error toastify
    }
  } // function that andle the repassword user

  return (
    <div className="mx-auto h-screen flex justify-center items-center translate-y-[-5%]">
      <main className="w-[75%]">
        <div className="mx-auto">
          <section className="rounded-2xl border border-slate-200 bg-accent1 p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-accent1">
                <FaKey />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-primary sm:text-2xl">
                  Change Password
                </h1>
                <p className="text-sm text-accent2">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(handleRepassword)}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-accent2">
                  Current password
                </span>
                <input
                  placeholder="Enter current password"
                  className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-accent2 outline-none transition border-slate-200 focus:border-primary focus:bg-white"
                  type="password"
                  {...register("currentPassword")}
                />
                {errors.currentPassword && touchedFields.currentPassword && (
                  <p className="text-primary">
                    {errors.currentPassword.message}
                  </p>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-accent2">
                  New password
                </span>
                <input
                  placeholder="Enter new password"
                  className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-accent2 outline-none transition border-slate-200 focus:border-primary focus:bg-white"
                  type="password"
                  {...register("newPassword")}
                />
                {errors.newPassword && touchedFields.newPassword && (
                  <p className="text-primary">{errors.newPassword.message}</p>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-accent2">
                  Confirm new password
                </span>
                <input
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm text-accent2 outline-none transition border-slate-200 focus:border-primary focus:bg-white"
                  type="password"
                  {...register("confirmNewPassword")}
                />
                {errors.confirmNewPassword &&
                  touchedFields.confirmNewPassword && (
                    <p className="text-primary">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
              </label>
              <Button
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-accent1 transition hover:bg-primary/70 cursor-pointer duration-300 "
                type="submit"
                isLoading={isSubmitting}
              >
                Update password
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Setting;

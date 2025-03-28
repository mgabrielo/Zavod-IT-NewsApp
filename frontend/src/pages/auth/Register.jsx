import { useState } from "react";
import { useForm } from "react-hook-form";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthForm from "../../components/auth/AuthForm";
import { authAction } from "../../hooks/authAction";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { handleRegisterAuth, checkError, setCheckError, error, loading } =
    authAction();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password", "");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log({ file });
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleRegister = async (data, e) => {
    e.preventDefault();
    console.log({ data });
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("photo", selectedImage);

    let temp_photo = formData.get("photo");
    let temp_username = formData.get("username");
    let temp_email = formData.get("email");
    console.log({ temp_email, temp_username, temp_photo });

    await handleRegisterAuth(formData).then(() => {
      navigate("/bookstore");
      reset({});
    });
  };

  console.log({ selectedImage, previewImage });

  return (
    <AuthLayout
      authSwitchDesc={"Already Got An Account...?"}
      authSwitchLabel={"Login"}
      authSwitchLink={"/login"}
      title={"Register"}
      error={error}
      loading={loading}
      checkError={checkError}
      setCheckError={setCheckError}
    >
      <AuthForm
        title={"Register"}
        onSubmit={handleSubmit((data, e) => handleRegister(data, e))}
        isSubmitting={isSubmitting}
        register={register}
        errors={errors}
        control={control}
        password={password}
        handleImageChange={(e) => handleImageChange(e)}
        previewImage={previewImage}
      />
    </AuthLayout>
  );
};
export default Register;

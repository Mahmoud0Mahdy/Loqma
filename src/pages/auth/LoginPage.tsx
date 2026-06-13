import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../contexts/AppContext";

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { registerUser, loginUser } from "../../api/authApi";
import { decodeToken } from "../../utils/decodeToken";

export function LoginPage() {
  const navigate = useNavigate();

  const { dispatch } = useApp();

  const [tab, setTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ================= LOGIN =================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      const { token, refreshToken } = res;

      // save
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // decode
      const { userId, role } = decodeToken(token);

      // save in context
      dispatch({
        type: "LOGIN",
        user: {
          id: userId,
          email: loginData.email,
          role: role.toLowerCase(),
        },
      });

      toast.success("Login successful ", { duration: 1500 });

      //  redirect
      setTimeout(() => {
        if (role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err: any) {
      let apiErrors: string[] = [];

      if (err?.errors) {
        const errorsObj = err.errors as Record<string, string[]>;
        apiErrors = Object.values(errorsObj).flat();
      } else if (err?.message) {
        apiErrors.push(err.message);
      } else {
        apiErrors.push("Something went wrong");
      }

      apiErrors.forEach((e) => {
        toast.error(e, { duration: 1000 });
      });
    }
  };

  // ================= SIGNUP =================
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    let validationErrors: string[] = [];

    if (!signupData.firstName) validationErrors.push("First name is required");
    if (!signupData.lastName) validationErrors.push("Last name is required");
    if (!signupData.email) validationErrors.push("Email is required");

    const emailRegex = /\S+@\S+\.\S+/;
    if (signupData.email && !emailRegex.test(signupData.email)) {
      validationErrors.push("Invalid email format");
    }

    if (!signupData.password) {
      validationErrors.push("Password is required");
    } else if (signupData.password.length < 6) {
      validationErrors.push("Password must be at least 6 characters");
    }

    if (signupData.password !== signupData.confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        toast.error(err, { duration: 1000 });
      });
      return;
    }

    try {
      await registerUser({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      });

      toast.success("Account created successfully ", {
        duration: 1000,
      });

      setTimeout(() => {
        setSignupData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTab("login");
      }, 1000);
    } catch (err: any) {
      let apiErrors: string[] = [];

      if (err?.errors) {
        const errorsObj = err.errors as Record<string, string[]>;
        apiErrors = Object.values(errorsObj).flat();
      } else if (err?.message) {
        apiErrors.push(err.message);
      } else {
        apiErrors.push("Something went wrong");
      }

      apiErrors.forEach((e) => {
        toast.error(e, { duration: 1000 });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full mb-4">
            <User size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to FreshMart
          </h1>

          <p className="text-gray-600 mt-2">
            Sign in to your account or create a new one
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <LoginForm
                  loginData={loginData}
                  setLoginData={setLoginData}
                  handleLogin={handleLogin}
                />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <SignupForm
                  signupData={signupData}
                  setSignupData={setSignupData}
                  handleSignup={handleSignup}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

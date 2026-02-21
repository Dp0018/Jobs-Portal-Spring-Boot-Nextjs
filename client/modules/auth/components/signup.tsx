"use client";

import {
  IconAt,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconLock,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerUser } from "../server/user-service";
import { signupSchema, type SignupFormData } from "../validations";

const form = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "APPLICANT" as const,
};

export const Signup = () => {
  const [data, setData] = useState<SignupFormData>(form);
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | string) => {
    if (typeof event === "string") {
      setData({ ...data, accountType: event as "APPLICANT" | "EMPLOYER" });
    } else {
      const name = event.target.name;
      const value = event.target.value;
      const newData = { ...data, [name]: value };
      setData(newData);

      // Real-time field validation
      const result = signupSchema.safeParse(newData);
      if (result.success) {
        setFormError({ ...formError, [name]: "", ...(name === "password" ? { confirmPassword: "" } : {}) });
      } else {
        const fieldError = result.error.issues.find((i) => i.path[0] === name);
        setFormError({
          ...formError,
          [name]: fieldError ? fieldError.message : "",
          ...(name === "password" || name === "confirmPassword"
            ? {
                confirmPassword:
                  result.error.issues.find((i) => i.path[0] === "confirmPassword")?.message || "",
              }
            : {}),
        });
      }
    }
  };

  const handleSubmit = () => {
    const result = signupSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setFormError(fieldErrors);
      return;
    }

    setFormError({});
    setLoading(true);
    registerUser(data)
      .then(() => {
        setData(form);
        toast.success("Registered Successfully", {
          description: "Redirecting to login page...",
          icon: <IconCheck size={18} />,
        });
        setTimeout(() => {
          router.push("/login");
          setLoading(false);
        }, 4000);
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Registration failed!", {
          description: err.response?.data?.errorMessage || "Something went wrong. Please try again.",
          icon: <IconX size={18} />,
        });
      });
  };

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-8 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Creating account...</span>
          </div>
        </div>
      )}

      <div className="w-full h-full px-6 sm:px-10 md:px-16 py-8 sm:py-12 flex flex-col justify-center overflow-y-auto">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-nunito">Create Account</h2>
          <p className="text-muted-foreground text-sm">Fill in your details to get started</p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Full Name <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.name}
                onChange={handleChange}
                name="name"
                placeholder="Enter your full name"
                className="pl-9 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
            {formError.name && (
              <p className="text-xs text-destructive">{formError.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Email Address <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconAt size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-9 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>
            {formError.email && (
              <p className="text-xs text-destructive">{formError.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Password <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.password}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-9 pr-10 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            {formError.password && (
              <p className="text-xs text-destructive">{formError.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label className="text-foreground/80 font-medium">
              Confirm Password <span className="text-primary">*</span>
            </Label>
            <div className="relative">
              <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={data.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                className="pl-9 pr-10 bg-input/20 border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/50 text-foreground"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            {formError.confirmPassword && (
              <p className="text-xs text-destructive">{formError.confirmPassword}</p>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-2">
            <Label className="text-foreground/80 font-medium">
              Account Type <span className="text-primary">*</span>
            </Label>
            <div className="flex gap-3 mt-1">
              {["APPLICANT", "EMPLOYER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange(type)}
                  className={`flex-1 py-3 px-5 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer text-sm
                    ${
                      data.accountType === type
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-muted/20 hover:border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-muted-foreground text-sm cursor-pointer">
              I accept the{" "}
              <span className="text-primary hover:text-primary/80 cursor-pointer transition-colors underline underline-offset-2">
                Terms and Conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !termsAccepted}
            className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 mt-6 font-semibold text-base text-primary-foreground"
            size="lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2">
            <span className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <span
                onClick={() => {
                  router.push("/login");
                  setFormError(form);
                  setData(form);
                }}
                className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
              >
                Login here
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
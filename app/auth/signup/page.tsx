"use client";
import useSign from "@/hooks/auth-hooks/use-auth";
import { useLoadingStore } from "@/zustand/use-loading-store";
import styles from "../auth.module.css";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "@/lib/zod/auth";
import type { AuthType } from "@/lib/zod/auth";
import Link from "next/link";
import Close from "@/vectors/Close";

export default function Signup() {
  const router = useRouter();
  const { setIsLoading, isLoading } = useLoadingStore();
  const { auth } = useSign(setIsLoading);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthType>({
    resolver: zodResolver(Auth),
    mode: "onChange",
  });

  const onSubmit = async (data: AuthType) => {
    const response = await auth({ data });
    console.log(response);
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1>Sign Up</h1>
          <button
            type="button"
            onClick={() => router.push("/")}
            className={styles.close}
          >
            <Close />
          </button>
        </div>

        <div className={styles.field}>
          <Label htmlFor="email">Enter e-mail</Label>
          <Input
            id="email"
            placeholder="example@email.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <Label htmlFor="password">Enter password</Label>
          <Input
            id="password"
            type="password"
            placeholder="******"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isLoading ? (
            <>
              <Spinner className="size-5" />
            </>
          ) : (
            <>Sign Up</>
          )}
        </Button>

        <div className="flex flex-row w-full">
          <Link href="/auth/login">I already have an account</Link>
        </div>
      </form>
    </div>
  );
}

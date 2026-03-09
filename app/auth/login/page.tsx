"use client";
import styles from "../auth.module.css";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Close from "@/vectors/Close";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  return (
    <div className={styles.wrapper}>
      <form className={styles.form}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1>Login</h1>
          <button
            onClick={() => router.push("/")}
            type="button"
            className={styles.close}
          >
            <Close />
          </button>
        </div>
        <div className={styles.field}>
          <Label htmlFor="email">Enter e-mail</Label>
          <Input id="email" type="email" placeholder="example@email.com" />
        </div>
        <div className={styles.field}>
          <Label htmlFor="password">Enter password</Label>
          <Input id="password" type="password" placeholder="*****" />
        </div>
        <Button className={styles.submit} type="submit">
          Login
        </Button>
        <div className="flex flex-row w-full">
          <Link href={"/auth/signin"}> I don't have an account</Link>
        </div>
      </form>
    </div>
  );
}

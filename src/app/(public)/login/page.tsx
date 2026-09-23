import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="w-full max-w-sm">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-xl">Ingresá</CardTitle>
          <CardDescription>
            Te tenemos al tanto de todo lo que te deben.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm callbackUrl={next ?? "/dashboard"} />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:underline">
          Creala gratis
        </Link>
      </p>
    </div>
  )
}
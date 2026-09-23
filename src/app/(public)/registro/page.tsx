import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-xl">Creá tu cuenta</CardTitle>
          <CardDescription>
            Empezá a llevar las cuentas con amigos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Ingresá
        </Link>
      </p>
    </div>
  )
}